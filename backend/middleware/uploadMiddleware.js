/**
 * File upload configuration using `multer` middleware.
 * This configuration uses disk storage to save files locally.
 * Files will be stored in the specified directory, and the filenames will be prefixed with the field name and a timestamp.
 */

const multer = require('multer'); // Import multer for handling file uploads

const storage = multer.diskStorage({ // Configure storage settings for multer
    destination(req, file, cb) { // Specify the destination folder for uploaded files
      cb(null, './tmp/my-uploads')// Callback that sets the destination folder for files, Files will be saved in the './tmp/my-uploads' folder
    },
    filename(req, file, cb) { // Specify the filename format for uploaded files
      cb(null, `${file.fieldname}-${Date.now()}`) // Callback that sets the filename for the uploaded file, Filename format: fieldname followed by a timestamp
    }
})

module.exports.upload = multer({ storage }); // Export the multer middleware with the specified storage configuration

