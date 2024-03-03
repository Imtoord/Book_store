const multer = require('multer')
const verifyImageUploded = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error
        res.json({ error: "Multer error: " + err.message })
    } else {        // Other errors
        res.json({ error: err.message })
    }
}

module.exports = { verifyImageUploded }