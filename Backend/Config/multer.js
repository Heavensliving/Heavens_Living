// multerConfig.js
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for upload
const upload = multer({ storage: storage });

module.exports = upload;
