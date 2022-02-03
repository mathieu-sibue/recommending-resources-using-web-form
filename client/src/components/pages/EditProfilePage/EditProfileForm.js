import React, { useState, useContext } from "react"
import { Grid, Avatar, Button, Card, CardContent, Backdrop, CircularProgress, makeStyles, Snackbar, IconButton, TextField } from '@material-ui/core'
import { Autocomplete } from "@material-ui/lab";
import MailIcon from '@material-ui/icons/Mail'
import BusinessIcon from '@material-ui/icons/Business'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import MyTextFieldSignUp from "../../basicComponents/MyTextFieldSignUp"
import userRequests from "../../../APIrequests/userRequests"

import { UserContext } from "../../contexts/UserContext"


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
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

export function EditProfileForm(props) {

    const classes = useStyles();

    const [backdropOpen, setBackdropOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { user, setUser, sectors } = useContext(UserContext);

    var [email, setEmail] = useState(user.email);
    var [password, setPassword] = useState("");
    var [cpassword, setCpassword] = useState("");
    var [company, setCompany] = useState(user.company);
    var [sector, setSector] = useState("");

    var [emailError, setEmailError] = useState(false);
    var [emailWrongFormat, setEmailWrongFormat] = useState(false);
    var [emailAlreadyTaken, setEmailAlreadyTaken] = useState(false);
    var [companyAlreadyFiled, setCompanyAlreadyFiled] = useState(false);
    var [passwordError, setPasswordError] = useState(false);
    var [cpasswordError, setCpasswordError] = useState(false);
    var [companyError, setCompanyError] = useState(false);
    var [sectorError, setSectorError] = useState(false);
    // to deal with errors

    function validateEmail(emailString) {
        const re = /\S+@\S+\.\S+/;
        return re.test(emailString);
    }

    async function editProfile() {
        setBackdropOpen(true);

        setEmailAlreadyTaken(false);
        setCompanyAlreadyFiled(false);

        setEmailWrongFormat(false);
        setEmailError(false);
        setCompanyError(false);
        setPasswordError(false);
        setCpasswordError(false);
        setSectorError(false);
        // we clean all the errors

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
  
        const newUserInfo = {
            id: user.id,
            company,
            email,
            password,
            sector
        };
        
        const { data } = await userRequests.editProfile(newUserInfo);

        setBackdropOpen(false);

        setSnackbarMessage(data.text);
        setSnackbarOpen(true);

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

        await setUser(prevUser=>{return {
            id: newUserInfo.id,
            company: newUserInfo.company,
            email: newUserInfo.email,
            isAdmin: prevUser.isAdmin,
            sector: newUserInfo.sector
        }});

    }

    
    return (
        <div className="RegistrationForm" id="editForm" style={{display:'flex', justifyContent:'center'}}>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={()=>setSnackbarOpen(false)}
                message={snackbarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setSnackbarOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />

            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <Grid item xs={11} sm={9} md={6} style={{margin:"auto"}}>

                <Card elevation={3}>

                    <CardContent style={{paddingTop:"5%", paddingBottom:"5%"}}>

                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item>
                                <Avatar style={{backgroundColor: "#90d058", margin: "auto"}} className={classes.large}>
                                    {user.company[0]}
                                </Avatar>                                    
                            </Grid>
                            <Grid item>
                                <h1><nobr>{user.company}</nobr></h1>
                            </Grid>
                        </Grid>

                        <h3>Modifiez votre <nobr>compte :</nobr></h3>

                        <Grid item xs={10} sm={8} md={5} style={{margin:"auto", marginTop:"0.5%"}}>    
                            <MyTextFieldSignUp
                                id="email"
                                name="email"
                                label="Email"
                                value={email} 
                                onChange={event => setEmail(event.target.value)}   
                                autoFocus={false}
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
                                label="Nouveau mot de passe"
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

                        <Button 
                            variant="contained" 
                            style={{paddingLeft:"3%", paddingRight:"3%", backgroundColor:"#90d058"}}
                            endIcon={<SaveIcon />}
                            onClick={editProfile}
                        >
                            <h3><b>Enregistrer les modifications</b></h3>
                        </Button>

                    </CardContent>

                </Card>

            </Grid>


        </div>
    )
}