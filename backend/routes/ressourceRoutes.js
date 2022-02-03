const express = require('express');
var router = express.Router();
const ressource = require('../controllers/ressourceControllers');
const passport = require('../config/passport');


router.get('/getall', passport.adminAuth, ressource.getAllRessources)
router.get('/getallresults', passport.adminAuth, ressource.getAllResults)
router.post('/deleteuserresponse', passport.adminAuth, ressource.deleteUserResponse)


module.exports = router;