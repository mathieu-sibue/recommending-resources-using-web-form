import React, { useState } from "react"
import { Fab, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AddQuestionDialog from './MyModalAddQuestion'
import AddTutorialDialog from "./MyModalAddTutorial"
import AddProductDialog from "./MyModalAddProduct"


const style = {
    margin: 0,
    top: 'auto',
    right: "8%",
    bottom: "6%",
    left: 'auto',
    position: 'fixed',
};

export default function MyFloatingActionButtons() {

    const [dialogOpen, setDialogOpen] = useState(false);

    if (window.location.pathname === "/edit_questions") {
        return (
            <>
                <AddQuestionDialog
                    dialogOpen={dialogOpen} 
                    setDialogOpenFunc={setDialogOpen} 
                />

                <div style={style}>
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        justify="center"
                    >
                        <Grid
                            item
                        >
                            <Fab style={{backgroundColor:"#90d058", color:"white"}}>
                                <AddIcon onClick={()=>setDialogOpen(true)}/>
                            </Fab>
                        </Grid>

                    </Grid>
                </div>            
            </>
        )
    }
    if (window.location.pathname === "/edit_tutorials") {
        return (
            <>
                <AddTutorialDialog
                    dialogOpen={dialogOpen} 
                    setDialogOpenFunc={setDialogOpen} 
                />

                <div style={style}>
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        justify="center"
                    >
                        <Grid
                            item
                        >
                            <Fab style={{backgroundColor:"#90d058", color:"white"}}>
                                <AddIcon onClick={()=>setDialogOpen(true)}/>
                            </Fab>
                        </Grid>

                    </Grid>
                </div>            
            </>
        )
    } else {
        return (
            <>
                <AddProductDialog
                    dialogOpen={dialogOpen} 
                    setDialogOpenFunc={setDialogOpen} 
                />

                <div style={style}>
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        justify="center"
                    >
                        <Grid
                            item
                        >
                            <Fab size="large" style={{backgroundColor:"#90d058", color:"white"}}>
                                <AddIcon onClick={()=>setDialogOpen(true)}/>
                            </Fab>
                        </Grid>

                    </Grid>
                </div>            
            </>            
        )
    }
}