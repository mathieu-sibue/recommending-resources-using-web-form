const Product = require('../models/Product');
const Question = require('../models/Question');
//const mongoose = require('mongoose');

async function createProduct(req, res) {
    var productToAdd = req.body;
    try {
        var productCreated;
        await Product.create(
            {
                ...productToAdd,
                createdAt: new Date()
            }
        ).then((res)=>{productCreated=res})
        return res.status(201).json({
            productCreated: productCreated,
            text: "Produit créé"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }
}

async function deleteProduct(req, res) {
    const productToDelete = req.body;
    try {
        await Product.deleteOne(
            {
                _id: productToDelete._id
            }
        )
        // we update all the questions linked to the deleted product
        const associatedQuestions = await Question.find({
            products: { "$in" : [productToDelete._id]}
        });
        await Promise.all(associatedQuestions.map(async (question)=>{
            newQuestionProducts = (question.products).filter(val=>val.toString()!==productToDelete._id);
            await Question.findOneAndUpdate({ 
                _id: question._id
            },
            {
                $set: {
                    products: newQuestionProducts
                }
            })
        }))   
        return res.status(200).json({
            text: "Produit supprimé"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}

async function updateProduct(req, res) {
    const productToUpdate = req.body;
    try {
        await Product.findOneAndUpdate(
            {
                _id: productToUpdate._id
            },
            {
                $set: productToUpdate
            }
        )
        return res.status(200).json({
            text: "Produit mis à jour"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}


exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;