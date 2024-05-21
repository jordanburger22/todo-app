import { useState } from "react";
import { signinRequest, signupRequest } from "./http";



export const useAuth = () => {

    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        todos: '',
        errMsg: ''
    }

    const [userState, setUserState] = useState(initState)

    const signup = async (creds) => {
        try {
            const response = await signupRequest(creds);
            const { user, token } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setUserState((prevUserState) => ({
                ...prevUserState,
                user,
                token,
            }));
        } catch (err) {
            console.log(err)
            handleAuthErr(err.response.data.errMsg)
        }
    }

    const signin = async (creds) => {
        try {
            const response = await signinRequest(creds)
            const {user,  token} = response.data

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setUserState((prevUserState) => ({
                ...prevUserState,
                user,
                token,
            }));
        } catch (err) {
            console.log(err)
            handleAuthErr(err.response.data.errMsg)
        }
    }


    const handleAuthErr = (errMsg) => {
        setUserState(prevUserState => ({
            ...prevUserState,
            errMsg
        }))
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            issues: []
        })
    }

    const resetAuthErr = () => {
        setUserState(prev => ({
            ...prev,
            errMsg: ''
        }))
    }

    return {
        ...userState,
        signup,
        signin,
        logout,
        resetAuthErr
    }
}