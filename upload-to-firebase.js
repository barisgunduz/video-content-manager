const {Storage} = require('@google-cloud/storage');
const express = require("express");

const app = new express();


const storage = new Storage({
    keyFilename: "./key/video-content-manager-firebase-adminsdk-gld7u-b13bf7b8f3.json",
        });

        let bucketName = "video-content-manager.appspot.com"

            let filename = 'uploads/_Training Day_ Best Scene HD.mp4';

            const uploadFile = async() => {

            // Uploads a local file to the bucket
            await storage.bucket(bucketName).upload(filename, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                // By setting the option `destination`, you can change the name of the
                // object you are uploading to a bucket.
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                }
            })

            console.log(`${filename} uploaded to ${bucketName}.`);
        }

            uploadFile();

            app.listen(process.env.PORT || 8088, () => { console.log('node server running')});