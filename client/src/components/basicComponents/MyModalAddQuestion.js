import React, { useState, useContext, useEffect } from 'react';
import { Grid, makeStyles, TextField, Button, Snackbar, IconButton, Typography, Chip, CircularProgress, MenuItem, Backdrop } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import _ from 'lodash'

import { EditContext } from "../contexts/EditContext";
import { FormContext } from "../contexts/FormContext";


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
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    select: {
        '&:before': {
            borderColor: "rgb(112,112,122)",
        },
        '&:after': {
            borderColor: "#90d058",
        }
    },
    typo: {
        color: "#90d058 !important",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
})
);


export default function AddQuestionDialog(props) {

    const classes = useStyles();

    const [questionText, setQuestionText] = useState("");

    const [theme, setTheme] = useState("");

    const [questionProducts, setQuestionProducts] = useState([]);
    const [productToAdd, setProductToAdd] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [resetAutocompleteValue, setResetAutocompleteValue] = useState(false);

    const [questionTutorials, setQuestionTutorials] = useState([]);
    const [tutorialToAdd, setTutorialToAdd] = useState("");
    const [isLoading2, setIsLoading2] = useState(true);   
    const [resetAutocompleteValue2, setResetAutocompleteValue2] = useState(false); 

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { createQuestion, setQuestions, questions, products, tutorials } = useContext(EditContext);
    const { themes } = useContext(FormContext);


    useEffect(() => {
        if (products !== null) {
            setIsLoading(false);
        } 
        if (tutorials !== null) {
            setIsLoading2(false);
        }

    }, [tutorials, questionTutorials, products, questionProducts])

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };    

    const handleCancelClose = (event) => {
        setQuestionText("");
        setTheme("");
        setQuestionProducts([]);
        setProductToAdd("");
        setQuestionTutorials([]);
        setTutorialToAdd("");
        setResetAutocompleteValue(prev=>!prev);
        setResetAutocompleteValue2(prev=>!prev);
        props.setDialogOpenFunc(false);        
    }

    const handleClose = (event) => {
        props.setDialogOpenFunc(false); 
    }

    const handleSaveAddedQuestion = async (event) => {
        setBackdropOpen(true);
        const res = await createQuestion({
            questionText: questionText,
            theme: theme,
            products: questionProducts.map(prod=>prod._id),
            tutorials: questionTutorials.map(tuto=>tuto._id),
            order: questions[theme].length+1 // starts at 1
        });
        setSnackbarMessage(res.text);
        setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            setBackdropOpen(false);
            return;
        } else {
            setQuestions(previousQuestions => {
                const prevQuestions = _.clone(previousQuestions);
                prevQuestions[theme].push(res.questionCreated)  // like that we get its id
                return prevQuestions
            })
            setQuestionText("");
            setTheme("");
            setQuestionProducts([]);
            setProductToAdd("");
            setQuestionTutorials([]);
            setTutorialToAdd("");
            setResetAutocompleteValue(prev=>!prev);
            setResetAutocompleteValue2(prev=>!prev);
            props.setDialogOpenFunc(false);  
        } 
        setBackdropOpen(false);
    }

    const handleCloseSnackbar = (event) => {
        setSnackbarOpen(false);
    }

    const deleteAssociatedProduct = (index) => {
        if (questionProducts.length === 0) {
            return
        }
        setQuestionProducts(previousQuestionProds=>{
            const prevQuestionProds = _.clone(previousQuestionProds)
            prevQuestionProds.splice(index,1);
            return prevQuestionProds
        })
    }

    const deleteAssociatedTutorial = (index) => {
        if (questionTutorials.length === 0) {
            return
        }
        setQuestionTutorials(previousQuestionTuts=>{
            const prevQuestionTuts = _.clone(previousQuestionTuts)
            prevQuestionTuts.splice(index,1);
            return prevQuestionTuts
        })
    }

    const handleAddProduct = () => {
        if (!products.includes(productToAdd)) {
            return
        }
        setQuestionProducts(prevQuestionProds=>{
            prevQuestionProds.push(productToAdd);
            return prevQuestionProds
        });
        setProductToAdd(null);
        setResetAutocompleteValue(prev=>!prev);
    }

    const handleAddTutorial = () => {
        if (!tutorials.includes(tutorialToAdd)) {
            return
        }
        setQuestionTutorials(prevQuestionTuts=>{
            prevQuestionTuts.push(tutorialToAdd);
            return prevQuestionTuts
        });
        setTutorialToAdd(null);
        setResetAutocompleteValue2(prev=>!prev);
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
                <DialogTitle id="alert-dialog-slide-title">Ajouter <nobr>une question :</nobr></DialogTitle>

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
                                label="Question"
                                onChange={(event)=>setQuestionText(event.target.value)}
                                value={questionText}
                                name="questionText" 
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
                                label="Thème"
                                select
                                name="theme"
                                fullWidth
                                value={theme}
                                onChange={(event)=>setTheme(event.target.value)}
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
                            >
                                {
                                    themes.map((themeItem) => (
                                        <MenuItem key={themeItem} value={themeItem}>
                                            {themeItem}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>




                        <Grid 
                            item
                            container
                            spacing={1}
                            xs={12} sm={10}
                        >
                                <Grid item>
                                    <Typography>
                                        <nobr>Produits associés :</nobr>
                                    </Typography>
                                </Grid>

                                <Grid item style={{margin:"auto"}}>
                                    <div className={classes.root}>
                                        {
                                            questionProducts.length === 0?
                                            <i style={{fontSize:"12px"}}>Pas de produit ajouté pour le moment</i>
                                            :
                                            questionProducts.map((product,index)=>{
                                                return (
                                                    <Chip
                                                        label={product.productName}
                                                        onDelete={()=>deleteAssociatedProduct(index)}
                                                        style={{backgroundColor:"rgba(213,213,213,0.5)"}}
                                                        key={index}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </Grid>
                                <Grid item style={{margin:"auto"}}>
                                    <nobr style={{display:'flex'}}>                              
                                        <Autocomplete
                                            key={resetAutocompleteValue}
                                            options={(products===null)?[]:products}
                                            getOptionLabel={(option) => option.productName}
                                            onChange={(event,value)=>{setProductToAdd(value)}}
                                            filterSelectedOptions
                                            loading={isLoading}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="A ajouter"
                                                    fullWidth
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
                                                                {isLoading ? <CircularProgress disableShrink style={{color:"rgb(144, 208, 88)"}} size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        )
                                                    }}
                                                    style={{ width: 300 }}
                                                />
                                            )}
                                        />
                                        <IconButton onClick={handleAddProduct}>
                                            <AddIcon/>
                                        </IconButton>                                   
                                    </nobr>
                                </Grid>                               
                              
                        </Grid> 




                        <Grid 
                            item
                            container
                            spacing={1}
                            xs={12} sm={10}
                        >
                                <Grid item>
                                    <Typography>
                                        <nobr>Tutoriels associés :</nobr>
                                    </Typography>
                                </Grid>

                                <Grid item style={{margin:"auto"}}>
                                    <div className={classes.root}>
                                        {
                                            questionTutorials.length === 0?
                                            <i style={{fontSize:"12px"}}>Pas de tutoriel ajouté pour le moment</i>
                                            :
                                            questionTutorials.map((tutorial,index)=>{
                                                return (
                                                    <Chip
                                                        label={tutorial.tutorialName}
                                                        onDelete={()=>deleteAssociatedTutorial(index)}
                                                        style={{backgroundColor:"rgba(213,213,213,0.5)"}}
                                                        key={index}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </Grid>
                                <Grid item style={{margin:"auto"}}>
                                    <nobr style={{display:'flex'}}>                              
                                        <Autocomplete
                                            key={resetAutocompleteValue2}
                                            options={(tutorials===null)?[]:tutorials}
                                            getOptionLabel={(option) => option.tutorialName}
                                            onChange={(event,value)=>{setTutorialToAdd(value)}}
                                            filterSelectedOptions
                                            loading={isLoading2}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="A ajouter"
                                                    fullWidth
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
                                                                {isLoading2 ? <CircularProgress disableShrink style={{color:"rgb(144, 208, 88)"}} size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        )
                                                    }}
                                                    style={{ width: 300 }}
                                                />
                                            )}
                                        />
                                        <IconButton onClick={handleAddTutorial}>
                                            <AddIcon/>
                                        </IconButton>                                   
                                    </nobr>
                                </Grid>                               
                              
                        </Grid>  
                                                      
                    </Grid>
                </DialogContent>  

                <DialogActions>
                    <Button onClick={handleSaveAddedQuestion} style={{color:"#90d058"}}>
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