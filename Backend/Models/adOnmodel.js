const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  Itemname:{type:String,required:true},
  prize:{type:Number,required:true},
  Quantity:{type:Number,required:true},
  propertyid:{type:String,required:true},
  propertyname:{type:String,required:true},
  image:{type:String,required:true}
})

const adOnSchema = mongoose.model('adOnSchema',Schema);

module.exports =adOnSchema;