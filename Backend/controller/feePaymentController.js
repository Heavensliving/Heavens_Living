const {mongoose} = require("mongoose");
const Student = require("../Models/Add_student");
const FeePayment = require("../Models/feePayment"); // Ensure the path is correct
const peopleModel = require("../Models/AddPeople");
const DailyRent = require("../Models/DailyRentModel");
const nodemailer = require("nodemailer");
const fs = require("fs");
const generatePaymentReceipt = require("../utils/generatePaymentReceipt");
const Property = require("../Models/Add_property");

let receiptCounter = 0; // Initial counter, starts at 1

const generateReceiptNumber = () => {
  // Format the number with leading zeros (e.g., "HVNS01", "HVNS02", ...)
  const formattedNumber = `HVNS${String(receiptCounter).padStart(2, "0")}`;

  // Increment the counter for the next receipt number
  receiptCounter++;

  return formattedNumber;
};

// Function to send email with PDF attachment
const sendPaymentReceiptEmail = async (
  email,
  pdfBuffer,
  studentName,
  transactionId,
  payingAmount
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "heavensliving@gmail.com",
      pass: "ejsy hwcd lrsg puap",
    },
  });

  const mailOptions = {
    from: "heavensliving@gmail.com",
    to: email,
    subject: `Thank you for your payment, ${studentName}! Your Receipt is Attached`,
    text: `Dear ${studentName},\n\nThank you for making the payment. We have received your payment and the receipt is attached.\n\nReceipt Details:\n\nAmount Paid: ${payingAmount}\nTransaction ID: ${transactionId}\n\nIf you have any questions or concerns, feel free to contact us.\n\nBest regards,\nHeavens Living Team`,
    attachments: [
      {
        filename: "payment_receipt.pdf",
        content: pdfBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
// Function to add a fee payment
const addFeePayment = async (req, res) => {
  try {
    const {
      name,
      studentId,
      payingAmount,
      waveOffAmount,
      waveOffReason,
      paidDate,
      paymentMode,
      collectedBy,
      property,
      propertyId,
      transactionId,
      remarks,
      isDepositPayment,
      _id,
    } = req.body;
    // console.log(req.body);
    const studentMongoId = _id;

    if (isDepositPayment) {
      if (!studentId || !payingAmount || !_id) {
        return res
          .status(400)
          .json({message: "Missing required fields for deposit payment"});
      }

      const student = await Student.findById(_id);

      let generatedTransactionId =
        paymentMode === "Cash" ? `CASH_${Date.now()}` : transactionId;

      if (paymentMode !== "Cash") {
        const existingPaymentRecord = await FeePayment.findOne({
          transactionId: generatedTransactionId,
        });
        if (existingPaymentRecord) {
          return res
            .status(400)
            .json({message: "Transaction ID already exists."});
        }
      }

      const feePayment = new FeePayment({
        name,
        studentId,
        property,
        amountPaid: payingAmount,
        waveOff: waveOffAmount,
        paymentMode,
        transactionId: generatedTransactionId,
        collectedBy: collectedBy || "",
        paymentDate: paidDate,
        student: studentMongoId,
        remarks,
        isDepositPayment,
      });

      await feePayment.save();

      if (!student) return res.status(404).json({message: "Student not found"});

      student.depositPaid =
        (Number(student.depositPaid) || 0) + Number(payingAmount);

      await student.save();

      return res.status(201).json({
        message: "Deposit payment recorded successfully",
        depositPaid: student.depositPaid,
      });
    }

    // Parallel DB queries
    const [existingPayment, student, propertyDoc] = await Promise.all([
      transactionId ? FeePayment.findOne({transactionId}).lean() : null,
      Student.findById(studentMongoId),
      Property.findById(propertyId),
    ]);

    if (existingPayment) {
      return res.status(400).json({message: "Transaction ID already exists."});
    }
    if (!student) return res.status(404).json({message: "Student not found"});
    if (!propertyDoc)
      return res.status(404).json({message: "Property not found"});

    const monthlyRent = student.monthlyRent;
    const currentDate = new Date();
    const joinDate = new Date(student.joinDate);

    let dueAmount = (student.pendingRent || 0) - payingAmount - waveOffAmount;
    let newBalance = student.accountBalance || 0;

    if (dueAmount < 0) {
      newBalance += Math.abs(dueAmount);
      dueAmount = 0;
    }

    // Calculate all months from joinDate till now
    const rentMonths = [];
    let tempDate = new Date(joinDate);
    while (tempDate <= currentDate) {
      rentMonths.push(
        tempDate.toLocaleString("default", {month: "long"}) +
          " " +
          tempDate.getFullYear()
      );
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    student.rentMonths = student.rentMonths || [];

    // Merge existing rentMonths into a map
    const rentMonthMap = new Map(
      student.rentMonths.map((rm) => [rm.monthYear, rm])
    );

    // Ensure every month exists
    for (let monthYear of rentMonths) {
      if (!rentMonthMap.has(monthYear)) {
        rentMonthMap.set(monthYear, {
          monthYear,
          paidAmount: 0,
          waveOffAmount: 0,
          status: "Pending",
        });
      }
    }

    student.rentMonths = [...rentMonthMap.values()].sort(
      (a, b) => new Date(a.monthYear) - new Date(b.monthYear)
    );

    let remainingAmount = payingAmount;
    let remainingWaveOff = waveOffAmount;
    let fullyClearedRentMonthsSet = new Set();

    for (let month of student.rentMonths) {
      let rentDue = monthlyRent - (month.paidAmount + month.waveOffAmount);

      if (remainingWaveOff > 0) {
        const waveOffApplied = Math.min(remainingWaveOff, rentDue);
        month.waveOffAmount += waveOffApplied;
        remainingWaveOff -= waveOffApplied;
        rentDue -= waveOffApplied;
      }

      if (remainingAmount > 0 && rentDue > 0) {
        const paymentApplied = Math.min(remainingAmount, rentDue);
        month.paidAmount += paymentApplied;
        remainingAmount -= paymentApplied;
        rentDue -= paymentApplied;
      }

      if (month.paidAmount + month.waveOffAmount >= monthlyRent) {
        month.status = "Paid";
        fullyClearedRentMonthsSet.add(month.monthYear);
      }
    }

    // Allocate to future months if overflow exists
    while (remainingAmount > 0 || remainingWaveOff > 0) {
      const lastMonth = student.rentMonths[student.rentMonths.length - 1];
      const nextMonthDate = new Date(lastMonth.monthYear);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const monthYear =
        nextMonthDate.toLocaleString("default", {month: "long"}) +
        " " +
        nextMonthDate.getFullYear();

      const newMonth = {
        monthYear,
        paidAmount: 0,
        waveOffAmount: 0,
        status: "Pending",
      };

      let rentDue = monthlyRent;

      if (remainingWaveOff > 0) {
        const waveOffApplied = Math.min(remainingWaveOff, rentDue);
        newMonth.waveOffAmount = waveOffApplied;
        remainingWaveOff -= waveOffApplied;
        rentDue -= waveOffApplied;
      }

      if (remainingAmount > 0) {
        const paymentApplied = Math.min(remainingAmount, rentDue);
        newMonth.paidAmount = paymentApplied;
        remainingAmount -= paymentApplied;
        rentDue -= paymentApplied;
      }

      if (newMonth.paidAmount + newMonth.waveOffAmount >= monthlyRent) {
        newMonth.status = "Paid";
        fullyClearedRentMonthsSet.add(monthYear);
      }

      student.rentMonths.push(newMonth);
    }

    const lastPaidMonth = [...student.rentMonths]
      .reverse()
      .find((month) => month.paidAmount > 0);
    const rentMonthToStore = lastPaidMonth ? lastPaidMonth.monthYear : null;

    const receiptTransactionId =
      paymentMode === "Cash" ? `CASH_${Date.now()}` : transactionId;

    const feePayment = new FeePayment({
      name,
      studentId,
      monthlyRent,
      property,
      amountPaid: payingAmount,
      pendingBalance: dueAmount,
      waveOff: waveOffAmount,
      waveOffReason,
      advanceBalance: newBalance,
      paymentMode,
      transactionId: receiptTransactionId,
      collectedBy: collectedBy || "",
      fullyClearedRentMonths: [...fullyClearedRentMonthsSet],
      paymentDate: paidDate,
      student: studentMongoId,
      rentMonth: rentMonthToStore,
      remarks,
    });

    await feePayment.save();

    const updateFields = {
      paymentStatus: dueAmount === 0 ? "Paid" : "Pending",
      pendingRent: dueAmount,
      accountBalance: newBalance,
      rentMonths: student.rentMonths,
    };

    if (dueAmount === 0) {
      updateFields.isBlocked = false;
      updateFields.pendingSince = null;
    }

    await Student.updateOne(
      {_id: studentMongoId},
      {
        $set: updateFields,
        $push: {payments: feePayment._id},
      }
    );

    // Respond early to improve client experience
    res
      .status(201)
      .json({message: "Student fee payment added successfully", feePayment});

    // Background task: Generate receipt and email
    setImmediate(async () => {
      try {
        const studentData = await Student.findById(studentMongoId).populate(
          "payments"
        );
        const receiptNumber = generateReceiptNumber();

        const lastPaidRent = student.rentMonths
          .filter((rent) => rent.status.toLowerCase() === "paid")
          .slice(-1)[0];
        const lastPendingRent = student.rentMonths
          .filter((rent) => rent.status.toLowerCase() === "pending")
          .slice(-1)[0];

        const clearedTill = lastPaidRent
          ? `Cleared Till: ${lastPaidRent.monthYear}`
          : lastPendingRent
          ? `Pending: ${lastPendingRent.monthYear}`
          : "No rent recorded";

        const pdfBuffer = await generatePaymentReceipt(studentData, {
          payingAmount,
          waveOffAmount,
          dueAmount,
          paidDate,
          clearedTill,
          transactionId: receiptTransactionId,
          paymentMode,
          receiptNumber,
        });

        await sendPaymentReceiptEmail(
          studentData.email,
          pdfBuffer,
          studentData.name,
          receiptTransactionId,
          payingAmount
        );
      } catch (err) {
        console.error("❌ Background task failed:", err);
      }
    });
  } catch (error) {
    console.error("❌ Error adding fee payment:", error);
    res.status(500).json({message: "Error adding fee payment", error});
  }
};

const processPaymentForDailyRent = async (req, res) => {
  try {
    const {
      name,
      renterId,
      amountPaid,
      waveOff = 0,
      paymentMethod,
      transactionId,
      collectedBy,
      paymentMode,
      remarks,
      property,
      paidDate,
    } = req.body;

    console.log("Received Request Body:", req.body); // Debugging log

    // Validate if transactionId is required
    if (
      (paymentMethod === "UPI" || paymentMethod === "Online") &&
      !transactionId
    ) {
      return res.status(400).json({
        message: "Transaction ID is required for UPI or Online payments.",
      });
    }

    // Find renter
    const renter = await DailyRent.findById(renterId);
    console.log(renter);
    if (!renter) return res.status(404).json({message: "renter not found"});

    // Ensure renter has pending rent
    const previousPendingRent = renter.pendingRent || 0;
    let dueAmount = Math.max(0, previousPendingRent - amountPaid - waveOff);

    // Create a new payment record
    const newPayment = new FeePayment({
      name,
      studentId: renter.OccupantId,
      contact: renter.contactNo,
      room: renter.roomNo,
      checkIn: renter.checkIn,
      checkOut: renter.checkOut,
      property,
      amountPaid,
      waveOff,
      paymentMode,
      transactionId:
        paymentMode === "Cash"
          ? `CASH_${new Date().getTime()}`
          : req.body.transactionId,
      collectedBy: collectedBy || "",
      paymentDate: paidDate,
      remarks,
      dailyRent: renterId,
    });

    // Save payment
    await newPayment.save();
    console.log("Payment Saved:", newPayment);

    // Update renter record
    renter.paymentStatus = newPayment.status;
    renter.pendingRent = dueAmount;
    renter.paymentStatus = dueAmount === 0 ? "Paid" : "Pending";
    renter.payments.push(newPayment._id);
    await renter.save();
    console.log("renter Updated:", renter);

    return res
      .status(201)
      .json({message: "Payment processed successfully", payment: newPayment});
  } catch (error) {
    console.error("Error Processing Payment:", error);
    return res.status(500).json({message: error.message});
  }
};

// Function to get all fee payments
const getAllFeePayments = async (req, res) => {
  try {
    const feePayments = await FeePayment.find();
    res.status(200).json(feePayments);
  } catch (error) {
    console.error("Error fetching fee payments:", error);
    res.status(500).json({message: "Error fetching fee payments", error});
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const {
      search = "",
      month,
      year,
      property,
      type = "totalReceived",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // 🔍 Search by name, studentId, or transactionId
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {studentId: {$regex: search, $options: "i"}},
        {transactionId: {$regex: search, $options: "i"}},
      ];
    }

    // 📅 Filter by month and year
    if (month || year) {
      const now = new Date();
      const selectedYear = parseInt(year) || now.getFullYear();
      const selectedMonth = parseInt(month || 1) - 1; // JS Date month is 0-indexed
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 1);
      query.paymentDate = {$gte: startDate, $lt: endDate};
    }

    // 🏢 Property filter
    if (property && property !== "totalReceived") {
      query.property = property;
    }

    // 🧮 Additional type-based filter
    if (type !== "totalReceived") {
      if (type === "dailyRent") {
        query.studentId = {$regex: "^HVNDR"};
      } else if (type === "messOnly") {
        query.studentId = {$regex: "^HVNMP"};
      } else if (type === "occupants") {
        query.studentId = {$regex: "^HVNS"};
      }
    }

    // 📝 Calculate totals for the full set of filtered transactions (no pagination)
    const allFilteredTransactions = await FeePayment.find(query);

    const totalAmount = allFilteredTransactions.reduce(
      (acc, transaction) => acc + (transaction.amountPaid || 0),
      0
    );

    const filteredDailyRentTotal = allFilteredTransactions
      .filter((t) => t.studentId && t.studentId.startsWith("HVNDR"))
      .reduce((acc, t) => acc + (t.amountPaid || 0), 0);

    const filteredMessPeopleTotal = allFilteredTransactions
      .filter((t) => t.studentId && t.studentId.startsWith("HVNMP"))
      .reduce((acc, t) => acc + (t.amountPaid || 0), 0);

    // Pagination setup
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FeePayment.countDocuments(query);
    const transactionsRaw = await FeePayment.find(query)
      .sort({paymentDate: -1, _id: -1})
      .skip(skip)
      .limit(parseInt(limit));

    const transactions = Array.from(
      new Map(transactionsRaw.map((tx) => [tx.transactionId, tx])).values()
    );

    // Return transactions with the calculated totals
    res.status(200).json({
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalAmount,
      filteredDailyRentTotal,
      filteredMessPeopleTotal,
    });
  } catch (error) {
    console.error("Error fetching fee payments:", error);
    res.status(500).json({message: "Error fetching fee payments", error});
  }
};

// Function to get fee payments by student ID
const getFeePaymentsByStudentId = async (req, res) => {
  try {
    const {studentId} = req.params;

    const feePayments = await FeePayment.find({student: studentId}).populate({
      path: "student",
      select: "rentMonths", // Only fetch 'rentMonths' from the student document
    });

    if (feePayments.length === 0) {
      return res
        .status(404)
        .json({message: "No fee payments found for this student ID"});
    }

    res.status(200).json(feePayments);
  } catch (error) {
    console.error("Error fetching fee payments by student ID:", error);
    res
      .status(500)
      .json({message: "Error fetching fee payments by student ID", error});
  }
};

const getFeePaymentsByRenterId = async (req, res) => {
  try {
    // console.log(req.params)
    const {renterId} = req.params;
    const feePayments = await FeePayment.find({dailyRent: renterId});
    // console.log(feePayments)

    if (feePayments.length === 0) {
      return res
        .status(404)
        .json({message: "No fee payments found for this ID"});
    }

    res.status(200).json(feePayments);
  } catch (error) {
    console.error("Error fetching fee payments by renter ID:", error);
    res
      .status(500)
      .json({message: "Error fetching fee payments by renter ID", error});
  }
};

// Function to edit a fee payment
const editFeePayment = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedData = req.body;

    const feePayment = await FeePayment.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!feePayment) {
      return res.status(404).json({message: "Fee payment not found"});
    }

    res
      .status(200)
      .json({message: "Fee payment updated successfully", feePayment});
  } catch (error) {
    console.error("Error updating fee payment:", error);
    res.status(500).json({message: "Error updating fee payment", error});
  }
};

