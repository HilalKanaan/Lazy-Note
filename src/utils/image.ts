export async function compressToJpeg(file: File, maxSide=1600, quality=0.72){
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const canvas = new OffscreenCanvas(Math.round(bmp.width*scale), Math.round(bmp.height*scale))
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
  return blob
}

export async function makeThumb(fileOrBlob: Blob, size=256){
  const data = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], 'img.jpg', { type: 'image/jpeg' })
  const bmp = await createImageBitmap(data)
  const scale = size / Math.max(bmp.width, bmp.height)
  const canvas = new OffscreenCanvas(Math.round(bmp.width*scale), Math.round(bmp.height*scale))
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
  return blob
}
