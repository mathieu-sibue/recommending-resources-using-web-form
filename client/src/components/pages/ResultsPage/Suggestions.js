import React from "react";
import { ProductItem } from "./ProductItem";
import { TutorialItem } from "./TutorialItem";
import { Grid, Typography, Divider } from '@material-ui/core'


export function Suggestions(props) {

    const maxNbProductsToDisplay = 8;
    const maxNbTutorialsToDisplay = 4;
    var nbOfProductsToDisplayPerTheme = {};
    var nbOfTutorialsToDisplayPerTheme = {};
    var productsToDisplay = [];
    var tutorialsToDisplay = [];

    for (var theme of props.weaknesses) {
        nbOfProductsToDisplayPerTheme[theme] = 0;
        nbOfTutorialsToDisplayPerTheme[theme] = 0;
    }

    var themesRankedWorstToBest = [];
    for (let theme in props.userScores) {
        themesRankedWorstToBest.push({
            theme: theme,
            score: props.userScores[theme]
        })
    }
    themesRankedWorstToBest = themesRankedWorstToBest.sort((obj1,obj2)=>{
        return obj1.score-obj2.score
    })
    themesRankedWorstToBest = themesRankedWorstToBest.filter(obj=>props.weaknesses.includes(obj.theme)?true:false)
    themesRankedWorstToBest = themesRankedWorstToBest.map(obj=>obj.theme)

    var productsLeft = maxNbProductsToDisplay;
    var tutorialsLeft = maxNbTutorialsToDisplay;
    var productWeaknessesCompleted = 0;
    while (productsLeft>0) {
        if (productWeaknessesCompleted === themesRankedWorstToBest.length) {
            productsLeft = 0
        }
        for (var theme of themesRankedWorstToBest) {
            if (productsLeft === 0) {
                break
            }
            if (props.suggestedProducts[theme].length > nbOfProductsToDisplayPerTheme[theme]) {
                nbOfProductsToDisplayPerTheme[theme] += 1;
                productsLeft -= 1;
            } 
            if (props.suggestedProducts[theme].length === nbOfProductsToDisplayPerTheme[theme]) {
                productWeaknessesCompleted += 1;
            }
        }
    }
    var tutorialWeaknessesCompleted = 0;
    while (tutorialsLeft>0) {
        if (tutorialWeaknessesCompleted === themesRankedWorstToBest.length) {
            tutorialsLeft = 0
        }
        for (var theme of themesRankedWorstToBest) {
            if (tutorialsLeft === 0) {
                break
            }
            if (props.suggestedTutorials[theme].length > nbOfTutorialsToDisplayPerTheme[theme]) {
                nbOfTutorialsToDisplayPerTheme[theme] += 1;
                tutorialsLeft -= 1;
            } 
            if (props.suggestedTutorials[theme].length === nbOfTutorialsToDisplayPerTheme[theme]) {
                tutorialWeaknessesCompleted += 1;
            }
        }
    }

    for (var theme of themesRankedWorstToBest) {
        const themeProductsToDisplay = props.suggestedProducts[theme].slice(0,nbOfProductsToDisplayPerTheme[theme]).map(obj => {
            return {
                ...obj,
                themes: [theme]
            }
        });
        productsToDisplay.push(themeProductsToDisplay);

        const themeTutorialsToDisplay = props.suggestedTutorials[theme].slice(0,nbOfTutorialsToDisplayPerTheme[theme]).map(obj => {
            return {
                ...obj,
                themes: [theme]
            }
        });
        tutorialsToDisplay.push(themeTutorialsToDisplay);
        
    }

    productsToDisplay = [].concat.apply([],productsToDisplay);
    tutorialsToDisplay = [].concat.apply([],tutorialsToDisplay);

    for (let index = 1; index < Math.max(productsToDisplay.length, tutorialsToDisplay.length); index++) {
        if (index < productsToDisplay.length) {
            const product = productsToDisplay[index];
            if (productsToDisplay.slice(0,index-1).map(obj => obj._id).includes(product._id)) {
                productsToDisplay.splice(index);
                for (let j = 0; j < productsToDisplay.slice(0,index-1).length; j++) {
                    if (productsToDisplay[j]._id === product._id) {
                        productsToDisplay[j].themes = productsToDisplay[j].themes.concat(product.themes);
                    }
                }
            }
        }
        if (index < tutorialsToDisplay.length) {
            const tutorial = tutorialsToDisplay[index];
            if (tutorialsToDisplay.slice(0,index-1).map(obj => obj._id).includes(tutorial._id)) {
                tutorialsToDisplay.splice(index);
                for (let j = 0; j < tutorialsToDisplay.slice(0,index-1).length; j++) {
                    if (tutorialsToDisplay[j]._id === tutorial._id) {
                        tutorialsToDisplay[j].themes = tutorialsToDisplay[j].themes.concat(tutorial.themes);
                    }
                }
            }
        }
    }


    return (
        <>
            <Grid item>
                <Typography component="h4" variant="h4" style={{fontFamily:"Rubik"}}>
                    Une sélection de produits pour vous <nobr>aider :</nobr>
                </Typography>
            </Grid>
            <br/>
            <br/>
            <Grid
                item
            >
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="flex-start"
                    spacing={1}
                    style={{paddingLeft:"4%"}}
                >
                    {
                        productsToDisplay.map(product=>{
                            return (
                                <Grid
                                    key={product.productName} 
                                    item
                                    xs={6}
                                    md={3}
                                >
                                    <ProductItem 
                                        product={product} 
                                        windowSizeHook={props.windowSizeHook}
                                        themeToShortenedTheme={props.themeToShortenedTheme}
                                    />
                                </Grid>

                            )
                        })
                    }

                </Grid>
            </Grid> 
            <br/>

            <Divider variant="middle" />
            <br/> 

            <Grid item>
                <Typography component="h4" variant="h4" style={{fontFamily:"Rubik"}}>
                    Quelques <nobr>conseils :</nobr>
                </Typography>
            </Grid>
            <br/>

            <Grid
                item
            >
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="flex-start"
                    spacing={1}
                    style={{paddingLeft:"0%"}}
                >
                    {
                        tutorialsToDisplay.map(tutorial=>{
                            return (
                                <Grid
                                    item
                                    xs={6}
                                    key={tutorial.tutorialName} 
                                >
                                    <TutorialItem 
                                        tutorial={tutorial} 
                                        key={tutorial.tutorialName} 
                                        windowSizeHook={props.windowSizeHook}
                                        themeToShortenedTheme={props.themeToShortenedTheme}
                                    />
                                </Grid>

                            )
                        })
                    }

                </Grid>
            </Grid>   
        </>

    )
}