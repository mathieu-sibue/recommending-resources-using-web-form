import React from "react";
import { MyIndividualResultsList } from "./MyIndividualResultsList";
import { Grid } from "@material-ui/core";
import { ScoresAnalysisBoard } from "./ScoresAnalysisBoard";
import { UsageAnalysisBoard } from "./UsageAnalysisBoard";


export function ResultsAnalysisContent(props) {


    return (
        <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={1}
        >
            <Grid 
                item 
                xs={10} sm={9} md={8}
                container
                direction="row"
                justify="center"
                spacing={1}
            >
                <Grid item container sm={6}>
                    <ScoresAnalysisBoard/>
                </Grid>
                <Grid item container sm={6}>
                    <UsageAnalysisBoard/>
                </Grid>
                
            </Grid>

            <Grid 
                item 
                container 
                xs={10} sm={9} md={8}
                style={{padding:"8px"}}
            >
                <MyIndividualResultsList windowHook={props.windowHook}/>
            </Grid>
        </Grid>

    )
}