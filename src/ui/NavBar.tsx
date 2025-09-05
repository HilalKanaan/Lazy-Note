import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(){
  return (
    <div className="nav container">
      <Link to="/"><strong>Class Notes (Local)</strong></Link>
      <div style={{marginLeft:'auto'}} />
      <Link className="btn secondary" to="/">Home</Link>
    </div>
  )
}
