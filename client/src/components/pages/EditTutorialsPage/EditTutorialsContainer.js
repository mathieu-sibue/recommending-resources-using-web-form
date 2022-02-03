import React, { useEffect, useState, useContext } from "react";
import useWindowDimensions from "../../../customHooks/useWindowDimensions";
import { CircularProgress } from "@material-ui/core";
import { MyTutorialList } from "./MyTutorialList";

import { EditContext } from "../../contexts/EditContext";


export function EditTutorialsContainer() {

    const [isLoaded, setIsLoaded] = useState(false);

    const { fetchAllRessources } = useContext(EditContext);
    const { width } = useWindowDimensions();

    useEffect(()=>{
        fetchAllRessources().then(()=>setIsLoaded(true));
    }, [])

    const isWindowSizeBelowSm = () => {
        if (width < 1100) {
          return true
        } else {
          return false
        };
    };


    return (
        <>
            {
                isLoaded?
                <div
                    style={{marginTop: isWindowSizeBelowSm()?"90px":"100px", marginBottom: isWindowSizeBelowSm()?"110px":"180px", /*overflowY: "scroll"*/}}
                > 
                    <MyTutorialList windowHook={isWindowSizeBelowSm}/>              
                </div>                     
                :
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop: "50vh", transform: "translateY(-50%)"}}>
                    <CircularProgress disableShrink style={{margin: "auto", color:"rgb(144, 208, 88)"}}/>
                </div>    
            }
        </>
    )
}