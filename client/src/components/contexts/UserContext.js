import React, { createContext, useState, useEffect } from "react"
import userRequests from "../../APIrequests/userRequests"
import { CircularProgress } from "@material-ui/core"


export const UserContext = createContext();

export function UserContextWrapper({ children }) {

    const sectors = [
        'Social',
        'Santé',
        'Humanitaire',
        'Culture',
        'Environnement',
        'Sport',
        'Loisirs',
        'Jeunesse & éducation populaire',
        'Autre'
    ]

    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=>{
        async function retrieveUser(token) {
            if (token !== null) {
                const userInfo = await userRequests.getUserInfo(token);
                setUser(userInfo);
            };          
        }   
        const token = localStorage.getItem("token");
        retrieveUser(token).then(()=>setIsLoaded(true));
    }, [])

    return (
        <div>
            {
                isLoaded?
                <UserContext.Provider value={{
                    user,
                    sectors,
                    setUser
                }}>
                    {children}
                </UserContext.Provider>:

                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop: "50vh", transform: "translateY(-50%)"}}>
                        <CircularProgress disableShrink style={{margin: "auto", color:"rgb(144, 208, 88)"}}/>
                    </div>
            }            
        </div>

    )
}