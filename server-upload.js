const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const uuid = require('uuid').v4;
const app = express();
const {Storage} = require('@google-cloud/storage');
require('dotenv').config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const {originalname} = file;
        // or
        // uuid, or fieldname
        cb(null, originalname);
    }
})

const filesDir = path.join(path.dirname(require.main.filename), "uploads");
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Firebase
const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_ADMIN_SDK_JSON);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const uploadFilesToDb = db.collection('uploads').doc('uploadFilesToDb');

uploadFilesToDb.set({
    'Filename': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 19125
});

const storageToFirebase = new Storage({
    keyFilename: process.env.FIREBASE_ADMIN_SDK_JSON,
});

let bucketName = "video-content-manager.appspot.com"
let filename = "uploads/John Wick - How much for the car.mp4";

const uploadFile = async () => {
    await storageToFirebase.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            cacheControl: 'public, max-age=31536000',
        }
    })
    console.log(`${filename} uploaded to ${bucketName}.`);
}

const upload = multer({storage}); // or simply { dest: 'uploads/' }
app.use(express.static('public'))

app.post('/upload', upload.array('avatar'), (req, res) => {
    uploadFile().then(r => {
        return res.json({status: 'OK', uploaded: req.files});
    });
    // const snapshot = db.collection('uploads').get();
    // snapshot.forEach((doc) => {
    //     console.log(doc.id, '=>', doc.data());
    // });
});
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});