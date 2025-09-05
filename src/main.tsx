import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import NavBar from './ui/NavBar'
import Courses from './pages/Courses'
import Lectures from './pages/Lectures'
import LectureDetail from './pages/LectureDetail'

const router = createBrowserRouter([
  { path: '/', element: <><NavBar/><Courses/></> },
  { path: '/lectures/:courseId', element: <><NavBar/><Lectures/></> },
  { path: '/lecture/:lectureId', element: <><NavBar/><LectureDetail/></> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
