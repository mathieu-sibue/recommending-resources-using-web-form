const Question = require('../models/Question');
const UserResponse = require('../models/UserResponse');
const service = require('../service/recommandProductsAndTutorials');


async function getUserResponses(req, res) {
    const userId = req.query['0'];

    try {
        const prevRes = await UserResponse.findOne({ user: userId }).populate("responses.question");
        if (prevRes === null) {
            const allQuestions = await Question.find();
            const initResponses = allQuestions.map((question)=>{
                return {
                    question: question._id,
                    response: null
                }
            });

            await UserResponse.create({
                user: userId,
                responses: initResponses,
                createdAt: new Date(),
                lastModified: [new Date()],
            });

            const populatedUserRes = await UserResponse.findOne({ user: userId }).populate("responses.question");
            return res.status(201).json(populatedUserRes.responses)
        } else {
            return res.status(200).json(prevRes.responses)
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur" 
        })
    }
}


async function updateUserResponses(req, res) {
    const { userId, questAndResNew } = req.body;

    try {
        const userResponsesToUpdate = await UserResponse.findOne({ user: userId });
        var newLastModified = userResponsesToUpdate.lastModified;
        newLastModified.push(new Date());
        await UserResponse.findOneAndUpdate({ user: userId }, {$set:
            {
                responses: questAndResNew,
                lastModified: newLastModified
            }
        });
        res.status(200).json({
            text: `reponses de l'utilisateur ${userId} mises à jour`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur" 
        })
    }
}


async function updateUserResAndComputeResults(req, res) {
    const { userId, questAndRes, themes } = req.body;
    const questAndResForUpdate = questAndRes.map((questResPair)=>{
        return {
            _id: questResPair._id,
            question: questResPair.question._id,
            response: questResPair.response
        }
    })
    try {
        const userResponsesToUpdate = await UserResponse.findOne({ user: userId });
        var newLastModified = userResponsesToUpdate.lastModified;
        newLastModified.push(new Date());        
        await UserResponse.findOneAndUpdate({ user: userId }, {$set:
            {
                responses: questAndResForUpdate,
                lastModified: newLastModified
            }
        });
        const results = await service.recommandProductsAndTutorials(questAndRes, themes);
        res.status(200).json({
            text: `reponses de l'utilisateur ${userId} mises à jour`,
            results
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            text: "Erreur serveur" 
        })
    }   
}


exports.getUserResponses = getUserResponses;
exports.updateUserResponses = updateUserResponses;
exports.updateUserResAndComputeResults = updateUserResAndComputeResults;