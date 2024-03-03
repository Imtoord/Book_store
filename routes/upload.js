const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { verifyImageUploded } = require('../middlewares/upload')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'))
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1].toLowerCase()
        if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') cb(new Error("not supported"), null)
        cb(null, new Date().getTime() + "-" + file.originalname)

    }
})

const upload = multer({ storage })

router.post('/', upload.single('file'), verifyImageUploded, (req, res) => {
    res.json({
        message: 'File uploaded successfully'
    })
})



module.exports = router
