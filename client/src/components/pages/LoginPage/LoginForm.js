import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { Grid, Avatar, Button, Card, CardContent, Backdrop, CircularProgress, makeStyles } from '@material-ui/core'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import MailIcon from '@material-ui/icons/Mail'
import LockIcon from '@material-ui/icons/Lock'
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined'
import MyTextFieldLogIn from "../../basicComponents/MyTextFieldLogIn"

import userRequests from "../../../APIrequests/userRequests"

import { UserContext } from "../../contexts/UserContext"



const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
}));

export function LoginForm(props) {

    const classes = useStyles();

    const [backdropOpen, setBackdropOpen] = useState(false);

    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");

    // to deal with errors
    var [emailError, setEmailError] = useState(false);
    var [wrongEmailError, setWrongEmailError] = useState(false);
    var [passwordError, setPasswordError] = useState(false);
    var [wrongPasswordError, setWrongPasswordError] = useState(false);

    const { setUser } = useContext(UserContext);


    async function logIn() {
        setBackdropOpen(true);
        
        setWrongEmailError(false);
        setWrongPasswordError(false);
        setEmailError(false);
        setPasswordError(false);
        // we clean all errors

        let errorCount = 0;

        if (!email || email.length === 0) {
            setEmailError(true);
            errorCount+=1;
        }
        if (!password || password.length === 0) {
            setPasswordError(true);
            errorCount+=1;
        }

        if (errorCount > 0) {
            setBackdropOpen(false);
            return;
        }
  
        
        const userInfo = { 
            email,
            password
        }
        try {
            const { data } = await userRequests.login(userInfo);

            setBackdropOpen(false);

            let postReqErrorCount = 0;

            if (data === "L'utilisateur n'existe pas") {
                setWrongEmailError(true)
                postReqErrorCount+=1;
            }
            if (data === "Mot de passe incorrect") {
                setWrongPasswordError(true);
                postReqErrorCount+=1;             
            }

            if (postReqErrorCount > 0) {
                return;
            }

            localStorage.setItem("token", data.token);
            await setUser(data.userInfo);

            if (props.location.state === "redirectToFormAfterConnection") {
                props.history.push("/diagnostic");
                return null
            } else {
                props.history.push("/home");
                return null
            }

        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <div className="RegistrationForm" style={{display:'flex', justifyContent:'center'}}>

            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>
            
            <Grid item xs={11} sm={9} md={6} style={{margin:"auto"}}>

                <Card elevation={3}>

                    <CardContent style={{paddingTop:"5%", paddingBottom:"5%"}}>

                        <Avatar style={{backgroundColor: "#90d058", margin: "auto"}}>
                            <AccountCircleOutlinedIcon fontSize="large" />
                        </Avatar>
                        <h1>
                            {
                                props.location.state === "redirectToFormAfterConnection"?
                                <>Connectez-vous avant <nobr>de commencer !</nobr></>:
                                    <nobr>Connectez-vous :</nobr>
                            }
                        </h1>
                        <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto", marginTop:"0.5%"}}>    
                                <MyTextFieldLogIn
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={email} 
                                    onChange={event => setEmail(event.target.value)}   
                                    autoFocus={true}
                                    type="email"   
                                    inputIcon={<MailIcon/>}
                                    error={emailError || wrongEmailError}
                                    wrongEmailError={wrongEmailError}          
                                />    
                            </Grid>
                            <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto"}}>
                                <MyTextFieldLogIn
                                    id="password"
                                    name="password"
                                    label="Mot de passe"
                                    value={password} 
                                    onChange={event => setPassword(event.target.value)}   
                                    autoFocus={false}
                                    type="password"   
                                    inputIcon={<LockIcon/>}  
                                    error={passwordError || wrongPasswordError}      
                                    wrongPasswordError={wrongPasswordError}           
                                />
                            </Grid>
                            <br/>
                            <br/>

                            <div>
                                Vous ne possédez pas encore un compte ? <Link to={props.location.state === "redirectToFormAfterConnection"? { pathname: "/signup", state: "redirectToFormAfterConnection" }: "/signup"}>Créez-en un ici.</Link>
                            </div>
                            <br/>
                            <br/>

                            <Button 
                                variant="contained" 
                                style={{paddingLeft:"3%", paddingRight:"3%", backgroundColor:"#90d058"}}
                                endIcon={<CheckCircleOutlinedIcon/>}
                                onClick={logIn}
                            >
                                <h3><b>Connexion</b></h3>
                            </Button>

                    </CardContent>

                </Card>

            </Grid>
        </div>
    )
}
