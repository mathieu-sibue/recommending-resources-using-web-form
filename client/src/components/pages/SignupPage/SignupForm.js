import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { Grid, Avatar, Button, Card, CardContent, Backdrop, CircularProgress, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import MailIcon from '@material-ui/icons/Mail'
import BusinessIcon from '@material-ui/icons/Business'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import CreateIcon from '@material-ui/icons/Create'
import MyTextFieldSignUp from "../../basicComponents/MyTextFieldSignUp"
import userRequests from "../../../APIrequests/userRequests"

import { UserContext } from "../../contexts/UserContext"


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    },
    cssLabel: {
        color: '#90d058 !important'
    },
    floatingLabelFocusStyle: {
        color: '#90d058 !important'
    },
    cssFocused: {
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: '#90d058 !important',
        }
    },  
    notchedOutline: {
        borderWidth: '1px',
    }
}));

export function SignupForm(props) {

    const classes = useStyles();

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");
    var [cpassword, setCpassword] = useState("");
    var [company, setCompany] = useState("");
    var [sector, setSector] = useState("");

    var [emailError, setEmailError] = useState(false);
    var [emailWrongFormat, setEmailWrongFormat] = useState(false);
    var [emailAlreadyTaken, setEmailAlreadyTaken] = useState(false);
    var [companyAlreadyFiled, setCompanyAlreadyFiled] = useState(false);
    var [passwordError, setPasswordError] = useState(false);
    var [cpasswordError, setCpasswordError] = useState(false);
    var [companyError, setCompanyError] = useState(false);
    var [sectorError, setSectorError] = useState(false);
    // to handle errors

    const { setUser, sectors } = useContext(UserContext);

    function validateEmail(emailString) {
        const re = /\S+@\S+\.\S+/;
        return re.test(emailString);
    }

    async function signUp() {

        setBackdropOpen(true);

        setEmailAlreadyTaken(false);
        setEmailWrongFormat(false);
        setCompanyAlreadyFiled(false);
        setEmailError(false);
        setCompanyError(false);
        setPasswordError(false);
        setCpasswordError(false);
        setSectorError(false);
        // we clean all errors

        let errorCount = 0;

        if (!email || email.length === 0) {
            setEmailError(true);
            errorCount+=1;
        }
        if (!validateEmail(email)) {
            setEmailWrongFormat(true);
            errorCount+=1;
        }
        if (!company || company.length === 0) {
            setCompanyError(true);
            errorCount+=1;
        } 
        if (!password || password.length === 0) {
            setPasswordError(true);
            errorCount+=1;
        }
        if (!cpassword || cpassword.length === 0) {
            setCpasswordError(true);
            errorCount+=1;
        }
        if (cpassword !== password) {
            setCpasswordError(true);
            errorCount+=1;
        }
        if (!sector || sector.length === 0 || !sectors.includes(sector)) {
            setSectorError(true);
            errorCount+=1;
        }

        if (errorCount > 0) {
            setBackdropOpen(false);
            return;
        }
  
        
        const userInfo = { 
            email,
            company,
            password,
            sector
        }
        try {
            const { data } = await userRequests.signup(userInfo);

            setBackdropOpen(false);

            let postReqErrorCount = 0;

            if (data === "Email existe déjà") {
                setEmailAlreadyTaken(true);
                postReqErrorCount+=1;
            }
            if (data === "Utilisateur existe déjà") {
                setCompanyAlreadyFiled(true);
                postReqErrorCount+=1;             
            }

            if (postReqErrorCount > 0) {
                return;
            }

            localStorage.setItem("token", data.token);
            await setUser(data.userInfo);

            if (props.location.state === "redirectToFormAfterConnection") {
                props.history.push("/diagnostic");
            } else {
                props.history.push("/home");
            }

        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <div className="RegistrationForm" id="registerForm" style={{display:'flex', justifyContent:'center'}}>

            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <Grid item xs={11} sm={9} md={6} style={{margin:"auto"}}>

                <Card elevation={3}>

                    <CardContent style={{paddingTop:"5%", paddingBottom:"5%"}}>

                        <Avatar style={{backgroundColor: "#90d058", margin: "auto"}}>
                            <PersonAddOutlinedIcon />
                        </Avatar>

                        <h1>A propos de votre <nobr>association :</nobr></h1>
                        <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto", marginTop:"0.5%"}}>    
                                <MyTextFieldSignUp
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={email} 
                                    onChange={event => setEmail(event.target.value)}   
                                    autoFocus={true}
                                    type="email"   
                                    inputIcon={<MailIcon/>}
                                    error={emailError || emailAlreadyTaken || emailWrongFormat}
                                    emailAlreadyTaken={emailAlreadyTaken} 
                                    emailWrongFormat={emailWrongFormat}         
                                />    
                            </Grid>
                            <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto"}}>
                                <MyTextFieldSignUp
                                    id="company"
                                    name="company"
                                    label="Association"
                                    value={company} 
                                    onChange={event => setCompany(event.target.value)}   
                                    autoFocus={false}
                                    type="" 
                                    inputIcon={<BusinessIcon/>}
                                    error={companyError || companyAlreadyFiled}
                                    companyAlreadyFiled={companyAlreadyFiled}                     
                                />
                            </Grid>
                            <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto"}}>
                                <Autocomplete
                                    options={sectors}
                                    getOptionLabel={(option) => option}
                                    onChange={(event,value)=>{setSector(value)}}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Secteur"
                                            fullWidth
                                            helperText={sectorError ? "Un secteur valide doit être renseigné": ""}
                                            error={sectorError}
                                            InputLabelProps={{
                                                ...params.InputLabelProps,
                                                classes: {
                                                    root: classes.cssLabel,
                                                    focused: classes.cssFocused,
                                                },
                                                className: classes.floatingLabelFocusStyle
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                classes: {
                                                    root: classes.cssOutlinedInput,
                                                    focused: classes.cssFocused,
                                                    notchedOutline: classes.notchedOutline,
                                                },
                                                inputMode: "numeric",
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <br/>                            

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto"}}>
                                <MyTextFieldSignUp
                                    id="password"
                                    name="password"
                                    label="Mot de passe"
                                    value={password} 
                                    onChange={event => setPassword(event.target.value)}   
                                    autoFocus={false}
                                    type="password"   
                                    inputIcon={<LockOpenIcon/>}  
                                    error={passwordError}                 
                                />
                            </Grid>
                            <br/>

                            <Grid item xs={10} sm={8} md={5} style={{margin:"auto"}}>
                                <MyTextFieldSignUp
                                    id="cpassword"
                                    name="cpassword"
                                    label="Confirmation"
                                    value={cpassword} 
                                    onChange={event => setCpassword(event.target.value)}   
                                    autoFocus={false}
                                    type="password"   
                                    inputIcon={<LockIcon/>}
                                    error={cpasswordError}                        
                                />
                            </Grid>
                            <br/>
                            <br/>

                            <div>Vous possédez déjà un compte ? <Link to="/login">Connectez-vous ici.</Link></div>
                            <br/>
                            <br/>

                            <Button 
                                variant="contained" 
                                style={{paddingLeft:"3%", paddingRight:"3%", backgroundColor:"#90d058"}}
                                endIcon={<CreateIcon />}
                                onClick={signUp}
                            >
                                <h3><b>Créer votre compte</b></h3>
                            </Button>

                    </CardContent>

                </Card>

            </Grid>


        </div>
    )
}