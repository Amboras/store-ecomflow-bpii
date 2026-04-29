/**
 * Helpers for uploading review media (photos + short videos) to the backend.
 *
 * Backend route: POST /store/reviews/upload
 *   Body:    { files: [{ filename, mimeType, content (base64, no data: prefix) }] }
 *   Auth:    Authorization: Bearer <medusa_auth_token from localStorage>
 *   Returns: { urls: string[] }
 *
 * Constraints (mirror backend validation):
 *   - max 5 files per upload
 *   - images ≤ 5 MB, videos ≤ 50 MB
 *   - allowed MIME: image/jpeg, image/png, image/webp, image/gif,
 *                   video/mp4, video/quicktime, video/webm
 *
 * The submitted review payload expects:
 *   media: [{ url, type: 'image' | 'video' }]
 * — this module returns that shape directly so callers can pass it straight
 * into useCreateReview / useUpdateReview.
 */

export const MAX_REVIEW_MEDIA_FILES = 5
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const
export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
] as const

export type ReviewMediaType = 'image' | 'video'

export interface ReviewMediaItem {
  url: string
  type: ReviewMediaType
}

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

/** Decide media type from a MIME string. */
export function mediaTypeFromMime(mime: string): ReviewMediaType {
  return mime.toLowerCase().startsWith('video/') ? 'video' : 'image'
}

/** Quick client-side check that mirrors the backend rules. */
export function validateReviewFile(file: File): string | null {
  const mime = file.type.toLowerCase()
  if (!ALLOWED_MIME_TYPES.includes(mime as (typeof ALLOWED_MIME_TYPES)[number])) {
    return `${file.name}: unsupported file type`
  }
  const isVideo = mime.startsWith('video/')
  const cap = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
  if (file.size > cap) {
    const capMb = cap / 1024 / 1024
    return `${file.name}: too large (max ${capMb} MB)`
  }
  return null
}

/**
 * Compress an image client-side: scale down to ≤ MAX_DIM on longest edge and
 * re-encode as JPEG @ quality 0.85. Falls back to the original file if anything
 * goes wrong (e.g. canvas blocked, exotic format).
 */
async function compressImage(file: File): Promise<File> {
  const MAX_DIM = 1600
  const QUALITY = 0.85

  // GIFs animate — re-encoding to JPEG would freeze them. Skip.
  if (file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap
    const scale = Math.min(1, MAX_DIM / Math.max(width, height))
    const targetW = Math.round(width * scale)
    const targetH = Math.round(height * scale)

    // Skip work if the image is already small enough AND not bigger than 1.5 MB.
    if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
      bitmap.close?.()
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close?.()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH)
    bitmap.close?.()

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.(png|webp|jpe?g)$/i, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

/** Read a Blob/File and return its base64 contents (without the data: prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Unexpected reader result'))
        return
      }
      const commaIdx = result.indexOf(',')
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result)
    }
    reader.readAsDataURL(file)
  })
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem('medusa_auth_token')
  } catch {
    return null
  }
}

/**
 * Compress images, base64-encode each file, POST to /store/reviews/upload,
 * and return media items shaped for the review create/update payload.
 *
 * Throws on validation failure, missing auth, or backend error.
 */
export async function uploadReviewMedia(files: File[]): Promise<ReviewMediaItem[]> {
  if (files.length === 0) return []
  if (files.length > MAX_REVIEW_MEDIA_FILES) {
    throw new Error(`You can attach up to ${MAX_REVIEW_MEDIA_FILES} files per review.`)
  }

  // Validate first so we fail fast before doing any compression work.
  for (const f of files) {
    const err = validateReviewFile(f)
    if (err) throw new Error(err)
  }

  const token = getAuthToken()
  if (!token) {
    throw new Error('You must be signed in to upload review media.')
  }

  // Compress images in parallel; videos pass through untouched.
  const prepared = await Promise.all(
    files.map(async (file) =>
      file.type.toLowerCase().startsWith('image/')
        ? await compressImage(file)
        : file,
    ),
  )

  // Re-validate after compression (should still be within limits; defensive).
  for (const f of prepared) {
    const err = validateReviewFile(f)
    if (err) throw new Error(err)
  }

  const payload = {
    files: await Promise.all(
      prepared.map(async (f) => ({
        filename: f.name,
        mimeType: f.type,
        content: await fileToBase64(f),
      })),
    ),
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }
  if (process.env.NEXT_PUBLIC_STORE_ID) {
    headers['X-Store-Environment-ID'] = process.env.NEXT_PUBLIC_STORE_ID
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/reviews/upload`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = `Upload failed (${res.status})`
    try {
      const body = (await res.json()) as { message?: string; error?: string }
      message = body.message || body.error || message
    } catch {
      // ignore JSON parse failure — keep status-based message
    }
    throw new Error(message)
  }

  const body = (await res.json()) as { urls?: string[] }
  const urls = body.urls ?? []
  if (urls.length !== prepared.length) {
    throw new Error('Upload response was incomplete — please try again.')
  }

  return urls.map((url, i) => ({
    url,
    type: mediaTypeFromMime(prepared[i].type),
  }))
}
