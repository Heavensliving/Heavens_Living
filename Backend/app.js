
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload') 
const studentRoutes = require('./routes/student');
const propertyRoutes = require('./routes/property');
const staffRoutes = require('./routes/staff');
const feeRoutes = require('./routes/feePayment');
const expenseRoute = require('./routes/expense');
const messRoute = require('./routes/Mess');
const adOnRoute = require('./routes/adOn');
const commissionRoutes = require('./routes/Commission')

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(fileUpload({
  createParentPath: true // Automatically create the parent directory if it doesn't exist
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/students', studentRoutes);  
app.use('/api/property', propertyRoutes); 
app.use('/api/staff', staffRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/expense',expenseRoute);
app.use('/api/mess',messRoute);
app.use('/api/adOn',adOnRoute);
app.use('/api/commission',commissionRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
