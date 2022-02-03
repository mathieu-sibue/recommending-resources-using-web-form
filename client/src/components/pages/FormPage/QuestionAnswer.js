import React from "react"
import { makeStyles, TableCell, TableRow } from "@material-ui/core"
import MyStepper from "../../basicComponents/MyStepperSolidaForm";



const useStyles = makeStyles(theme => ({
    cellFont: {
        fontWeight:"bold",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1em !important",
      }
    }
}
));

export function QuestionAnswer(props) {
    const classes = useStyles();

    return (
        <TableRow>
            <TableCell style={{paddingLeft:"4.5%"}}>
                <div className={classes.cellFont}>
                    {props.question.questionText}
                </div>
            </TableCell>
            <TableCell>
                <MyStepper question={props.question}/>
            </TableCell>
        </TableRow>  
    )
}



