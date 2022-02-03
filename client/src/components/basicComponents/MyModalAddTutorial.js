import React, { useState, useContext } from 'react';
import { Grid, makeStyles, TextField, Button, Snackbar, IconButton, CircularProgress, Backdrop } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import _ from 'lodash'

import { EditContext } from "../contexts/EditContext";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({ 
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
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
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
}));

export default function AddTutorialDialog(props) {

    const classes = useStyles();

    const [tutorialName, setTutorialName] = useState("");

    const [tutorialLink, setTutorialLink] = useState("");

    const [tutorialDescription, setTutorialDescription] = useState("");

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { createTutorial, setTutorials } = useContext(EditContext);


    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };

    const handleCancelClose = (event) => {
        setTutorialName("");
        setTutorialLink("");
        setTutorialDescription("");
        props.setDialogOpenFunc(false);        
    }

    const handleClose = (event) => {
        props.setDialogOpenFunc(false); 
    }

    const handleSaveAddedTutorial = async (event) => {
        setBackdropOpen(true);
        const res = await createTutorial({
            tutorialName: tutorialName,
            tutorialLink: tutorialLink,
            tutorialDescription: tutorialDescription,
        });
        setSnackbarMessage(res.text);
        setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            setBackdropOpen(false);
            return;
        } else {
            setTutorials(previousTuts => {
                const prevTuts = _.clone(previousTuts);
                prevTuts.push(res.tutorialCreated)  // like that we get its id
                return prevTuts
            })
            setTutorialName("");
            setTutorialLink("");
            setTutorialDescription("");
            props.setDialogOpenFunc(false); 
        } 
        setBackdropOpen(false);
    }

    const handleCloseSnackbar = (event) => {
        setSnackbarOpen(false);
    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleCloseBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />


            <Dialog
                open={props.dialogOpen}
                fullWidth={true}
                maxWidth="sm"
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
            >
                <DialogTitle id="alert-dialog-slide-title">Ajouter <nobr>un tutoriel :</nobr></DialogTitle>

                <DialogContent>

                    <Grid 
                        container
                        direction="column"
                        alignItems="center"
                        spacing={2}
                        justify="center"
                    >

                        <Grid 
                            item
                            container
                            xs={12} sm={10}
                        >
                            <TextField
                                label="Nom du tutoriel"
                                onChange={(event)=>setTutorialName(event.target.value)}
                                value={tutorialName}
                                name="tutorialName" 
                                type="text"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    className: classes.floatingLabelFocusStyle
                                }}
                                InputProps={{
                                    classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        notchedOutline: classes.notchedOutline,
                                    },
                                    inputMode: "numeric"
                                }}
                            />
                        </Grid>

                        <Grid 
                            item
                            container
                            xs={12} sm={10}
                        >
                            <TextField
                                label="Lien"
                                onChange={(event)=>setTutorialLink(event.target.value)}
                                value={tutorialLink}
                                name="tutorialLink" 
                                type="text"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    className: classes.floatingLabelFocusStyle
                                }}
                                InputProps={{
                                    classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        notchedOutline: classes.notchedOutline,
                                    },
                                    inputMode: "numeric"
                                }}
                            />
                        </Grid>

                        <Grid 
                            item
                            container
                            xs={12} sm={10}
                        >
                            <TextField
                                label="description"
                                onChange={(event)=>setTutorialDescription(event.target.value)}
                                value={tutorialDescription}
                                name="tutorialDescription" 
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                rowsMax={4}
                                variant="outlined"
                                InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    className: classes.floatingLabelFocusStyle
                                }}
                                InputProps={{
                                    classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        notchedOutline: classes.notchedOutline,
                                    },
                                    inputMode: "numeric"
                                }}
                            />
                        </Grid>
                                                    
                    </Grid>
                </DialogContent>  

                <DialogActions>
                    <Button onClick={handleSaveAddedTutorial} style={{color:"#90d058"}}>
                        Créer
                    </Button>
                    <Button onClick={handleCancelClose} style={{color:"#90d058"}}>
                        Annuler
                    </Button>
                </DialogActions>          
            </Dialog>         
        </>

    )

}