import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getLongUrl } from '../db/apiUrls'
import { storeClicks } from '../db/apiClicks'
import { useFetch } from '../hooks/use_fetch' 
import { BarLoader } from "react-spinners";


const Redirect_Link = () => {

  const {id} = useParams()

  const {loading , data ,fn} = useFetch(getLongUrl , id);

  const {loading : loadingStats , fn : fnStats} = useFetch(storeClicks , {
    id : data?.id,
    originalUrl : data?.original_url
  })

  useEffect(()=>{
    fn()
  } , [])

  useEffect(()=>{
    if(!loading && data){
      fnStats()
    }
  } , [loading])


  if(loading || loadingStats){
    return (
      <>
        <BarLoader width={"100%"} color = "#36d7b7" />
        <br></br>
        Redirecting...
      </>
    )
  }

  return null

}

export default Redirect_Link