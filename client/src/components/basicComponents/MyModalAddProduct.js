import React, { useState, useContext, useEffect } from 'react';
import { Grid, makeStyles, TextField, Button, Snackbar, IconButton, Typography, Chip, CircularProgress, Backdrop } from "@material-ui/core";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
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
    },
    input: {
        display: 'none',
    },
})
);


export default function AddProductDialog(props) {

    const classes = useStyles();

    const [productName, setProductName] = useState("");

    const [productLink, setProductLink] = useState("");

    const [productDescription, setProductDescription] = useState("");

    const [productTutorials, setProductTutorials] = useState([]);
    const [tutorialToAdd, setTutorialToAdd] = useState("");

    const [productPhoto, setProductPhoto] = useState("");
    const [productPhotoFilename, setProductPhotoFilename] = useState("");

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [resetAutocompleteValue, setResetAutocompleteValue] = useState(false)

    const { createProduct, setProducts, tutorials } = useContext(EditContext);

    useEffect(() => {
        if (tutorials !== null) {
            setIsLoading(false);
        } 
    }, [tutorials, productTutorials])

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };    

    const handleCancelClose = (event) => {
        setProductName("");
        setProductLink("");
        setProductDescription("");
        setProductTutorials([]);
        setTutorialToAdd("");
        setProductPhoto("");
        setProductPhotoFilename("");
        setResetAutocompleteValue(prev=>!prev);
        document.getElementById("contained-button-file").value = "";
        props.setDialogOpenFunc(false);        
    }

    const handleClose = (event) => {
        props.setDialogOpenFunc(false); 
    }

    const handleSaveAddedProduct = async (event) => {
        setBackdropOpen(true);
        const res = await createProduct({
            productName: productName,
            productLink: productLink,
            productDescription: productDescription,
            tutorials: productTutorials.map(tuto=>tuto._id),
            productPhoto: productPhoto,
            productPhotoFilename: productPhotoFilename
        });
        setSnackbarMessage(res.text);
        setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            setBackdropOpen(false);
            return;
        } else {
            setProducts(previousProducts => {
                const prevProducts = _.clone(previousProducts);
                prevProducts.push(res.productCreated)  // like that we get its id
                return prevProducts
            })
            setProductName("");
            setProductLink("");
            setProductDescription("");
            setProductTutorials([]);
            setTutorialToAdd("");
            setProductPhoto("");
            setProductPhotoFilename("");
            document.getElementById("contained-button-file").value = "";
            setResetAutocompleteValue(prev=>!prev);
            props.setDialogOpenFunc(false); 
        } 
        setBackdropOpen(false);
    }

    const handleCloseSnackbar = (event) => {
        setSnackbarOpen(false);
    }

    const deleteAssociatedTutorial = (index) => {
        if (productTutorials.length === 0) {
            return
        }
        setProductTutorials(previousProductTuts=>{
            const prevProductTuts = _.clone(previousProductTuts)
            prevProductTuts.splice(index,1);
            return prevProductTuts
        })
    }

    const handleAddTutorial = () => {
        if (!tutorials.includes(tutorialToAdd)) {
            return
        }
        setProductTutorials(prevProductTuts=>{
            prevProductTuts.push(tutorialToAdd);
            return prevProductTuts
        });
        setTutorialToAdd(null);
        setResetAutocompleteValue(prev=>!prev);
    }

    const encodeImageFileAsURL = () => {
        var filesSelected = document.getElementById("contained-button-file").files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            setProductPhotoFilename(fileToLoad.name)

            var fileReader = new FileReader();
            fileReader.onloadend = function() {
                setProductPhoto(fileReader.result)
            }
            fileReader.readAsDataURL(fileToLoad)

        }
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
                <DialogTitle id="alert-dialog-slide-title">Ajouter <nobr>un produit :</nobr></DialogTitle>

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
                                label="Nom du produit"
                                onChange={(event)=>setProductName(event.target.value)}
                                value={productName}
                                name="productName" 
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
                                onChange={(event)=>setProductLink(event.target.value)}
                                value={productLink}
                                name="productLink" 
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
                                label="Description"
                                onChange={(event)=>setProductDescription(event.target.value)}
                                value={productDescription}
                                name="productDescription" 
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
                                            productTutorials.length === 0?
                                            <i style={{fontSize:"12px"}}>Pas de tutoriel ajouté pour le moment</i>
                                            :
                                            productTutorials.map((tutorial,index)=>{
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
                                            key={resetAutocompleteValue}
                                            options={(tutorials===null)?[]:tutorials}
                                            getOptionLabel={(option) => option.tutorialName}
                                            onChange={(event,value)=>{setTutorialToAdd(value)}}
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
                                        <IconButton onClick={handleAddTutorial}>
                                            <AddIcon/>
                                        </IconButton>                                   
                                    </nobr>
                                </Grid>                               
                              
                        </Grid> 

                        <br/>

                        <Grid 
                            item
                            container
                            justify="center"
                            alignContent="center"
                            xs={12} sm={10}
                            spacing={1}
                        >
                            <Grid item>
                                <div style={{textAlign:"center", marginBottom:"5px", fontSize:"0.8em"}}>
                                    Photo choisie : {productPhoto === ""? "aucune.": productPhotoFilename}
                                </div>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={encodeImageFileAsURL}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button 
                                        variant="contained" 
                                        component="span" 
                                        style={{backgroundColor:"#90d058", color:"white"}} 
                                        endIcon={<PhotoCamera/>}
                                    >
                                        Choisir une photo
                                    </Button>
                                </label>                              
                            </Grid>
                        </Grid>                                                       
                    </Grid>
                </DialogContent>  

                <DialogActions>
                    <Button onClick={handleSaveAddedProduct} style={{color:"#90d058"}}>
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