const cron = require('node-cron');
const Student = require('../Models/Add_student');

cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('Running daily payment status and blocking check...');

    const students = await Student.find();
    const today = new Date();

    for (const student of students) {
      const { joinDate, paymentStatus, pendingSince, isBlocked, dateOfPayment, _id } = student;

      // Ensure joinDate is valid
      if (!joinDate || isNaN(new Date(joinDate))) {
        console.warn(`Invalid joinDate for student ${student.name}. Skipping...`);
        continue;
      }

      const joinDateObj = new Date(joinDate);
      let nextDueDate;

      if (dateOfPayment) {
        // Calculate next due date based on the existing `dateOfPayment`
        const lastPaymentDate = new Date(dateOfPayment);
        nextDueDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, lastPaymentDate.getDate());
      } else {
        // If there is no `dateOfPayment`, calculate the first due date (same day next month from join date)
        nextDueDate = new Date(joinDateObj.getFullYear(), joinDateObj.getMonth() + 1, joinDateObj.getDate());
      }

      // Ensure nextDueDate is in the past or today
      if (today >= nextDueDate) {
        // If `dateOfPayment` is not set, update it to the next month's same date
        if (!dateOfPayment) {
          await Student.findByIdAndUpdate(_id, {
            paymentStatus: 'Pending',
            pendingSince: today,
            isBlocked: false, // Reset blocking status when a new due date is handled
            dateOfPayment: today, // Set dateOfPayment to the current due date (same day of the next month)
          });

          console.log(`${student.name}'s status set to Pending for due date ${nextDueDate.toISOString().slice(0, 10)}.`);
        } else {
          // If `dateOfPayment` is already set, just update the payment status to Pending
          await Student.findByIdAndUpdate(_id, {
            paymentStatus: 'Pending',
            pendingSince: today,
          });

          console.log(`${student.name}'s status set to Pending for due date ${nextDueDate.toISOString().slice(0, 10)}.`);
        }
      }

      // Blocking after 7 days of Pending
      if (paymentStatus === 'Pending' && pendingSince) {
        const pendingDate = new Date(pendingSince);
        const daysPending = Math.floor((today - pendingDate) / (1000 * 60 * 60 * 24));

        if (daysPending > 7 && !isBlocked) {
          await Student.findByIdAndUpdate(_id, { isBlocked: true });
          console.log(`Blocked ${student.name} due to non-payment.`);
        }
      }

      // Update `dateOfPayment` for the next cycle
      if (today >= nextDueDate) {
        // Update the student's `dateOfPayment` for the same day next month (i.e., 10-12-2024)
        const updatedNextPaymentDate = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth() + 1, nextDueDate.getDate());
        await Student.findByIdAndUpdate(_id, { dateOfPayment: today });
        console.log(`${student.name}'s dateOfPayment updated to ${today.toISOString().slice(0, 10)}.`);
      }
    }

    console.log('Daily payment status and blocking check completed.');
  } catch (error) {
    console.error('Error during daily payment status and blocking check:', error);
  }
});
