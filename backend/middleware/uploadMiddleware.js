/**
 * ...
 *
 */

const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './tmp/my-uploads')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}`)
    }
})
module.exports.upload = multer({ storage });

