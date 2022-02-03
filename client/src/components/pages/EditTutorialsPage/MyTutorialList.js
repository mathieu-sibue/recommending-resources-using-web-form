import React, { useContext, useState } from "react";
import { Paper, Grid, Typography, List, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TutorialItem } from "./TutorialItem";

import { EditContext } from "../../contexts/EditContext";


export function MyTutorialList(props) {

    const isWindowSizeBelowSm = props.windowHook;

    const { tutorials } = useContext(EditContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseSnackbar = (event) => {
        setSnackbarOpen(false);
    }

    return (
        <>
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

            <Grid item xs={10} sm={9} md={8} xl={6} style={{margin:"auto"}}>
                <Paper 
                    elevation={5} 
                    style={{maxWidth: isWindowSizeBelowSm()? "90vw": "70vw", margin: "auto", marginTop: "30px", padding: "28px 28px 28px 28px"}}
                >
                    <Typography component="h4" variant="h4">
                        Tutoriels
                    </Typography>
                    <List>
                        {
                            tutorials.map((tutorial, index)=>{
                                return <TutorialItem key={index} index={index} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage}/>
                            })
                        }
                    </List>
                </Paper>
            </Grid>        
        </>
    )
}