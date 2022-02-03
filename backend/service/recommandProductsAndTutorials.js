const Product = require('../models/Product');
const Tutorial = require('../models/Tutorial');


async function recommandProductsAndTutorials(questAndRes, themes) {

    var suggestedProducts = {};
    var suggestedTutorials = {};
    var userScores = {};
    for (var theme of themes) {
        suggestedProducts[theme] = [];
        suggestedTutorials[theme] = [];     
        userScores[theme] = [];
    }


    // we first isolate all the responses in the form that can potentially lead to a recommendation
    for (var questResPair of questAndRes) {
        if (questResPair.response !== 1) {              // in the score, we do not account for the responses "Non et je ne pense pas en avoir besoin" (i.e. "No, and I do not think I need it")
            userScores[questResPair.question.theme].push(questResPair.response);            
        }
        if (questResPair.response === 0 || questResPair.response === 2) {
            for (var productId of questResPair.question.products) {
                suggestedProducts[questResPair.question.theme].push({
                    product: productId,
                    order: questResPair.question.order
                })
            }
            for (var tutorialId of questResPair.question.tutorials) {
                suggestedTutorials[questResPair.question.theme].push({
                    tutorial: tutorialId,
                    order: questResPair.question.order
                })
            }
        }
    }


    // score computation of each potential recommendation, based on the collected answers
    const minWeight = 1/3;
    for (var theme in userScores) {
        var themeScore = 0;
        var weightSum = 0;
        userScores[theme] = userScores[theme].map(response => (response !== 0)? (response-1): response)     // we readjust the score/value associated to each response because we got rid of the "Non et je ne pense pas en avoir besoin" option
        const computeWeight = (index) => {
            return (userScores[theme].length === 0? 0: -((1-minWeight)/(userScores[theme].length)**2)*index**2 + 1)
        }
        for (let i = 0; i < userScores[theme].length; i++) {
            const response = userScores[theme][i];
            themeScore += (response/3)*computeWeight(i);        
            weightSum += computeWeight(i);
        }
        themeScore = (1/weightSum)*themeScore*100;
        userScores[theme] = themeScore;            
    }


    for (var theme of themes) {
        // we rank the products to recommend per theme
        suggestedProducts[theme] = suggestedProducts[theme].sort((prod1, prod2)=>{
            return prod1.order-prod2.order
        }).map(obj=>obj.product)
        // we rank the tutorials to recommend per theme
        suggestedTutorials[theme] = suggestedTutorials[theme].sort((tuto1, tuto2)=>{
            return tuto1.order-tuto2.order
        }).map(obj=>obj.tutorial)


        // we populate the products to recommend with their actual objects saved
        const orderedProductIds = suggestedProducts[theme];
        suggestedProducts[theme] = await Product.find({
            _id: { $in: suggestedProducts[theme] }
        }).populate('tutorials');
        suggestedProducts[theme] = suggestedProducts[theme].sort((prod1,prod2)=>{
            return orderedProductIds.indexOf(prod1._id.toString())-orderedProductIds.indexOf(prod2._id.toString())
        })
        // we populate the tutorials to recommend with their actual objects saved
        suggestedTutorials[theme] = await Tutorial.find({
            _id: { $in: suggestedTutorials[theme] }
        }).then(docs=>docs.sort((tuto1,tuto2)=>{
            return suggestedTutorials[theme].indexOf(tuto1._id.toString())-suggestedTutorials[theme].indexOf(tuto2._id.toString())
        }))

        
        // we make sure there are no redundancies in the rankings (the tutorials linked to products to recommend, as well as independent tutorials within the same theme)
        for (var product of suggestedProducts[theme]) {
            for (var productTutorial of product.tutorials) {
                suggestedTutorials[theme] = suggestedTutorials[theme].filter(tutorial=>tutorial._id.toString()!==productTutorial._id.toString())
            }
        }
    }

    return {
        suggestedProducts,
        suggestedTutorials,
        userScores
    }
}




exports.recommandProductsAndTutorials = recommandProductsAndTutorials;