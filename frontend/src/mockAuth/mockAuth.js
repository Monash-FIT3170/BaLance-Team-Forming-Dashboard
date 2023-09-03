import { useState } from "react";


export function MockAuth() {
    
    const [authenticated, setAuthenticate] = useState(true);
    const [accessToken, setAccessToken] = useState("0000")

    function isAuthenticated() {
        return authenticated;
    }

    function loginWithRedirect() {
        setAuthenticate(true)
        return authenticated;
    }

    async function getAccessTokenSilently(){
        return accessToken;
    }

    function logout() {
        setAuthenticate(false)
        return authenticated;
    }
    
    return {
        isAuthenticated,
        loginWithRedirect,
        getAccessTokenSilently,
        logout
    }
}