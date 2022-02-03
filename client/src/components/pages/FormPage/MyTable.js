import React, { useContext, useState, useEffect } from "react"
import { makeStyles, TableContainer, Paper, Table, TableBody, TableHead, TableCell, TableRow, Hidden } from "@material-ui/core"
import { FormContext } from "../../contexts/FormContext"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import InputIcon  from "@material-ui/icons/Input"
import { QuestionAnswer } from "./QuestionAnswer"


const useStyles = makeStyles(theme => ({
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


export function MyTable(props) {
    const isWindowSizeBelowSm = props.windowHook;
    const classes = useStyles();
    const { questAndRes, themes, currentThemeNb } = useContext(FormContext);

    function selectCurrentThemeQuestions(allQuestions) {
        var currentThemeQuestions = [];
        for (var key in allQuestions) {
            let question = allQuestions[key];
            if (question.theme === themes[currentThemeNb]) {
                currentThemeQuestions.push(question)
            }
        };
        currentThemeQuestions = currentThemeQuestions.sort((quest1,quest2)=>{
            return quest1.order-quest2.order
        })
        return currentThemeQuestions
    }

    const [questionsToDisplay, setQuestionsToDisplay] = useState(selectCurrentThemeQuestions(questAndRes));

    useEffect(()=>{
        const currentThemeQuestions = selectCurrentThemeQuestions(questAndRes);
        setQuestionsToDisplay(currentThemeQuestions);
    }, [currentThemeNb]);

    return (
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
                    {
                        questionsToDisplay.map((question, index)=>{
                            return <QuestionAnswer question={question} key={index}/>
                        })
                    }
                </TableBody>

            </Table>

        </TableContainer>
    )
}