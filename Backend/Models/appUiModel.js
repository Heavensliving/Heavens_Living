
const mongoose = require('mongoose');

const appUiSchema = new mongoose.Schema({
    appBarColor:{type:String, required:false},
    mainContainerColor:{type:String, required:false},
    mainContainerImage:{type:String, required:false},
    showContainer:{type:Boolean, required:false},
    homeBodyBGColor:{type:String, required:false},
    containerHeight:{type:String, required:false},
    emergencyMessageEnable:{type:Boolean, required:false},
    emergencyMessageText:{type:String, required:false},
    emergencyMessageIcon:{type:String, required:false},
})
  

const AppUi = mongoose.model("AppUi", appUiSchema);

module.exports = AppUi;
