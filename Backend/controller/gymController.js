const GymSlot = require('../Models/GymSlot.js');
const moment = require('moment');

const slotTimings = [
  '5am - 7am',
  '7am - 9am',
  '3pm - 5pm',
  '5pm - 7pm',
  '7pm - 9pm',
  '9pm - 11pm'
];

// ✅ Delete all past slot data after 12 AM
const deletePastSlots = async () => {
  const now = moment();
  const isMidnightOrLater = now.hour() >= 0;

  if (isMidnightOrLater) {
    const today = now.format('YYYY-MM-DD');
    await GymSlot.deleteMany({ date: { $lt: today } });
    console.log(`✅ Deleted all slots before ${today}`);
  }
};

// ✅ Initialize slots for a single date
const initializeSlotsForDate = async (date) => {
  const existing = await GymSlot.find({ date });

  if (existing.length === 6) return;

  const creationPromises = slotTimings.map(time =>
    GymSlot.updateOne(
      { date, time },
      {
        $setOnInsert: {
          bookings: 0,
          maxBookings: 15,
          bookedUsers: []
        }
      },
      { upsert: true }
    )
  );

  await Promise.all(creationPromises);
};

// ✅ MAIN FUNCTION: Delete old & create next 7 days
exports.initializeSlotsForNext7Days = async (req, res) => {
  try {
    await deletePastSlots();

    const today = moment();

    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, 'days').format('YYYY-MM-DD');
      await initializeSlotsForDate(date);
    }

    res.status(200).json({ message: 'Old slots deleted, new 7 days initialized.' });
  } catch (err) {
    res.status(500).json({ error: 'Initialization failed', details: err.message });
  }
};

// ✅ Book a slot
exports.bookSlot = async (req, res) => {
  const { date, time, numberOfPeople, userId, slotId } = req.body;
  if (!date) return res.status(400).json({ error: 'Missing date' });
  if (!time) return res.status(400).json({ error: 'Missing time' });
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  if (!numberOfPeople || numberOfPeople <= 0) {
    return res.status(400).json({ error: 'Invalid number of people' });
  }

  try {
    // ✅ Check if user has already booked a slot for this date
    const existingBooking = await GymSlot.findOne({
      date,
      'bookedUsers.userId': userId
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked 1 slot today.' });
    }

    // ✅ Find the slot by slotId
    const slot = await GymSlot.findOne({ date, time });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found for the selected date/time.' });
    }

    if (slot.bookings + numberOfPeople > slot.maxBookings) {
      return res.status(400).json({ error: 'Slot is full or not enough space.' });
    }

    // ✅ Add booking
    slot.bookedUsers.push({
      userId,
      numberOfPeople,
      date,
      time
    });

    slot.bookings += numberOfPeople;
    await slot.save();

    res.status(200).json({
      message: 'Slot booked successfully.',
      currentBookings: slot.bookings,
      remaining: slot.maxBookings - slot.bookings
    });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed', details: err.message });
  }
};


// ✅ Get all slots for a specific date
exports.getSlotsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const slots = await GymSlot.find({ date });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', details: err.message });
  }
};

// ✅ Get all slot timings with availability for a given date
exports.getSlotsByDateWithAvailability = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: 'Date is required in YYYY-MM-DD format.' });
  }

  try {
    const allSlots = await GymSlot.find({ date });

    if (allSlots.length === 0) {
      return res.status(404).json({ error: 'No slots found for the given date.' });
    }

    const isToday = moment().format('YYYY-MM-DD') === date;
    const now = moment(); // current time

    // Sort using predefined slotTimings order
    const orderedSlots = slotTimings
      .map(slotTime => allSlots.find(slot => slot.time === slotTime))
      .filter(Boolean); // remove undefined if slot not found

    const filtered = orderedSlots.filter(slot => {
      if (!isToday) return true; // future date: keep all

      // Parse starting time from slot.time (e.g., "5am - 7am" -> "5am")
      const startTimeStr = slot.time.split(' - ')[0];
      const slotStart = moment(`${date} ${startTimeStr}`, 'YYYY-MM-DD ha');

      return now.isBefore(slotStart); // only future slots today
    });

    const formatted = filtered.map(slot => ({
      _id: slot._id, // ✅ Add this
      time: slot.time,
      bookings: slot.bookings,
      maxBookings: slot.maxBookings,
      availableSlots: slot.maxBookings - slot.bookings
    }));

    res.status(200).json({
      date,
      slots: formatted
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', details: err.message });
  }
};

// ✅ Fetch all bookings made by a specific user
exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const slots = await GymSlot.find({ 'bookedUsers.userId': userId });

    const userBookings = slots.flatMap(slot => {
      return slot.bookedUsers
        .filter(booking => booking.userId.toString() === userId)
        .map(booking => ({
          date: booking.date,
          time: booking.time,
          numberOfPeople: booking.numberOfPeople
        }));
    });

    res.status(200).json({ bookings: userBookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

// ✅ NEW CONTROLLER: Get all unique dates in DB
exports.getAllDates = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const dates = await GymSlot.distinct('date');

    // Filter out dates that are before today
    const upcomingDates = dates
      .filter(date => moment(date).isSameOrAfter(today))
      .sort();

    res.status(200).json({ availableDates: upcomingDates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dates', details: err.message });
  }
};

//gym recovered