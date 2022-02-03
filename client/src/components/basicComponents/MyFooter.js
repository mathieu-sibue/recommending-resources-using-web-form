import React, { useContext } from "react"
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core"
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import LanguageIcon from '@material-ui/icons/Language';
import MyFormNavStepper from './MyFormNavStepper';
import MyFloatingActionButtons from './MyFloatingActionButtons'

import { UserContext } from "../contexts/UserContext";


export default function MyFooter(props) {

    const { user } = useContext(UserContext)

    if (window.location.pathname === "/results") {
        return <></>
    }
    return (
        <>
            {
                ((window.location.pathname).substr(0,5) === "/edit") && (user) && (user.isAdmin === true)?
                <MyFloatingActionButtons/>
                :
                    window.location.pathname === "/all_results"?
                    <></>
                    :
                    <div className="Footer">
                    {
                        window.location.pathname !== "/diagnostic"?
                        <BottomNavigation>
                            <BottomNavigationAction href="https://www.solidatech.fr/" label="Website" icon={<LanguageIcon />} />
                            <BottomNavigationAction href="https://www.facebook.com/Solidatech/" label="Facebook" icon={<FacebookIcon />} />
                            <BottomNavigationAction href="https://twitter.com/solidatech" label="Twitter" icon={<TwitterIcon />} />          
                        </BottomNavigation>
                        :
                        <MyFormNavStepper/>
                    }
                    </div>  
            }      
        </>

    )
}