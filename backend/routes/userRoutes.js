const express = require('express');
var router = express.Router();
const account = require('../controllers/userControllers');
const passport = require('../config/passport');


router.post('/login', account.login)
router.post('/signup', account.signup)
router.get('/getuser', account.getUser)
router.post('/editprofile', passport.classicAuth, account.editProfile)


module.exports = router;