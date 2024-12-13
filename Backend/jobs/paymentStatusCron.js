const cron = require('node-cron');
const Student = require('../Models/Add_student');

// Scheduled task to run on the 1st of each month at midnight
cron.schedule('0 0 1 * *', async () => { // Testing: Runs every minute. Change back to '0 0 1 * *' for monthly.
    try {
      console.log('Running monthly payment status check...');
      const students = await Student.find().populate('payments');
  
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      for (const student of students) {
        const { joinDate, monthlyRent, payments, _id } = student;
        console.log(`Checking student ${_id}: ${student.name}`);
  
        // Use the joinDate as lastClearedDate if no payments exist
        let lastClearedDate = joinDate || new Date();  // Fallback to a default date if joinDate is missing
        if (payments.length > 0) {
          const latestPayment = payments[payments.length - 1];
          const [lastClearedMonth, lastClearedYear] = latestPayment.paymentClearedMonthYear.split(', ');
  
          if (lastClearedMonth && lastClearedYear) {
            lastClearedDate = new Date(`${lastClearedYear}-${lastClearedMonth}-01`);
            console.log(`Last payment cleared date: ${lastClearedDate}`);
          } else {
            console.log(`Invalid paymentClearedMonthYear for payment of student ${student.name}`);
          }
        }
  
        // Check if lastClearedDate is valid
        if (isNaN(lastClearedDate)) {
          console.warn(`Invalid lastClearedDate for student ${student.name}. Skipping...`);
          continue;
        }
  
        const unpaidMonths = (currentYear - lastClearedDate.getFullYear()) * 12 + currentMonth - lastClearedDate.getMonth();
        const paymentStatus = unpaidMonths > 0 ? 'Pending' : 'Paid';
  
        if (student.paymentStatus !== paymentStatus) {
          await Student.findByIdAndUpdate(_id, { paymentStatus });
          console.log(`Updated payment status for ${student.name} to ${paymentStatus}`);
        } else {
          console.log(`No update needed for ${student.name}, current status: ${student.paymentStatus}`);
        }
      }
  
      console.log('Monthly payment status check completed.');
    } catch (error) {
      console.error('Error during monthly payment status check:', error);
    }
  });
  
