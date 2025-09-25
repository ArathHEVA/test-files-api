// src/controllers/files.controller.js
import multer from 'multer'
import * as FileService from '../services/file.service.js'
import { AppError } from '../utils/error.js'

const storage = multer.memoryStorage()
export const upload = multer({ storage })

export async function uploadFile(req, res, next) {
  try {
    const { doc, location } = await FileService.uploadFromBuffer({
      userId: req.user.id,
      file: req.file
    })
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: { file: doc, location }
    })
  } catch (err) {
    next(err)
  }
}

export async function listFiles(req, res, next) {
  try {
    const items = await FileService.list()
    res.status(200).json({
      success: true,
      message: 'Files listed successfully',
      data: { items }
    })
  } catch (err) {
    next(err)
  }
}

export async function getDownloadUrl(req, res, next) {
  try {
    const { url } = await FileService.getSignedUrlById({
      id: req.params.id,
      expires: 300
    })
    res.status(200).json({
      success: true,
      message: 'Download URL generated successfully',
      data: { url }
    })
  } catch (err) {
    next(err)
  }
}

export async function downloadFile(req, res, next) {
  try {
    const { url } = await FileService.getSignedUrlForDonwload({
      id: req.params.id,
      userId: req.user.id,
      expires: 900
    })
    return res.redirect(302, url) // descarga directa desde S3
  } catch (err) { next(err) }
}

export async function renameFile(req, res, next) {
  try {
    const { filename } = req.body
    if (!filename) throw new AppError('filename is required', 422)

    const { file } = await FileService.rename({
      id: req.params.id,
      newFilename: filename
    })

    res.status(200).json({
      success: true,
      message: 'File renamed successfully',
      data: { file }
    })
  } catch (err) {
    next(err)
  }
}

export async function importFromUrl(req, res, next) {
  try {
    const { url, filename } = req.body
    if (!url) throw new AppError('url is required', 422)
    const { doc, location } = await FileService.importFromUrl({
      userId: req.user.id,
      url,
      filename
    })
    res.status(201).json({
      success: true,
      message: 'Imported from URL',
      data: { file: doc, location }
    })
  } catch (err) { next(err) }
}