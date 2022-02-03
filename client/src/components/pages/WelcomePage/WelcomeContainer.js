import React from "react"
import { Link } from "react-router-dom"
import { Grid, Button, makeStyles } from "@material-ui/core"
import BuildIcon from '@material-ui/icons/Build'
import useWindowDimensions from "../../../customHooks/useWindowDimensions"


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "10em",
        [theme.breakpoints.down("sm")]: {
            borderRadius: "5em",
            fontSize: "0.5em !important",
        }
    },
    addBottomMargin: {
        [theme.breakpoints.down("sm")]: {
            marginBottom: "20% !important"
        }
    },
    }) 
);



export function WelcomeContainer(props) {
    const classes =  useStyles();
    const { height } = useWindowDimensions();

    const isWindowSizeBelowSm = () => {
        if (height < 750) {
          return true
        } else {
          return false
        }
    }

    return (
        <div className="HomePage" style={{display:'flex', justifyContent:'center'}}>
            <Grid
                container
                spacing={isWindowSizeBelowSm()? 0.5: 3}
                direction="column"
                alignItems="center"
                justify="center"
                style={{margin:"auto"}}
            >

                <Grid item style={{margin:"auto", marginTop:"8%"}} xs={10}>
                    <h1 style={{fontSize:isWindowSizeBelowSm()? "2.2em": "2.5em"}}>
                        Evaluez la maturité de votre <nobr>association !</nobr>
                    </h1>
                </Grid>

                <Grid item style={{margin:"auto", marginBottom:"1%"}} xs={9} sm={6} md={4}>
                    <h3 style={{fontWeight:"lighter", fontStyle:"italic"}}>
                        "Un questionnaire pour initier votre transformation numérique et recevoir des recommandations adaptées à votre situation."
                    </h3>
                </Grid>

                <Grid item style={{margin:"auto", marginBottom:"16%"}} xs={10} className={classes.buttonContainer}>
                    <Link className="Link" to="/diagnostic">
                        <Button 
                            variant="contained" 
                            size="large"
                            style={{backgroundColor:"#90d058", borderRadius: "8"}}
                            className={classes.button}
                            endIcon={<BuildIcon style={{color:"white", fontSize:"3em"}}/>}
                        >
                            <h3 style={{color:"white", fontSize: "2em"}}><b><nobr>Lancer mon diagnostic</nobr></b></h3>
                        </Button>
                    </Link>
                </Grid>

            </Grid>
        </div>        
    )
}