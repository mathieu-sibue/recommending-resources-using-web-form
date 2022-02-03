import React from "react"
import { LoginForm } from "./LoginForm"


export function LoginContainer(props) {
    return (
        <div>
            <LoginForm {...props}/>
        </div>
    )
}