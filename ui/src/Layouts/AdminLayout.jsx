import React from 'react'
import Sidebar from '../components/admin/layoutComponets/Sidebar'
import Navbar from '../components/admin/layoutComponets/Navbar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="flex">
    <div className={`flex-grow transition-all ml-16 md:ml-60 sm:ml-16`}>
        <Sidebar />
        <Navbar/>
        <div>
            <Outlet/>
        </div>
    </div>
</div>
  )
}

export default AdminLayout
