import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import StepButton from '@material-ui/core/StepButton';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import useWindowDimensions from '../../customHooks/useWindowDimensions';

import { FormContext } from "../contexts/FormContext";



function MyRadioButtonCheckedIcon(props) {
  return <RadioButtonCheckedIcon style={{color: "#90d058"}} {...props}></RadioButtonCheckedIcon>
}

function MyRadioButtonUncheckedIcon(props) {
  return <RadioButtonUncheckedIcon style={{color: "lightgrey"}} {...props}></RadioButtonUncheckedIcon>
}


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  cellFont: {
    fontWeight:"bold",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.85em",
  }
}
}));



function getSteps() {
  return ['Je ne sais pas', 'Non et je ne pense pas en avoir besoin', 'Non et je pense en avoir besoin', "C'est en cours", "Oui"];
}



export default function MyStepper(props) {
  const classes = useStyles();
  const { modifyRes } = useContext(FormContext);
  const [activeStep, setActiveStep] = React.useState(props.question.response);
  const { width } = useWindowDimensions();
  
  const steps = getSteps();

  useEffect(()=>{
    setActiveStep(props.question.response);
  }, [props.question]);

  const handleStep = step => () => {
    modifyRes(props.question._id, step);
    setActiveStep(step);
  };

  const showActiveIcon = (index) => {
    if (index === activeStep) {
      return MyRadioButtonCheckedIcon
    } else {
      return MyRadioButtonUncheckedIcon
    }
  }

  const isWindowSizeBelowSm = () => {
    if (width < 800) {
      return true
    } else {
      return false
    }
  }


  return (
    <div className={classes.root} style={{minWidth: "50vw"}}>
      <Stepper 
        alternativeLabel={!isWindowSizeBelowSm()} 
        nonLinear
        connector={isWindowSizeBelowSm()? false: <StepConnector/>} 
        orientation={isWindowSizeBelowSm()? 'vertical': 'horizontal'}
        activeStep={activeStep}
      >

        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};

          return (
            <Step 
              key={label} 
              {...stepProps}
            >
              <StepButton
                onClick={handleStep(index)}
                {...buttonProps}
              >
                <StepLabel 
                  style={{textAlign: isWindowSizeBelowSm()? "left": "center"}}
                  StepIconComponent={showActiveIcon(index)}
                >
                  <div className={classes.cellFont}>
                    {label}
                  </div>
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}