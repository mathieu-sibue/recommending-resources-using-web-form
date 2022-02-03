import React, { useState, useContext } from "react";
import { Paper, List, Typography, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { IndividualResultsItem } from "./IndividualResultsItem";

import { EditContext } from "../../contexts/EditContext";


export function MyIndividualResultsList(props) {

    const { userResponsesScoresAndReco } = useContext(EditContext);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseSnackbar = (event) => {
        setSnackbarOpen(false);
    }

    return (
        <Paper 
            elevation={5} 
            style={{margin: "auto", padding: "28px 28px 28px 28px", width:"100%"}}
        >

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

            <Typography component="h4" variant="h4">
                Réponses individuelles
            </Typography>

            <List>
                {
                    userResponsesScoresAndReco.reverse().map((individualResults,index)=>{
                        return <IndividualResultsItem 
                            key={index} 
                            index={index} 
                            individualResults={individualResults} 
                            windowHook={props.windowHook}
                            setSnackbarMessage={setSnackbarMessage}
                            setSnackbarOpen={setSnackbarOpen}
                        />
                    })
                }
            </List>
        </Paper>
    )
}