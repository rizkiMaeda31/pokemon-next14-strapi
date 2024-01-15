'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { TableT1, TableT4 } from '../../../../components/MyTable'
import { useEffect } from 'react'
import { getStrapiT1, testStrapi } from '../../../../components/Axios'

export default function T4() {  
  // console.clear()
  // console.log('project rizki root process', process.env.mypokeapi)
  // useEffect(()=>{
  //   RunAxios()
  // },[])
  // const RunAxios=()=>{
  //   // // GetAll(host,endpoints)
  //   // // console.clear()
  //   // // getStrapiT1()
  //   testStrapi()
  // }

  return(<>
  <TableT4 url='http://localhost:1337/api/pokemons?sort=idx&populate=*&filters[pokemon_name][id][$null]=false&pagination[page]='/>
  </>
  )
}
