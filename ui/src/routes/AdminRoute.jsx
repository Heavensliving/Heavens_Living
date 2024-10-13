import React from 'react'
import Dashboard from '../pages/Dashboard'
import AdminLayout from '../Layouts/AdminLayout'
import StudentManagement from '../pages/studentManagement/StudentManagement'
import { Route, Routes } from 'react-router-dom'
import StaffManagement from '../pages/staff/StaffManagement'
import PropertyManagement from '../pages/property/PropertyManagement'
import StudentDetails from '../pages/studentManagement/StudentDetails'
import MessManagement from '../pages/messManagement/MessManagement'
import AddFood from '../pages/messManagement/AddFood'
import AddOns from '../pages/messManagement/AddOns'
import Maintanence from '../pages/Maintanence'
import AddProperty from '../pages/property/AddProperty'
import AddStudent from '../pages/studentManagement/AddStudent'
import AddStaff from '../pages/staff/AddStaff'
import StaffDetails from '../pages/staff/StaffDetails'
import AddPeople from '../pages/messManagement/AddPeople.jsx'
import ManagePeople from '../pages/messManagement/ManagePeople.jsx'

const AdminRoute = () => {
    return (
        <div>
            <Routes>

                {/* <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signin" element={<UserSignInPage />} />
                <Route path="/signup" element={<UserSignUpPage />} /> */}

                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<StudentManagement />} />
                    <Route path="/students-details" element={<StudentDetails />} />
                    <Route path="/staffs" element={<StaffManagement />} />
                    <Route path="/staff-details" element={<StaffDetails />} />
                    <Route path="/property" element={<PropertyManagement />} />
                    <Route path="/mess" element={<MessManagement />} />
                    <Route path="/manage-people" element={<ManagePeople />} />
                    <Route path="/add-food" element={<AddFood />} />
                    <Route path="/add-ons" element={<AddOns />} />
                    <Route path="/maintanance" element={<Maintanence />} />
                    <Route path="/add-student" element={<AddStudent />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/add-staff" element={<AddStaff />} />
                    <Route path="/add-people" element={<AddPeople />} />
                </Route>

            </Routes>
        </div>
    )
}

export default AdminRoute
