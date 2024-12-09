// const admin = require("firebase-admin");

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

// const sendNotification = async (req, res) => {
//   const { token, title, body } = req.body;

//   if (!token || !title || !body) {
//     return res.status(400).send({ error: "Missing required fields." });
//   }

//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token: token, // Send notification to the FCM token
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Notification sent:", response);
//     res.status(200).send({ success: true, message: "Notification sent!" });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).send({ error: "Failed to send notification" });
//   }
// };

// module.exports = { sendNotification };
