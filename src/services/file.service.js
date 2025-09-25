// src/services/file.service.js
import { v4 as uuid } from 'uuid'
import * as S3 from './s3.service.js'
import File from '../models/File.js'
import { AppError } from '../utils/error.js'



export async function uploadFromBuffer({ userId, file }) {
  if (!file) throw new AppError('File is required', 400)

  const name = file.originalname
  const key = `${userId}/${uuid()}-${name}`

  const up = await S3.uploadBuffer({
    buffer: file.buffer,
    key,
    contentType: file.mimetype
  })

  const doc = await File.create({
    key,
    filename: name,
    size: file.size,
    contentType: file.mimetype,
    owner: userId
  })

  const location = up.location || up.Location || null
  return { doc, location }
}

export async function list() {
  return File.find({}).sort({ createdAt: -1 }).lean()
}

export async function getSignedUrlById({ id, expires = 300 }) {
  const file = await File.findOne({ _id: id })
  if (!file) throw new AppError('Not found', 404)
  const url = await S3.getSignedUrl(file.key, expires)
  return { url }
}

export async function getSignedUrlForDonwload({ id, userId, expires = 900 }) {
  const file = await File.findOne({ _id: id, owner: userId })
  if (!file) throw new AppError('Not found', 404)
  const url = S3.getSignedUrl(file.key, expires, { filename: file.filename })
  return { url }
}

export async function streamById({ id }) {
  const file = await File.findOne({ _id: id })
  if (!file) throw new AppError('File not found', 404)

  const { head, stream } = await S3.getObjectStream(file.key)
  console.log(head)
  console.log(stream)
  const headers = {
    'Content-Type':
      head.ContentType || file.contentType || 'application/octet-stream',
    'Content-Length': head.ContentLength,
    'ETag': head.ETag,
    'Last-Modified': head.LastModified,
    'Content-Disposition': `attachment; filename="${encodeURIComponent(
      file.filename || 'download'
    )}"`
  }
  return { headers, stream }
}

export async function rename({ id, newFilename }) {
  if (!newFilename) throw new AppError('new filename is required', 422)

  const file = await File.findOne({ _id: id })
  if (!file) throw new AppError('Not found', 404)

  file.filename = newFilename
  await file.save()
  return { file }
}


export async function importFromUrl({
  userId,
  url,
  filename,
  maxBytes = 10 * 1024 * 1024,     // 10MB
  timeoutMs = 8000,
}) {
  let parsed
  try {
    parsed = new URL(String(url))
  } catch {
    throw new AppError('Invalid URL', 422)
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new AppError('URL must be http(s)', 422)
  }

  // Timeout
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), timeoutMs)

  try {
    const res = await fetch(parsed.toString(), { signal: ac.signal })
    if (!res.ok) {
      throw new AppError('Fetch failed', 400, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const lenHeader = res.headers.get('content-length')
    if (lenHeader && Number(lenHeader) > maxBytes) {
      throw new AppError('Remote file too large', 413)
    }

    // Leer en memoria con control de tamaño
    const reader = res.body?.getReader?.()
    let size = 0
    const chunks = []
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > maxBytes) {
          ac.abort()
          throw new AppError('Remote file too large', 413)
        }
        chunks.push(Buffer.from(value))
      }
    } else {
      // Fallback (no debería pasar en Node 18+)
      const ab = await res.arrayBuffer()
      size = ab.byteLength
      if (size > maxBytes) throw new AppError('Remote file too large', 413)
      chunks.push(Buffer.from(ab))
    }
    const buffer = Buffer.concat(chunks)

    // Si no trae extensión y conocemos el tipo, añade una
    if (!/\.[a-z0-9]{2,6}$/i.test(filename)) {
      if (contentType.includes('image/jpeg')) filename += '.jpg'
      else if (contentType.includes('image/png')) filename += '.png'
      else if (contentType.includes('image/gif')) filename += '.gif'
      else if (contentType.includes('image/svg')) filename += '.svg'
    }

    const key = `${userId}/${uuid()}-${filename}`

    const up = await S3.uploadBuffer({
      buffer,
      key,
      contentType
    })

    const doc = await File.create({
      key,
      filename: filename,
      size,
      contentType,
      owner: userId
    })

    return {
      doc,
      location: up.location || up.Location || null
    }
  } catch (e) {
    if (e.name === 'AbortError') throw new AppError('Remote fetch timeout', 504)
    throw e
  } finally {
    clearTimeout(t)
  }
}