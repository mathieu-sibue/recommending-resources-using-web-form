import React, { useState } from "react";
import { makeStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TableContainer, TableCell, Table, TableRow, TableHead, Paper, TableBody, Grid, List, ListItem } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


function getSteps() {
    return ['Je ne sais pas', 'Non et je ne pense pas en avoir besoin', 'Non et je pense en avoir besoin', "C'est en cours", "Oui"];
}

const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

export default function MyIndividualResultsThemeSection(props) {

    const themeResponsesList = props.themeResponsesList.sort((questResPair1, questResPair2) => {
        return questResPair1.question.order-questResPair2.question.order
    });
    const theme = props.theme;
    const scoresAndReco = props.scoresAndReco;

    const classes = useStyles();
    const steps = getSteps();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (event) => {
        setExpanded(prev=>!prev)
    }

    return (
        <ExpansionPanel expanded={expanded} onChange={handleChange} style={{backgroundColor:"rgba(213,213,213,0.5)"}}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelbh-content"
                id="panelbh-header"
            >
                <Typography className={classes.heading}>
                    {theme}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                    {
                        scoresAndReco === null?
                        "(en cours)"
                        :
                        "score : "+Math.round(scoresAndReco.userScores[theme])+"/100"
                    }
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item container>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Question
                                        </TableCell>
                                        <TableCell align="right">
                                            Réponse
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        themeResponsesList.map(questResPair=>{
                                            return <TableRow key={questResPair.question.questionText}>
                                                <TableCell>
                                                    {questResPair.question.questionText}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        questResPair.response === null?
                                                        <span style={{color:"grey", fontStyle:"italic", fontSize:"0.9em"}}>(pas de réponse)</span>
                                                        :
                                                        steps[questResPair.response]
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>


                    <Grid 
                        item 
                        container
                        direction="row"
                        justify="center"
                        spacing={2}
                    >


                        <Grid item container sm={6}>
                            <Paper elevation={2} style={{width:"100%", padding:"30px"}}>
                                <Typography variant="h5" component="h5">
                                    Produits <nobr>recommandés :</nobr>
                                </Typography>
                                <List>
                                    {
                                        scoresAndReco !== null && scoresAndReco.suggestedProducts[theme].length>0?
                                        scoresAndReco.suggestedProducts[theme].map(product => {
                                            return (
                                                <ListItem key={product.productName}>
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
                            <Paper elevation={2} style={{width:"100%", padding:"30px"}}>
                                <Typography variant="h5" component="h5">
                                    Tutoriels <nobr>recommandés :</nobr>
                                </Typography>
                                <List>
                                    {
                                        scoresAndReco !== null && scoresAndReco.suggestedTutorials[theme].length>0?
                                        scoresAndReco.suggestedTutorials[theme].map(tutorial => {
                                            return (
                                                <ListItem key={tutorial.tutorialName}>
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


                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}