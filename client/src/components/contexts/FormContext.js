import React, { createContext, useState, useEffect, useContext } from "react"

import formRequests from "../../APIrequests/formRequests"

import { UserContext } from "./UserContext"


export const FormContext = createContext();

const themes = [
    'Animez votre réseau', 
    'Gagnez en visibilité sur le web', 
    'Travaillez collaborativement',
    'Financez vos projets',
    'Gérez vos ressources humaines et financières',
    'Sécurisez votre association et suivez les réglementations',
    'Pilotez la stratégie de votre transformation numérique'
];

export function FormContextWrapper({ children }) {
    const { user } = useContext(UserContext);
    const [questAndRes, setQuestAndRes] = useState(null);
    const [currentThemeNb, setCurrentThemeNb] = useState(0);
    const [alreadyModified, setAlreadyModified] = useState(false);
    const [unanswered, setUnanswered] = useState(null);
    const questionThemesNb = 6;

    // to run in the componentDidMount of the form page
    async function retrieveQuestions() {
        if (alreadyModified){
            return
        } else {
            const storedQuestAndRes = JSON.parse(localStorage.getItem('questAndRes'));
            if (storedQuestAndRes !== null) {
                setQuestAndRes(storedQuestAndRes);
                setAlreadyModified(true);
            } else {
                const { data } = await formRequests.getUserResponses(user.id);
                const prevRes = data;
                var resOtherFormat = {};
                let nullCount = 0;
                for (var i in prevRes) {
                    const questResPair = prevRes[i];
                    if (questResPair.response === null) {
                        nullCount+=1;
                    }
                    resOtherFormat[questResPair.question._id] = { 
                        questResPairId: questResPair._id,
                        response: questResPair.response,
                        ...questResPair.question
                    };
                };
                if (nullCount === prevRes.length) {
                    setAlreadyModified(false);
                } else {
                    setAlreadyModified(true);
                };
                await setQuestAndRes(resOtherFormat);
            }
        }
    }

    async function sendResults() {
        var computedResults = null;
        const questAndResDBFormat = [];
        for (let key in questAndRes) {
            const questResPair = questAndRes[key];
            questAndResDBFormat.push({
                _id: questResPair.questResPairId,
                question: {                        
                    // we reconstruct the question object here not to have to repopulate it once received in the backend
                    _id: questResPair._id,
                    questionText: questResPair.questionText,
                    theme: questResPair.theme,
                    order: questResPair.order,
                    products: questResPair.products,
                    tutorials: questResPair.tutorials,
                    createdAt: questResPair.createdAt     
                },
                response: questResPair.response
            });    
        };
        computedResults = await formRequests.updateUserResAndComputeResults(user.id, questAndResDBFormat, themes);
        return computedResults
    }

    async function onDisconnect() {
        if (questAndRes!== null) {
            const questAndResDBFormat = [];
            for (let key in questAndRes) {
                const questResPair = questAndRes[key];
                questAndResDBFormat.push({
                    _id: questResPair.questResPairId,
                    question: questResPair._id,
                    response: questResPair.response
                });
            }
            await formRequests.updateUserResponses(user.id, questAndResDBFormat);
        }
        await setQuestAndRes(null);
        await setCurrentThemeNb(0);
        await setAlreadyModified(false);
    }

    useEffect(()=>{
        async function onUnload() {
            if (questAndRes !== null) {
                const currentQuestAndRes = JSON.stringify(questAndRes);
                localStorage.setItem('questAndRes', currentQuestAndRes);
                const questAndResDBFormat = [];
                for (let key in questAndRes) {
                    const questResPair = questAndRes[key];
                    questAndResDBFormat.push({
                        _id: questResPair.questResPairId,
                        question: questResPair._id,
                        response: questResPair.response
                    });
                }
                await formRequests.updateUserResponses(user.id, questAndResDBFormat);
            }
        }
        window.addEventListener("beforeunload", onUnload)
        return () => window.removeEventListener("beforeunload", onUnload)
    })

    function modifyRes(questionId, responseGiven) {
        if (!alreadyModified){
            setAlreadyModified(true);
        }
        setQuestAndRes(currentQuestAndRes => {
            currentQuestAndRes[questionId].response = responseGiven;
            return currentQuestAndRes
        });
    }

    function incrementThemeNb() {
        setCurrentThemeNb(currentNb => currentNb+1);
    }

    function decrementThemeNb() {
        setCurrentThemeNb(currentNb => currentNb-1);
    }


    return (
        <FormContext.Provider 
            value={{
                retrieveQuestions,
                modifyRes,
                questAndRes,
                setQuestAndRes,
                currentThemeNb,
                themes,
                incrementThemeNb,
                decrementThemeNb,
                setCurrentThemeNb,
                questionThemesNb,
                alreadyModified,
                onDisconnect,
                unanswered,
                setUnanswered,
                sendResults
            }}
        >
            {children}
        </FormContext.Provider>       
    )
}