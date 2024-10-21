const pageConfig = {
    '/': {
      title: 'Dashboard',
    },
    '/students': {
      title: 'Student Management',
    },
    '/students/:studentId': {
      title: 'Student Details',
    },
    '/students/edit/:studentId': {
      title: 'Edit Student',
    },
    '/staffs': {
      title: 'Staffs Management',
    },
    '/staffs/:staffId': {
      title: 'Staff Details',
    },
    '/staffs/edit/:staffId': {
      title: 'Edit Staff',
    },
    '/property': {
      title: 'Property Management',
    },
    '/property/:propertyId': {
      title: 'Propety Details',

    },
    '/editproperty/:propertyId': {
      title: 'Edit Property',

    },
    '/mess': {
      title: 'Mess Management',
    },
    '/meal-history':{
      title:'Meal History'
    },
    '/manage-people': {
      title: 'Manage People',
    },
     '/editPeople/:id':{
      title:'Edit People'
     },

    '/add-food': {
      title: 'Add Food',
    },
    '/addOns-item': {
      title: 'Add-Items',
    },
    '/add-ons': {
      title: 'Add-ons',
    },
    '/update-addOn/:id': {
      title: 'Edit AddOn',
    },
    '/add-people': {
      title: 'Add People',
    },
    '/maintanance': {
      title: 'Maintanance',
    },
    '/add-student': {
      title: 'Add Student',
    },
    '/add-property': {
      title: 'Add Property',
    },
    '/add-staff': {
      title: 'Add Staff',
    },
    '/update/:id': {
      title: 'Update Branch',
    },
    "/branch-management":{
      title:"Branch Management"
    },
    "/add-branch":{
      title:"Add Branch"
    },
    '/phase-management/:id':{
      title:"Phase Management"
    },
    '/add-phase/:id':{
      title:"Add Phase"
    },
    '/History':{
      title:"History"
    },
    '/add-maintanence':{
      title:"Add Maintanence"
    },

  };
  
  export default pageConfig;
  