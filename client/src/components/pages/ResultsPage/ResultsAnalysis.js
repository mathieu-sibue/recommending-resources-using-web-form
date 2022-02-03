import React, { useContext } from 'react';
import { Typography, makeStyles, Card, Button } from "@material-ui/core";
import useWindowDimensions from "../../../customHooks/useWindowDimensions";

import ContactMailIcon from '@material-ui/icons/ContactMail';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';
import EuroIcon from '@material-ui/icons/Euro';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import { UserContext } from "../../contexts/UserContext";



const shortenedThemeToIcon = {
    'Animation réseau': <ContactMailIcon/>,
    'Visibilité': <VisibilityIcon/>,
    'Travail collaboratif': <GroupIcon/>,
    'Financement': <EuroIcon/>,
    'Gestion ressources': <AccessibilityIcon/>,
    'Sécurité': <VpnLockIcon/>,
    'Pilotage transformation numérique': <AssignmentTurnedInIcon/>
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      maxWidth: "300px",
      margin:'auto'
    }
  }));


export function ResultsAnalysis(props) {

    const classes = useStyles();
    const { user } = useContext(UserContext);

    const { width } = useWindowDimensions();

    const strengths = props.strengths.sort((theme1, theme2) => {
        return props.userScores[theme2] - props.userScores[theme1]
    })
    const weaknesses = props.weaknesses.sort((theme1, theme2) => {
        return props.userScores[theme1] - props.userScores[theme2]
    })

    return (
        <>
            {
                width<500?
                <Typography component="h4" variant="h4" style={{fontFamily:"Rubik", textAlign:"center"}}>
                    <nobr>Bien joué,</nobr> <nobr>{user.company} !</nobr>
                </Typography>
                :
                <Typography component="h3" variant="h3" style={{fontFamily:"Rubik", textAlign:"center"}}>
                    <nobr>Bien joué,</nobr> <nobr>{user.company} !</nobr>
                </Typography>                
            }

            <br/>
            <br/>

            <Typography component="h5" variant="h5" style={{fontFamily:"Rubik", textAlign:"center"}}>
                <nobr>Vos points forts :</nobr>
            </Typography>
            <div className={classes.root}>
                {
                    strengths.map((strength)=>{
                        return (
                            <Card
                                key={strength}
                                style={{margin:"5px", padding:"2px", backgroundColor:"rgb(144, 208, 88)", color:"white"}}
                            >   
                                <Button
                                    disabled
                                    endIcon={shortenedThemeToIcon[props.themeToShortenedTheme[strength]]}
                                    style={{color:"white", fontWeight:"normal", textTransform:"none"}}
                                >
                                    {props.themeToShortenedTheme[strength]}
                                </Button>
                            </Card>
                        )
                    })
                }
            </div>
            <br/>
            <Typography component="h5" variant="h5" style={{fontFamily:"Rubik", textAlign:"center"}}>
                <nobr>Vos points</nobr> <nobr>d'amélioration :</nobr>
            </Typography>  
            <div className={classes.root}>
                {
                    weaknesses.map((weakness)=>{
                        return (
                            <Card
                                key={weakness}
                                style={{margin:"5px", padding:"2px", backgroundColor:"rgb(250, 90, 52)", color:"white"}}
                            >   
                                <Button
                                    disabled
                                    endIcon={shortenedThemeToIcon[props.themeToShortenedTheme[weakness]]}
                                    style={{color:"white", fontWeight:"normal", textTransform:"none"}}
                                >
                                    {props.themeToShortenedTheme[weakness]}
                                </Button>
                            </Card>
                        )
                    })
                }
            </div>   

        </>
    )
}