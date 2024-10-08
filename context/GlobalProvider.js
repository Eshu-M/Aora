import { createContext,useContext,useState,useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext=()=>useContext(GlobalContext);

const GlobalProvider= ({children}) => {
    const [isLoggedIn, setIsLoggedIn]= useState(false);
    const [user, setUser]= useState(null);
    const [isLoading, setIsLoading]= useState(true);

    useEffect(()=> {
        getCurrentUser()
          .then((res)=> {
            if(res){
                setIsLoading(true);
                setUser(res);
            }else{
                setIsLoading(false);
                setUser(null);
            }
          }).catch((error) => {
            console.log(error);
          }).finally(() => {
            setIsLoading(false);
          })
    },[])
    return (
        <GlobalContext.Provider 
         value={{
            isLoading, setIsLoggedIn, isLoggedIn, user, setUser
         }}
        >
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalProvider;