const Question = require('../models/Question');
const Product = require('../models/Product');
const Tutorial = require('../models/Tutorial');
const UserResponse = require('../models/UserResponse');
const _ = require('lodash');
const service = require('../service/recommandProductsAndTutorials');


async function getAllRessources(req, res) {
    try {
        var ressources = {}
        const questions = await Question.find({});
        ressources.questions = questions;
        const products = await Product.find({});
        ressources.products = products;
        const tutorials = await Tutorial.find({});
        ressources.tutorials = tutorials;
        return res.status(200).json({ 
            text: "Ressources récupérées avec succès",
            ressources
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur"
        })
    }
}


async function getAllResults(req, res) {
    const themes = req.query.themes;
    try {

        const userResponses = await UserResponse.find({}).populate("responses.question user");
        var userResponsesScoresAndReco;

        await Promise.all(userResponses.map(async userResponse => { 
            for (var questResPair of userResponse.responses) {
                if (questResPair.response === null) {
                    return {
                        _id: userResponse._id,
                        user: userResponse.user,
                        responses: userResponse.responses,
                        scoresAndReco: null,
                        createdAt: userResponse.createdAt,
                        lastModified: userResponse.lastModified                        
                    }
                }
            }
            return service.recommandProductsAndTutorials(userResponse.responses, themes).then(result => {
                return {
                    _id: userResponse._id,
                    user: userResponse.user,
                    responses: userResponse.responses,
                    scoresAndReco: result,
                    createdAt: userResponse.createdAt,
                    lastModified: userResponse.lastModified
                }
            });
        })).then(results => {
            userResponsesScoresAndReco = results;
        });
        return res.status(200).json({ 
            text: "Résultats récupérés avec succès",
            results: userResponsesScoresAndReco
        });               

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur"
        })
    }
}


async function deleteUserResponse(req, res) {
    const userResponseToDelete = req.body;
    try {
        await UserResponse.deleteOne(
            {
                _id: userResponseToDelete._id
            }
        )
        return res.status(200).json({
            text: "Réponse utilisateur supprimée"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur"
        })
    }

}


exports.getAllRessources = getAllRessources;
exports.getAllResults = getAllResults;
exports.deleteUserResponse = deleteUserResponse;