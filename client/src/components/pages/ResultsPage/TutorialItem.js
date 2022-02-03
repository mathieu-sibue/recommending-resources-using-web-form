import React from "react";
import { Grid, Card, CardHeader, CardContent, Button } from "@material-ui/core";

import ContactMailIcon from '@material-ui/icons/ContactMail';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';
import EuroIcon from '@material-ui/icons/Euro';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';


const shortenedThemeToIcon = {
    'Animation réseau': <ContactMailIcon/>,
    'Visibilité': <VisibilityIcon/>,
    'Travail collaboratif': <GroupIcon/>,
    'Financement': <EuroIcon/>,
    'Gestion ressources': <AccessibilityIcon/>,
    'Sécurité': <VpnLockIcon/>,
    'Pilotage transformation numérique': <AssignmentTurnedInIcon/>
}

export function TutorialItem(props) {
    
    const tutorial = props.tutorial;
    const themeToShortenedTheme = props.themeToShortenedTheme;

    return (
        <>
            <Grid 
                container
                direction="row"
                justify="center"
            >
                {
                    tutorial.themes.map(theme=>{
                        theme = themeToShortenedTheme[theme];
                        return (
                            <Grid 
                                key={theme}
                                item 
                            > 
                                <Button
                                    disabled
                                    endIcon={shortenedThemeToIcon[theme]}
                                    style={{color:"white", fontWeight:"normal", textTransform:"none", fontSize:props.windowSizeHook()?"0.75em":"0.82em", backgroundColor:"rgb(250, 90, 52)"}}
                                >
                                    {
                                        props.windowSizeHook()?
                                        <>{theme}</>
                                        :
                                        <nobr>{theme}</nobr>
                                    }
                                </Button>

                            </Grid>
                        )
                    })
                }
            </Grid>            

            <Card elevation={0} style={{ padding:props.windowSizeHook()?"0px":"20px", paddingTop:"0px", maxWidth:"450px", margin:"auto" }} >
                <a 
                    href={tutorial.tutorialLink}
                    className="itemLink"
                    style={{color:"inherit", textDecoration:"inherit"}}
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <CardHeader  
                        title={tutorial.tutorialName}
                        titleTypographyProps={{
                            component:"h5",
                            variant:"h5",
                            style: {
                                fontFamily:"Rubik",
                                fontSize: props.windowSizeHook()?"1em":"",
                                textAlign:"center",
                                fontWeight:"bold"
                            }
                        }}
                        style={{paddingBottom:"0px"}}
                    />
                </a>
                <CardContent style={{fontSize:props.windowSizeHook()?"0.8em":"",textAlign:"center"}}>
                    {tutorial.tutorialDescription}    
                    <br/>
                    <br/>
                </CardContent>

            </Card>
        </>
    )
}