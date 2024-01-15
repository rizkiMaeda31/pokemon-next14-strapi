'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { TableT1, TableT3 } from '../../../../components/MyTable'
import { useEffect } from 'react'
import { getStrapiT1 } from '../../../../components/Axios'

export default function T3() {  
  // console.clear()
  // console.log('project rizki root process', process.env.mypokeapi)
  const url=`http://localhost:1337/api/pokemon-abilities?sort=id&pagination[page]=`

  return(<>
  <TableT3 url={url}/>
  </>
  )
}
