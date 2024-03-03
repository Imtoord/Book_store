const router = require('express').Router()
const { forgotPasswordForm, forgotPasswordLink, resetPasswordView,resetPassword } = require('../controllers/passwordController')

router.route('/')
    .get(forgotPasswordForm)
    .post(forgotPasswordLink)

router.route('/:id/:token')
    .get(resetPasswordView)
    .post(resetPassword)

module.exports = router