import React from "react"
import { SignupForm } from "./SignupForm"



export function SignupContainer(props) {
    return (
        <div>
            <SignupForm {...props} />
        </div>
    )
}