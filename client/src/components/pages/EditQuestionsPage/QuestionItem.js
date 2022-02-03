import React, { useState, useContext } from "react";
import { Card, Grid, IconButton, ListItem, ListItemSecondaryAction, ListItemText, CircularProgress, Backdrop, makeStyles } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditQuestionDialog from '../../basicComponents/MyModalEditQuestion';
import _ from 'lodash';

import { EditContext } from "../../contexts/EditContext";


const useStyles = makeStyles(theme => ({ 
    backdrop: {
        zIndex: theme.zIndex.drawer + 10000,
        color: "#90d058"
    }
})
);

export function QuestionItem(props) {

    const classes = useStyles();

    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);

    const { deleteQuestion, setQuestions, questions } = useContext(EditContext);

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    };    

    const handleDeleteQuestion = async () => {
        setBackdropOpen(true);
        const questionToDelete = questions[props.question.theme][props.question.order-1];
        var newQuestions;
        const themeQuestions = _.clone(questions[questionToDelete.theme]);
        var filteredQuestions = themeQuestions.filter((val)=>(val !== questionToDelete));
        for (let i=0; i<filteredQuestions.length; i++) {
            var question_i = filteredQuestions[i];
            question_i.order = i+1;
        };        
        newQuestions = filteredQuestions;

        const res = await deleteQuestion(questionToDelete, newQuestions);
        setBackdropOpen(false);
        props.setSnackbarMessage(res.text);
        props.setSnackbarOpen(true);
        if (res.text === "Erreur serveur") {
            return;
        } else {
            setQuestions(previousQuestions=>{
                var prevQuestions = _.clone(previousQuestions);
                prevQuestions[questionToDelete.theme] = newQuestions
                return prevQuestions
            });
        }
    }; 


    const handleOpenEditQuestion = () => {
        setDialogOpen(true);
    };

    return (
        <>  
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleCloseBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>

            <EditQuestionDialog 
                dialogOpen={dialogOpen} 
                setDialogOpenFunc={setDialogOpen} 
                question={questions[props.question.theme][props.question.order-1]}
            />


            <Draggable draggableId={(props.index).toString()} index={props.question.order-1}>
                {
                    (provided,snapshot) => (
                        <Grid 
                            item
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <Card 
                                style={{backgroundColor:snapshot.isDragging?"#90d058":"rgba(213,213,213,0.5)"}}
                            >
                                <ListItem>
                                    <ListItemText style={{paddingRight:"25px", color:snapshot.isDragging?"white":"black"}}>
                                        {(questions[props.question.theme][props.question.order-1]).questionText}
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton size="small" edge="end" onClick={handleOpenEditQuestion}>
                                            <EditIcon style={{color:snapshot.isDragging?"white":""}}/>
                                        </IconButton>
                                        <IconButton size="small" edge="end" onClick={handleDeleteQuestion}>
                                            <DeleteIcon style={{color:snapshot.isDragging?"white":""}}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Card>                
                        </Grid>                    
                    )
                }
            </Draggable>            
        </>

    )
}