// Function to delete a fee payment
const deleteFeePayment = async (req, res) => {
  try {
    const {id} = req.params;

    const feePayment = await FeePayment.findByIdAndDelete(id);

    if (!feePayment) {
      return res.status(404).json({message: "Fee payment not found"});
    }

    res.status(200).json({message: "Fee payment deleted successfully"});
  } catch (error) {
    console.error("Error deleting fee payment:", error);
    res.status(500).json({message: "Error deleting fee payment", error});
  }
};

const getPendingPayments = async (req, res) => {
  try {
    // Find students and mess people with a payment status of "Pending"
    const students = await Student.find({
      paymentStatus: "Pending",
      vacate: false,
    });
    const messPeople = await peopleModel.find({paymentStatus: "Pending"});

    if (students.length === 0 && messPeople.length === 0) {
      return res.status(200).json([]);
    }

    // Array to store the student details along with their pending rent amount
    const pendingPaymentsDetails = await Promise.all([
      // Handling students
      ...students.map(async (student) => {
        const latestPayment = await FeePayment.findOne({student: student._id})
          .sort({createdAt: -1})
          .lean();

        const today = new Date();
        const joinDate = new Date(student.joinDate);
        const joinDay = joinDate.getDate();

        let unpaidMonths = 0;
        let advanceBalance = latestPayment
          ? latestPayment.advanceBalance || 0
          : 0;
        let waveOffAmount = latestPayment ? latestPayment.waveOff || 0 : 0;

        if (latestPayment && latestPayment.paymentClearedMonthYear) {
          const [clearedMonth, clearedYear] =
            latestPayment.paymentClearedMonthYear.split(", ");
          const clearedDate = new Date(`${clearedYear}-${clearedMonth}-01`);
          clearedDate.setDate(joinDay);

          unpaidMonths =
            (today.getFullYear() - clearedDate.getFullYear()) * 12 +
            (today.getMonth() - clearedDate.getMonth());
          if (today.getDate() < clearedDate.getDate()) {
            unpaidMonths--;
          }
        } else {
          // unpaidMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
          // if (today.getDate() < joinDate.getDate()) {
          //   unpaidMonths--;
          // }
          // unpaidMonths = 2
          const joinYear = joinDate.getFullYear();
          const joinMonth = joinDate.getMonth(); // Months are zero-based in JavaScript
          const joinDay = joinDate.getDate();

          unpaidMonths =
            (today.getFullYear() - joinYear) * 12 +
            (today.getMonth() - joinMonth) +
            1; // Add 1 to make it inclusive
          if (today.getDate() < joinDay) {
            unpaidMonths--;
          }
        }

        const monthlyRent = student.monthlyRent || 0;
        const pendingRentAmount = student.pendingRent;

        const dateOfPayment = student.dateOfPayment
          ? new Date(student.dateOfPayment)
          : null; // Extract dateOfPayment from student document

        const todayDate = new Date(); // Get today's date
        todayDate.setUTCHours(0, 0, 0, 0); // Set to UTC midnight

        if (dateOfPayment) {
          dateOfPayment.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight
        }

        let adjustedWaveOffAmount = waveOffAmount;
        if (dateOfPayment && todayDate >= dateOfPayment) {
          adjustedWaveOffAmount = 0;
        }
        // const totalRentDue = unpaidMonths * monthlyRent;

        // let pendingRentAmount = totalRentDue + (latestPayment ? latestPayment.pendingBalance || 0 : 0) - adjustedWaveOffAmount - advanceBalance;
        // let pendingRentAmount =
        //   (latestPayment && latestPayment.pendingBalance >= latestPayment.monthlyRent ? 0 : totalRentDue) +
        //   (latestPayment ? latestPayment.pendingBalance || 0 : 0) -
        //   adjustedWaveOffAmount -
        //   advanceBalance;

        if (pendingRentAmount < 0) {
          advanceBalance = Math.abs(pendingRentAmount);
          pendingRentAmount = 0;
        } else {
          advanceBalance = 0;
        }

        return {
          studentId: student.studentId,
          name: student.name,
          contact: student.contactNo,
          joinDate: student.joinDate,
          room: student.roomNo,
          monthlyRent,
          unpaidMonths,
          pendingRentAmount,
          advanceBalance,
          waveOffAmount,
          lastPaidDate: latestPayment ? latestPayment.paymentDate : null,
          paymentClearedMonthYear: latestPayment
            ? latestPayment.paymentClearedMonthYear
            : null,
          fullyClearedRentMonths: latestPayment
            ? latestPayment.fullyClearedRentMonths
            : null,
          propertyName: student.pgName,
        };
      }),

      // Handling mess people
      ...messPeople.map(async (person) => {
        const latestPayment = await FeePayment.findOne({messPeople: person._id})
          .sort({createdAt: -1})
          .lean();
        const today = new Date();
        const joinDate = new Date(person.joinDate);
        const joinDay = joinDate.getDate();

        let unpaidMonths = 0;
        let advanceBalance = latestPayment
          ? latestPayment.advanceBalance || 0
          : 0;
        let waveOffAmount = latestPayment ? latestPayment.waveOff || 0 : 0;

        if (latestPayment && latestPayment.paymentClearedMonthYear) {
          const [clearedMonth, clearedYear] =
            latestPayment.paymentClearedMonthYear.split(", ");
          const clearedDate = new Date(`${clearedYear}-${clearedMonth}-01`);
          clearedDate.setDate(joinDay);

          unpaidMonths =
            (today.getFullYear() - clearedDate.getFullYear()) * 12 +
            (today.getMonth() - clearedDate.getMonth());
          if (today.getDate() < clearedDate.getDate()) {
            unpaidMonths--;
          }
        } else {
          unpaidMonths =
            (today.getFullYear() - joinDate.getFullYear()) * 12 +
            (today.getMonth() - joinDate.getMonth());
          if (today.getDate() < joinDate.getDate()) {
            unpaidMonths--;
          }
        }

        const monthlyRent = person.monthlyRent || 0;
        const totalRentDue = unpaidMonths * monthlyRent;

        let pendingRentAmount =
          totalRentDue +
          (latestPayment ? latestPayment.pendingBalance || 0 : 0) -
          waveOffAmount -
          advanceBalance;

        if (pendingRentAmount < 0) {
          advanceBalance = Math.abs(pendingRentAmount);
          pendingRentAmount = 0;
        } else {
          advanceBalance = 0;
        }

        return {
          studentId: person.studentId,
          name: person.name,
          monthlyRent,
          unpaidMonths,
          pendingRentAmount,
          advanceBalance,
          waveOffAmount,
          lastPaidDate: latestPayment ? latestPayment.paymentDate : null,
          paymentClearedMonthYear: latestPayment
            ? latestPayment.paymentClearedMonthYear
            : null,
          property: person.propertyName,
        };
      }),
    ]);
    res.status(200).json(pendingPaymentsDetails);
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    res.status(500).json({message: "Error fetching pending payments", error});
  }
};

