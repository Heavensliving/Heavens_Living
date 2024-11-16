const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
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
  monthlyAmount: {
    type: Number,
    required:true
  },  
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
  }
}); 

const peopleModel = mongoose.model('peopleModel', peopleSchema);

module.exports = peopleModel;
