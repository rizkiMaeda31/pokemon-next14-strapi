'use client'
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { TryAxios, createStrapiT1, createStrapiT2, createStrapiT3, createStrapiT4, deleteStrapiT1, deleteStrapiT2, deleteStrapiT3, deleteStrapiT4, downloadAbility, downloadPokemon, downloadType, getStrapiT1, getStrapiT2, getStrapiT3, getStrapiT4, putStrapiT1, putStrapiT2, putStrapiT3, putStrapiT4, testStrapi } from "./Axios"
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Input, Button, Divider, ButtonGroup, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, CardHeader, CardBody, CardFooter, Card, BreadcrumbItem, Breadcrumbs, Popover, PopoverTrigger, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import axios from "axios";

export const MyPlainTable=()=>{
    const [myaxios, setAxios]=useState([])

    useEffect(()=>{
        TryAxios().then(data=>setAxios(data)).catch(err=>console.log('err10', err.message))
    },[])
    const empty=<><h1 style={{paddingLeft:"43%",paddingTop:"20%"}}>NO DATA</h1></>
    const td=<><th>Key</th><th>Value</th></>
    const table=<><table>
                        <thead ><tr>{td}</tr></thead>
                        <tbody>
                            {
                                Object.entries(myaxios).map(([key,value])=>(
                                    <tr key={key}><td>{key}</td><td>{value}</td></tr>
                                ))
                            }
                        </tbody>
                  </table></>
    
    return(<>
    {/* {JSON.stringify(myaxios)} */}
    {}
    {myaxios?table:empty}
    </>)
}

