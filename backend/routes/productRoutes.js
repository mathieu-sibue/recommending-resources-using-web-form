const express = require('express');
var router = express.Router();
const product = require('../controllers/productControllers');
const passport = require('../config/passport');


router.post('/create', passport.adminAuth, product.createProduct)
router.post('/delete', passport.adminAuth, product.deleteProduct)
router.post('/update', passport.adminAuth, product.updateProduct)


module.exports = router;