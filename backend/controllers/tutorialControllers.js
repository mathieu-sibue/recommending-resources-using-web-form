const Tutorial = require('../models/Tutorial');
const Product = require('../models/Product');
const Question = require('../models/Question');


async function createTutorial(req, res) {
    const tutorialToAdd = req.body;
    try {
        var tutorialCreated;
        await Tutorial.create(
            {
                ...tutorialToAdd,
                createdAt: new Date()
            }
        ).then((res)=>{tutorialCreated=res;})
        return res.status(201).json({
            tutorialCreated: tutorialCreated,
            text: "Tutoriel créé"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }
}

async function deleteTutorial(req, res) {
    const tutorialToDelete = req.body;
    try {
        await Tutorial.deleteOne(
            {
                _id: tutorialToDelete._id
            }
        )
        // we update all the products linked to the deleted tutorial
        const associatedProducts = await Product.find({
            tutorials: { "$in" : [tutorialToDelete._id]}
        });
        await Promise.all(associatedProducts.map(async (product)=>{
            newProductTutorials = (product.tutorials).filter(val=>val.toString()!==tutorialToDelete._id);
            await Product.findOneAndUpdate({ 
                _id: product._id
            },
            {
                $set: {
                    tutorials: newProductTutorials
                }
            })
        }))
        // we update all the questions linked to the deleted tutorial
        const associatedQuestions = await Question.find({
            tutorials: { "$in" : [tutorialToDelete._id]}
        });
        await Promise.all(associatedQuestions.map(async (question)=>{
            newQuestionTutorials = (question.tutorials).filter(val=>val.toString()!==tutorialToDelete._id);
            await Question.findOneAndUpdate({ 
                _id: question._id
            },
            {
                $set: {
                    tutorials: newQuestionTutorials
                }
            })
        }))        
        return res.status(200).json({
            text: "Tutoriel supprimé"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}

async function updateTutorial(req, res) {
    const tutorialToUpdate = req.body;
    try {
        await Tutorial.findOneAndUpdate(
            {
                _id: tutorialToUpdate._id
            },
            {
                $set: tutorialToUpdate
            }
        )
        return res.status(200).json({
            text: "Tutoriel mis à jour"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}


exports.createTutorial = createTutorial;
exports.deleteTutorial = deleteTutorial;
exports.updateTutorial = updateTutorial;