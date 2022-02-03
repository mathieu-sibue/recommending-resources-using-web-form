import React, { useState, useContext, useEffect } from "react"
import { CircularProgress } from "@material-ui/core"
import { ResultsContent } from "./ResultsContent"

import { FormContext } from "../../contexts/FormContext";


export function ResultsContainer(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [userScores, setUserScores] = useState(null);
    const [suggestedProducts, setSuggestedProducts] = useState(null);
    const [suggestedTutorials, setSuggestedTutorials] = useState(null);
    const { sendResults, questAndRes, retrieveQuestions, setUnanswered } = useContext(FormContext);

    useEffect(() => {
        const getAndSetResults = async () => {
            const computedResults = await sendResults();
            const { suggestedProducts, suggestedTutorials, userScores } = computedResults.data.results;
            setUserScores(userScores);
            setSuggestedProducts(suggestedProducts);
            setSuggestedTutorials(suggestedTutorials);
        }


        const findQuestions = async () => {         // we are obliged to recover this here because the questions are set only when we arrive on the questionnaire... necessary for a direct access
            await retrieveQuestions()
        }
        
        if (questAndRes === null) {
            findQuestions();
        } else {

            var unansweredQuestCount = 0;
            var themesList = [];
            for (var questionId in questAndRes) {
              const questAndResPair = questAndRes[questionId];
              if (questAndResPair.response === null) {
                unansweredQuestCount += 1;
                themesList.push(questAndResPair.theme)
              };
            };
            if (unansweredQuestCount > 0) {
                setUnanswered(themesList);
                props.history.push("/diagnostic")
            }
            window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
            getAndSetResults().then(()=>setIsLoaded(true)) 
        }

    }, [questAndRes])

    return (
        <>
        {
            isLoaded?
            <ResultsContent userScores={userScores} suggestedProducts={suggestedProducts} suggestedTutorials={suggestedTutorials}/>
            :
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop: "50vh", transform: "translateY(-50%)"}}>
                <CircularProgress disableShrink style={{margin: "auto", color:"rgb(144, 208, 88)"}}/>
            </div>            
        }
        </>
    )
}
