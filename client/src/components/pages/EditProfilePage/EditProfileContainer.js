import React from "react"
import { EditProfileForm } from "./EditProfileForm"


export function EditProfileContainer(props) {
    return (
        <div>
            <EditProfileForm {...props}/>
        </div>
    )
}