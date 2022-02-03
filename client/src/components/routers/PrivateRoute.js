import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"


export default function PrivateRoute({ component: Component, ...rest }) {
    const { user } = useContext(UserContext);

    return (
        <Route
            {...rest}
            render={props => {
                return user === null?
                    <Redirect to="/"/>
                    :
                        <Component {...props} />
            }}
        />
    )
}