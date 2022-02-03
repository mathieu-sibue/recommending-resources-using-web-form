const express = require('express');
var router = express.Router();
const tutorial = require('../controllers/tutorialControllers');
const passport = require('../config/passport');


router.post('/create', passport.adminAuth, tutorial.createTutorial)
router.post('/delete', passport.adminAuth, tutorial.deleteTutorial)
router.post('/update', passport.adminAuth, tutorial.updateTutorial)


module.exports = router;