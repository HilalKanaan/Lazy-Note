import Dexie, { Table } from 'dexie'

export interface Course { id?: number; title: string; createdAt: number }
export interface Lecture { id?: number; courseId: number; title: string; createdAt: number }
export interface Photo { id?: number; lectureId: number; title?: string; description?: string; blob: Blob; thumb: Blob; createdAt: number }

export class NotesDB extends Dexie {
  courses!: Table<Course, number>
  lectures!: Table<Lecture, number>
  photos!: Table<Photo, number>
  constructor(){
    super('class-notes-local')
    this.version(1).stores({
      courses: '++id, createdAt',
      lectures: '++id, courseId, createdAt',
      photos: '++id, lectureId, createdAt'
    })
  }
}

export const db = new NotesDB()

export async function requestPersistentStorage(){
  if (navigator.storage && 'persist' in navigator.storage) {
    try { await navigator.storage.persist() } catch {}
  }
}
