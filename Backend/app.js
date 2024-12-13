const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http');
const { Server } = require('socket.io');

const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const propertyRoutes = require('./routes/property');
const staffRoutes = require('./routes/staff');
const feeRoutes = require('./routes/feePayment');
const expenseRoute = require('./routes/expense');
const messRoute = require('./routes/Mess');
const adOnRoute = require('./routes/adOn');
const commissionRoutes = require('./routes/Commission');
const peopleRoutes = require('./routes/people');
const { router: maintenaceRoutes, setMaintenanceSocketIO} = require('./routes/Maintanence');
const { router: messOrderRoutes, setSocketIO } = require('./routes/MessOrder'); 
const branchRoutes = require('./routes/Branch');
const phaseRoutes = require('./routes/Phase');
const DailyRentRoutes = require('./routes/DailyRent');
const CafeItemRoutes = require('./routes/CafeItem');
const CafeOrderRoutes = require('./routes/CafeOrder');
const CategoryRoutes = require('./routes/Category');
const CafeLoginRoutes = require('./routes/CafeLogin.js')



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// Set the Socket.IO instance in the messOrder routes
setSocketIO(io);
// Set the Socket.IO instance in the maintenance routes
setMaintenanceSocketIO(io);

// Middleware
app.use(cors());

app.use(express.json());
app.use(fileUpload({
  createParentPath: true
}));

require('./jobs/paymentStatusCron');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/expense',expenseRoute);
app.use('/api/mess',messRoute);
app.use('/api/adOn',adOnRoute);
app.use('/api/commission',commissionRoutes);
app.use('/api/people',peopleRoutes);
app.use('/api/maintenance',maintenaceRoutes);
app.use('/api/messOrder',messOrderRoutes);
app.use('/api/branch',branchRoutes);
app.use('/api/phase',phaseRoutes);
app.use('/api/DailyRent',DailyRentRoutes);
app.use('/api/CafeItem',CafeItemRoutes);
app.use('/api/cafeOrder',CafeOrderRoutes);
app.use('/api/Category' ,CategoryRoutes);
app.use('/api/CafeAuth',CafeLoginRoutes)



const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
