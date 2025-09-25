import AWS from "aws-sdk";
import env from "../config/env.js";

let s3;
AWS.config.update({ accessKeyId: env.S3_KEY, secretAccessKey: env.S3_SECRET });
s3 = new AWS.S3({params: {Bucket: env.S3_BUCKET}});


export async function uploadBuffer({ buffer, key, contentType }) {
  const res = await s3
    .upload({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType
    })
    .promise();
  return { key, location: res.Location, contentType };
}

export function getSignedUrl(key, expires = 900, { filename } = {}) {
  const params = {
    Bucket: env.S3_BUCKET,
    Key: key,
    Expires: expires
  }
  if (filename) {
    params.ResponseContentDisposition = `attachment; filename="${encodeURIComponent(filename)}"`
  }
  return s3.getSignedUrl('getObject', params)
}

export async function getObjectStream (key, rangeHeader) {
  const params = { Bucket: env.S3_BUCKET, Key: key }
  if (rangeHeader) params.Range = rangeHeader;
  const head = await s3.headObject({ Bucket: env.S3_BUCKET, Key: key }).promise()
  const stream = s3.getObject(params).createReadStream()
  return { head, stream }
}


