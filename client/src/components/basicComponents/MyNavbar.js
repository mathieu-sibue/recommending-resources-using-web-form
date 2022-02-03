import React, { useState, useContext, useEffect } from "react"
import { Link, withRouter } from "react-router-dom"
import { AppBar, Toolbar, Button, makeStyles, Grid, Hidden, Menu, MenuItem, ListItemText, ListItemIcon, Backdrop, CircularProgress } from "@material-ui/core"
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import Logo from "../../ressources/images/logoSolidatech.png"
import PersonIcon from '@material-ui/icons/Person'
import userRequests from "../../APIrequests/userRequests"
import useWindowDimensions from "../../customHooks/useWindowDimensions";

import { UserContext } from "../contexts/UserContext"
import { FormContext } from "../contexts/FormContext"
import { EditContext } from "../contexts/EditContext"


const useStyles = makeStyles(theme=>({
    logo: {
        maxWidth: 30
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
  })
);


function MyNavBar(props) {
    const classes = useStyles();
    const { width } = useWindowDimensions();
    const maxNbOfLettersForUserButton = (width < 400)? 6:8;

    const [backdropOpen, setBackdropOpen] = useState(false);

    const [anchorElement, setAnchorElement] = useState(null);
    const [anchorElement2, setAnchorElement2] = useState(null);
    const [opened, setOpened] = useState(false);
    const [opened2, setOpened2] = useState(false);

    const { user, setUser } = useContext(UserContext);
    const { onDisconnect } = useContext(FormContext);
    const { setTutorials, setProducts, setQuestions, setUserResponsesScoresAndReco } = useContext(EditContext);


    useEffect(() => {
        setOpened(false);
    }, [user])


    function handleAccountClick(event) {
        setAnchorElement(event.currentTarget);
        setOpened(true);
    }
    function handleCloseMenu(event) {
        setAnchorElement(null);
        setOpened(false);
    }
    async function handleDisconnect() {
        setBackdropOpen(true);

        if (user && !user.isAdmin) {
            await onDisconnect();
        }
        await userRequests.logout();
        await setUser(null);
        if (user.isAdmin) {
            await setTutorials(null);
            await setProducts(null);
            await setQuestions(null);
            await setUserResponsesScoresAndReco(null);
        }

        setBackdropOpen(false);
        props.history.push("/");
    }
    function handleRedirectToProfile() {
        props.history.push("/edit_profile");
        handleCloseMenu();
    }
    function handleRedirectToResults() {
        props.history.push("/results");
        handleCloseMenu();
    }

 
    function handleAccountClick2(event) {
        setAnchorElement2(event.currentTarget);
        setOpened2(true);
    }
    function handleCloseMenu2(event) {
        setAnchorElement2(null);
        setOpened2(false);
    }
    function handleRedirectToEditQuestions(event) {
        props.history.push("/edit_questions");
        handleCloseMenu2();
    }
    function handleRedirectToEditProducts(event) {
        props.history.push("/edit_products");
        handleCloseMenu2();
    }
    function handleRedirectToEditTutorials(event) {
        props.history.push("/edit_tutorials");
        handleCloseMenu2();
    }


    return (
        <>
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <div className={classes.root}>
                <AppBar position="fixed" style={{backgroundColor:"white"}}>
                    <Toolbar style={{paddingLeft:"12%", paddingRight:"12%"}}>

                        <Grid
                            container
                            spacing={10}
                            direction="row"
                            alignItems="center"
                        >
                            <Grid item style={{flex:"1"}}>
                                <Link className="Link" to={user===null? "/": "/home"}>
                                    <img src={Logo} alt="logo" className={classes.logo}/>
                                </Link>
                            </Grid>

                            {
                                user === null?
                                <Grid item>
                                    <Grid item container={width<600?false:true} spacing={1}>
                                        <Grid item style={{flex:"1"}}>
                                            <Hidden xsDown>
                                                <Link className="Link" to={props.location.state === "redirectToFormAfterConnection"? { pathname: "/login", state: "redirectToFormAfterConnection" }: "/login"}>
                                                    <Button style={{fontWeight: "normal"}}>Se connecter</Button>
                                                </Link>   
                                            </Hidden>                                    
                                        </Grid>
                                        <Grid item>
                                            <Hidden xsDown>
                                                <Link className="Link" to={props.location.state === "redirectToFormAfterConnection"? { pathname: "/signup", state: "redirectToFormAfterConnection" }: "/signup"}>
                                                    <Button style={{fontWeight: "normal"}}>S'inscrire</Button>
                                                </Link>
                                            </Hidden>                                         
                                        </Grid>      
                                        <Grid item>
                                            <Link className="Link" to="/diagnostic">
                                                <Button variant="contained" style={{backgroundColor:"#90d058"}}>
                                                    {
                                                        width<350?
                                                        "Diag..."
                                                        :
                                                        "Diagnostic"
                                                    }
                                                </Button>
                                            </Link>     
                                        </Grid>                              
                                    </Grid>                    
                                </Grid>:

                                    user.isAdmin?
                                    <Grid item>
                                        <Grid item container={width<600?false:true} spacing={1}>
                                            <Grid item style={{flex:"1"}}>
                                                <Hidden xsDown>
                                                    <Button 
                                                        style={{fontWeight: "normal"}}
                                                        aria-controls="simple-menu" 
                                                        aria-haspopup="true" 
                                                        onClick={handleAccountClick2}                                                    
                                                    >
                                                        Questionnaire
                                                    </Button>
                                                    <Menu
                                                        id="simple-menu2"
                                                        anchorEl={anchorElement2}
                                                        getContentAnchorEl={null}
                                                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                                        transformOrigin={{ vertical: "top", horizontal: "center" }}                                                
                                                        open={opened2}
                                                        onClose={handleCloseMenu2}
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
                                                </Hidden>                                    
                                            </Grid>
                                            <Grid item>
                                                <Hidden xsDown>
                                                    <Link className="Link" to="/all_results">
                                                        <Button style={{fontWeight: "normal"}}>Résultats</Button>
                                                    </Link>
                                                </Hidden>                                         
                                            </Grid>      
                                            <Grid item>
                                                <Button 
                                                    variant="contained" 
                                                    aria-controls="simple-menu" 
                                                    aria-haspopup="true" 
                                                    onClick={handleAccountClick}
                                                    endIcon={<PersonIcon/>}
                                                >
                                                    Admin
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
                                                    <MenuItem onClick={handleRedirectToProfile}>Mon compte</MenuItem>
                                                    <MenuItem onClick={handleDisconnect}>Se déconnecter</MenuItem>
                                                </Menu>
                                            </Grid>                              
                                        </Grid>                    
                                    </Grid>:

                                        <Grid item>
                                            <Grid item container={width<600?false:true} spacing={1}>
                                                <Grid item style={{flex:"1"}}>
                                                    {
                                                        window.location.pathname === "/diagnostic" /*|| window.location.pathname === "/results"*/?
                                                        <div></div>:
                                                            <Hidden xsDown>
                                                                <Link className="Link" to="/diagnostic">
                                                                    <Button variant="contained" style={{backgroundColor:"#90d058"}}>Diagnostic</Button>
                                                                </Link>                                                                                     
                                                            </Hidden>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Button 
                                                        variant="contained" 
                                                        aria-controls="simple-menu" 
                                                        aria-haspopup="true" 
                                                        onClick={handleAccountClick}
                                                        endIcon={<PersonIcon/>}
                                                    >
                                                        {(user.company).length>8?(user.company).substr(0,maxNbOfLettersForUserButton)+"...":user.company}
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
                                                        <MenuItem onClick={handleRedirectToProfile}>Mon compte</MenuItem>
                                                        <MenuItem onClick={handleRedirectToResults}>Mes résultats</MenuItem>
                                                        <MenuItem onClick={handleDisconnect}>Se déconnecter</MenuItem>
                                                    </Menu>
                                                </Grid>                              
                                            </Grid>  
                                        </Grid>
                            }                                       
                            </Grid>

                    </Toolbar>
                </AppBar>
            </div>        
        </>

    )
}

export default withRouter(MyNavBar);