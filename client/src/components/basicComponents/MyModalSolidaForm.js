import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';



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


export default function CustomizedDialog() {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" style={{textAlign:"center"}}>
          Bienvenue dans le questionnaire <nobr>Solidatech !</nobr>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom className={classes.bodyTextDialog}>
            Ce questionnaire se compose de 63 questions ax??es sur 7 th??mes du domaine du num??rique. 
            Il s'agit d'un outil permettant d'??valuer l'avancement de votre association dans l'optimisation des activit??s.
          </Typography>
          <Typography gutterBottom className={classes.bodyTextDialog}>
            Pr??voyez une vingtaine de minutes si vous souhaitez effectuer le diagnostic d'une traite.
            Sinon, il vous sera toujours possible de reprendre au m??me niveau d'avancement en vous reconnectant sur votre compte !
          </Typography>
          <Typography gutterBottom component={'span'} className={classes.bodyTextDialog} style={{color:"grey", fontSize:"0.9em"}}>
            <ul>
              <li>Solidatech, en sa qualit?? de responsable de traitement, est amen?? ?? collecter vos informations dans l'objectif de proposer un diagnostic num??rique pr??cis de votre association.</li>
              <li>Les donn??es collect??es ne seront partag??es avec aucun tiers et ne feront pas l'objet d'un usage commercial.</li>
              <li>Vous disposez d'un droit d'acc??s, de rectification et d'opposition ?? ce que leur donn??es fassent l'objet d'un traitement en contactant Solidatech aux coordonn??es suivantes : contact@solidatech.fr</li>
            </ul>
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color: "#90d058"}}>
            Commencer !
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}