import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"


export default function AdminRoute({ component: Component, ...rest }) {
    const { user } = useContext(UserContext);

    return (
        <Route
            {...rest}
            render={props => {
                return user === null?
                    <Redirect to="/"/>
                    :
                        user.isAdmin?
                        <Component {...props} />
                        :
                            <Redirect to="/home" />
            }}
        />
    )
}