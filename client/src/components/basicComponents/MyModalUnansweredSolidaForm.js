import React, { useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { FormContext } from "../contexts/FormContext";


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

const useStyles = makeStyles(() => ({
  bodyTextDialog: {
    fontFamily: "Rubik",
    fontSize: "1em"
  }
}));

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


export default function UnansweredDialog() {
  const { unanswered, setUnanswered } = useContext(FormContext);
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  const handleClose = async () => {
    setOpen(false);
    await setUnanswered(null);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" style={{textAlign:"center"}}>
          Vous n'avez pas répondu à toutes les <nobr>questions !</nobr>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom className={classes.bodyTextDialog}>
            Vous n'avez pas répondu à {unanswered.length} questions du questionnaire, dans les thèmes :
            <ul>
                {
                    [...(new Set(unanswered))].map((theme, index)=>{
                        return <li key={index}>{theme}</li>
                    })

                }
            </ul>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color: "#90d058"}}>
            Répondre aux questions restantes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}