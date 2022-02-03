import React, { useState, useContext } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, makeStyles, Typography, Grid, Paper, List, ListItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import _ from "lodash"

import { EditContext } from "../../contexts/EditContext";


const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      marginLeft: "4px"
    },
  }));

export function ThemeScoreAnalysisItem(props) {

    const theme = props.theme;
    const sector = props.sector;
    const themeMeanScore = props.themeMeanScore;
    const themeStdScore = props.themeStdScore;

    const classes = useStyles();
    const { userResponsesScoresAndReco } = useContext(EditContext);

    const [expanded, setExpanded] = useState(false);


    var mostSuggestedProducts = [];
    var mostSuggestedTutorials = [];

    var userResponses;
    if (sector !== "Tous") {
        userResponses = userResponsesScoresAndReco.filter(userResponse => userResponse.user.sector === sector && userResponse.scoresAndReco !== null);
    } else {
        userResponses = userResponsesScoresAndReco.filter(userResponse => userResponse.scoresAndReco !== null);;
    }

    var allProductsSuggested = userResponses.map(userResponse => userResponse.scoresAndReco.suggestedProducts[theme]);
    allProductsSuggested = [].concat.apply([], allProductsSuggested);
    const allProductsSuggestedUnique = [...(new Set(allProductsSuggested.map(JSON.stringify)))];

    if (allProductsSuggestedUnique.length > 0) {
        var countsProducts = {}
        for (var product of allProductsSuggestedUnique) {
            countsProducts[product] = 0; 
        }
        for (var product of allProductsSuggested) {
            countsProducts[product] += 1;
        }
        var maxKey = _.max(Object.keys(countsProducts), prod => countsProducts[prod]);
        mostSuggestedProducts.push(JSON.parse(maxKey));
        delete countsProducts[maxKey];

        if (allProductsSuggestedUnique.length > 1) {
            maxKey = _.max(Object.keys(countsProducts), prod => countsProducts[prod]);
            mostSuggestedProducts.push(JSON.parse(maxKey));     
            delete countsProducts[maxKey];

            if (allProductsSuggestedUnique.length > 2) {
                maxKey = _.max(Object.keys(countsProducts), prod => countsProducts[prod]);
                mostSuggestedProducts.push(JSON.parse(maxKey));     
                delete countsProducts[maxKey];
            }
        }
    }

    
    var allTutorialsSuggested = userResponses.map(userResponse => userResponse.scoresAndReco.suggestedTutorials[theme]);
    allTutorialsSuggested = [].concat.apply([], allTutorialsSuggested);
    const allTutorialsSuggestedUnique = [...(new Set(allTutorialsSuggested.map(JSON.stringify)))];

    if (allTutorialsSuggestedUnique.length > 0) {
        var countsTutorials = {}
        for (var tutorial of allTutorialsSuggestedUnique) {
            countsTutorials[tutorial] = 0; 
        }
        for (var tutorial of allTutorialsSuggested) {
            countsTutorials[tutorial] += 1;
        }
        var maxKey2 = _.max(Object.keys(countsTutorials), tuto => countsTutorials[tuto]);
        mostSuggestedTutorials.push(JSON.parse(maxKey2));
        delete countsTutorials[maxKey2];

        if (allTutorialsSuggestedUnique.length > 1) {
            maxKey2 = _.max(Object.keys(countsTutorials), tuto => countsTutorials[tuto]);
            mostSuggestedTutorials.push(JSON.parse(maxKey2));     
            delete countsTutorials[maxKey2];

            if (allTutorialsSuggestedUnique.length > 2) {
                maxKey2 = _.max(Object.keys(countsTutorials), tuto => countsTutorials[tuto]);
                mostSuggestedTutorials.push(JSON.parse(maxKey2));     
                delete countsTutorials[maxKey2];
            }
        }
   
    }



    const handleChange = (event) => {
        setExpanded(prev=>!prev)
    }

    return (
        <ExpansionPanel expanded={expanded} onChange={handleChange} style={{backgroundColor:Math.round(themeMeanScore)<50?"rgb(250, 90, 52)":isNaN(themeMeanScore)?"rgba(213,213,213,0.5)":"rgb(144, 208, 88)", color:isNaN(themeMeanScore)?"black":"white"}}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon style={{color:"white"}} />}
                aria-controls="panelbh-content"
                id="panelbh-header"
            >
                <Typography className={classes.heading}>
                    {theme}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                    {
                        isNaN(themeMeanScore)?
                        "Pas d'utilisateur dans le secteur"
                        :
                        <>score moyen : <b>{Math.round(themeMeanScore)}</b>/100 (+/-{Math.round(themeStdScore)})</>
                    }
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid 
                    item 
                    container
                    direction="row"
                    justify="center"
                    spacing={2}
                >


                    <Grid item container sm={6}>
                        <Paper elevation={2} style={{width:"100%", padding:"20px"}}>
                            <Typography variant="h6" component="h6">
                                Produits les plus <nobr>recommandés :</nobr>
                            </Typography>
                            <List style={{fontSize:"0.9em"}}>
                                {
                                    !isNaN(themeMeanScore) && mostSuggestedProducts.length>0?
                                    mostSuggestedProducts.map((product, index) => {
                                        return (
                                            <ListItem key={product.productName}>
                                                {index+1}.&nbsp;
                                                <a 
                                                    href={product.productLink}
                                                    className="itemLink"
                                                    style={{color:"inherit", textDecoration:"inherit", "&:hover":{textDecoration:"underline"}}}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {product.productName} 
                                                </a> 
                                                <span>
                                                    {
                                                        product.tutorials.length>0?
                                                        <span style={{color:"grey"}}>
                                                            &nbsp;(
                                                            {
                                                                product.tutorials.map((tuto,index) => {
                                                                    if (index === product.tutorials.length-1) {
                                                                        return <a
                                                                            key={index}
                                                                            href={tuto.tutorialLink}
                                                                            style={{color:"inherit", textDecoration:"inherit", "&:hover":{textDecoration:"underline"}+" !important"}}
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            tuto{index+1})
                                                                        </a>                                                                            
                                                                    } else {
                                                                        return <a
                                                                            key={index}
                                                                            href={tuto.tutorialLink}
                                                                            style={{color:"inherit", textDecoration:"inherit", "&:hover":{textDecoration:"underline"}+" !important"}}
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            tuto{index+1+", "}
                                                                        </a>                                                                                     
                                                                    }
                                                                })                                                                        
                                                            }

                                                        </span>
                                                        :
                                                        ""
                                                    }
                                                </span>                                              
                                            </ListItem>
                                        )
                                    })
                                    :
                                    <ListItem>Pas (encore) de recommandation.</ListItem>
                                }                                
                            </List>
                        </Paper>  
                    </Grid>

                    <Grid item container sm={6}>
                        <Paper elevation={2} style={{width:"100%", padding:"20px"}}>
                            <Typography variant="h6" component="h6">
                                Tutoriels les plus <nobr>recommandés :</nobr>
                            </Typography>
                            <List style={{fontSize:"0.9em"}}>
                                {
                                    !isNaN(themeMeanScore) && mostSuggestedTutorials.length>0?
                                    mostSuggestedTutorials.map((tutorial,index) => {
                                        return (
                                            <ListItem key={tutorial.tutorialName}>
                                                {index+1}.&nbsp;
                                                <a 
                                                    href={tutorial.tutorialLink}
                                                    className="itemLink"
                                                    style={{color:"inherit", textDecoration:"inherit", "&:hover":{textDecoration:"underline"}}}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {tutorial.tutorialName}
                                                </a>                                               
                                            </ListItem>
                                        )
                                    })
                                    :
                                    <ListItem>Pas (encore) de recommandation.</ListItem>
                                }                                
                            </List>
                        </Paper>  
                    </Grid>

                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}