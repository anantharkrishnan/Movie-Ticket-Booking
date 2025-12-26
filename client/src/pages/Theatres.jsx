import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../axiosInstance'
import { Link } from 'react-router-dom'

const Theatres = () => {
  const[theatres,setTheatres]=useState([])
  const[loading,setLoading]=useState(false)

  useEffect(()=>{
    setLoading(true)
    axiosInstance.get("theatre/alltheatres").then((res)=>{
      console.log(res.data.data);
      setTheatres(res.data.data)
      setLoading(false)
      
    }).catch((error)=>{
      console.log(error);
      setLoading(false)
      
    })

  },[])
  return (
    <div>
      <h2 className=' text-3xl text-white ms-1.5  my-10 text-center'>Theatres</h2>
      <ul>
        {theatres.map((t)=>(
          <li key={t._id}>
          
            <div className='border p-4 mx-9 text-white my-4 text-center rounded-3xl '>
            <h3 className='text-2xl font-bold '>{t.name}</h3>
            <p className='text-lg '>{t.location}</p>
              </div>
             
          </li>
        ))}
      </ul>
      
    </div>
    
  )
}

export default Theatres