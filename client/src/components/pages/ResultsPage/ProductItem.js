import React from "react";
import { Grid, Card, CardHeader, Typography, Avatar, CardContent, Button } from "@material-ui/core";

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

export function ProductItem(props) {
    
    const product = props.product;
    const themeToShortenedTheme = props.themeToShortenedTheme;

    return (
        <>
            <Grid 
                container
                direction="row"
                justify="center"
            >
                {
                    product.themes.map(theme=>{
                        theme = themeToShortenedTheme[theme];
                        return (
                            <Grid 
                                key={theme}
                                item
                            > 
                                <Button
                                    disabled
                                    endIcon={shortenedThemeToIcon[theme]}
                                    style={{color:"white", fontWeight:"normal", textTransform:"none", fontSize:props.windowSizeHook()?"0.75em":"0.82em", backgroundColor:"rgb(250, 90, 52)", margin: props.windowSizeHook()?"10px": "2px"}}
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

            <Card elevation={0}>
                <a 
                    href={product.productLink}
                    className="itemLink"
                    style={{color:"inherit", textDecoration:"inherit", "&:hover":{textDecoration:"underline"}}}
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {
                        props.windowSizeHook()?
                        <Typography
                            component="h5"
                            variant="h5"
                            style={{fontFamily:"Rubik",fontSize:"1em",fontWeight:"bold",textAlign:"center"}}
                        >
                            {product.productName}
                        </Typography> 
                        :
                        <CardHeader  
                            avatar={
                                <>
                                    {
                                        product.productPhoto === ""?
                                        <Avatar style={{backgroundColor:"black"}}>
                                            {product.productName[0]} 
                                        </Avatar>  
                                        :
                                        <Avatar src={product.productPhoto}/>                                                                                 
                                    }
                                </>
                                                             
                            }
                            title={
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontFamily:"Rubik"}}
                                >
                                    {product.productName}
                                </Typography>
                            }

                            style={{paddingBottom:"0px"}}
                        />
                    }
                </a>
                <CardContent style={{fontSize:props.windowSizeHook()?"0.8em":"", textAlign:"justify"}}>
                    {product.productDescription}
                    <br/> 
                    {
                        product.tutorials.length!==0?
                        <Typography style={{margin:"5px", fontSize:props.windowSizeHook()?"0.9em":""}}>
                            Quelques <nobr>ressources :</nobr>
                        </Typography>
                        :
                        <br/>
                    }
                    <Grid 
                        container
                        direction="row"
                        justify="center"
                        spacing={1}
                    >
                        {
                            product.tutorials.map(tuto=>{
                                return (
                                    <Grid 
                                        key={tuto.tutorialName}
                                        sm={9}
                                        md={6}
                                        xs={12}
                                        item
                                        style={{fontSize:props.windowSizeHook()?"0.8em":"0.85em", textAlign:"justify"}}
                                    > 
                                        <Card style={{backgroundColor: 'rgba(213,213,213,0.5)', padding:"10px"}}>
                                            <a 
                                                href={tuto.tutorialLink}
                                                style={{color:"inherit", textDecoration:"inherit"}}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {tuto.tutorialName}
                                            </a>                                            
                                        </Card>

                                    </Grid>
                                )
                            })
                        }
                    </Grid>         
                </CardContent>
            </Card>
            <br/> 
        </>
    )
}