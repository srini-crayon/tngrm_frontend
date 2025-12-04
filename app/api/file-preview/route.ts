import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'node:stream'

export const runtime = 'nodejs'

const S3_CONFIG = {
  bucket_name: process.env.S3_BUCKET_NAME || 'agentsstore',
  region: process.env.S3_REGION || 'us-east-1',
  access_key_id: process.env.S3_ACCESS_KEY_ID || '',
  secret_access_key: process.env.S3_SECRET_ACCESS_KEY || '',
}

const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials:
    S3_CONFIG.access_key_id && S3_CONFIG.secret_access_key
      ? {
          accessKeyId: S3_CONFIG.access_key_id,
          secretAccessKey: S3_CONFIG.secret_access_key,
        }
      : undefined,
})

function extractS3Key(target: string): { key?: string; externalUrl?: string } {
  if (!target) {
    return {}
  }

  if (target.startsWith('http://') || target.startsWith('https://')) {
    try {
      const url = new URL(target)
      const host = url.hostname
      const bucketHost = `${S3_CONFIG.bucket_name}.s3.${S3_CONFIG.region}.amazonaws.com`
      const regionalHost = `s3.${S3_CONFIG.region}.amazonaws.com`

      if (host === bucketHost) {
        return { key: decodeURIComponent(url.pathname.replace(/^\/+/, '')) }
      }

      if (host === regionalHost) {
        const [, bucket, ...rest] = url.pathname.split('/')
        if (bucket === S3_CONFIG.bucket_name && rest.length) {
          return { key: decodeURIComponent(rest.join('/')) }
        }
      }

      return { externalUrl: target }
    } catch {
      return { key: target }
    }
  }

  return { key: target.replace(/^\/+/, '') }
}

function isPathTraversal(key: string) {
  return key.split('/').some((part) => part === '..' || part === '.')
}

function getDisposition(key: string, forceDownload: boolean, contentType?: string) {
  const fileName = key.split('/').pop() || 'file'
  const sanitizedName = fileName.replace(/["\r\n]/g, '')
  const shouldInline =
    !forceDownload &&
    contentType &&
    (contentType.startsWith('image/') || contentType === 'application/pdf' || contentType.startsWith('text/'))

  return `${shouldInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(sanitizedName)}"; filename*=UTF-8''${encodeURIComponent(sanitizedName)}`
}

function toReadableStream(body: unknown): ReadableStream<Uint8Array> | null {
  if (!body) return null
  if (body instanceof Readable) {
    return Readable.toWeb(body as Readable) as ReadableStream<Uint8Array>
  }
  if (typeof (body as any).transformToWebStream === 'function') {
    return (body as any).transformToWebStream() as ReadableStream<Uint8Array>
  }
  if (typeof (body as any).stream === 'function') {
    return (body as any).stream() as ReadableStream<Uint8Array>
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const filePath = searchParams.get('path')
    const forceDownload = searchParams.get('download') === '1'

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    const { key, externalUrl } = extractS3Key(filePath)

    if (externalUrl) {
      return NextResponse.redirect(externalUrl)
    }

    if (!key) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    if (isPathTraversal(key)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket_name,
      Key: key,
    })

    const result = await s3Client.send(command)

    const stream = toReadableStream(result.Body)

    if (!stream) {
      return NextResponse.json({ error: 'Unable to read file contents' }, { status: 500 })
    }

    const headers = new Headers()
    const contentType = result.ContentType || 'application/octet-stream'

    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', getDisposition(key, forceDownload, contentType))
    headers.set('Cache-Control', 'private, max-age=0, must-revalidate')

    if (result.ContentLength != null) {
      headers.set('Content-Length', result.ContentLength.toString())
    }

    return new NextResponse(stream, {
      headers,
    })
  } catch (error: any) {
    console.error('Error retrieving file from S3:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve file' },
      { status: 500 }
    )
  }
}

