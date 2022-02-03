import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"


export default function SimpleAuthRoute({ component: Component, path, ...rest }) {
    const { user } = useContext(UserContext);



    return (
        <Route
            {...rest}
            render={props => {
                return user === null?
                    path === "/diagnostic"?
                        <Redirect to={{ pathname: "/login", state: "redirectToFormAfterConnection" }} />                 
                        :
                        <Redirect to="/" /> 
                    :
                    (!user.isAdmin)?
                        <Component {...props} />                        
                        :
                            <Redirect to="/home" />                           
            }}
        />
    )
}