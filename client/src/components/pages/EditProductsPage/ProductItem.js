import React, { useContext, useState } from "react";
import { ListItem, Divider, ListItemText, ListItemSecondaryAction, IconButton, Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import _ from 'lodash';
import EditProductDialog from "../../basicComponents/MyModalEditProduct";

import { EditContext } from "../../contexts/EditContext";


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
})
);

export function ProductItem(props) {

    const classes = useStyles();

    const [backdropOpen, setBackdropOpen] = React.useState(false);
    
    const [dialogOpen, setDialogOpen] = useState(false);

    const { products, setProducts, deleteProduct } = useContext(EditContext);

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };  

    const handleDeleteProduct = async () => {
        setBackdropOpen(true);
        const productToDelete = products[props.index];
        const res = await deleteProduct(productToDelete);
        setBackdropOpen(false);
        props.setSnackbarMessage(res.text);
        props.setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            return;
        } else {
            setProducts(previousProducts=>{
                var prevProducts = _.clone(previousProducts);
                var filteredProducts = prevProducts.filter((val)=>(val !== productToDelete));
                return filteredProducts
            });
        }
    } 

    const handleOpenEditProduct = () => {
        setDialogOpen(true);
    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleCloseBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <EditProductDialog
                dialogOpen={dialogOpen} 
                setDialogOpenFunc={setDialogOpen} 
                product={products[props.index]}
                index={props.index}
            />

            <ListItem>
                <ListItemText
                    primary={products[props.index].productName}
                    secondary={
                        <React.Fragment>
                            {
                                products[props.index].productDescription===""?
                                <></>
                                :
                                <><i>{products[props.index].productDescription}</i><br/></>
                            }
                            <a 
                                href={products[props.index].productLink}
                                style={{color:"inherit", textDecoration:"inherit"}}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {products[props.index].productLink}
                            </a>
                        </React.Fragment>
                    }
                    style={{marginRight:"30px"}}
                />
                <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" onClick={handleOpenEditProduct}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton size="small" edge="end" onClick={handleDeleteProduct}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            
            {
                (props.index === products.length-1)?
                <></>
                :
                <Divider component="li"/>
            }
        </>
    )
}