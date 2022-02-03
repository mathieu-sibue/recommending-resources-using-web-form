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


export default function EditProductDialog(props) {

    const { updateProduct, setProducts, tutorials } = useContext(EditContext);
    const fullProductTutorialObjects = tutorials.filter(tuto => {
        return (props.product.tutorials).includes(tuto._id)
    });

    const classes = useStyles();

    const [productName, setProductName] = useState(props.product.productName);

    const [productLink, setProductLink] = useState(props.product.productLink);

    const [productDescription, setProductDescription] = useState(props.product.productDescription);

    const [productTutorials, setProductTutorials] = useState(fullProductTutorialObjects);
    const [tutorialToAdd, setTutorialToAdd] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [resetAutocompleteValue, setResetAutocompleteValue] = useState(false);

    const [productPhoto, setProductPhoto] = useState(props.product.productPhoto);
    const [productPhotoFilename, setProductPhotoFilename] = useState(props.product.productPhotoFilename);

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");


    useEffect(() => {
        if (tutorials !== null) {
            setIsLoading(false);
        } 
    }, [tutorials, productTutorials])

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };

    const handleCancelClose = (event) => {
        setProductName(props.product.productName);
        setProductLink(props.product.productLink);
        setProductDescription(props.product.productDescription);
        setProductTutorials(fullProductTutorialObjects);
        setTutorialToAdd("");
        setProductPhoto(props.product.productPhoto);
        setProductPhotoFilename(props.product.productPhotoFilename);
        document.getElementById("contained-button-file"+props.index).value = "";
        setResetAutocompleteValue(prev=>!prev);
        props.setDialogOpenFunc(false);        
    }

    const handleClose = (event) => {
        props.setDialogOpenFunc(false); 
    }

    const handleSaveUpdatedProduct = async (event) => {
        setBackdropOpen(true);
        const productToUpdate = {
            _id: props.product._id,
            productName: productName,
            productLink: productLink,
            productDescription: productDescription,
            tutorials: productTutorials.map(tuto=>tuto._id),
            productPhoto: productPhoto,
            productPhotoFilename: productPhotoFilename,
            createdAt: props.product.createdAt
        };
        const res = await updateProduct(productToUpdate);
        setSnackbarMessage(res.text);
        setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            setBackdropOpen(false);
            return;
        } else {
            setProducts(previousProducts => {
                var prevProducts = _.clone(previousProducts);
                for (var prod of prevProducts) {
                    if (prod._id === props.product._id) {
                        prod.productName = productToUpdate.productName;
                        prod.productLink = productToUpdate.productLink;
                        prod.productDescription = productToUpdate.productDescription;
                        prod.tutorials = productToUpdate.tutorials;
                        prod.productPhoto = productToUpdate.productPhoto;
                        prod.productPhotoFilename = productToUpdate.productPhotoFilename;
                    } 
                }
                return prevProducts
            })
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
        var filesSelected = document.getElementById("contained-button-file"+props.index).files;
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
                <DialogTitle id="alert-dialog-slide-title">Modifier <nobr>le produit :</nobr></DialogTitle>

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
                                    id={"contained-button-file"+props.index}
                                    multiple
                                    type="file"
                                    onChange={encodeImageFileAsURL}
                                />
                                <label htmlFor={"contained-button-file"+props.index}>
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
                    <Button onClick={handleSaveUpdatedProduct} style={{color:"#90d058"}}>
                        Modifier
                    </Button>
                    <Button onClick={handleCancelClose} style={{color:"#90d058"}}>
                        Annuler
                    </Button>
                </DialogActions>          
            </Dialog>         
        </>

    )

}