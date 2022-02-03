import React, { useContext } from "react"
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, makeStyles, Hidden } from "@material-ui/core"
import MyStepper from "../../basicComponents/MyStepperSolidaForm"
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import InputIcon from '@material-ui/icons/Input'
import CustomizedDialog from "../../basicComponents/MyModalSolidaForm"
import useWindowDimensions from "../../../customHooks/useWindowDimensions"

import { FormContext } from '../../contexts/FormContext'


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    cellFontHead: {
        fontWeight:"bold",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.2em !important",
      }
    },
    cellFont: {
        fontWeight:"bold",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1em !important",
      }
    }
}
));


export function SolidaFormContainer(){
    const { themes, currentThemeNb } = useContext(FormContext);
    const classes = useStyles();
    const { width } = useWindowDimensions();

    const isWindowSizeBelowSm = () => {
        if (width < 1100) {
          return true
        } else {
          return false
        }
    }

    return (
        <>
            <div 
                classNames={"SolidaFormPage", classes.root} 
                style={{marginTop: isWindowSizeBelowSm()?"90px":"100px", marginBottom: isWindowSizeBelowSm()?"110px":"180px", overflowY: "scroll"}}
            >

                <CustomizedDialog/>

                <div style={{margin:"auto", textAlign:"center", fontSize:isWindowSizeBelowSm()?"1.2em":"2em", fontWeight:"bold"}}>{themes[currentThemeNb]}</div>

                <TableContainer component={Paper} style={{maxWidth: isWindowSizeBelowSm()? "90vw": "70vw", margin:"auto", marginTop: "30px"}}>
                    <Table>
                        <TableHead>
                            <TableRow style={{backgroundColor: "#90d058"}}>
                                <TableCell align="center">
                                    <div style={{color:"white", fontSize:"1.5em"}} className={classes.cellFontHead}>
                                        <nobr>Nos questions <Hidden smDown><QuestionAnswerIcon style={{verticalAlign:"middle"}}/></Hidden></nobr>
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <div style={{color:"white", fontSize:"1.5em"}} className={classes.cellFontHead}>
                                        <nobr>Vos réponses <Hidden smDown><InputIcon style={{verticalAlign:"middle"}}/></Hidden></nobr>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{paddingLeft:"4%"}}>
                                    <div className={classes.cellFont}>
                                        Utilisez-vous des outils de bureautique au <nobr>quotidien ?</nobr>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <MyStepper/>
                                </TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell style={{paddingLeft:"4%"}}>
                                    <div className={classes.cellFont}>
                                        Possédez-vous des licences de logiciels de <nobr>gestion ?</nobr>
                                    </div>
                                    
                                </TableCell>
                                <TableCell>
                                    <MyStepper/>
                                </TableCell>
                            </TableRow>    
                            <TableRow>
                                <TableCell style={{paddingLeft:"4%"}}>
                                    <div className={classes.cellFont}>
                                        Avez-vous déjà fait usage d'un outil de gestion de <nobr>projet ?</nobr>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <MyStepper/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{paddingLeft:"4%"}}>
                                    <div className={classes.cellFont}>
                                        Possédez-vous des unités centrales de la marque <nobr>Dell ?</nobr>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <MyStepper/>
                                </TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell style={{paddingLeft:"4%"}}>
                                    <div className={classes.cellFont}>
                                        Possédez-vous des unités centrales de la marque <nobr>HP ?</nobr>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <MyStepper/>
                                </TableCell>
                            </TableRow>                      
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}