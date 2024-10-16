const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  Itemname:{type:String,required:true},
  prize:{type:Number,required:true},
  Description:{type:String,required:true},
  image:{type:String,required:true},
  status: {
    type: String,
    enum: ['available', 'unavailable'], 
    default: 'unavailable', 
  },
})

const adOnSchema = mongoose.model('adOnSchema',Schema);

module.exports =adOnSchema;