import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { Grid, Button, makeStyles, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import TimelineIcon from '@material-ui/icons/Timeline'
import BuildIcon from '@material-ui/icons/Build'
import useWindowDimensions from "../../../customHooks/useWindowDimensions";

import { UserContext } from "../../contexts/UserContext"
import { FormContext } from "../../contexts/FormContext"


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(-2),
        borderRadius: "10em",
        [theme.breakpoints.down("sm")]: {
            borderRadius: "5em",
            fontSize: "0.5em !important"
        }
    },
    addBottomMargin: {
        [theme.breakpoints.down("sm")]: {
            marginBottom: "20% !important"
        }
    }
    }) 
);

export function HomeContainer(props) {
    const classes =  useStyles();
    const { height } = useWindowDimensions();

    const [anchorElement, setAnchorElement] = useState(null);
    const [opened, setOpened] = useState(false);
    const { user } = useContext(UserContext);
    const { alreadyModified } = useContext(FormContext);

    function handleEditClick(event) {
        setAnchorElement(event.currentTarget);
        setOpened(true);
    }
    function handleCloseMenu(event) {
        setAnchorElement(null);
        setOpened(false);
    }
    function handleRedirectToEditQuestions(event) {
        props.history.push("/edit_questions");
        handleCloseMenu();
    }
    function handleRedirectToEditProducts(event) {
        props.history.push("/edit_products");
        handleCloseMenu();
    }
    function handleRedirectToEditTutorials(event) {
        props.history.push("/edit_tutorials");
        handleCloseMenu();
    }
    function handleRedirectToResultsAnalysis(event) {
        props.history.push("/all_results");
    }


    const isWindowSizeBelowSm = () => {
        if (height < 750) {
          return true
        } else {
          return false
        }
    }


    if (user.isAdmin) {
        return (
            <div className="HomePage" style={{display:'flex', justifyContent:'center'}}>
                <Grid
                    container
                    spacing={isWindowSizeBelowSm()? 0.5: 3}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{margin:"auto"}}
                >

                    <Grid item style={{margin:"auto", marginTop:"8%"}} xs={10}>
                        <h1 style={{fontSize:"2.5em"}}>Bienvenue, <nobr>Admin !</nobr></h1>
                    </Grid>

                    <Grid item style={{margin:"auto", marginBottom:"1%"}} xs={9} sm={6} md={4}>
                        <h3 style={{fontWeight:"lighter"}}>
                            Mettez à jour le questionnaire de transformation numérique Solidatech et visualisez <nobr>les résultats.</nobr>
                        </h3>
                        <br/>
                    </Grid>

                        
                    <Grid 
                        item
                        container 
                        className={classes.buttonContainer}
                        spacing={isWindowSizeBelowSm()?2:6}
                        direction="row"
                        alignItems="center"
                        justify={isWindowSizeBelowSm()?"space-evenly":"center"}
                        style={{marginBottom:"16%"}}
                    >
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size="medium"
                                aria-controls="simple-menu" 
                                aria-haspopup="true"
                                onClick={handleEditClick}
                                style={{backgroundColor:"#90d058", borderRadius: "8"}}
                                className={classes.button}
                                endIcon={<EditIcon style={{color:"white", fontSize:"1.8em"}}/>}
                            >
                                <h3 style={{color:"white", fontSize: "1.3em"}}>
                                    {
                                        isWindowSizeBelowSm()?
                                        <b>Editer<br/>
                                        le questionnaire</b>
                                        :
                                        <b><nobr>Editer le questionnaire</nobr></b>
                                    }
                                </h3>
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorElement}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                                open={opened}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem onClick={handleRedirectToEditQuestions}>
                                    <ListItemIcon>
                                        <LiveHelpIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Editer les questions"></ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleRedirectToEditProducts}>
                                    <ListItemIcon>
                                        <AddShoppingCartIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Editer les produits"></ListItemText>                                    
                                </MenuItem>
                                <MenuItem onClick={handleRedirectToEditTutorials}>
                                    <ListItemIcon>
                                        <FormatListNumberedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Editer les tutoriels"></ListItemText>                                   
                                </MenuItem>
                            </Menu>
                        </Grid>
                        
                        <Grid item>

                            <Button 
                                variant="contained" 
                                onClick={handleRedirectToResultsAnalysis}
                                size="medium"
                                style={{backgroundColor:"#90d058", borderRadius: "8"}}
                                className={classes.button}
                                endIcon={<TimelineIcon style={{color:"white", fontSize:"1.8em"}}/>}
                            >
                                <h3 style={{color:"white", fontSize: "1.3em"}}>
                                    {
                                        isWindowSizeBelowSm()?
                                        <b>Analyser<br/>
                                        les résultats</b>
                                        :
                                        <b><nobr>Analyser les résultats</nobr></b>
                                    }
                                </h3>
                            </Button>                            

                        </Grid>                                
                    </Grid>


                </Grid>
            </div>
        )
    } else {
        return (
            <div className="HomePage" style={{display:'flex', justifyContent:'center'}}>
                <Grid
                    container
                    spacing={isWindowSizeBelowSm()? 0.5: 3}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{margin:"auto"}}
                >

                    <Grid item style={{margin:"auto", marginTop:"8%"}} xs={10}>
                        <h1 style={{fontSize:isWindowSizeBelowSm()? "2.2em": "2.5em"}}>Bienvenue, <nobr>{user.company} !</nobr></h1>
                    </Grid>

                    <Grid item style={{margin:"auto", marginBottom:"1%"}} xs={9} sm={6} md={4}>
                        <h3 style={{fontWeight:"lighter"}}>
                            Débutez ou reprenez le questionnaire de transformation numérique <nobr>Solidatech.</nobr>
                        </h3>
                        <br/>
                    </Grid>

                    <Grid item style={{margin:"auto", marginBottom:"16%"}} xs={10} className={classes.buttonContainer}>
                        <Link className="Link" to="/diagnostic">
                            <Button 
                                variant="contained" 
                                size="large"
                                style={{backgroundColor:"#90d058", borderRadius: "8"}}
                                className={classes.button}
                                endIcon={<BuildIcon style={{color:"white", fontSize:"3em"}}/>}
                            >
                                <h3 style={{color:"white", fontSize: "2em"}}>
                                    <b>
                                        <nobr>
                                            {
                                                alreadyModified || (localStorage.getItem('questAndRes') !== null)?
                                                'Reprendre ':
                                                'Lancer '
                                            }
                                            mon diagnostic
                                        </nobr>
                                    </b>
                                </h3>
                            </Button>
                        </Link>
                    </Grid>

                </Grid>
            </div>
        )
    }
}