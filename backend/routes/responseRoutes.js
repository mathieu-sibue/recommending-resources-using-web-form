const express = require('express');
var router = express.Router();
const response = require('../controllers/responseControllers');
const passport = require('../config/passport');


router.get('/getprevres', passport.classicAuth, response.getUserResponses)
router.post('/updateres', passport.classicAuth, response.updateUserResponses)    
router.post('/computeresults', passport.classicAuth, response.updateUserResAndComputeResults)


module.exports = router;