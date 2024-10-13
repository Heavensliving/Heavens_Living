// const admin = require('firebase-admin');
// const serviceAccount = require('../../firebase/new-project-b6126-firebase-adminsdk-v9qz0-fee3b08bc0.json'); // Update with your downloaded file path


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://new-project-b6126.appspot.com',
// });

// const bucket = admin.storage().bucket();

// module.exports = bucket;



// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../../firebase/new-project-b6126-firebase-adminsdk-v9qz0-fee3b08bc0.json'); // Update with your downloaded file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://new-project-b6126.appspot.com', // Replace with your bucket name
});

const bucket = admin.storage().bucket();

module.exports = bucket;
