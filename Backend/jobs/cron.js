const cron = require('node-cron');
const Student = require('../Models/Add_student');
const MessOrder = require('../Models/MessOrderModel');
const moment = require('moment');

cron.schedule('0 0 * * *', async () => {

  try {
    // Find all students
    const students = await Student.find();

    const today = new Date();

    for (const student of students) {

      const joinDateObj = new Date(student.joinDate);
      let nextDueDate;

      if (student.dateOfPayment) {
        // Calculate next due date based on the existing `dateOfPayment`
        const lastPaymentDate = new Date(student.dateOfPayment);
        nextDueDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, lastPaymentDate.getDate());
      } else {
        // If there is no `dateOfPayment`, calculate the first due date (same day join date)
        nextDueDate = new Date(joinDateObj.getFullYear(), joinDateObj.getMonth(), joinDateObj.getDate());
      }

      let remainingRent = student.monthlyRent; // Full rent due this month

      if (today >= nextDueDate) {

        // Scenario 1: Full rent can be covered by balance
        if (student.accountBalance >= remainingRent) {
          student.accountBalance -= remainingRent;
          remainingRent = 0; // Rent fully covered
          console.log(`Deducted full rent ₹${student.monthlyRent} from balance for ${student.name}`);
        }
        // Scenario 2: Partial amount in balance, rest goes to pending rent    
        else if (student.accountBalance > 0) {
          remainingRent -= student.accountBalance; // Reduce remaining rent by balance amount
          console.log(`Deducted ₹${student.accountBalance} from balance for ${student.name}, remaining rent: ₹${remainingRent}`);
          student.accountBalance = 0; // Balance used up
        }

        // Scenario 3: Remaining rent (if any) should be added to pending rent
        if (remainingRent > 0) {
          student.pendingRent += remainingRent;
          student.paymentStatus = "Pending";
          student.dateOfPayment = today;
          if (!student.pendingSince) {
            student.pendingSince = today; // Store the date when payment became pending
          }
          console.log(`Updated pending rent for ${student.name}: ₹${student.pendingRent}`);
        }

        await student.save();
      }
    }
  } catch (error) {
    console.error("Error updating rent:", error);
  }
});


// ========== CRON JOB 2: Block Overdue Students ==========
cron.schedule('0 0 * * *', async () => {
  console.log("Checking students for overdue payments...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const students = await Student.find({ paymentStatus: "Pending" });

    for (const student of students) {
      if (student.pendingSince) {
        const dueDate = new Date(student.pendingSince);
        const daysPending = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        // if (student.extendDate) {
        //   const extendDate = new Date(student.extendDate);
        //   extendDate.setHours(0, 0, 0, 0);

        //   if (extendDate >= today) {
        //     console.log(`Skipping block for ${student.name}, extend date valid until ${student.extendDate}`);
        //     continue;
        //   }
        // }

        if (daysPending > 5) {
          student.isBlocked = true;
          console.log(`Blocked ${student.name} for overdue payment (₹${student.pendingRent}) for ${daysPending} days.`);
          await student.save();
        }
      }
    }
  } catch (error) {
    console.error("Error in overdue blocking job:", error);
  }
});


cron.schedule('0 0 * * *', async () => {  // Runs daily at midnight
  try {
    console.log('Running daily cleanup of orders older than 3 days...');

    const deleteOlderThan = moment().subtract(3, 'days').toDate(); // Get date 3 days ago
    const deletedOrders = await MessOrder.deleteMany({
      deliverDate: { $lt: deleteOlderThan }, // Orders older than 3 days
      $or: [
        { totalPrice: { $exists: false } }, // If totalPrice does not exist
        { totalPrice: 0 }, // OR If totalPrice is 0
      ],
    });
    console.log(`${deletedOrders.deletedCount} orders deleted that were older than 3 days.`);

    console.log('Order cleanup completed.');
  } catch (error) {
    console.error('Error during order cleanup:', error);
  }
});