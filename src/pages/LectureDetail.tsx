import React, { useEffect, useState } from 'react'
import { db, Photo } from '../db/db'
import { useParams, Link } from 'react-router-dom'
import { compressToJpeg, makeThumb } from '../utils/image'
import JSZip from 'jszip'

export default function LectureDetail(){
  const { lectureId } = useParams()
  const [items, setItems] = useState<Photo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(()=>{
    const load = async()=> setItems(await db.photos.where('lectureId').equals(Number(lectureId)).reverse().sortBy('createdAt'))
    load()
    const i = setInterval(load, 500)
    return ()=>clearInterval(i)
  },[lectureId])

  async function onAdd(ev: React.ChangeEvent<HTMLInputElement>){
    if(!lectureId || !ev.target.files) return
    const files = Array.from(ev.target.files)
    for(const f of files){
      const jpeg = await compressToJpeg(f, 1600, 0.72)
      const thumb = await makeThumb(jpeg, 256)
      await db.photos.add({ lectureId: Number(lectureId), title, description, blob: jpeg, thumb, createdAt: Date.now() })
    }
    setTitle(''); setDescription(''); (ev.target as any).value = ''
    setItems(await db.photos.where('lectureId').equals(Number(lectureId)).reverse().sortBy('createdAt'))
  }

  async function remove(p: Photo){
    await db.photos.delete(p.id!)
    setItems(await db.photos.where('lectureId').equals(Number(lectureId)).reverse().sortBy('createdAt'))
  }

  async function exportLecture(){
    const zip = new JSZip()
    const photos = await db.photos.where('lectureId').equals(Number(lectureId)).toArray()
    const meta: any[] = []
    for(const p of photos){
      const pid = p.id!
      const mainName = `images/${pid}.jpg`
      const thumbName = `thumbs/${pid}_256.jpg`
      const mainBuf = new Uint8Array(await p.blob.arrayBuffer())
      const thumbBuf = new Uint8Array(await p.thumb.arrayBuffer())
      zip.file(mainName, mainBuf)
      zip.file(thumbName, thumbBuf)
      meta.push({ id: pid, title: p.title, description: p.description, main: mainName, thumb: thumbName, createdAt: p.createdAt })
    }
    zip.file('meta.json', JSON.stringify({ lectureId, photos: meta }, null, 2))
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `lecture-${lectureId}.zip`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function importLecture(ev: React.ChangeEvent<HTMLInputElement>){
    if(!lectureId || !ev.target.files) return
    const file = ev.target.files[0]
    const zip = await JSZip.loadAsync(file)
    const metaText = await zip.file('meta.json')!.async('string')
    const meta = JSON.parse(metaText)
    for(const m of meta.photos){
      const blob = new Blob([await zip.file(m.main)!.async('uint8array')], { type: 'image/jpeg' })
      const thumb = new Blob([await zip.file(m.thumb)!.async('uint8array')], { type: 'image/jpeg' })
      await db.photos.add({ lectureId: Number(lectureId), title: m.title, description: m.description, blob, thumb, createdAt: m.createdAt || Date.now() })
    }
    ;(ev.target as any).value=''
    setItems(await db.photos.where('lectureId').equals(Number(lectureId)).reverse().sortBy('createdAt'))
  }

  return (
    <div className="container grid" style={{gap:16}}>
      <div className="card">
        <h1>Lecture</h1>
        <div className="grid">
          <input className="input" placeholder="Photo title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="textarea" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
          <input type="file" accept="image/*" multiple onChange={onAdd} />
          <div className="row">
            <button className="btn" onClick={exportLecture}>Export</button>
            <label className="btn secondary">
              Import
              <input type="file" accept=".zip" style={{display:'none'}} onChange={importLecture} />
            </label>
          </div>
          <Link className="small" to={-1 as any}>← Back</Link>
        </div>
      </div>
      <div className="grid courses">
        {items.map(p => (
          <div key={p.id} className="card">
            <img className="thumb" src={URL.createObjectURL(p.thumb)} alt={p.title||'photo'} />
            <h2>{p.title || 'Untitled'} <span className="badge">photo</span></h2>
            {p.description && <div className="small">{p.description}</div>}
            <div className="row">
              <a className="btn" href={URL.createObjectURL(p.blob)} target="_blank" rel="noreferrer">Open</a>
              <button className="btn secondary" onClick={()=>remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
