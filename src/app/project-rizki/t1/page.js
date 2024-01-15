'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { TableT1 } from '../../../../components/MyTable'
import { useEffect } from 'react'
import { downloadAbility, downloadPokemon, downloadType, getStrapiT1, testStrapi } from '../../../../components/Axios'

export default function T1() {  
  // console.clear()
  // console.log('project rizki root process', process.env.mypokeapi)
  // const url=`http://localhost:1337/api/pokedexes?populate=*`
  
  const url=`http://localhost:1337/api/pokemon-names?sort=idx&populate=illustration&populate=cover&pagination[page]=`
  // useEffect(()=>{
  //   RunAxios()
  // },[])

  return(<>
  <TableT1 url={url}/>
  </>
  )
}
