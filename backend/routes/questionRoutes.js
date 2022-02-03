const express = require('express');
var router = express.Router();
const question = require('../controllers/questionControllers');
const passport = require('../config/passport');


router.post('/create', passport.adminAuth, question.createQuestion)
router.post('/delete', passport.adminAuth, question.deleteQuestion)
router.post('/update', passport.adminAuth, question.updateQuestions)


module.exports = router;