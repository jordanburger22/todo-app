import { createContext, useContext } from 'react'
import { useAuth } from '../hooks';


const UserContext = createContext()


const UserProvider = ({children}) => {

    const userAPI = useAuth()


    return ( 
        <UserContext.Provider value={{userAPI}}>
            {children}
        </UserContext.Provider>
     );
}
 
export default UserProvider;

export const useUserContext = () => useContext(UserContext)