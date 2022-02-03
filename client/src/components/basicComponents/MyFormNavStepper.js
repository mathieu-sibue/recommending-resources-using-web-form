import React, { useContext, useState } from 'react';
import { withRouter } from "react-router-dom"
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from "@material-ui/core/Button";
import IconButton  from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Grid from '@material-ui/core/Grid';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepConnector from '@material-ui/core/StepConnector';
import useWindowDimensions from "../../customHooks/useWindowDimensions"

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';
import EuroIcon from '@material-ui/icons/Euro';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { FormContext } from '../contexts/FormContext';


const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient(136deg, rgb(165, 220, 50) 0%, rgb(144, 208, 88) 50%, rgb(120, 180, 180) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <ContactMailIcon />,
    2: <VisibilityIcon />,
    3: <GroupIcon />,
    4: <EuroIcon />,
    5: <AccessibilityIcon />,
    6: <VpnLockIcon />,
    7: <AssignmentTurnedInIcon />
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));




function MyFormNavStepper(props) {
  const classes = useStyles();
  const { 
    questAndRes,
    themes, 
    incrementThemeNb, 
    decrementThemeNb, 
    currentThemeNb, 
    setCurrentThemeNb,
    setUnanswered
  } = useContext(FormContext);
  const [activeStep, setActiveStep] = useState(currentThemeNb);
  const steps = themes;
  const { width } = useWindowDimensions();


  const isWindowSizeBelowSm = () => {
    if (width < 1100) {
      return true
    } else {
      return false
    }
  }

  const handleNext = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    incrementThemeNb();
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    decrementThemeNb();
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSelectStep = (index) => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    setCurrentThemeNb(index);
    setActiveStep(index);
  };

  const handleSendResults = async () => {
    var unansweredQuestCount = 0;
    var themesList = [];
    for (var questionId in questAndRes) {
      const questAndResPair = questAndRes[questionId];
      if (questAndResPair.response === null) {
        unansweredQuestCount += 1;
        themesList.push(questAndResPair.theme)
      };
    };

    if (unansweredQuestCount>0) {
      await setUnanswered(themesList);
      return
    } else {
      props.history.push("/results")
    }
  }
  

  return (
    <div className={classes.root}>

        <Grid
            container
            direction="row"
            alignItems="center"
            justify="center"
        >

            <Grid item xs={2}>
              <IconButton 
                disabled={activeStep <= 0} 
                onClick={handleBack} 
                className={classes.button}
                style={{color:"white", backgroundImage:(activeStep<=0)?'linear-gradient(136deg, rgb(210,210,210) 0%, rgb(210,210,210) 50%, rgb(210,210,210) 100%)':'linear-gradient(136deg, rgb(165, 220, 50) 0%, rgb(144, 208, 88) 50%, rgb(120, 180, 180) 100%)'}}
              >
                <NavigateBeforeIcon/>
              </IconButton>                
            </Grid>

            {
              isWindowSizeBelowSm()?
              <Grid item>
                <nobr style={{textAlign:"center"}}>{currentThemeNb+1}/{steps.length}</nobr>
              </Grid>:
                <Grid item xs={8}>
                  <Stepper alternativeLabel nonLinear activeStep={activeStep} connector={<ColorlibConnector />}>
                      {steps.map((label, index) => (
                        <Step key={label}>
                            <StepButton onClick={() => handleSelectStep(index)}>
                              <StepLabel StepIconComponent={ColorlibStepIcon}/>
                            </StepButton>
                        </Step>                          
                      ))}
                  </Stepper>                
                </Grid>
            }


            <Grid item xs={2}>
              {
                activeStep <= steps.length-2?
                <IconButton
                    onClick={handleNext}
                    className={classes.button}
                    disabled={activeStep > steps.length-2} 
                    style={{color:"white", backgroundImage:'linear-gradient(136deg, rgb(165, 220, 50) 0%, rgb(144, 208, 88) 50%, rgb(120, 180, 180) 100%)',marginLeft:isWindowSizeBelowSm()?"5px":"0"}}
                >
                  <NavigateNextIcon/>
                </IconButton>    
                :
                <Button 
                  variant="contained" 
                  style={{backgroundColor:"rgb(144, 208, 88)", color:"white", marginLeft:isWindowSizeBelowSm()?"10px":"0"}}
                  onClick={handleSendResults}
                  endIcon={<SendIcon/>}
                >
                  Envoyer
                </Button>          
              }
              
            </Grid>

        </Grid>
    </div>
  );
};


export default withRouter(MyFormNavStepper);