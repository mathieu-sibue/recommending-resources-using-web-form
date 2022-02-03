import React, { useState } from "react";
import useWindowDimensions from "../../../customHooks/useWindowDimensions";
import { Grid, Paper, Typography, Divider } from "@material-ui/core";
import { MyRadarChart } from "./MyRadarChart";
import { ResultsAnalysis } from "./ResultsAnalysis"
import { Suggestions } from "./Suggestions";


const themeToShortenedTheme = {
    'Animez votre réseau': 'Animation réseau',
    'Gagnez en visibilité sur le web': 'Visibilité', 
    'Travaillez collaborativement': 'Travail collaboratif',
    'Financez vos projets': 'Financement',
    'Gérez vos ressources humaines et financières': 'Gestion ressources',
    'Sécurisez votre association et suivez les réglementations': 'Sécurité',
    'Pilotez la stratégie de votre transformation numérique': 'Pilotage transformation numérique'
}

export function ResultsContent(props) {
    
    const userScores = useState(props.userScores)[0];
    const suggestedProducts = useState(props.suggestedProducts)[0];
    const suggestedTutorials = useState(props.suggestedTutorials)[0];

    var scores = [];
    var themes = [];
    for (let theme in userScores) {
        scores.push(Math.round(userScores[theme]));
        const reducedTheme = themeToShortenedTheme[theme];
        themes.push(reducedTheme)
    }

    const strengths = [];
    const weaknesses = [];
    var themeScoreList = [];
    const minPercentageToBeStrength = 50;
    var meanScores = 0;
    for (let theme in userScores) {
        themeScoreList.push({ 
            theme: theme,
            score: userScores[theme]
        })
        meanScores += userScores[theme]
    }
    meanScores = meanScores/Object.keys(userScores).length
    themeScoreList = themeScoreList.sort((theme1,theme2)=>{
        return theme2.score-theme1.score
    })
    for (let i = 0; i < themeScoreList.length; i++) {
        const themeAndScore = themeScoreList[i];
        if (themeAndScore.score > 0.5*(minPercentageToBeStrength + meanScores)) {
            strengths.push(themeAndScore.theme)
        } else {
            weaknesses.push(themeAndScore.theme)
        }
    }

    const { width } = useWindowDimensions();

    const isWindowSizeBelowSm = () => {
        if (width < 1000) {
          return true
        } else {
          return false
        };
    };

    return (
        <div
            style={{marginTop: isWindowSizeBelowSm()?"90px":"100px", overflowY:"hidden"}}
        >
            <Grid
                item
                xs={11} md={12}
                style={{margin:"auto"}}
            >
                <Paper
                    elevation={5} 
                    style={{maxWidth: isWindowSizeBelowSm()? "90vw": "70vw", margin: "auto", marginTop: "30px", marginBottom: isWindowSizeBelowSm()?"110px":"180px", padding: "30px"}}
                >
                    <Typography component="h4" variant="h4" style={{fontFamily:"Rubik"}}>
                        <nobr>Vos résultats !</nobr>
                    </Typography>

                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center"
                        spacing={5}
                        xs={12}
                        style={{margin:"auto"}}
                    >
                        <Grid item>
                            <MyRadarChart 
                                data={scores} 
                                labels={themes} 
                                suggestedProducts={suggestedProducts}
                                suggestedTutorials={suggestedTutorials}
                                windowSizeHook={isWindowSizeBelowSm} 
                            />
                        </Grid>
                        <Grid item>
                            <ResultsAnalysis
                                strengths={strengths}
                                weaknesses={weaknesses}
                                themeToShortenedTheme={themeToShortenedTheme}
                                userScores={userScores}
                            />
                        </Grid>

                    </Grid>  
                    <br/>

                    <Divider variant="middle" />
                    <br/>


                    <Suggestions 
                        suggestedProducts={suggestedProducts} 
                        suggestedTutorials={suggestedTutorials} 
                        userScores={userScores} 
                        weaknesses={weaknesses} 
                        themeToShortenedTheme={themeToShortenedTheme}
                        windowSizeHook={isWindowSizeBelowSm}
                    />            

                </Paper>
            </Grid>

        </div>

        
    )
}