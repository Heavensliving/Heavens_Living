import React from 'react'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'
import AdminLayout from '../Layouts/AdminLayout'
import StudentManagement from '../pages/studentManagement/StudentManagement'
import { Route, Routes } from 'react-router-dom'
import StaffManagement from '../pages/staff/StaffManagement'
import PropertyManagement from '../pages/property/PropertyManagement'
import StudentDetails from '../pages/studentManagement/StudentDetails'
import MessManagement from '../pages/messManagement/MessManagement'
import AddFood from '../pages/messManagement/AddFood'
import AddOns from '../pages/messManagement/AddOns'
import Maintanence from '../pages/Maintenance/Maintanence.jsx'
import AddProperty from '../pages/property/AddProperty'
import AddStudent from '../pages/studentManagement/AddStudent'
import AddStaff from '../pages/staff/AddStaff'
import StaffDetails from '../pages/staff/StaffDetails'
import AddPeople from '../pages/messManagement/AddPeople.jsx'
import ManagePeople from '../pages/messManagement/ManagePeople.jsx'
import Signup from '../pages/auth/Signup.jsx'
import Login from '../pages/auth/Login.jsx'
import PropertyDetails from '../pages/property/PropertyDetails.jsx'
import EditProperty from '../pages/property/EditProperty.jsx'
import AddAddOnsItem from '../pages/messManagement/AddAddOnsItem.jsx'
import EditAddOns from '../pages/messManagement/EditAddOns.jsx'
import EditPeople from '../pages/messManagement/EditPeople.jsx'
import EditStudent from '../pages/studentManagement/EditSudent.jsx'
import EditStaff from '../pages/staff/EditStaff.jsx'
import AddMaintanence from '../pages/Maintenance/AddMaintanence.jsx'
import MealHistory from '../pages/messManagement/MealHistory.jsx'
import BranchManagement from '../pages/property/BranchManagement.jsx'
import AddBranch from '../pages/property/AddBranch.jsx'
import EditBranch from '../pages/property/EditBranch.jsx'
import PhaseManagement from '../pages/property/PhaseManagement.jsx'
import EditPhase from '../pages/property/EditPhase.jsx'
import AddPhase from '../pages/property/AddPhase.jsx'
import Property from '../pages/property/Property.jsx'
import AddPropertyToPhase from '../pages/property/AddPropertyToPhase.jsx'
import History from '../pages/Maintenance/History.jsx'
import DailyRentPage from '../pages/DailyRent/DailyRentPage.jsx'
import AddDailyRent from '../pages/DailyRent/AddDailyRent.jsx'
import DailyRentDetails from '../pages/DailyRent/DailyRentDetails.jsx'
import EditDailyRentPerson from '../pages/DailyRent/EditDailyRentPerson.jsx'


const AdminRoute = () => {
    return (
        <div>
            <Routes>

                {/* <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signin" element={<UserSignInPage />} />
                <Route path="/signup" element={<UserSignUpPage />} /> */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<StudentManagement />} />
                    <Route path="/students/:studentId" element={<StudentDetails />} />
                    <Route path="/students/edit/:studentId" element={<EditStudent />} />
                    <Route path="/staffs" element={<StaffManagement />} />
                    <Route path="/staffs/:staffId" element={<StaffDetails />} />
                    <Route path="/staffs/edit/:staffId" element={<EditStaff />} />
                    <Route path="/properties" element={<PropertyManagement />} />
                    <Route path="/property/:propertyId" element={<PropertyDetails />} />
                    <Route path="/mess" element={<MessManagement />} />
                    <Route path="/manage-people" element={<ManagePeople />} />
                    <Route path="/add-food" element={<AddFood />} />
                    <Route path="/addOns-item" element={<AddAddOnsItem />} />
                    <Route path="/add-ons" element={<AddOns />} />
                    <Route path="/update-addOn/:id" element={<EditAddOns />} />
                    <Route path="/maintanance" element={<Maintanence />} />
                    <Route path="/add-student" element={<AddStudent />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/add-staff" element={<AddStaff />} />
                    <Route path="/add-people" element={<AddPeople />} />
                    <Route path='/editproperty/:propertyId' element={<EditProperty/>} />
                    <Route path='/editPeople/:id' element={<EditPeople/>}/>
                    <Route path='/add-maintanence' element={<AddMaintanence/>}/>
                    <Route path='/meal-history' element={<MealHistory/>}/>
                    <Route path='/branch-management' element={<BranchManagement/>}/>
                    <Route path='/add-branch' element={<AddBranch/>}/>
                    <Route path='/update/:id' element={<EditBranch/>}/>
                    <Route path='/phase-management/:id' element={<PhaseManagement/>}/>
                    <Route path='/add-phase/:id' element={<AddPhase/>}/>
                    <Route path='/updatePhase/:id' element={<EditPhase/>}/>
                    <Route path='/properties/:id' element={<Property/>}/>
                    <Route path='/add-property/:id' element={<AddPropertyToPhase/>}/>
                    <Route path='history' element={<History/>}/>
                    <Route path="/dailyRent" element={<DailyRentPage/>}/>
                    <Route path="/AddDailyRent" element={<AddDailyRent />}/>
                    <Route path="/dailyRent/:id" element={<DailyRentDetails />}/>
                    <Route path="/dailyRent/edit/:id" element={<EditDailyRentPerson />}/>
                    
                </Route>

            </Routes>
        </div>
    )
}

export default AdminRoute
