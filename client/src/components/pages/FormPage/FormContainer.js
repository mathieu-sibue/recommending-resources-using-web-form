import React, { useContext, useEffect, useState } from "react"
import CustomizedDialog from "../../basicComponents/MyModalSolidaForm"
import UnansweredDialog from "../../basicComponents/MyModalUnansweredSolidaForm"
import { makeStyles } from "@material-ui/core"
import { MyTable } from "./MyTable"
import useWindowDimensions from "../../../customHooks/useWindowDimensions"
import { CircularProgress } from "@material-ui/core"

import { FormContext } from '../../contexts/FormContext'


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    }
}
));


export function FormContainer(props){
    const { themes, currentThemeNb, retrieveQuestions, alreadyModified, unanswered } = useContext(FormContext);
    const classes = useStyles();
    const { width } = useWindowDimensions();
    const [isLoaded, setIsLoaded] = useState(false);

    const isWindowSizeBelowSm = () => {
        if (width < 1100) {
          return true
        } else {
          return false
        }
    }

    
    useEffect(()=>{
        async function getQuestions() {
            await retrieveQuestions();
            await setIsLoaded(true);
        }
        getQuestions();
    }, []);


    return (
        <div>
            {
                isLoaded?
                <div 
                    className={"SolidaFormPage", classes.root} 
                    style={{marginTop: isWindowSizeBelowSm()?"90px":"100px", marginBottom: isWindowSizeBelowSm()?"110px":"190px", overflowY: "scroll"}}
                >

                    {
                        alreadyModified?
                        <></>
                        :
                        <CustomizedDialog/>
                    }


                    {
                        (unanswered !== null)?
                        <UnansweredDialog/>
                        :
                        <></>
                    }

                    <div style={{margin:"auto", textAlign:"center", fontSize:isWindowSizeBelowSm()?"1.1em":"2em", fontWeight:"bold", /*color:'white'*/}}>
                        {themes[currentThemeNb]}
                    </div>

                    <MyTable windowHook={isWindowSizeBelowSm}/>

                </div>
                :
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop: "50vh", transform: "translateY(-50%)"}}>
                    <CircularProgress disableShrink style={{margin: "auto", color:"rgb(144, 208, 88)"}}/>
                </div>
            }            
        </div>

    )
}