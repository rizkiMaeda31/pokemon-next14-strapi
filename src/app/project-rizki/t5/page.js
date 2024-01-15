'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { TableT1 } from '../../../../components/MyTable'
import { useEffect } from 'react'
import { getStrapiT1 } from '../../../../components/Axios'

export default function T1() {  
  // console.clear()
  // console.log('project rizki root process', process.env.mypokeapi)
  useEffect(()=>{
    RunAxios()
  },[])
  const RunAxios=()=>{
    // GetAll(host,endpoints)
    // console.clear()
    getStrapiT1()
  }

  return(<>
  <TableT1 url=''/>
  </>
  )
}
