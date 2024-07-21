import { createContext, useContext, useEffect } from "react";
import { useFetch } from "./hooks/use_fetch";
import { getCurrentuser } from "./db/apiAuth";

const UrlContext = createContext()

const UrlProvider = ({children})=>{
    const {data : user , loading , fn : fetchuser} = useFetch(getCurrentuser)

    const isAuthenticated = user?.role === "authenticated"

    useEffect(()=>{
        fetchuser()
    },[])

    return <UrlContext.Provider value={{user , fetchuser , loading , isAuthenticated}}>{children}</UrlContext.Provider>
}

export const UrlState = ()=>{
    return useContext(UrlContext);
}

export default UrlProvider