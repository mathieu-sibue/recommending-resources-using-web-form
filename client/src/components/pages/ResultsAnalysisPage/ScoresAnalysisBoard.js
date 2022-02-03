import React, { useContext, useState, useEffect } from "react";
import { Grid, Paper, Typography, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { ThemeScoreAnalysisItem } from "./ThemeScoreAnalysisItem";

import { EditContext } from "../../contexts/EditContext";
import { UserContext } from "../../contexts/UserContext";
import { FormContext } from "../../contexts/FormContext";


const average = (data) => {
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);
  
    var avg = sum / data.length;
    return avg;
};

const standardDeviation = (values) => {
    var avg = average(values);
    
    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
    
    var avgSquareDiff = average(squareDiffs);
  
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

const useStyles = makeStyles(theme => ({ 
    root: {
        width: '100%',
    },
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
    }
}));

export function ScoresAnalysisBoard(props) {

    const classes = useStyles();

    const { sectors } = useContext(UserContext);
    const { userResponsesScoresAndReco } = useContext(EditContext);
    const { themes } = useContext(FormContext);

    const [currentFilter, setCurrentFilter] = useState("Tous");
    const [themeMeanScores, setThemeMeanScores] = useState(null);
    const [themeStdScores, setThemeStdScores] = useState(null);

    var means = {}
    var stds = {}

    useEffect(() => {
        if (userResponsesScoresAndReco) {
            var scoreObjects;
            if (currentFilter === "Tous") {
                scoreObjects = userResponsesScoresAndReco.filter(
                    userResponse => userResponse.scoresAndReco !== null).map(
                    userResponse => userResponse.scoresAndReco.userScores
                );
            } else {
                scoreObjects = userResponsesScoresAndReco.filter(
                    userResponse => userResponse.scoresAndReco !== null && userResponse.user.sector === currentFilter).map(
                    userResponse => userResponse.scoresAndReco.userScores
                );
            }

            for (var theme of themes) {
                const themeScores = scoreObjects.map(scoreObj => scoreObj[theme]);
                means[theme] = average(themeScores);
                stds[theme] = standardDeviation(themeScores);
            }

            setThemeMeanScores(means);
            setThemeStdScores(stds);
        }
    }, [currentFilter])


    return (
        <Paper elevation={5} style={{width:"100%", padding:"30px"}}>
            <Grid
                container
                direction="row"
                justify="space-between"
                spacing={2}
            >
                <Grid item container md={8}>
                    <Typography component="h4" variant="h4">
                        Scores par secteur
                    </Typography>                    
                </Grid>
                
                <Grid item container md={4}>

                    <Autocomplete                       
                        options={[...sectors,"Tous"]}
                        getOptionLabel={(option) => option}
                        onChange={(event,value)=>{setCurrentFilter(value)}}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Secteur"
                                fullWidth
                                InputLabelProps={{
                                    ...params.InputLabelProps,
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    className: classes.floatingLabelFocusStyle
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        notchedOutline: classes.notchedOutline,
                                    },
                                    inputMode: "numeric",
                                    endAdornment: (
                                        <React.Fragment>
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    )
                                }}
                                style={{maxWidth:"250px",textAlign:"right"}}
                            />
                        )}
                    />

                </Grid>
            </Grid>
            
            {
                themeMeanScores === null || themeStdScores === null?
                <></>
                :
                <Typography style={{textAlign:"center"}}>
                    <b>{currentFilter}</b>&nbsp;
                    {
                        currentFilter === "Tous"?
                        <>({userResponsesScoresAndReco.filter(userResponse => userResponse.scoresAndReco !== null).length})</>
                        :
                        <>({userResponsesScoresAndReco.filter(userResponse => userResponse.user.sector === currentFilter && userResponse.scoresAndReco !== null).length})</>
                    }
                </Typography>
            }
            <br/>

            <div style={{margin:"auto"}}>
                {
                    themeMeanScores === null || themeStdScores === null?
                    <></>
                    :
                    <div className={classes.root}>
                        {
                            themes.map((theme,index) => {
                                return <ThemeScoreAnalysisItem
                                    key={index}
                                    theme={theme}
                                    sector={currentFilter}
                                    themeMeanScore={themeMeanScores[theme]}
                                    themeStdScore={themeStdScores[theme]}
                                />
                            })
                        }
                    </div>
                }
                
            </div>
        </Paper>
    )
}