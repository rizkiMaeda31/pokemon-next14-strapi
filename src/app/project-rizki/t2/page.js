'use client'
import styles from './page.module.css'
import { TableT2 } from '../../../../components/MyTable'

export default function T2() {  
  // console.clear()
  // console.log('project rizki root process', process.env.mypokeapi)
  const url=`http://localhost:1337/api/pokemon-types?sort=id&pagination[page]=`

  return(<>
  <TableT2 url={url}/>
  </>
  )
}
