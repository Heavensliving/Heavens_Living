const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const http = require("http");
const {initializeSocket} = require("./socket.js");

const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const propertyRoutes = require("./routes/property");
const staffRoutes = require("./routes/staff");
const feeRoutes = require("./routes/feePayment");
const expenseRoute = require("./routes/expense");
const messRoute = require("./routes/Mess");
const adOnRoute = require("./routes/adOn");
const commissionRoutes = require("./routes/Commission");
const peopleRoutes = require("./routes/people");
const maintenaceRoutes = require("./routes/Maintanence");
const messOrderRoutes = require("./routes/MessOrder");
const branchRoutes = require("./routes/Branch");
const phaseRoutes = require("./routes/Phase");
const DailyRentRoutes = require("./routes/DailyRent");
const CafeItemRoutes = require("./routes/CafeItem");
const CafeOrderRoutes = require("./routes/CafeOrder");
const CategoryRoutes = require("./routes/Category");
const CafeLoginRoutes = require("./routes/CafeLogin.js");
const userRoutes = require("./routes/user.js");
const roomAllocationRoutes = require("./routes/RoomAllocation.js");
const carousalRoutes = require("./routes/carousal.js");
const stockRoutes = require("./routes/stockRoutes.js");
const inventoryCategoryRoutes = require("./routes/InventoryCategoryRoutes");
const InvestmentRoute = require("./routes/Investment.js");
const appUiRoute = require("./routes/appUi.js");
const gymRoutes = require('./routes/gymRoutes');

dotenv.config();

const app = express();

const server = http.createServer(app);

initializeSocket(server);

const allowedOrigins = [
  "https://hportal.heavensliving.com",
  "https://heavens-living.onrender.com",
  "https://heavens-cafe-1.onrender.com",
  "https://heaven-living.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array or if it's undefined (for non-browser requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Role", "Content-Type"],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

require("./jobs/cron");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/fee", feeRoutes);
app.use("/api/expense", expenseRoute);
app.use("/api/mess", messRoute);
app.use("/api/adOn", adOnRoute);
app.use("/api/commission", commissionRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/maintenance", maintenaceRoutes);
app.use("/api/messOrder", messOrderRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/phase", phaseRoutes);
app.use("/api/DailyRent", DailyRentRoutes);
app.use("/api/CafeItem", CafeItemRoutes);
app.use("/api/cafeOrder", CafeOrderRoutes);
app.use("/api/Category", CategoryRoutes);
app.use("/api/CafeAuth", CafeLoginRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/room/", roomAllocationRoutes);
app.use("/api/carousal/", carousalRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/inventorycategories", inventoryCategoryRoutes);
app.use("/api/investment", InvestmentRoute);
app.use("/api/appUi", appUiRoute);
app.use('/api/gym', gymRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
