const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  name: {  
    type: String,  
    required: true  
  },  
  contactNumber: {  
    type: String,  
    required: true  
  },  
  email: {  
    type: String,  
    required: false  
  },  
  mealType: {  
    type: String,  
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Whole Meal'],  
    required: true  
  },
  monthlyRent: {
    type: Number,
    required:true
  },
  paymentStatus: { type: String, default: 'Paid', enum: ['Pending', 'Paid'], },   
  timePeriod: {  
    months: {  
      type: Number,  
      required: true  
    },  
    days: {  
      type: Number,  
      required: true  
    }  
  },  
  password: {  
    type: String,  
    required: true 
  },
  propertyName: {
    type: String,
    required: true
  },
  propertyId: {
    type: String,
    required: false
  },
  daysleft: {
    type: String,
    required: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
},
payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeePayment' }],  
messOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessOrder' }],
}); 

const peopleModel = mongoose.model('peopleModel', peopleSchema);

module.exports = peopleModel;
