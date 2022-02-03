import React, { useEffect, useState } from "react"
import { TextField, makeStyles, InputAdornment } from '@material-ui/core';


const useStyles = makeStyles(theme => ({ 
    cssLabel: {
      color: '#90d058 !important'
    },
    floatingLabelFocusStyle: {
        color: '#90d058 !important'
    },
    cssFocused: {
    },
    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        borderColor: '#90d058 !important',
      }
    },  
    notchedOutline: {
      borderWidth: '1px',
    },
  })
);


export default function MyTextFieldSignUp(props) {
    var [error, setError] = useState(props.error);

    const classes = useStyles();

    var helperText;

    // at each render, the switch conditions are explored because the useEffect on the error state (which listens to the prop error) will force a re-render of the component
    switch (props.id) {
        case "email":
            if (props.emailAlreadyTaken) {
                helperText = "Un compte avec cet email existe déjà"
            } else if (!props.emailWrongFormat) {
                helperText = "Un email est requis";
            } else {
                helperText = "Adresse email non valide";                
            };
            break
        case "password":
            helperText = "Un mot de passe est requis";
            break
        case "cpassword":
            helperText = "La confirmation doit être identique au mot de passe";
            break
        case "company":
            if (props.companyAlreadyFiled) {
                helperText = "Un compte avec cette association existe déjà"
            } else {
                helperText = "Une association doit être renseignée";                
            };
            break
        default:
            break
    }
    
    
    useEffect(() => {
        setError(props.error)
    }, [props.error])
  

    return (
        <TextField
            id={props.id}
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            autoFocus={props.autoFocus} 
            name={props.name}  
            type={props.type} 
            fullWidth
            helperText={error ? helperText: ""}
            error={error}
            variant="outlined"
            InputLabelProps={{
                classes: {
                    root: classes.cssLabel,
                    focused: classes.cssFocused,
                },
                className: classes.floatingLabelFocusStyle
            }}
            InputProps={{
                classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                },
                inputMode: "numeric",
    
                endAdornment: (
                      <InputAdornment>
                        {props.inputIcon}
                      </InputAdornment>
                    )
            }}
        />
    )
}