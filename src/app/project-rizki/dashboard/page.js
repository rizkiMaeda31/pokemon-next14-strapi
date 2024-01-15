'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { DownloadData, GetAll } from '../../../../components/Axios'
import { mynavbar } from '../../../../components/MyNavBar'
import { MyPlainTable, ShowDataNames } from '../../../../components/MyTable'

export default function Dashboard() {
  const root=<><p>Dashboard</p></>
  // const mypokeapi=process.env.host_mypokeapi
  // const pokeapi=process.env.host_pokeapi
  // const endpoints=process.env.mypokeapi.split(',')
  // console.clear()
  // console.log('d process', mypokeapi)
  // console.log('d process2', endpoints)
  
  useEffect(() => {
    // RunAxios()
  }, [])

  const RunAxios=()=>{
    // GetAll(host,endpoints)
    console.clear()
    DownloadData()
  }
  const columns_names=[
    {key:"icon", label:"Icon"},
    {key:"name", label:"Name"},
    {key:"sprites", label:"Sprites"},
    {key:"HP", label:"HP"},
    {key:"Attack", label:"Attack"},
    {key:"Defense", label:"Defense"},
    {key:"Special Attack", label:"Special Attack"},
    {key:"Special Defense", label:"Special Defense"},
    {key:"Speed", label:"Speed"},
    {key:"Action", label:"Action"}
]
  return (
    <>
    {/* {ShowData({offset:0, table:'pokemon'})} */}
    {/* <MyPlainTable></MyPlainTable> */}
    {/* <main>
      <div>{mynavbar}</div><br/>
      <ShowDataNames columns={columns_names} offset={0} table="pokemon" />
    </main> */}
    </>
  )
}
