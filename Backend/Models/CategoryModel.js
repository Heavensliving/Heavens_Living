const mongoose = require('mongoose');

const Category = new mongoose.Schema({
  name:{type:String,required:true},
})

const CategorySchema = mongoose.model('CategorySchema',Category);

module.exports =CategorySchema;