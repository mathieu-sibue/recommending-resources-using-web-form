import React, { createContext, useState, useContext } from "react"

import { FormContext } from "./FormContext";

import questionRequests from "../../APIrequests/questionRequests"
import tutorialRequests from "../../APIrequests/tutorialRequests"
import productRequests from "../../APIrequests/productRequests"
import ressourceRequests from "../../APIrequests/ressourceRequests"


export const EditContext = createContext();

export function EditContextWrapper({ children }) {
    
    const [questions, setQuestions] = useState(null);
    const [products, setProducts] = useState(null);
    const [tutorials, setTutorials] = useState(null);

    const [userResponsesScoresAndReco, setUserResponsesScoresAndReco] = useState(null);

    const { themes } = useContext(FormContext);
    var themesDict = {};
    for (var theme of themes) {
        themesDict[theme] = [];
    };

    // to edit questions, products, and tutorials on the admin interface
    const fetchAllRessources = async () => {
        if ((questions !== null)&&(products !== null)&&(tutorials !== null)) {
            return
        }
        const ressourcesFetched = await ressourceRequests.getAllRessources();
        const questionsFetched = ressourcesFetched.questions;
        const productsFetched = ressourcesFetched.products;
        const tutorialsFetched = ressourcesFetched.tutorials;
        for (var question of questionsFetched) {
            themesDict[question.theme].push(question);
        };
        for (var key in themesDict) {
            themesDict[key] = themesDict[key].sort((quest1, quest2)=>{
                return quest1.order-quest2.order
            })
        };
        await setQuestions(themesDict);
        await setProducts(productsFetched);
        await setTutorials(tutorialsFetched);
    }

    // to analyze results
    const fetchAllResults = async () => {
        if (userResponsesScoresAndReco !== null) {
            return
        }
        const resultsFetched = await ressourceRequests.getAllResults(themes);
        await setUserResponsesScoresAndReco(resultsFetched);
    }


    // TUTORIAL ACTIONS
    const createTutorial = async (tutorialToAdd) => {
        const { data } = await tutorialRequests.createTutorial(tutorialToAdd);
        return data
    }

    const deleteTutorial = async (tutorialToDelete) => {
        const { data } = await tutorialRequests.deleteTutorial(tutorialToDelete);
        return data
    }

    const updateTutorial = async (tutorialToUpdate) => {
        const { data } = await tutorialRequests.updateTutorial(tutorialToUpdate);
        return data        
    }

    // PRODUCT ACTIONS
    const createProduct = async (productToAdd) => {
        const { data } = await productRequests.createProduct(productToAdd);
        return data
    }

    const deleteProduct = async (productToDelete) => {
        const { data } = await productRequests.deleteProduct(productToDelete);
        return data
    }

    const updateProduct = async (productToUpdate) => {
        const { data } = await productRequests.updateProduct(productToUpdate);
        return data        
    }

    // QUESTION ACTIONS
    const updateQuestions = async (questionsToUpdate) => {
        const { data } = await questionRequests.updateQuestions(questionsToUpdate);
        return data
    }

    const createQuestion = async (questionToAdd) => {
        const { data } = await questionRequests.createQuestion(questionToAdd);
        return data
    }

    const deleteQuestion = async (questionToDelete, newQuestions) => {
        const { data } = await questionRequests.deleteQuestion(questionToDelete, newQuestions);
        return data
    }

    // USERRESPONSE ACTIONS
    const deleteUserResponse = async (userResponseToDelete) => {
        const { data } = await ressourceRequests.deleteUserResponse(userResponseToDelete);
        return data
    }


    return (
        <EditContext.Provider value={{
            /* form editing */
            questions,
            setQuestions,
            products,
            setProducts,
            tutorials,
            setTutorials,
            fetchAllRessources,
            createTutorial,
            deleteTutorial,
            updateTutorial,
            createProduct,
            deleteProduct,
            updateProduct,
            createQuestion,
            deleteQuestion,
            updateQuestions,
            /* results analysis */
            userResponsesScoresAndReco,
            setUserResponsesScoresAndReco,
            deleteUserResponse,
            fetchAllResults
        }}>
            {children}
        </EditContext.Provider>
    )
}