export const ShowDataNames=(props)=>{
    // console.log(['props.offset', props.offset, "-", props.table])
    const [data,setdata]=useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [loading, isLoading]=useState(false)
    const [pageTotal, setCount]=useState(0)
    const pages=Math.ceil((pageTotal!=0?pageTotal:data.length)/rowsPerPage)//change data.length to static count
    
    // const [searchData, setSearchData]=useState([])
    
    const showItem=useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);

    }, [page, rowsPerPage])

    // console.clear()
    // console.log('data', data)
    // const columns=Array.from({length:9}).map((_,idx)=>({key:`key${idx}`,label:`label${idx}`}))
    
    // const rows=data
    useEffect(() => {
        call((page-1)*rowsPerPage,rowsPerPage)
        
    }, [page,rowsPerPage])
    
    const call=async(p1,p2)=>{
        // const temp=[]
        if (pageTotal == 0) {
            // const count = await axios(process.env.NEXT_PUBLIC_HOST_POKEMONAPI+'pokemon?offset=0&limit=1').then(d => d.data.count).catch(err => console.log(err.message))
            const count = await axios(process.env.NEXT_PUBLIC_HOST_POKEMONAPI+`${props.table}?limit=1`).then(d => d.data.count).catch(err => console.log(err.message))
            setCount(count)
            // if (searchData == []) {
            //     var sd=await axios(process.env.NEXT_PUBLIC_HOST_POKEMONAPI+`${props.table}?limit=1500`).then(d => d.data.results).catch(err => console.log(err.message))
            //     sd=sd.map(d=>d.name)
            //     setSearchData(sd)
            //     // console.log('sd', sd)
            // }
            
            if (count > 0 && count != pageTotal) {
                switch (props.table) {
                    case "pokemon":
                        var temp=await downloadPokemon(p1,p2)
                        // temp=await downloadPokemon(p1,p2)
                        setdata(temp)
                        break;
                    case "type":
                        // temp=await downloadType(p1,p2)
                        setdata(await downloadType(p1,p2))
                        break
                    case "ability":
                        // temp=await downloadAbility(p1,p2)
                        setdata(await downloadAbility(p1,p2))
                        break
                    default:
                        // temp=null
                        break;
                }
                // for (let index = 0; index < 2; index++) {
                //     temp.push(await downloadPokemon(index))
                // }       
                // setdata(temp.flat())
                // setdata(await downloadPokemon(page).then(d => d.flat()))
                // setdata(temp)
            }
        }
        if(pageTotal > 0 && page > 0){
            switch (props.table) {
                case "pokemon":
                    // temp=await downloadPokemon(p1,p2)
                    setdata(await downloadPokemon(p1,p2))
                    break;
                case "type":
                    // temp=await downloadType(p1,p2)
                    setdata(await downloadType(p1,p2))
                    break
                case "ability":
                    // temp=await downloadAbility(p1,p2)
                    setdata(await downloadAbility(p1,p2))
                    break
                default:
                    // temp=null
                    break;
            }
            // setdata(temp)
            // console.log('data', data)
        }
    }
    const onRowsPerPageChange=useCallback((e)=>{
        setRowsPerPage(Number(e.target.value))
        setPage(1)
        // call(page,rowsPerPage)
        // console.log('rowsPerPage', rowsPerPage)
        // console.log('page', page)
        // console.log('data', data)
    },[])

    const rowsPerPageComponent=useMemo(()=>{
        return(<>
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {pageTotal != 0?pageTotal:data.length} Pokemon</span>
            <div className="flex justify-between gap-3 items-end">
            <Input
                isClearable
                className="w-full max-w-[100%]"
                placeholder="Search by name..."
                // startContent={<SearchIcon />}
                // value={filterValue}
                // onClear={useCallback(()=>{setPage(1)},[])}
                // onValueChange={onSearchChange}
            />
            <Button color="primary" >
               Add New
            </Button>
            </div>
            <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
                >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                </select>
            </label>
            </div>
        </div>
        </>)
    },[
        onRowsPerPageChange,
        data.length
    ])

    const paginationComponent=<div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>

    const rendercell=useCallback((keyname, valuefromkey)=>{
        switch (keyname) {
            case "icon":
                return (<><Image src={valuefromkey} alt={valuefromkey} loading="lazy"/></>)
            case "variant":
                return (<div style={{ display: 'flex', overflow: 'hidden' }}>
                            
                            {
                                valuefromkey.map(v => <Image alt="no img" src={v} loading="lazy" key={v} />)
                            }
                        </div>)
            default:
                return valuefromkey
        }
    },[])

    const mytable= <Table aria-label="Example table with dynamic content"
                          selectionMode="single" isCompact
                          topContentPlacement="outside" topContent={rowsPerPageComponent}
                          bottomContent={pages > 0 ? paginationComponent:null}
                          
                    >
                    <TableHeader columns={props.columns}>
                    {(column) => <TableColumn key={column.key} align='center' isRowHeader={true}>
                                    {column.label}
                                </TableColumn>}
                    </TableHeader>
                    <TableBody items={data?data:[]} emptyContent={"No Data"}
                               loadingContent={<Spinner label="Loading..." />}
                               loadingState={loading} >
                    {(item) => (
                        <TableRow key={item.name}>
                            {/*console.log('key', key) rendercell(key,value)*/}
                            { Object.entries(item).map(([key,value])=><TableCell key={key}>{rendercell(key,value)}</TableCell>) }
                            <TableCell key="button">{}</TableCell>
                            {/* <TableCell>
                                <Image src={item.icon} alt={item.name}
                                loading="lazy"/>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', overflow: 'hidden' }}>
                                    {
                                        item.variant.map(img => 
                                            <Image 
                                                alt="no img" src={img} 
                                                loading="lazy"
                                                key={img}
                                                
                                            />
                                        )
                                    }
                                </div>
                            </TableCell>
                            <TableCell>{item.hp}</TableCell>
                            <TableCell>{item.atk}</TableCell>
                            <TableCell>{item.def}</TableCell>
                            <TableCell>{item.satk}</TableCell>
                            <TableCell>{item.sdef}</TableCell>
                            <TableCell>{item.speed}</TableCell>
                            <TableCell></TableCell> */}
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
    
    // console.log('first', columns)
    // console.log('second', data)
    return(<>
        {
            <div className="flex flex-col gap-3">{mytable}</div>
        }
    </>)
}

export const ShowDataTypes=(props)=>{
    // console.log(['props.offset', props.offset, "-", props.table])
    const [data,setdata]=useState([])
    // console.clear()
    // console.log('data', data)
    // const columns=Array.from({length:9}).map((_,idx)=>({key:`key${idx}`,label:`label${idx}`}))
    const columns=[
        {key:"icon", label:"Icon"},
        {key:"name", label:"Name"},
        {key:"Action", label:"Action"}
    ]
    // const rows=data
    useEffect(() => {
        console.log('first', 1)
        downloadPokemon(0).then(data=>{
            // data.key=data.id
            setdata(data)
        }).catch(err=>console.log("err 55", err.message))
      }, [])


    const mytable= <Table aria-label="Example table with dynamic content"
                          selectionMode="single"
                    >
                    <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} align='center' isRowHeader={true}>
                                    {column.label}
                                </TableColumn>}
                    </TableHeader>
                    <TableBody items={data}>
                    {(item) => (
                        <TableRow key={item.name}>
                            <TableCell>
                                <Image src={item.icon} alt={item.name}
                                loading="lazy"/>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', overflow: 'hidden' }}>
                                    {
                                        item.variant.map(img => 
                                            <Image 
                                                alt="no img" src={img} 
                                                loading="lazy"
                                                key={img}
                                                
                                            />
                                        )
                                    }
                                </div>
                                {/* <Staticimgcarousel images={item.variant} /> */}
                            </TableCell>
                            <TableCell>{item.hp}</TableCell>
                            <TableCell>{item.atk}</TableCell>
                            <TableCell>{item.def}</TableCell>
                            <TableCell>{item.satk}</TableCell>
                            <TableCell>{item.sdef}</TableCell>
                            <TableCell>{item.speed}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
    
    // console.log('first', columns)
    // console.log('second', data)
    return(<>
        {
            data?<div className="flex flex-col gap-3">{mytable}</div>:""
        }
    </>)
}

export const TableT1=({url})=>{
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [crudState, setCRUDstate]=useState('')
    const [doCRUD, isDoCRUD]=useState('')
    const newvar=useRef()

    const [data, setData] = useState([]);
    const [loading, setLoading]=useState(true)
    const [totalRows, setTotalRows]=useState(0)
    const [pages, setPages]=useState(0)
    const [curr, setCurrentPage]=useState(1)
    const [tempObj, setTempObj]=useState({})
    const [modalObj, setModalObj]=useState({})
    const [createObj, setCreateObj]=useState({})
    
    const [searchText, setST] =useState("")
    
    useEffect(() => {
        setLoading(true)
        // console.clear()
        if (doCRUD == 'update') {
            putAxios()
            console.log('update')
        }
        else if (doCRUD == 'create') {
            createAxios()
            console.log('create')
        }
        else if (doCRUD == 'delete') {
            deleteAxios()
            console.log('delete')
        }
        else if (searchText !== '' && doCRUD == ''){
            setCurrentPage(1)
            searchAxios()
            console.log('search')
        }
        else {
            getAxios()
            console.log('normal get')
        }
        setLoading(false)
        console.log('CRUD',doCRUD)
        console.log('Search',searchText)
        console.log('tempObj',tempObj)
        console.log('modalObj',modalObj)
        console.log('createObj',createObj)
    }, [doCRUD, searchText, curr])

    const getAxios=async()=>{
        console.clear()
        // console.log(doCRUD)
        const {dataAxios,meta} = await getStrapiT1(url+curr)
        // console.log('dataAxios', dataAxios)
        setPages(meta.pageCount)
        setTotalRows(meta.total)
        setData(dataAxios)
        // testStrapi()
        // console.log('url', url)
    }

    const searchAxios=async()=>{
        if (searchText!=='') {
            console.clear()
            const filter=`&filters[$or][0][idx][$containsi]=${searchText}&filters[$or][1][name][$containsi]=${searchText}&filters[$or][2][hp][$containsi]=${searchText}&filters[$or][3][atk][$containsi]=${searchText}&filters[$or][4][def][$containsi]=${searchText}&filters[$or][5][satk][$containsi]=${searchText}&filters[$or][6][sdef][$containsi]=${searchText}&filters[$or][7][speed][$containsi]=${searchText}`
            const filterUrl=`http://localhost:1337/api/pokemon-names?sort=idx`+filter
            // console.log('filterUrl', filterUrl)
            const {dataAxios,meta} = await getStrapiT1(filterUrl)
            setPages(meta.pageCount)
            setTotalRows(meta.total)
            // console.log('axios',dataAxios)
            // console.log('meta',meta)
            setData(dataAxios)
        }
        
        // setST('')
    }

    const createAxios=async()=>{
        console.clear()
        const res = await createStrapiT1('http://localhost:1337/api/pokemon-names/',createObj)
        setCreateObj({})
        isDoCRUD('')
        onClose()
        // console.log(doCRUD)
        // location.reload()
        // alert()
    }

    const putAxios=async()=>{
        console.clear()
        const res = await putStrapiT1('http://localhost:1337/api/pokemon-names/'+modalObj.id,modalObj)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const deleteAxios=async()=>{
        console.clear()
        const res = await deleteStrapiT1('http://localhost:1337/api/pokemon-names/'+modalObj.id)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const topContent=<>
    <div className="flex justify-between items-center">
        <p>Total Rows: {totalRows||0}</p>
        <Button color="primary" variant="ghost"
            onPress={()=>handleCRUD('create', 0)}
        >Create New Pokemon</Button>
        <Input type="text" label='Search' 
            className="w-full sm:max-w-[44%]"
            isClearable 
            onClear={()=>setST('')}
            value={searchText}
            onChange={(e)=> setST(e.target.value)}
        />
    </div>
    </>
    const bottomContent=pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                total={pages}
                                loop
                                page={curr}
                                onChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                            ) : null
    const arrHeader=[
        // {label:'Id',key:0},
        {label:'Index',key:1},
        {label:'Name',key:2},
        {label:'Icon',key:3},
        {label:'Cover',key:4},
        {label:'Illustration',key:5},
        {label:'HP',key:6},
        {label:'Attack',key:7},
        {label:'Defense',key:8},
        {label:'Special Attack',key:9},
        {label:'Special Defense',key:10},
        {label:'Speed',key:11},
        {label:'Action',key:12},
    ]
    const rendercell=useCallback((keyname, valuefromkey)=>{
        if (!valuefromkey) {
            return
        }
        switch (keyname) {
            // case !valuefromkey:
            //     return
            case "icon":
                return (<><Image src={valuefromkey?valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "variant":
            //     return (<div style={{ display: 'flex', overflow: 'hidden' }}>
                            
            //                 {
            //                     valuefromkey.map(v => <Image alt="no img" src={v} loading="lazy" key={v} />)
            //                 }
            //             </div>)
            case "illustration":
                // console.log('first', valuefromkey)
                return (<>
                    {[...Array(valuefromkey.length)].map((e,i)=>(
                        <Image key={i} src={valuefromkey && valuefromkey.length>0?'http://localhost:1337'+valuefromkey[i]:'#'} alt={valuefromkey[i]} loading="lazy"/>
                    ))}
                    
                </>)
            case "cover":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "idx"||"name"||"hp"||"atk"||"def"||"satk"||"sdef"||"speed":
            //     return valuefromkey
            // case ("illustration" || "icon" || "cover") && !valuefromkey:
            //     return
            default:
                return valuefromkey
        }
    },[])
    const handleCRUD=(state, index)=>{
        setCreateObj({})
        if (state == 'update'||state == 'delete'||state == 'display') {
            const t=data.find(obj => obj['idx'] === index || obj['id'] === index)
            // console.log('t', t)
            setTempObj(Object.assign(t))
            setModalObj(Object.assign(t))
        }
        setCRUDstate(state)
        onOpen()
    }
    const table=<Table
                    aria-label="T1"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    isStriped
                    selectionMode="single" 
                    color='success'
                >
                    <TableHeader>
                        {[...Array(arrHeader.length)].map((e,i)=>(
                            <TableColumn key={arrHeader[i].key} isRowHeader={true}
                            >{arrHeader[i].label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent={"No Data"} items={data?data:[]}
                            loadingContent={<Spinner label="Loading..." color="danger" labelColor="danger"/>}
                            loadingState={loading?'loading':'idle'}
                            isLoading={loading}
                    >
                        {(item)=>(
                            <TableRow key={item.id}>
                                { Object.entries(item)
                                .filter(([key]) => key !== 'id')
                                .map((
                                        [key,value])=> 
                                            // console.log('first', item[key])
                                            // return <><TableCell key={key}>{rendercell(key,value)}</TableCell></>
                                            <TableCell key={key}>{rendercell(key,value)}</TableCell>
                                        
                                    )
                                }
                                <TableCell key={'action'}>
                                    <ButtonGroup>
                                        <Button color="primary" variant="ghost" key={'display'}
                                            onPress={()=>handleCRUD('display', item.idx || item.id)}
                                        >Detail</Button>
                                        <Button color="warning" variant="ghost" key={'update'}
                                            onPress={()=>handleCRUD('update', item.idx || item.id)}
                                        >Change</Button>
                                        <Button color="danger" variant="ghost" key={'delete'}
                                            onPress={()=>handleCRUD('delete', item.idx || item.id)}
                                        >Delete</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
    const MyModal=React.memo((props)=>{
        // console.clear()
        var {obj={}, state=null}=props
        console.log('state',state)
        console.log('obj',obj)
        if (!state) {
            return null
        }
        if (state=='create') {
            obj=null
        }
        const handleChange=useCallback((key,value)=>{
            setModalObj((prev)=>({...prev, [key]:value}))
        },[])
        const handleChange2=useCallback((key,value)=>{
            setCreateObj((prev)=>({...prev, [key]:value}))
        },[])
        var modalContent=''
        // console.log(obj)
        const modalNonCreate=<><Input
        label="Name"
        value={obj?.name}
        onChange={e=>handleChange('name',e.target.value)}
        // labelPlacement="outside-left"
        isClearable
        isRequired={state==='delete'?false:true}
        onClear={()=>handleChange('name','')}
        className="grid-rows-1"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Icon"
        value={obj?obj.icon:''}
        onChange={e=>handleChange('icon',e.target.value)}
        // labelPlacement="outside-left"
        description={'example: '+(obj?obj.icon:'')}
        isClearable
        onClear={()=>handleChange('icon','')}
        className="grid-rows-1 text-clip"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Cover"
        value={obj?obj.cover:''}
        onChange={e=>handleChange('cover',e.target.value)}
        description={'example: /uploads/filename.extension'}
        isClearable
        onClear={()=>handleChange('cover','')}
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Illustration"
        value={obj?obj.illustration:''}
        onChange={e=>handleChange('illustration',e.target.value)}
        description={'example: /uploads/filename.extension'}
        isClearable
        onClear={()=>handleChange('illustration','')}
        // isDisabled={state==='delete'?true:false}
        // readOnly={state==='delete'?true:false}
        isDisabled={true}
        readOnly={true}
    />
    <div className="flex gap-2">
    <Input
        label="HP"
        value={obj?obj.hp:0}
        type="number"
        min={0}
        onChange={e=>handleChange('hp',e.target.value)}
        isClearable
        onClear={()=>handleChange('hp',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Attack"
        value={obj?obj.atk:0}
        type="number"
        min={0}
        onChange={e=>handleChange('atk',e.target.value)}
        isClearable
        onClear={()=>handleChange('atk',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Defense"
        value={obj?obj.def:0}
        type="number"
        min={0}
        onChange={e=>handleChange('def',e.target.value)}
        isClearable
        onClear={()=>handleChange('def',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    </div>
    <div className="flex gap-2">
    <Input
        label="Special Attack"
        value={obj?.satk||0}
        type="number"
        min={0}
        onChange={e=>handleChange('satk',e.target.value)}
        isClearable
        onClear={()=>handleChange('satk',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Special Defense"
        value={obj?obj.sdef:0}
        type="number"
        min={0}
        onChange={e=>handleChange('sdef',e.target.value)}
        isClearable
        onClear={()=>handleChange('sdef',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Speed"
        value={obj?obj.speed:0}
        type="number"
        min={0}
        onChange={e=>handleChange('speed',e.target.value)}
        isClearable
        onClear={()=>handleChange('speed',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
        </div></>

        const modalCreate= <>
        {/* <Input
        label="somethingnew"
        value={newvar.current}
        onChange={e=>newvar.current=e.target.value}
        // labelPlacement="outside-left"
        // isClearable
        // isRequired={state==='delete'?false:true}
        // onClear={()=>newvar.current=e.target.value}
        className="grid-rows-1"
        // isDisabled={state==='delete'?true:false}
        // readOnly={state==='delete'?true:false}
    /> */}
        <Input
        label="Name"
        value={createObj?createObj.name:''}
        onChange={e=>handleChange2('name',e.target.value)}
        // labelPlacement="outside-left"
        isClearable
        isRequired={state==='delete'?false:true}
        onClear={()=>handleChange2('name','')}
        className="grid-rows-1"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Icon"
        value={createObj?createObj.icon:''}
        onChange={e=>handleChange2('icon',e.target.value)}
        // labelPlacement="outside-left"
        description={'example: '+(createObj?createObj.icon:'')}
        isClearable
        onClear={()=>handleChange2('icon','')}
        className="grid-rows-1 text-clip"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Cover"
        value={createObj?createObj.cover:''}
        onChange={e=>handleChange2('cover',e.target.value)}
        description={'example: /uploads/filename.extension'}
        isClearable
        onClear={()=>handleChange2('cover','')}
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Illustration"
        value={createObj?createObj.illustration:''}
        onChange={e=>handleChange2('illustration',e.target.value)}
        description={'example: /uploads/filename.extension'}
        isClearable
        onClear={()=>handleChange2('illustration','')}
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <div className="flex gap-2">
    <Input
        label="HP"
        value={createObj?createObj.hp:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('hp',e.target.value)}
        isClearable
        onClear={()=>handleChange2('hp',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Attack"
        value={createObj?createObj.atk:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('atk',e.target.value)}
        isClearable
        onClear={()=>handleChange2('atk',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Defense"
        value={createObj?createObj.def:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('def',e.target.value)}
        isClearable
        onClear={()=>handleChange2('def',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    </div>
    <div className="flex gap-2">
        
    <Input
        label="Special Attack"
        value={createObj?createObj.satk:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('satk',e.target.value)}
        isClearable
        onClear={()=>handleChange2('satk',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Special Defense"
        value={createObj?createObj.sdef:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('sdef',e.target.value)}
        isClearable
        onClear={()=>handleChange2('sdef',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
    />
    <Input
        label="Speed"
        value={createObj?createObj.speed:0}
        type="number"
        min={0}
        onChange={e=>handleChange2('speed',e.target.value)}
        isClearable
        onClear={()=>handleChange2('speed',0)}
        className="flex-col"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
        /></div></>
        const modalbody=<>{state=='create'?modalCreate:modalNonCreate}</>
        switch (state) {
            case 'display':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        <p className="text-small text-default-500">Detail</p>
                                        <Image
                                            alt="Icon"
                                            height={40}
                                            radius="sm"
                                            src={obj&&obj.icon?obj.icon:''}
                                            // width={40}
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-small text-default-500">Id: {tempObj.idx}</p>
                                            <p className="text-small text-default-500">Name: {tempObj.name}</p>
                                        </div>
                                        <Divider/>
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="text-small text-default-500">HP: {obj?.hp||''}</p>
                                        <p className="text-small text-default-500">Attack: {obj?.atk||''}</p>
                                        <p className="text-small text-default-500">Defense: {obj?.def||''}</p>
                                        <p className="text-small text-default-500">Special Attack: {obj?.satk||''}</p>
                                        <p className="text-small text-default-500">Special Defense: {obj?.sdef||''}</p>
                                        <p className="text-small text-default-500">Speed: {obj?.speed||''}</p>
                                        {obj.cover?<Image
                                        alt="Cover"
                                        height={40}
                                        radius="sm"
                                        src={'http://localhost:1337'+obj.cover}
                                        // width={40}
                                        />:<p className="text-small text-default-500">No Cover Image</p>}

                                        {obj.illustration?[...Array(obj.illustration.length)].map((e,i)=>(
                                            <Image
                                            alt="Illustration"
                                            height={40}
                                            radius="sm"
                                            src={'http://localhost:1337'+obj.illustration[i]}
                                            key={i}
                                            // width={40}
                                            />
                                        )):<p className="text-small text-default-500">No Illustration Images</p>}
                                        
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                        </Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'create':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create New Pokemon</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('create')}>Create</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'update':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader >Update {tempObj.name}</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('update')}>Update</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'delete':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader>Delete {obj?.name||''}</ModalHeader>
                                    <ModalBody>{modalbody}</ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('delete')}>Delete</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            // default:
            //     break;
        }
        return <Modal 
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpenChange={onOpenChange}
                    scrollBehavior="outside"
                    size="lg"
                >
                    {modalContent}
                </Modal>
    },[handleCRUD])

    // const InputField = ({ label, value, onChange, type = "text", ...props }) => (
    //     <Input
    //       label={label}
    //       value={value}
    //       type={type}
    //       onChange={onChange}
    //       isClearable
    //       {...props}
    //     />
    //   );
      
    //   const BasicInputFields = ({ state, obj, onChange }) => (
    //     <>
    //       <InputField label="Name" value={obj?.name} onChange={(e) => onChange("name", e.target.value)} />
    //       <InputField label="Icon" value={obj?.icon} onChange={(e) => onChange("icon", e.target.value)} />
    //       {/* Add other input fields as needed */}
    //     </>
    //   );
      
    //   const MyModal2 = ({ state, obj, onChange, onSubmit }) => {
    //     if (!state) {
    //       return null;
    //     }
      
    //     const isCreate = state === "create";
      
    //     return (
    //       <ModalContent>
    //         {(onClose) => (
    //           <>
    //             <ModalHeader>{isCreate ? "Create New Pokemon" : `Update ${obj.name}`}</ModalHeader>
    //             <ModalBody>
    //               <BasicInputFields state={state} obj={obj} onChange={onChange} />
    //             </ModalBody>
    //             <ModalFooter>
    //               <Button color="danger" variant="flat" onPress={onClose}>
    //                 Close
    //               </Button>
    //               <Button color="primary" variant="flat" onPress={onSubmit}>
    //                 {isCreate ? "Create" : "Update"}
    //               </Button>
    //             </ModalFooter>
    //           </>
    //         )}
    //       </ModalContent>
    //     );
    //   };
      
      // Usage example
    //   const modalContent = useMemo(() => <MyModal2 
    //                         state={crudState} 
    //                         obj={crudState && crudState != 'create'?modalObj:null} 
    //                         onChange={handleChange} 
    //                         onSubmit={handleSubmit} />
    //                         , [crudState && crudState != 'create'?modalObj:null]);
    
    return(
        <>
            {table}
            {/* {useMemo(() => <MyModal state={crudState} 
            obj={modalObj}/>, [handleCRUD])} */}
            {<MyModal state={crudState} obj={modalObj}/>}
        </>
    )
}

export const TableT2=({url})=>{
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [crudState, setCRUDstate]=useState('')
    const [doCRUD, isDoCRUD]=useState('')

    const [data, setData] = useState([]);
    const [loading, setLoading]=useState(true)
    const [totalRows, setTotalRows]=useState(0)
    const [pages, setPages]=useState(0)
    const [curr, setCurrentPage]=useState(1)
    const [tempObj, setTempObj]=useState({})
    const [modalObj, setModalObj]=useState({})
    const [createObj, setCreateObj]=useState({})
    
    const [searchText, setST] =useState("")
    
    useEffect(() => {
        setLoading(true)
        // console.clear()
        if (doCRUD == 'update') {
            putAxios()
            console.log('update')
        }
        else if (doCRUD == 'create') {
            createAxios()
            console.log('create')
        }
        else if (doCRUD == 'delete') {
            deleteAxios()
            console.log('delete')
        }
        else if (searchText !== '' && doCRUD == ''){
            setCurrentPage(1)
            searchAxios()
            console.log('search')
        }
        else {
            getAxios()
            console.log('normal get')
        }
        setLoading(false)
        console.log('CRUD',doCRUD)
        console.log('Search',searchText)
        console.log('tempObj',tempObj)
        console.log('modalObj',modalObj)
        console.log('createObj',createObj)
    }, [doCRUD, searchText, curr])

    const getAxios=async()=>{
        console.clear()
        // console.log(doCRUD)
        const {dataAxios,meta} = await getStrapiT2(url+curr)
        setPages(meta.pageCount)
        setTotalRows(meta.total)
        setData(dataAxios)
        // testStrapi()
        // console.log('url', url)
    }

    const searchAxios=async()=>{
        if (searchText!=='') {
            console.clear()
            const filter=`&filters[$or][0][idx][$containsi]=${searchText}&filters[$or][1][name][$containsi]=${searchText}&filters[$or][2][id][$containsi]=${searchText}`
            const filterUrl=`http://localhost:1337/api/pokemon-types?sort=idx`+filter
            const {dataAxios,meta} = await getStrapiT2(filterUrl)
            setPages(meta.pageCount)
            setTotalRows(meta.total)
            setData(dataAxios)
        }
        
        // setST('')
    }

    const createAxios=async()=>{
        console.clear()
        const res = await createStrapiT2('http://localhost:1337/api/pokemon-types/',createObj)
        setCreateObj({})
        isDoCRUD('')
        onClose()
        // console.log(doCRUD)
        // location.reload()
        // alert()
    }

    const putAxios=async()=>{
        console.clear()
        const res = await putStrapiT2('http://localhost:1337/api/pokemon-types/'+modalObj.id,modalObj)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const deleteAxios=async()=>{
        console.clear()
        const res = await deleteStrapiT2('http://localhost:1337/api/pokemon-types/'+modalObj.id)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const topContent=<>
    <div className="flex justify-between items-center">
        <p>Total Rows: {totalRows||0}</p>
        <Button color="primary" variant="ghost"
            onPress={()=>handleCRUD('create', 0)}
        >Create New Pokemon Type</Button>
        <Input type="text" label='Search' 
            className="w-full sm:max-w-[44%]"
            isClearable 
            onClear={()=>setST('')}
            value={searchText}
            onChange={(e)=> setST(e.target.value)}
        />
    </div>
    </>
    const bottomContent=pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                total={pages}
                                loop
                                page={curr}
                                onChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                            ) : null
    const arrHeader=[
        // {label:'Id',key:0},
        {label:'Index',key:1},
        {label:'Name',key:2},
        // {label:'Icon',key:3},
        // {label:'Cover',key:4},
        // {label:'Illustration',key:5},
        // {label:'HP',key:6},
        // {label:'Attack',key:7},
        // {label:'Defense',key:8},
        // {label:'Special Attack',key:9},
        // {label:'Special Defense',key:10},
        // {label:'Speed',key:11},
        {label:'Action',key:12},
    ]
    const rendercell=useCallback((keyname, valuefromkey)=>{
        switch (keyname) {
            case "icon":
                return (<><Image src={valuefromkey?valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "variant":
            //     return (<div style={{ display: 'flex', overflow: 'hidden' }}>
                            
            //                 {
            //                     valuefromkey.map(v => <Image alt="no img" src={v} loading="lazy" key={v} />)
            //                 }
            //             </div>)
            case "illustration":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            case "cover":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "idx"||"name"||"hp"||"atk"||"def"||"satk"||"sdef"||"speed":
            //     return valuefromkey
            default:
                return valuefromkey
        }
    },[])
    const handleCRUD=(state, index)=>{
        setCreateObj({})
        if (state == 'update'||state == 'delete'||state == 'display') {
            const t=data.find(obj => obj['idx'] === index || obj['id'] === index)
            // console.log('t', t)
            setTempObj(Object.assign(t))
            setModalObj(Object.assign(t))
        }
        setCRUDstate(state)
        onOpen()
    }
    const table=<Table
                    aria-label="T2"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    isStriped
                    selectionMode="single" 
                    color='success'
                >
                    <TableHeader>
                        {[...Array(arrHeader.length)].map((e,i)=>(
                            <TableColumn key={arrHeader[i].key} isRowHeader={true}
                            >{arrHeader[i].label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent={"No Data"} items={data?data:[]}
                            loadingContent={<Spinner label="Loading..." color="danger" labelColor="danger"/>}
                            loadingState={loading?'loading':'idle'}
                            isLoading={loading}
                    >
                        {(item)=>(
                            <TableRow key={item.id}>
                                { Object.entries(item)
                                .filter(([key]) => key !== 'idx' )
                                .map((
                                    [key,value])=> <TableCell key={key}>{rendercell(key,value)}</TableCell>) 
                                }
                                <TableCell key={'action'}>
                                    <ButtonGroup>
                                        <Button color="primary" variant="ghost" key={'display'}
                                            onPress={()=>handleCRUD('display', item.idx || item.id)}
                                        >Detail</Button>
                                        <Button color="warning" variant="ghost" key={'update'}
                                            onPress={()=>handleCRUD('update', item.idx || item.id)}
                                        >Change</Button>
                                        <Button color="danger" variant="ghost" key={'delete'}
                                            onPress={()=>handleCRUD('delete', item.idx || item.id)}
                                        >Delete</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
    const MyModal=React.memo((props)=>{
        // console.clear()
        var {obj={}, state=null}=props
        // console.log('state',state)
        // console.log('obj',obj)
        if (!state) {
            return null
        }
        if (state=='create') {
            obj=null
        }
        const handleChange=useCallback((key,value)=>{
            setModalObj((prev)=>({...prev, [key]:value}))
        },[])
        const handleChange2=useCallback((key,value)=>{
            setCreateObj((prev)=>({...prev, [key]:value}))
        },[])
        var modalContent=''
        // console.log(obj)
        const modalNonCreate=<><Input
        label="Name"
        value={obj?.name}
        onChange={e=>handleChange('name',e.target.value)}
        // labelPlacement="outside-left"
        isClearable
        isRequired={state==='delete'?false:true}
        onClear={()=>handleChange('name','')}
        className="grid-rows-1"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
        />
        {/* 
        <Input
            label="Icon"
            value={obj?obj.icon:''}
            onChange={e=>handleChange('icon',e.target.value)}
            // labelPlacement="outside-left"
            description={'example: '+(obj?obj.icon:'')}
            isClearable
            onClear={()=>handleChange('icon','')}
            className="grid-rows-1 text-clip"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Cover"
            value={obj?obj.cover:''}
            onChange={e=>handleChange('cover',e.target.value)}
            description={'example: /uploads/filename.extension'}
            isClearable
            onClear={()=>handleChange('cover','')}
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Illustration"
            value={obj?obj.illustration:''}
            onChange={e=>handleChange('illustration',e.target.value)}
            description={'example: /uploads/filename.extension'}
            isClearable
            onClear={()=>handleChange('illustration','')}
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <div className="flex gap-2">
        <Input
            label="HP"
            value={obj?obj.hp:0}
            type="number"
            min={0}
            onChange={e=>handleChange('hp',e.target.value)}
            isClearable
            onClear={()=>handleChange('hp',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Attack"
            value={obj?obj.atk:0}
            type="number"
            min={0}
            onChange={e=>handleChange('atk',e.target.value)}
            isClearable
            onClear={()=>handleChange('atk',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Defense"
            value={obj?obj.def:0}
            type="number"
            min={0}
            onChange={e=>handleChange('def',e.target.value)}
            isClearable
            onClear={()=>handleChange('def',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        </div>
        <div className="flex gap-2">
            
        <Input
            label="Special Attack"
            value={obj?.satk||0}
            type="number"
            min={0}
            onChange={e=>handleChange('satk',e.target.value)}
            isClearable
            onClear={()=>handleChange('satk',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Special Defense"
            value={obj?obj.sdef:0}
            type="number"
            min={0}
            onChange={e=>handleChange('sdef',e.target.value)}
            isClearable
            onClear={()=>handleChange('sdef',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Speed"
            value={obj?obj.speed:0}
            type="number"
            min={0}
            onChange={e=>handleChange('speed',e.target.value)}
            isClearable
            onClear={()=>handleChange('speed',0)}
            className="flex-col"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
    </div>*/}
            </>
            const modalCreate=<><Input
            label="Name"
            value={createObj?createObj.name:''}
            onChange={e=>handleChange2('name',e.target.value)}
            // labelPlacement="outside-left"
            isClearable
            isRequired={state==='delete'?false:true}
            onClear={()=>handleChange2('name','')}
            className="grid-rows-1"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
    </>
        const modalbody=<>{state=='create'?modalCreate:modalNonCreate}</>
        switch (state) {
            case 'display':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        <p className="text-small text-default-500">Detail</p>
                                        <div className="flex flex-col">
                                            <p className="text-small text-default-500">Id: {tempObj.idx||tempObj.id}</p>
                                            <p className="text-small text-default-500">Type Name: {tempObj.name}</p>
                                        </div>
                                        <Divider/>
                                    </ModalHeader>
                                    <ModalBody>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                        </Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'create':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create New Pokemon Type</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('create')}>Create</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'update':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader >Update Type {tempObj.name}</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('update')}>Update</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'delete':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader>Delete Type {obj?.name||''}</ModalHeader>
                                    <ModalBody>{modalbody}</ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('delete')}>Delete</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            // default:
            //     break;
        }
        return <Modal 
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpenChange={onOpenChange}
                    scrollBehavior="outside"
                    size="lg"
                >
                    {modalContent}
                </Modal>
    },[handleCRUD])

    return(
        <>
            {table}
            {<MyModal state={crudState} obj={modalObj}/>}
        </>
    )
}

export const TableT3=({url})=>{
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [crudState, setCRUDstate]=useState('')
    const [doCRUD, isDoCRUD]=useState('')

    const [data, setData] = useState([]);
    const [loading, setLoading]=useState(true)
    const [totalRows, setTotalRows]=useState(0)
    const [pages, setPages]=useState(0)
    const [curr, setCurrentPage]=useState(1)
    const [tempObj, setTempObj]=useState({})
    const [modalObj, setModalObj]=useState({})
    const [createObj, setCreateObj]=useState({})
    
    const [searchText, setST] =useState("")
    
    useEffect(() => {
        setLoading(true)
        // console.clear()
        if (doCRUD == 'update') {
            putAxios()
            console.log('update')
        }
        else if (doCRUD == 'create') {
            createAxios()
            console.log('create')
        }
        else if (doCRUD == 'delete') {
            deleteAxios()
            console.log('delete')
        }
        else if (searchText !== '' && doCRUD == ''){
            setCurrentPage(1)
            searchAxios()
            console.log('search')
        }
        else {
            getAxios()
            console.log('normal get')
        }
        setLoading(false)
        console.log('CRUD',doCRUD)
        console.log('Search',searchText)
        console.log('tempObj',tempObj)
        console.log('modalObj',modalObj)
        console.log('createObj',createObj)
    }, [doCRUD, searchText, curr])

    const getAxios=async()=>{
        console.clear()
        // console.log(doCRUD)
        const {dataAxios,meta} = await getStrapiT3(url+curr)
        setPages(meta.pageCount)
        setTotalRows(meta.total)
        setData(dataAxios)
        // testStrapi()
        // console.log('url', url)
    }

    const searchAxios=async()=>{
        if (searchText!=='') {
            console.clear()
            const filter=`&filters[$or][0][idx][$containsi]=${searchText}&filters[$or][1][name][$containsi]=${searchText}&filters[$or][2][flavor_text][$containsi]=${searchText}&filters[$or][3][effect][$containsi]=${searchText}`
            const filterUrl=`http://localhost:1337/api/pokemon-abilities?sort=idx`+filter
            const {dataAxios,meta} = await getStrapiT3(filterUrl)
            setPages(meta.pageCount)
            setTotalRows(meta.total)
            setData(dataAxios)
        }
        
        // setST('')
    }

    const createAxios=async()=>{
        console.clear()
        const res = await createStrapiT3('http://localhost:1337/api/pokemon-abilities/',createObj)
        setCreateObj({})
        isDoCRUD('')
        onClose()
        // console.log(doCRUD)
        // location.reload()
        // alert()
    }

    const putAxios=async()=>{
        console.clear()
        const res = await putStrapiT3('http://localhost:1337/api/pokemon-abilities/'+modalObj.id,modalObj)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const deleteAxios=async()=>{
        console.clear()
        const res = await deleteStrapiT3('http://localhost:1337/api/pokemon-abilities/'+modalObj.id)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const topContent=<>
    <div className="flex justify-between items-center">
        <p>Total Rows: {totalRows||0}</p>
        <Button color="primary" variant="ghost"
            onPress={()=>handleCRUD('create', 0)}
        >Create New Pokemon Ability</Button>
        <Input type="text" label='Search' 
            className="w-full sm:max-w-[44%]"
            isClearable 
            onClear={()=>setST('')}
            value={searchText}
            onChange={(e)=> setST(e.target.value)}
        />
    </div>
    </>
    const bottomContent=pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                total={pages}
                                loop
                                page={curr}
                                onChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                            ) : null
    const arrHeader=[
        // {label:'Id',key:0},
        {label:'Index',key:1},
        {label:'Name',key:2},
        {label:'Flavor Text',key:3},
        {label:'Effect',key:4},
        {label:'Action',key:12},
    ]
    const rendercell=useCallback((keyname, valuefromkey)=>{
        switch (keyname) {
            case "icon":
                return (<><Image src={valuefromkey?valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "variant":
            //     return (<div style={{ display: 'flex', overflow: 'hidden' }}>
                            
            //                 {
            //                     valuefromkey.map(v => <Image alt="no img" src={v} loading="lazy" key={v} />)
            //                 }
            //             </div>)
            case "illustration":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            case "cover":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "idx"||"name"||"hp"||"atk"||"def"||"satk"||"sdef"||"speed":
            //     return valuefromkey
            default:
                return valuefromkey
        }
    },[])
    const handleCRUD=(state, index)=>{
        setCreateObj({})
        if (state == 'update'||state == 'delete'||state == 'display') {
            const t=data.find(obj => obj['idx'] === index || obj['id'] === index)
            // console.log('t', t)
            setTempObj(Object.assign(t))
            setModalObj(Object.assign(t))
        }
        setCRUDstate(state)
        onOpen()
    }
    const table=<Table
                    aria-label="T3"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    isStriped
                    selectionMode="single" 
                    color='success'
                >
                    <TableHeader>
                        {[...Array(arrHeader.length)].map((e,i)=>(
                            <TableColumn key={arrHeader[i].key} isRowHeader={true}
                            >{arrHeader[i].label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent={"No Data"} items={data?data:[]}
                            loadingContent={<Spinner label="Loading..." color="danger" labelColor="danger"/>}
                            loadingState={loading?'loading':'idle'}
                            isLoading={loading}
                    >
                        {(item)=>(
                            <TableRow key={item.id}>
                                { Object.entries(item)
                                .filter(([key]) => key !== 'idx')
                                .map((
                                    [key,value])=> <TableCell key={key}>{rendercell(key,value)}</TableCell>) 
                                }
                                <TableCell key={'action'}>
                                    <ButtonGroup>
                                        <Button color="primary" variant="ghost" key={'display'}
                                            onPress={()=>handleCRUD('display', item.idx || item.id)}
                                        >Detail</Button>
                                        <Button color="warning" variant="ghost" key={'update'}
                                            onPress={()=>handleCRUD('update', item.idx || item.id)}
                                        >Change</Button>
                                        <Button color="danger" variant="ghost" key={'delete'}
                                            onPress={()=>handleCRUD('delete', item.idx || item.id)}
                                        >Delete</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
    const MyModal=React.memo((props)=>{
        // console.clear()
        var {obj={}, state=null}=props
        // console.log('state',state)
        // console.log('obj',obj)
        if (!state) {
            return null
        }
        if (state=='create') {
            obj=null
        }
        const handleChange=useCallback((key,value)=>{
            setModalObj((prev)=>({...prev, [key]:value}))
        },[])
        const handleChange2=useCallback((key,value)=>{
            setCreateObj((prev)=>({...prev, [key]:value}))
        },[])
        var modalContent=''
        // console.log(obj)
        const modalNonCreate=<><Input
            label="Name"
            value={obj?.name}
            onChange={e=>handleChange('name',e.target.value)}
            // labelPlacement="outside-left"
            isClearable
            isRequired={state==='delete'?false:true}
            onClear={()=>handleChange('name','')}
            className="grid-rows-1"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
            />
            <Input
                label="Flavor Text"
                value={obj?.flavor_text}
                onChange={e=>handleChange('flavor_text',e.target.value)}
                isClearable
                onClear={()=>handleChange('flavor_text','')}
                className="grid-rows-1"
                isDisabled={state==='delete'?true:false}
                readOnly={state==='delete'?true:false}
            />
            <Input
                label="Effect"
                value={obj?.effect}
                onChange={e=>handleChange('effect',e.target.value)}
                isClearable
                onClear={()=>handleChange('effect','')}
                className="grid-rows-1"
                isDisabled={state==='delete'?true:false}
                readOnly={state==='delete'?true:false}
            />
        </>
        const modalCreate=<><Input
        label="Name"
        value={createObj?createObj.name:''}
        onChange={e=>handleChange2('name',e.target.value)}
        // labelPlacement="outside-left"
        isClearable
        isRequired={state==='delete'?false:true}
        onClear={()=>handleChange2('name','')}
        className="grid-rows-1"
        isDisabled={state==='delete'?true:false}
        readOnly={state==='delete'?true:false}
        />
        <Input
            label="Flavor Text"
            value={createObj?createObj.flavor_text:''}
            onChange={e=>handleChange2('flavor_text',e.target.value)}
            isClearable
            onClear={()=>handleChange2('flavor_text','')}
            className="grid-rows-1"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        <Input
            label="Effect"
            value={createObj?createObj.effect:''}
            onChange={e=>handleChange2('effect',e.target.value)}
            isClearable
            onClear={()=>handleChange2('effect','')}
            className="grid-rows-1"
            isDisabled={state==='delete'?true:false}
            readOnly={state==='delete'?true:false}
        />
        </>
        const modalbody=<>{state=='create'?modalCreate:modalNonCreate}</>
        switch (state) {
            case 'display':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        <p className="text-small text-default-500">Detail</p>
                                        <div className="flex flex-col">
                                            <p className="text-small text-default-500">Id: {tempObj.idx||tempObj.id}</p>
                                            <p className="text-small text-default-500">Ability Name: {tempObj.name}</p>
                                        </div>
                                        <Divider/>
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="flex flex-col">
                                            <p className="text-small text-default-500">Flavor Text: {tempObj.flavor_text||'No Data'}</p>
                                            <p className="text-small text-default-500">Effect: {tempObj.effect || 'No Data'}</p>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                        </Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'create':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create New Pokemon Ability</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('create')}>Create</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'update':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader >Update Ability {tempObj.name}</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('update')}>Update</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'delete':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader>Delete Ability {obj?.name||''}</ModalHeader>
                                    <ModalBody>{modalbody}</ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('delete')}>Delete</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            // default:
            //     break;
        }
        return <Modal 
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpenChange={onOpenChange}
                    scrollBehavior="outside"
                    size="lg"
                >
                    {modalContent}
                </Modal>
    },[handleCRUD])

    return(
        <>
            {table}
            {<MyModal state={crudState} obj={modalObj}/>}
        </>
    )
}

export const TableT4=({url})=>{
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [crudState, setCRUDstate]=useState('')
    const [doCRUD, isDoCRUD]=useState('')

    const [data, setData] = useState([]);
    const [loading, setLoading]=useState(true)
    const [totalRows, setTotalRows]=useState(0)
    const [pages, setPages]=useState(0)
    const [curr, setCurrentPage]=useState(1)
    const [tempObj, setTempObj]=useState({})
    const [modalObj, setModalObj]=useState({})
    const [createObj, setCreateObj]=useState({})
    const [nonRegisteredObj, setRegisteredObj]=useState({})
    const [selectedNewRegisteredData, setSelectedRegisteredData] = useState({
        pokemon:[],
        type:[],
        abilities:[]
    })
    const displayedDD=React.useMemo(()=>{
        if (!selectedNewRegisteredData || !selectedNewRegisteredData.pokemon|| !selectedNewRegisteredData.type|| !selectedNewRegisteredData.abilities) {
            return { pokemon: null, types: null, abilities: null, }
        }
        var t1=Array.from(selectedNewRegisteredData.pokemon)
        var t2=Array.from(selectedNewRegisteredData.type).map(d => parseInt(d))
        var t3=Array.from(selectedNewRegisteredData.abilities).map(d => parseInt(d))
        var t4= nonRegisteredObj.pokemon?.filter(d => d.id == t1[0])
        if(crudState == 'delete'){
            t4=nonRegisteredObj.pokemon_finder?.filter(d => d.id == t1[0])
        }
        var t5= nonRegisteredObj.types?.filter(d => t2.includes(d.id)).map(d => d.name)
        var t6= nonRegisteredObj.abilities?.filter(d => t3.includes(d.id)).map(d => d.name)
        if (t5&&t5.length > 2) {
            t5.shift()
            t2=Array.from(selectedNewRegisteredData.type)
            t2.shift()
            setSelectedRegisteredData(prev=>({...prev,type: new Set(t2)}))
        }
        if (t6&&t6.length > 3) {
            t6.shift()
            t3=Array.from(selectedNewRegisteredData.abilities)
            t3.shift()
            setSelectedRegisteredData(prev=>({...prev,abilities: new Set(t3)}))
        }
    return ({
        // pokemon: t1 && nonRegisteredObj.pokemon? nonRegisteredObj.pokemon.filter(d => t1.includes(d.id)).name :[],
        pokemon: t4 && t4.length > 0? t4[0].name :null,
        types: t5 && t5.length > 0? t5.toString() :null,
        abilities: t6 && t6.length > 0? t6.toString() :null,
    })},[selectedNewRegisteredData])
    
    const [searchText, setST] =useState("")
    
    useEffect(() => {
        setLoading(true)
        // console.clear()
        if (doCRUD == 'update') {
            putAxios()
            console.log('update')
        }
        else if (doCRUD == 'create') {
            createAxios()
            console.log('create')
        }
        else if (doCRUD == 'delete') {
            deleteAxios()
            console.log('delete')
        }
        else if (searchText !== '' && doCRUD == ''){
            setCurrentPage(1)
            searchAxios()
            console.log('search')
        }
        else {
            getAxios()
            console.log('normal get')
        }
        setLoading(false)
        console.log('selectedNewRegisteredData.pokemon', Array.from(selectedNewRegisteredData.pokemon))
        console.log('selectedNewRegisteredData.type', Array.from(selectedNewRegisteredData.type))
        console.log('selectedNewRegisteredData.ability', Array.from(selectedNewRegisteredData.abilities))
        console.log('CRUD',doCRUD)
        console.log('Search',searchText)
        console.log('tempObj',tempObj)
        console.log('modalObj',modalObj)
        console.log('nonRegisteredObj',nonRegisteredObj)
    }, [doCRUD, searchText, curr, selectedNewRegisteredData])

    const getAxios=async()=>{
        console.clear()
        // console.log(doCRUD)
        const {dataAxios,meta} = await getStrapiT4(url+curr)
        const base1= (await getStrapiT1('http://localhost:1337/api/pokemon-names?sort=idx&populate=*&pagination[pageSize]=2000&filters[pokemon][id][$null]=true')).dataAxios
        const base2= (await getStrapiT2('http://localhost:1337/api/pokemon-types?sort=name&pagination[pageSize]=50')).dataAxios
        const base3= (await getStrapiT3('http://localhost:1337/api/pokemon-abilities?sort=name&pagination[pageSize]=2000')).dataAxios
        const base4= (await getStrapiT1('http://localhost:1337/api/pokemon-names?sort=idx&populate=*&pagination[pageSize]=2000&filters[pokemon][id][$null]=false')).dataAxios
        // console.log('base3 ', base3)
        setRegisteredObj({pokemon:base1, types:base2, abilities:base3, pokemon_finder:base4})
        // console.log('type',nonRegisteredObj.types)
        setPages(meta.pageCount)
        setTotalRows(meta.total)
        setData(dataAxios)
        // testStrapi()
        // console.log('url', url)
    }

    const searchAxios=async()=>{
        if (searchText!=='') {
            console.clear()
            const filter1=`&filters[$or][0][idx][$containsi]=${searchText}&filters[$or][1][pokemon_name][name][$containsi]=${searchText}&filters[$or][2][pokemon_abilities][name][$containsi]=${searchText}&filters[$or][3][pokemon_types][name][$containsi]=${searchText}`
            const filter2=`&filters[$or][2][pokemon_abilities][name][$containsi]=${searchText}&filters[$or][3][pokemon_types][name][$containsi]=${searchText}`
            const filterUrl=`http://localhost:1337/api/pokemons?sort=idx&populate=*`+filter1+filter2
            const {dataAxios,meta} = await getStrapiT4(filterUrl)
            setPages(meta.pageCount)
            setTotalRows(meta.total)
            setData(dataAxios)
        }
        
        // setST('')
    }

    const createAxios=async()=>{
        // console.clear()
        // console.log('create', selectedNewRegisteredData)
        var a = {
            pokemon_name:Array.from(selectedNewRegisteredData.pokemon).map(d=>parseInt(d)),
            pokemon_types:Array.from(selectedNewRegisteredData.type).map(d=>parseInt(d)),
            pokemon_abilities:Array.from(selectedNewRegisteredData.abilities).map(d=>parseInt(d)),
        }
        // console.log('register pokemon', a)
        const res = await createStrapiT4('http://localhost:1337/api/pokemons/',a)
        setCreateObj({})
        isDoCRUD('')
        onClose()
        // console.log(doCRUD)
        // location.reload()
        // alert()
    }

    const putAxios=async()=>{
        console.clear()
        var a =Array.from(selectedNewRegisteredData.pokemon)
        var b =Array.from(selectedNewRegisteredData.type)
        var c =Array.from(selectedNewRegisteredData.abilities)
        console.log('a', a)
        console.log('b', b)
        console.log('c', c)
        var d = {
            pokemon_names:a.length>0?a:modalObj.pokemon_names,
            pokemon_abilities:c.length>0?c:modalObj.pokemon_abilities,
            pokemon_types:b.length>0?b:modalObj.pokemon_types
        }
        console.log('d', d)
        console.log('modalobj put', modalObj)
        // console.log('selectedNewRegisteredData put', Array.from(selectedNewRegisteredData.pokemon))
        // console.log('selectedNewRegisteredData put', selectedNewRegisteredData)
        const res = await putStrapiT4('http://localhost:1337/api/pokemons/'+modalObj.id+'?populate=*',d)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const deleteAxios=async()=>{
        console.clear()
        const res = await deleteStrapiT4('http://localhost:1337/api/pokemons/'+modalObj.id)
        setModalObj({})
        isDoCRUD('')
        onClose()
        // location.reload()
        // alert()
    }

    const topContent=<>
    <div className="flex justify-between items-center">
        <p>Total Rows: {totalRows||0}</p>
        <Button color="primary" variant="ghost"
            onPress={()=>handleCRUD('create', 0)}
            isDisabled={nonRegisteredObj.pokemon && nonRegisteredObj.pokemon.length > 0? false:true}
        >Register New Pokemon</Button>
        <Input type="text" label='Search' 
            className="w-full sm:max-w-[44%]"
            isClearable 
            onClear={()=>setST('')}
            value={searchText}
            onChange={(e)=> setST(e.target.value)}
        />
    </div>
    </>
    const bottomContent=pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                total={pages}
                                loop
                                page={curr}
                                onChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                            ) : null
    const arrHeader=[
        // {label:'Id',key:0},
        {label:'Index',key:1},
        {label:'Icon',key:2},
        {label:'Pokemon',key:3},
        {label:'Type',key:4},
        {label:'Ability',key:5},
        {label:'Action',key:12},
    ]
    const myBreadCrumbs=(items, keyname, text = "")=>{
        // if (currentMBC !== "") {
        //     alert(currentMBC)
        // }
        // const mypopover=({title="", content})=><Popover showArrow placement="bottom">
        //                     {/* <PopoverTrigger>
        //                     </PopoverTrigger> */}
        //                     <PopoverContent className="p-1">
        //                         {title!=""?(titleprops)=>(
        //                             <div className="px-1 py-2">
        //                                 <h3 className="text-small font-bold" {...titleprops}>{title}</h3>
        //                                 <div className="text-tiny">{content}</div>
        //                             </div>
        //                         ):content}
        //                     </PopoverContent>
        //                 </Popover>
        return <Breadcrumbs
            size="sm"
            // separator="|"
            radius="full"
            // onAction={(key) => setCurrentMBC(key) }
            classNames={{
                list: "gap-2",
            }}
            itemClasses={{
                item: [
                    "px-2 py-0.5 border-small border-default-400 rounded-small",
                    "data-[current=true]:border-foreground data-[current=true]:bg-foreground data-[current=true]:text-background transition-colors",
                    "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-default-100",
                  ],
                separator: "hidden",
            }}
        >
            {items.map((d)=> <BreadcrumbItem 
                key={d.attributes.name} 
                isCurrent={false}
                // isCurrent={(currentMBC === d.attributes.name)}
                onPress={()=>alert(keyname == "pokemon_abilities"? text+" - "+d.attributes.flavor_text:d.attributes.name)}
                // onPress={()=>{return (keyname == "pokemon_abilities"? 
                //         <mypopover title={text} content={d.attributes.flavor_text} />
                //         :<mypopover content={d.attributes.name} />
                //     )}}
                >
                    {d.attributes.name}
                </BreadcrumbItem>)}
        </Breadcrumbs>
    }
    const rendercell=useCallback((keyname, valuefromkey, currentRowData=null)=>{
        switch (keyname) {
            case "icon":
                // console.log(valuefromkey)
                return (<><Image src={valuefromkey?valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "variant":
            //     return (<div style={{ display: 'flex', overflow: 'hidden' }}>
            //                 {
            //                     valuefromkey.map(v => <Image alt="no img" src={v} loading="lazy" key={v} />)
            //                 }
            //             </div>)
            case "illustration":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            case "cover":
                return (<><Image src={valuefromkey?'http://localhost:1337'+valuefromkey:'#'} alt={valuefromkey} loading="lazy"/></>)
            // case "idx"||"name"||"hp"||"atk"||"def"||"satk"||"sdef"||"speed":
            //     return valuefromkey
            case "pokemon_names":
                // console.log(valuefromkey)
                return valuefromkey?.attributes.name||''
            case "pokemon_types":
                // console.log(valuefromkey)
                return myBreadCrumbs(valuefromkey, "pokemon_types")
            case "pokemon_abilities":
                // console.log(valuefromkey)
                return myBreadCrumbs(valuefromkey, "pokemon_abilities", currentRowData)
            default:
                return valuefromkey
        }
    },[])
    const handleCRUD=(state, index)=>{
        setCreateObj({})
        setSelectedRegisteredData({pokemon: [], type: new Set(), abilities:new Set()})
        if (state == 'update'||state == 'delete'||state == 'display') {
            const t=data.find(obj => obj['idx'] === index || obj['id'] === index)
            console.log('t', t)
            console.log('d', nonRegisteredObj)
            console.log('d2', nonRegisteredObj.pokemon_finder)
            setTempObj(Object.assign(t))
            setModalObj(Object.assign(t))
            if (state == 'delete'){
                // console.log('t2', t.pokemon_names)
                // var a=[]
                // a.push(t.pokemon_names.id)
                setSelectedRegisteredData({
                    pokemon:nonRegisteredObj.pokemon_finder.filter(d=>d.id===t.pokemon_names.id).map(d=>d.id),
                    type:t.pokemon_types.map(d=>d.id),
                    abilities:t.pokemon_abilities.map(d=>d.id),
                })
                // console.log('selectedNewRegisteredData.pokemon', selectedNewRegisteredData.pokemon)
            }
        }
        setCRUDstate(state)
        onOpen()
    }
    const table=<Table
                    aria-label="T4"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    isStriped
                    selectionMode="single" 
                    color='success'
                >
                    <TableHeader>
                        {[...Array(arrHeader.length)].map((e,i)=>(
                            <TableColumn key={arrHeader[i].key} isRowHeader={true}
                            >{arrHeader[i].label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent={"No Data"} items={data?data:[]}
                            loadingContent={<Spinner label="Loading..." color="danger" labelColor="danger"/>}
                            loadingState={loading?'loading':'idle'}
                            isLoading={loading}
                    >
                        {(item)=>(
                            <TableRow key={item.id}>
                                { Object.entries(item)
                                .filter(([key]) => key !== 'idx')
                                .map((
                                    [key,value])=> <TableCell key={key}>
                                        {rendercell(key,value, item.pokemon_names?.attributes.name||'')}
                                        </TableCell>) 
                                }
                                <TableCell key={'action'}>
                                    <ButtonGroup>
                                        <Button color="primary" variant="ghost" key={'display'}
                                            onPress={()=>handleCRUD('display', item.idx || item.id)}
                                        >Detail</Button>
                                        <Button color="warning" variant="ghost" key={'update'} isDisabled={nonRegisteredObj.pokemon && nonRegisteredObj.pokemon.length > 0? false:true}
                                            onPress={()=>handleCRUD('update', item.idx || item.id)}
                                        >Change</Button>
                                        <Button color="danger" variant="ghost" key={'delete'}
                                            onPress={()=>{
                                                // setSelectedRegisteredData({
                                                //     pokemon:item.pokemon_names.id,
                                                //     type:item.pokemon_types.map(d=>d.id),
                                                //     abilities:item.pokemon_abilities.map(d=>d.id),
                                                // })
                                                // console.log('item.pokemon_names.id', new Set(item.pokemon_names.id))
                                                // console.log('item.pokemon_types.map(d=>d.id)', new Set(item.pokemon_types.map(d=>d.id)))
                                                // console.log('item.pokemon_abilities.map(d=>d.id)', new Set(item.pokemon_abilities.map(d=>d.id)))
                                                handleCRUD('delete', item.idx || item.id)
                                            }}
                                        >Delete</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
    const MyModal=React.memo((props)=>{
        // console.clear()
        var {obj={}, state=null}=props
        // console.log('state',state)
        // console.log('obj',obj)
        if (!state) {
            return null
        }
        if (state=='create') {
            obj=null
        }
        const handleChange=useCallback((key,value)=>{
            setModalObj((prev)=>({...prev, [key]:value}))
        },[])
        const handleChange2=useCallback((key,value)=>{
            setCreateObj((prev)=>({...prev, [key]:value}))
        },[])
        var modalContent=''
        var pokemonItem=state == 'delete'? nonRegisteredObj.pokemon_finder:nonRegisteredObj.pokemon
        // var pokemonItem=nonRegisteredObj.pokemon
        // console.log(obj)
        const modalNonCreate=<>
            <Input
            label="Old Data"
            value={obj && obj.pokemon_names?obj.pokemon_names.name:null}
            className="grid-rows-1"
            isDisabled={true}
            readOnly={true}
            />
            <Dropdown key={'pokemon'}>
                <DropdownTrigger>
                    <Button variant="bordered" 
                    isDisabled={state === 'delete'? true:false}
                    >
                        {displayedDD.pokemon? displayedDD.pokemon:'Select Non Registered Pokemon'}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Select Pokemon" items={pokemonItem}
                    // onAction={(k) => selectedNewRegisteredData.current={pokemon:k}}
                    selectionMode="single"
                    variant="faded"
                    selectedKeys={selectedNewRegisteredData.pokemon}
                    onSelectionChange={(k)=>setSelectedRegisteredData(prev=>({...prev,pokemon:k}))}
                >
                    {(item) => (
                    <DropdownItem
                        key={item.id}
                        textValue={item.name}
                        className="text-primary"
                        startContent={<Image src={item.icon} alt={item.name} width={40} height={40} loading="lazy"/>}
                    >
                        {item.name}
                    </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
            <Dropdown key={'type'}>
                <DropdownTrigger>
                    <Button variant="bordered" isDisabled={state === 'delete'? true:false}>{displayedDD.types? displayedDD.types:'Select Pokemon Type'}</Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Select Type" items={nonRegisteredObj.types}
                    selectionMode="multiple" variant="faded"
                    selectedKeys={selectedNewRegisteredData.type}
                    onSelectionChange={(k)=> setSelectedRegisteredData(prev=>({...prev,type: k}))}
                >
                    {(item) => (
                        <DropdownItem key={item.id} className="text-primary" textValue={item.name}>{item.name}  </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
            <Dropdown key={'ability'}>
                <DropdownTrigger>
                    <Button variant="bordered" isDisabled={state === 'delete'? true:false}>{displayedDD.abilities? displayedDD.abilities:'Select Pokemon Ability'}</Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Select Ability" items={nonRegisteredObj.abilities}
                    selectionMode="multiple" variant="faded"
                    selectedKeys={selectedNewRegisteredData.abilities}
                    onSelectionChange={(k)=> setSelectedRegisteredData(prev=>({...prev,abilities: k}))}
                >
                    {(item) => (
                        <DropdownItem key={item.id} className="text-primary" textValue={item.name}>{item.name} </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        </>
        const modalCreate=<>
        <Dropdown key={'pokemon'}>
            <DropdownTrigger>
                <Button variant="bordered" >
                    {displayedDD.pokemon? displayedDD.pokemon:'Select Non Registered Pokemon'}
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Select Pokemon" items={nonRegisteredObj.pokemon}
                // onAction={(k) => selectedNewRegisteredData.current={pokemon:k}}
                selectionMode="single"
                variant="faded"
                selectedKeys={selectedNewRegisteredData.pokemon}
                onSelectionChange={(k)=>setSelectedRegisteredData(prev=>({...prev,pokemon:k}))}
                closeOnSelect={false}
            >
                {(item) => (
                <DropdownItem
                    key={item.id}
                    textValue={item.name}
                    className="text-primary"
                    startContent={<Image src={item.icon} alt={item.name} width={40} height={40} loading="lazy"/>}
                >
                    {item.name}
                </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
        <Dropdown key={'type'}>
            <DropdownTrigger>
                <Button variant="bordered" >{displayedDD.types? displayedDD.types:'Select Pokemon Type'}</Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Select Type" items={nonRegisteredObj.types}
                selectionMode="multiple" variant="faded"
                selectedKeys={selectedNewRegisteredData.type}
                onSelectionChange={(k)=> setSelectedRegisteredData(prev=>({...prev,type: k}))}
                closeOnSelect={'false'}
            >
                {(item) => (
                    <DropdownItem key={item.id} className="text-primary" textValue={item.name}>{item.name}  </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
        <Dropdown key={'ability'}>
            <DropdownTrigger>
                <Button variant="bordered" >{displayedDD.abilities? displayedDD.abilities:'Select Pokemon Ability'}</Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Select Ability" items={nonRegisteredObj.abilities}
                selectionMode="multiple" variant="faded"
                selectedKeys={selectedNewRegisteredData.abilities}
                onSelectionChange={(k)=> setSelectedRegisteredData(prev=>({...prev,abilities: k}))}
                closeOnSelect={'false'}
            >
                {(item) => (
                    <DropdownItem key={item.id} className="text-primary" textValue={item.name}>{item.name} </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
        </>
        const modalbody=<>{state=='create'?modalCreate:modalNonCreate}</>
        switch (state) {
            case 'display':
                modalContent=<ModalContent >
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        <p className="text-small text-default-500">Detail</p>
                                        <div className="flex flex-col">
                                            <p className="text-small text-default-500">Id: {tempObj.idx||tempObj.id}</p>
                                            <p className="text-small text-default-500">Name: {tempObj.pokemon_names?.attributes.name}</p>
                                        </div>
                                        <Divider/>
                                    </ModalHeader>
                                    <ModalBody >
                                        <p>Type<br/></p><Divider/>
                                            {
                                                tempObj.pokemon_types && tempObj.pokemon_types.length > 0 ?
                                                [...Array(tempObj.pokemon_types.length)]
                                                .map((e,i)=>
                                                    <div className="text-small text-default-300" key={'type'+i}>
                                                        {tempObj.pokemon_types[i].attributes.name}
                                                    </div>
                                                ):'No Data'
                                            }
                                        <p >Abilities<br/></p><Divider/>
                                        {
                                            tempObj.pokemon_abilities && tempObj.pokemon_abilities.length > 0 ?
                                            [...Array(tempObj.pokemon_abilities.length)]
                                            .map((e,i)=>
                                                (
                                                    <>
                                                    <div key={'display'+i} className="text-medium text-default-300">
                                                    Name: {tempObj.pokemon_abilities[i].attributes.name}<br/>
                                                        Flavor Text: {tempObj.pokemon_abilities[i].attributes.flavor_text}<br/>
                                                        Effect: {tempObj.pokemon_abilities[i].attributes.effect}<br/>
                                                        <Divider/>
                                                    </div>
                                                    </>
                                                )
                                            )
                                        :'No Data'}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                        </Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'create':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create New Pokemon Ability</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('create')}>Create</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'update':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader >Update Registered Pokemon</ModalHeader>
                                    <ModalBody>
                                    {modalbody}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" 
                                            onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('update')}>Update</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            case 'delete':
                modalContent=<ModalContent>
                                {(onClose)=>(
                                <>
                                    <ModalHeader>Delete Registered Pokemon</ModalHeader>
                                    <ModalBody>{modalbody}</ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
                                        <Button color="primary" variant="flat" onPress={()=>isDoCRUD('delete')}>Delete</Button>
                                    </ModalFooter>
                                </>)}
                            </ModalContent>
                break;
            // default:
            //     break;
        }
        return <Modal 
                    isOpen={isOpen}
                    onClose={()=>{
                        // setSelectedRegisteredData({})
                        setModalObj({})
                        onClose()}}
                    onOpenChange={onOpenChange}
                    
                    scrollBehavior="outside"
                    size="lg"
                >
                    {modalContent}
                </Modal>
    },[handleCRUD])

    return(
        <>
            {table}
            {<MyModal state={crudState} obj={modalObj}/>}
        </>
    )
}

export const TableT5=({url})=>{
    const dataForm=useRef({
        pokedex:{}, regPokemonToPokedex:[]
    })

    const getAxios=async()=>{
        console.clear()
        // console.log(doCRUD)
        // const {dataAxios,meta} = await getStrapiT4(url+curr)
        // const base1= (await getStrapiT1('http://localhost:1337/api/pokemon-names?sort=idx&populate=*&pagination[pageSize]=2000&filters[pokemon][id][$null]=true')).dataAxios
        // const base2= (await getStrapiT2('http://localhost:1337/api/pokemon-types?sort=name&pagination[pageSize]=50')).dataAxios
        // const base3= (await getStrapiT3('http://localhost:1337/api/pokemon-abilities?sort=name&pagination[pageSize]=2000')).dataAxios
        // const base4= (await getStrapiT1('http://localhost:1337/api/pokemon-names?sort=idx&populate=*&pagination[pageSize]=2000&filters[pokemon][id][$null]=false')).dataAxios
        // // console.log('base3 ', base3)
        // setRegisteredObj({pokemon:base1, types:base2, abilities:base3, pokemon_finder:base4})
        // // console.log('type',nonRegisteredObj.types)
        // setPages(meta.pageCount)
        // setTotalRows(meta.total)
        // setData(dataAxios)
        // testStrapi()
        // console.log('url', url)
    }

    const searchAxios=async()=>{
        // if (searchText!=='') {
        //     console.clear()
        //     const filter1=`&filters[$or][0][idx][$containsi]=${searchText}&filters[$or][1][pokemon_name][name][$containsi]=${searchText}&filters[$or][2][pokemon_abilities][name][$containsi]=${searchText}&filters[$or][3][pokemon_types][name][$containsi]=${searchText}`
        //     const filter2=`&filters[$or][2][pokemon_abilities][name][$containsi]=${searchText}&filters[$or][3][pokemon_types][name][$containsi]=${searchText}`
        //     const filterUrl=`http://localhost:1337/api/pokemons?sort=idx&populate=*`+filter1+filter2
        //     const {dataAxios,meta} = await getStrapiT4(filterUrl)
        //     setPages(meta.pageCount)
        //     setTotalRows(meta.total)
        //     setData(dataAxios)
        // }
        
        // setST('')
    }

    const createAxios=async()=>{
        console.clear()
        // console.log('create', selectedNewRegisteredData)
        // var a = {
        //     pokemon_name:Array.from(selectedNewRegisteredData.pokemon).map(d=>parseInt(d)),
        //     pokemon_types:Array.from(selectedNewRegisteredData.type).map(d=>parseInt(d)),
        //     pokemon_abilities:Array.from(selectedNewRegisteredData.abilities).map(d=>parseInt(d)),
        // }
        // // console.log('a', a)
        // const res = await createStrapiT4('http://localhost:1337/api/pokemons/',createObj)
        // setCreateObj({})
        // isDoCRUD('')
        // onClose()
        // console.log(doCRUD)
        // location.reload()
        // alert()
    }

    const putAxios=async()=>{
        console.clear()
        // var a =Array.from(selectedNewRegisteredData.pokemon)
        // var b =Array.from(selectedNewRegisteredData.type)
        // var c =Array.from(selectedNewRegisteredData.abilities)
        // console.log('a', a)
        // console.log('b', b)
        // console.log('c', c)
        // var d = {
        //     pokemon_names:a.length>0?a:modalObj.pokemon_names,
        //     pokemon_abilities:c.length>0?c:modalObj.pokemon_abilities,
        //     pokemon_types:b.length>0?b:modalObj.pokemon_types
        // }
        // console.log('d', d)
        // console.log('modalobj put', modalObj)
        // console.log('selectedNewRegisteredData put', Array.from(selectedNewRegisteredData.pokemon))
        // console.log('selectedNewRegisteredData put', selectedNewRegisteredData)
        // const res = await putStrapiT4('http://localhost:1337/api/pokemons/'+modalObj.id+'?populate=*',d)
        // setModalObj({})
        // isDoCRUD('')
        // onClose()
        // location.reload()
        // alert()
    }

    const deleteAxios=async()=>{
        console.clear()
        // const res = await deleteStrapiT4('http://localhost:1337/api/pokemons/'+modalObj.id)
        // setModalObj({})
        // isDoCRUD('')
        // onClose()
        // location.reload()
        // alert()
    }
}