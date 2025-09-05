import React, { useEffect, useState } from 'react'
import { db, Lecture } from '../db/db'
import { Link, useParams } from 'react-router-dom'

export default function Lectures(){
  const { courseId } = useParams()
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<Lecture[]>([])

  useEffect(()=>{
    const load = async()=> setItems(await db.lectures.where('courseId').equals(Number(courseId)).reverse().sortBy('createdAt'))
    load()
    const i = setInterval(load, 500)
    return ()=>clearInterval(i)
  },[courseId])

  async function addLecture(e: React.FormEvent){
    e.preventDefault()
    if(!title.trim() || !courseId) return
    await db.lectures.add({ courseId: Number(courseId), title: title.trim(), createdAt: Date.now() })
    setTitle('')
    setItems(await db.lectures.where('courseId').equals(Number(courseId)).reverse().sortBy('createdAt'))
  }

  async function remove(id?: number){
    if(id===undefined) return
    const photos = await db.photos.where('lectureId').equals(id).toArray()
    await db.photos.bulkDelete(photos.map(p=>p.id!))
    await db.lectures.delete(id)
    setItems(await db.lectures.where('courseId').equals(Number(courseId)).reverse().sortBy('createdAt'))
  }

  return (
    <div className="container grid" style={{gap:16}}>
      <div className="card">
        <h1>Lectures</h1>
        <form onSubmit={addLecture} className="row">
          <input className="input" placeholder="Add a lecture..." value={title} onChange={e=>setTitle(e.target.value)} />
          <button className="btn">Add</button>
        </form>
        <Link className="small" to="/">← Back to courses</Link>
      </div>
      <div className="grid courses">
        {items.map(l => (
          <div key={l.id} className="card">
            <h2>{l.title}</h2>
            <div className="row">
              <Link className="btn" to={`/lecture/${l.id}`}>Open</Link>
              <button className="btn secondary" onClick={()=>remove(l.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
