import React, { useContext, useState } from "react";
import { ListItem, Divider, ListItemText, ListItemSecondaryAction, IconButton, Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from '@material-ui/icons/Search';
import AnalyzeIndividualResultsDialog from "../../basicComponents/MyModalAnalyzeIndividualResults";
import _ from 'lodash';

import { EditContext } from "../../contexts/EditContext";


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
})
);

export function IndividualResultsItem(props) {
    
    const individualResults = props.individualResults;

    const classes = useStyles();

    const { userResponsesScoresAndReco, setUserResponsesScoresAndReco, deleteUserResponse } = useContext(EditContext);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };    

    const handleDeleteUserResponse = async () => {
        
        setBackdropOpen(true);
        const userResponseToDelete = userResponsesScoresAndReco[props.index];
        const res = await deleteUserResponse(userResponseToDelete);
        
        setBackdropOpen(false);
        props.setSnackbarMessage(res.text);
        props.setSnackbarOpen(true)
        if (res.text === "Erreur serveur") {
            return;
        } else {
            setUserResponsesScoresAndReco(previousUserResponses=>{
                var prevUserResponses = _.clone(previousUserResponses);
                prevUserResponses = prevUserResponses.filter(userResponse => userResponse !== userResponseToDelete);
                return prevUserResponses
            });
        }
    } 

    const handleOpenAnalyzeIndividualResults = () => {
        setDialogOpen(true);
    }

    return (
        <>
            <AnalyzeIndividualResultsDialog
                dialogOpen={dialogOpen} 
                setDialogOpenFunc={setDialogOpen} 
                individualResults={props.individualResults}
            />

            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleCloseBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <ListItem>
                <ListItemText
                    primary={
                        <React.Fragment>
                            {individualResults.user.company}
                            {
                                (individualResults.scoresAndReco === null)?
                                <span style={{color:"grey", fontStyle:"italic", fontSize:"0.9em"}}> (en cours)</span>
                                :
                                ""
                            }
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <b>Secteur :</b> {individualResults.user.sector}<br/>
                            <b>Créé le :</b> {individualResults.createdAt.substring(8,10)}/{individualResults.createdAt.substring(5,7)}/{individualResults.createdAt.substring(0,4)} à {Number(individualResults.createdAt.substring(11,13))+2}h{individualResults.createdAt.substring(14,16)}<br/>
                            <b>Modifié en dernier le :</b> {individualResults.lastModified[individualResults.lastModified.length - 1].substring(8,10)}
                            /{individualResults.lastModified[individualResults.lastModified.length - 1].substring(5,7)}
                            /{individualResults.lastModified[individualResults.lastModified.length - 1].substring(0,4)} 
                            &nbsp;à {Number(individualResults.lastModified[individualResults.lastModified.length - 1].substring(11,13))+2}h{individualResults.lastModified[individualResults.lastModified.length - 1].substring(14,16)}<br/>
                        </React.Fragment>
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" onClick={handleOpenAnalyzeIndividualResults}>
                        <SearchIcon/>
                    </IconButton>
                    <IconButton size="small" edge="end" onClick={handleDeleteUserResponse}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            
            {
                (props.index === userResponsesScoresAndReco.length-1)?
                <></>
                :
                <Divider component="li"/>
            }
        </>
    )
}