import axios from 'axios'

export const signupRequest = async(creds) => {
    try {
        return await axios.post('/auth/signup', creds)
    } catch (err) {
        console.log(err)
    }
}


export const signinRequest = async(creds) => {
    try {
        return await axios.post('/auth/signin', creds)
    } catch (err) {
        console.log(err)
    }
}