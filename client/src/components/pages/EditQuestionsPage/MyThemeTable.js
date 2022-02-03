import React, { useState, useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Paper, Typography, Grid, List, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { QuestionItem } from "./QuestionItem";
import _ from "lodash";

import { EditContext } from "../../contexts/EditContext";


export function MythemeTable(props) {

    const isWindowSizeBelowSm = props.windowHook;
    const { updateQuestions, questions, setQuestions } = useContext(EditContext);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination) {
            return
        }
        if (
           destination.droppableId === source.droppableId &&   
           destination.index === source.index         
        ) {
            return
        }
        const theme = source.droppableId;
        var themeQuestions = _.clone(questions[theme]);
        const [removedQuestion] = themeQuestions.splice(source.index,1);
        themeQuestions.splice(destination.index,0,removedQuestion);
        for (var i = 0; i < themeQuestions.length; i++) {
            themeQuestions[i].order = i+1;
        };
        setQuestions(previousQuestions => {
            var prevQuestions = _.clone(previousQuestions);
            prevQuestions[theme] = themeQuestions;
            return prevQuestions
        });
        await updateQuestions(themeQuestions);
    };

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

            <Grid item xs={11} sm={9} md={8} style={{margin:"auto"}}>
                <Paper 
                    elevation={5} 
                    style={{maxWidth: isWindowSizeBelowSm()? "90vw": "70vw", margin: "auto", marginTop: "30px", padding: "28px 28px 28px 28px"}}
                >
                    <Typography component="h4" variant="h4">
                        {props.theme}
                    </Typography>
                    <br/>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId={props.theme}>
                            {
                                provided => (
                                    <List>
                                        <Grid
                                            container
                                            spacing={1}
                                            direction="column"
                                            justify="center"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {
                                                questions[props.theme].map((quest, index)=>{
                                                    return <QuestionItem question={quest} index={index} key={index} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage}/>
                                                })
                                            } 
                                            {provided.placeholder} 
                                        </Grid>
                                    </List>                                
                                )
                            }
                        </Droppable>
                    </DragDropContext>
                </Paper>
            </Grid>        
        </>

    )
}