const getWaveOffPayments = async (req, res) => {
  try {
    // Find payments where waveOff amount is greater than 0
    const waveOffPayments = await FeePayment.find({waveOff: {$gt: 0}});
    res.status(200).json(waveOffPayments);
  } catch (error) {
    console.error("Error fetching payments with wave-off amounts:", error);
    res
      .status(500)
      .json({message: "Error fetching payments with wave-off amounts", error});
  }
};

const getTotalMonthlyRent = async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find(
      {vacate: false},
      "monthlyRent joinDate"
    ); // Only selecting monthlyRent field
    const messPeople = await peopleModel.find({vacate: false}, "monthlyRent");

    const eligibleStudents = students.filter(
      (student) => new Date(student.joinDate) <= new Date()
    );

    const totalMonthlyRentStudents = eligibleStudents.reduce((acc, student) => {
      return acc + (student.monthlyRent || 0); // Default to 0 if monthlyRent is undefined
    }, 0);

    const totalMonthlyRentMess = messPeople.reduce((acc, mess) => {
      return acc + (mess.monthlyRent || 0); // Default to 0 if monthlyRent is undefined
    }, 0);

    res.status(200).json({totalMonthlyRentStudents, totalMonthlyRentMess});
  } catch (error) {
    console.error("Error calculating total monthly rent:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

const feePaymentController = {
  addFeePayment,
  getAllFeePayments,
  getAllTransactions,
  getFeePaymentsByStudentId,
  getFeePaymentsByRenterId,
  editFeePayment,
  deleteFeePayment,
  getPendingPayments,
  getWaveOffPayments,
  getTotalMonthlyRent,
  processPaymentForDailyRent,
};

module.exports = feePaymentController;
