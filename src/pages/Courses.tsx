import React, { useEffect, useState } from 'react'
import { db, Course, requestPersistentStorage } from '../db/db'
import { Link } from 'react-router-dom'

export default function Courses(){
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<Course[]>([])

  useEffect(()=>{
    requestPersistentStorage()
    const load = async()=> setItems(await db.courses.orderBy('createdAt').reverse().toArray())
    load()
    const i = setInterval(load, 500) // simple live refresh
    return ()=>clearInterval(i)
  },[])

  async function addCourse(e: React.FormEvent){
    e.preventDefault()
    if(!title.trim()) return
    await db.courses.add({ title: title.trim(), createdAt: Date.now() })
    setTitle('')
    setItems(await db.courses.orderBy('createdAt').reverse().toArray())
  }

  async function remove(id?: number){
    if(id===undefined) return
    // Delete lectures + photos under this course
    const lectures = await db.lectures.where('courseId').equals(id).toArray()
    for(const lec of lectures){
      const photos = await db.photos.where('lectureId').equals(lec.id!).toArray()
      await db.photos.bulkDelete(photos.map(p=>p.id!))
    }
    await db.lectures.bulkDelete(lectures.map(l=>l.id!))
    await db.courses.delete(id)
    setItems(await db.courses.orderBy('createdAt').reverse().toArray())
  }

  return (
    <div className="container grid" style={{gap:16}}>
      <div className="card">
        <h1>Courses</h1>
        <form onSubmit={addCourse} className="row">
          <input className="input" placeholder="Add a course..." value={title} onChange={e=>setTitle(e.target.value)} />
          <button className="btn">Add</button>
        </form>
      </div>
      <div className="grid courses">
        {items.map(c => (
          <div key={c.id} className="card">
            <h2>{c.title}</h2>
            <div className="row">
              <Link className="btn" to={`/lectures/${c.id}`}>Open</Link>
              <button className="btn secondary" onClick={()=>remove(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
