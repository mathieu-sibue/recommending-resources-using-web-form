import React, { useContext, useState } from "react";
import { ListItem, Divider, ListItemText, ListItemSecondaryAction, IconButton, Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import _ from 'lodash';
import EditTutorialDialog from "../../basicComponents/MyModalEditTutorial";

import { EditContext } from "../../contexts/EditContext";


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
})
);

export function TutorialItem(props) {
    
    const classes = useStyles();
    
    const [backdropOpen, setBackdropOpen] = useState(false);
    
    const [dialogOpen, setDialogOpen] = useState(false);

    const { tutorials, setTutorials, deleteTutorial } = useContext(EditContext);
    
    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };    

    const handleDeleteTutorial = async () => {
        
        setBackdropOpen(true);
        const tutorialToDelete = tutorials[props.index];
        const res = await deleteTutorial(tutorialToDelete);
        
        setBackdropOpen(false);
        props.setSnackbarMessage(res.text);
        props.setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            return;
        } else {
            setTutorials(previousTuts=>{
                var prevTuts = _.clone(previousTuts);
                var filteredTuts = prevTuts.filter((val)=>(val !== tutorialToDelete));
                return filteredTuts
            });
        }
    } 
    
    const handleOpenEditTutorial = () => {
        setDialogOpen(true);
    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleCloseBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <EditTutorialDialog
                dialogOpen={dialogOpen} 
                setDialogOpenFunc={setDialogOpen} 
                tutorial={tutorials[props.index]}
            />

            <ListItem>
                <ListItemText
                    primary={tutorials[props.index].tutorialName}
                    secondary={
                        <React.Fragment>
                            {
                                tutorials[props.index].tutorialDescription===""?
                                <></>
                                :
                                <><i>{tutorials[props.index].tutorialDescription}</i><br/></>
                            }
                            <a 
                                href={tutorials[props.index].tutorialLink}
                                style={{color:"inherit", textDecoration:"inherit"}}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {tutorials[props.index].tutorialLink}
                            </a>
                        </React.Fragment>
                    }
                    style={{marginRight:"30px"}}
                />
                <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" onClick={handleOpenEditTutorial}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton size="small" edge="end" onClick={handleDeleteTutorial}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            
            {
                (props.index === tutorials.length-1)?
                <></>
                :
                <Divider component="li"/>
            }
        </>
    )
}