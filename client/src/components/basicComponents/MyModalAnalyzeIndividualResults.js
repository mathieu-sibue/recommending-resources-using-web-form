import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles, Button } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MyIndividualResultsThemeSection from "./MyIndividualResultsThemeSection";

import { FormContext } from "../contexts/FormContext";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }
}));

export default function AnalyzeIndividualResultsDialog(props) {

    const userResponse = props.individualResults

    const classes = useStyles();

    const { themes } = useContext(FormContext);

    const handleClose = (event) => {
        props.setDialogOpenFunc(false); 
    }

    return (
        <Dialog
            open={props.dialogOpen}
            fullWidth={true}
            maxWidth="lg"
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
        >
            <DialogTitle id="alert-dialog-slide-title">Réponses de <nobr>{userResponse.user.company} :</nobr></DialogTitle>

            <DialogContent>
                <div className={classes.root}>
                    {
                        themes.map(theme => {
                            const themeResponsesList = userResponse.responses.filter(questResPair => {
                                return questResPair.question.theme === theme
                            });
                            return <MyIndividualResultsThemeSection 
                                key={theme} 
                                theme={theme} 
                                themeResponsesList={themeResponsesList} 
                                scoresAndReco={userResponse.scoresAndReco}
                            />
                        })
                    }
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} style={{color:"#90d058"}}>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    )
}