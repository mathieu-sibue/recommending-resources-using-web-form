const Question = require('../models/Question');
const UserResponse = require('../models/UserResponse')


async function createQuestion(req, res) {
    var questionToAdd = req.body;
    try {
        var questionCreated;
        await Question.create(
            {
                ...questionToAdd,
                createdAt: new Date()
            }
        ).then((res)=>{questionCreated=res})

        // we update all the userResponses by adding them the new question
        const currentUserResponses = await UserResponse.find({});
        await Promise.all(currentUserResponses.map(async (userResponse)=>{
            (userResponse.responses).push({
                question: questionCreated._id,
                response: null
            })
            await UserResponse.findOneAndUpdate({ 
                _id: userResponse._id
            },
            {
                $set: {
                    responses: userResponse.responses
                }
            })
        }));   

        return res.status(201).json({
            questionCreated: questionCreated,
            text: "Question créée"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }
}

async function deleteQuestion(req, res) {
    const { questionToDelete, newQuestions } = req.body;
    // Note: the newQuestions only contain the questions of the same type, but with an updated order
    try {
        await Question.deleteOne(
            {
                _id: questionToDelete._id
            }
        )
        for (var question of newQuestions) {
            await Question.findOneAndUpdate(
                {
                    _id: question._id
                },
                {
                    $set: question
                }
            );            
        }
        // we update all the userResponses that the question to delete comprised
        const currentUserResponses = await UserResponse.find({});
        await Promise.all(currentUserResponses.map(async (userResponse)=>{
            newUserResponseResponses = (userResponse.responses).filter(questResPair=>(questResPair.question).toString()!==questionToDelete._id);
            await UserResponse.findOneAndUpdate({ 
                _id: userResponse._id
            },
            {
                $set: {
                    responses: newUserResponseResponses
                }
            })
        }));   
        return res.status(200).json({
            text: "Question supprimée"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}

async function updateQuestions(req, res) {
    const { questionsToUpdate } = req.body;
    try {
        for (let questionToUpdate of questionsToUpdate) {
            const prevQuestion = await Question.findOne({ _id: questionToUpdate._id });
            if (prevQuestion.theme !== questionToUpdate.theme) {
                const sameThemeQuestionsWithHigherOrder = (await Question.find({ theme: prevQuestion.theme })).filter(question => {
                    return question.order > prevQuestion.order
                })

                // we modify the order of all the questions of the previous theme 
                await Promise.all(sameThemeQuestionsWithHigherOrder.map(async (questionWithHigherOrder)=>{
                    const prevQuestionWithHigherOrder = await Question.findOne({ 
                        _id: questionWithHigherOrder._id
                    });
                    await Question.findOneAndUpdate({
                        _id: questionWithHigherOrder._id
                    },
                    {
                        $set: {
                            order: prevQuestionWithHigherOrder.order - 1
                        }
                    });
                }));  
            } 
            // we update the considered question, whose order we already mentioned in the query 
            await Question.findOneAndUpdate(
                {
                    _id: questionToUpdate._id
                },
                {
                    $set: questionToUpdate
                }
            );                   
            
         
        }
        return res.status(200).json({
            text: "Question(s) mise(s) à jour"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            text: "Erreur serveur"
        })
    }    
}


exports.createQuestion = createQuestion;
exports.deleteQuestion = deleteQuestion;
exports.updateQuestions = updateQuestions;