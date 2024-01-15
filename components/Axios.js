import axios from "axios"
import nextConfig from "../next.config"


const pokeApi_pokemon_offset=1200
const pokeApi_ability_offset=500

export const TryAxios=async()=>{
    const res=await axios(process.env.NEXT_PUBLIC_HOST_POKEMONAPI).then(data => data.data).catch((err)=>console.log('err 9', err.message))
    return res
}

export const GetAll=async(host,enpointArr)=>{
    const res=await axios.all(enpointArr.map(m=>{
        // console.log(host+m)
        return axios.get(`${host}${m}`).then(d=>d.data.data);
    })).catch(err => console.log('err 17',err.message))
    // console.log('res', res)
    return res
}

export const DownloadData=async(props)=>{
    // const abilities=await downloadAbility()
    // const types=await downloadType()
    var pokemons=[], types=[], abilities=[]
    // for (let index = 0; index < 200/50; index++) {
    //     pokemons.push(await downloadPokemon(index*50))
        
    // }
    // console.log(180%50)
    // console.log('pokemons', pokemons.flat())
}
export const downloadPokemon=async(offset = 0,limit = 9999)=>{
    // console.log('first', process.env.NEXT_PUBLIC_HOST_POKEMONAPI)//success
    
    // const process1="https://pokeapi.co/api/v2/"
    const process1=process.env.NEXT_PUBLIC_HOST_POKEMONAPI
    const linkPokemon=`${process1}pokemon?offset=${offset}&limit=${limit}`
    // const linkPokemon=`${process1}pokemon?offset=${offset}&limit=50`
    // console.log('first', linkPokemon)
    var urls=await extractUrls(linkPokemon)

    var urls_res=(await axios.all(urls.map(async(url) => {return await axios(url).then(d => d.data)})).catch(err => console.log('err 41', err)))
    var ctr=1
    urls_res=urls_res.map(data=>({
        idx:ctr++,
        icon:data.sprites.front_default,
        name:data.name,
        variant:[data.sprites.back_default, data.sprites.front_default, data.sprites.back_shiny, data.sprites.front_shiny],
        hp:data.stats[0].base_stat,
        atk:data.stats[1].base_stat,
        def:data.stats[2].base_stat,
        satk:data.stats[3].base_stat,
        sdef:data.stats[4].base_stat,
        speed:data.stats[5].base_stat
    }))
    // var idx=1
    // urls_res=urls_res.map(data=>({
    //     icon:data.icon,
    //     name:(idx++)+data.name,
    //     variant:data.variant,
    //     hp:data.hp,
    //     atk:data.atk,
    //     def:data.def,
    //     satk:data.satk,
    //     sdef:data.sdef,
    //     speed:data.speed
    // }))
    
    // const postUrl=`http://localhost:1337/api/tests/`
    // const postUrl=`http://localhost:1337/api/pokemon-names/`
    // const doPost= await Promise.all(urls_res.map(t=>axios.post(postUrl,
    // // const doPost= await Promise.all(urls_res.slice(0, 5).map(t=>axios.post(postUrl,
    //     {data:{
    //         idx:t.idx,
    //         name:t.name,
    //         icon:t.icon,
    //         hp:t.hp,
    //         atk:t.atk,
    //         def:t.def,
    //         satk:t.satk,
    //         sdef:t.sdef,
    //         speed:t.speed,
    //     }}
    // )))
    // return doPost
    // console.log('urls_res', urls_res)
    return urls_res
}
export const downloadType=async(offset = 0,limit = 9999)=>{
    const process1=process.env.NEXT_PUBLIC_HOST_POKEMONAPI
    const linkType=`${process1}type?offset=${offset}&limit=${limit}`
    var idx=1
    const urls=await axios(linkType)
        .then(types=> (types.data.results.map(t => ({idx:idx++,name:t.name}))))
                    // .then(t => console.log('t', t))                
                    .catch(err => console.log('err 59', err.message))
    // console.log('urls', urls)
    // const postUrl=`http://localhost:1337/api/tests/`
    // const postUrl=`http://localhost:1337/api/pokemon-types/`
    // const doPost=await Promise.all(urls.map(t=>axios.post(postUrl,
    //     {data:{
    // //         idx:t.idx
    //         name:t.name
    //     }}
    // )))
    return urls
    
    // return doPost
}
export const downloadAbility=async(offset = 0,limit = 9999)=>{
    const process1=process.env.NEXT_PUBLIC_HOST_POKEMONAPI
    const linkAbility=`${process1}ability?offset=${offset}&limit=${limit}`
    // const linkAbility=`https://pokeapi.co/api/v2/ability/?offset=${offset}&limit=500`
    
    var urls=await extractUrls(linkAbility)
    var urls_res= await axios.all(urls.map(url=>{return axios(url).then(d => d.data)}))
                            .catch(err=>console.log('err 67',err.message)) //get raw data for findOne
                        // console.log(urls_res)
    urls_res=urls_res.map(data=>({name:data.name, flavor_text:data.flavor_text_entries, effect:data.effect_entries[1]}))
    // console.log("type",typeof urls_res[0].flavor_text)
    // console.log("type",urls_res[0].flavor_text.length)
    // console.log("type",urls_res[0].flavor_text)
    // console.log("type",urls_res[0].flavor_text.includes({language: {name:"en"}}))
    // const temp = urls_res[0].flavor_text.filter(item => item.language && item.language.name === "en")
    //                                     .map(item => item.flavor_text)
    // console.log("get count", temp.length)
    // console.log("get", temp)

    var idx=1
    const res = urls_res.map(sanited=>{
        const getFlavorText = sanited.flavor_text.filter(item => item.language && item.language.name === "en")
        .map(item => item.flavor_text)
        return {
            idx:idx++,
            name:sanited.name,
            effect:sanited.effect?sanited.effect.short_effect:"-",
            flavor_text:getFlavorText.length>0?getFlavorText[0]:"-"
        }
    })
    // const postUrl=`http://localhost:1337/api/tests/`
    // const postUrl=`http://localhost:1337/api/pokemon-abilities/`
    // const doPost= Promise.all(res.map(t=>axios.post(postUrl,
    //     {data:{
    // //         idx:t.idx,
    //         name:t.name,
    //         flavor_text:t.flavor_text,
    //         effect:t.effect
    //     }}
    // )))
    // console.log(res)
    return res
}
const extractUrls=async(link)=>{
    return await axios.get(link)
                    .then(rawObjects=>{
                        // console.log(94, rawObjects)
                        const t1=rawObjects.data.results
                        const urls = Object.entries(t1).map(([key,value])=> value.url)
                        return urls
                        // console.log(typeof abilities.data.results) //must object
                        // console.log(abilities.data.results) //format in name & url
                        // console.log(urls.length)
                        // console.log(urls[0])
                        // console.log('res', urls_res)
                    })
                    .catch(err => console.log('err', err.message))
}

export const testStrapi=async()=>{
    
    // for (let index = 0; index < 14; index++) {
    //     // console.log('offset', (index*x1))
    //     // console.log('limit', x1 * (index+1))
        
    //     apis.push(res)
    // }
    // console.log('apis1', apis)
    // apis=apis.flat()
    // console.log('apis2', apis)
    
    
    // const r1 = await axios(u1).then(d=>d.data)
    // console.log('r1', r1.data[0].attributes.t1?r1.data[0].attributes.t1.data.map(i=>i.attributes.url):null)
}

export const backupPokemonIdx=async()=>{
    console.clear()
    const c1=`http://localhost:1337/api/pokemon-names?filters[name][$containsi]=`
    const c2=`http://localhost:1337/api/pokemon-types?filters[name][$containsi]=`
    const c3=`http://localhost:1337/api/pokemon-abilities?filters[name][$containsi]=`
    var x = 1
    var x1=100
    var apis=[]
    var pokemons=await (await getStrapiT1('http://localhost:1337/api/pokemon-names?sort=idx&pagination[start]=0&pagination[limit]=1400')).dataAxios
    var types=await (await getStrapiT1('http://localhost:1337/api/pokemon-types?sort=idx&pagination[start]=0&pagination[limit]=30')).dataAxios
    var abilities=await (await getStrapiT1('http://localhost:1337/api/pokemon-abilities?sort=idx&pagination[start]=0&pagination[limit]=400')).dataAxios
    var getPokemonFromAPI=`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1400`
    var extractedUrl=await extractUrls(getPokemonFromAPI)
    var data=await Promise.all(extractedUrl.map(async u1=>await axios(u1).then(d => d.data)))
    const res = await data.map(d => ({
        id:x++,
        name:pokemons.find(function(x2){return (x2.name === d.name)}).id,
        types:d.types.map(a1=>types.find(function(x2){return (x2.name === a1.type.name)}).id),
        abilities:d.abilities.map(a1=>abilities.find(function(x2){return (x2.name === a1.ability.name)}).id),
    }))
    var final_res=res.map(d=>({
        idx:d.id,
        pokemon_name:d.name,
        pokemon_types:d.types,
        pokemon_abilities:d.abilities,
    }))
    console.log('res', {data:final_res})
    console.log('res', {data:final_res[0]})
    var last = await Promise.all(final_res.map(async d => await axios.put('http://localhost:1337/api/pokemons/'+d.idx,{data:d})))
    console.log('last', last)
}

export const getStrapiT1=async(url)=>{
    const res=await axios.get(url).then(d=>d.data)
    // console.log('url', url)
    // console.log('res', await res.data[0].attributes.illustration)
    const data=await res.data.map(d => ({
        id:d.id,
        idx:d.attributes.idx,
        name:d.attributes.name,
        icon:d.attributes.icon,
        cover:d.attributes.cover.data?.attributes.url||'',
        // illustration:d.attributes.illustration.data?.map(i=>console.log('i', i)),
        illustration:d.attributes.illustration.data?.map(i=>i.attributes.url)||[],
        hp:d.attributes.hp,
        atk:d.attributes.atk,
        def:d.attributes.def,
        satk:d.attributes.satk,
        sdef:d.attributes.sdef,
        speed:d.attributes.speed,
    }))
    const meta=res.meta.pagination
    // console.log('data', data)
    // console.log('meta', meta)
    // const res=await axios.get(`http://127.0.0.1:1337/api/tests?populate=t1&populate=t2`)
    // const data=res.data.data.map(d => ({
    //     id:d.id,
    //     t1:d.attributes.t1.data?d.attributes.t1.data[1].attributes.url:null}))
    // console.log('data', data)
    return {dataAxios:data,meta}
}
export const createStrapiT1=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // dataContent=dataContent.data
    var data=dataContent
    // console.log('url', url)
    // console.log('data', {data})
    const res=await axios.post(url,{data}).then(d=>console.log('create success', d))
}
export const putStrapiT1=async(url,dataContent)=>{
    var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    const res=await axios.put(url,{data}).then(d=>console.log('put success', d))
}
export const deleteStrapiT1=async(url)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // const res=await axios.put(url,{data}).then(d=>console.log('success', d))
    const res=await axios.delete(url).then(d=>console.log('delete success', d))
}

export const getStrapiT2=async(url)=>{
    const res=await axios.get(url).then(d=>d.data)
    // console.log('url', url)
    // console.log('res', await res.data[0].attributes.illustration)
    const data=await res.data.map(d => ({
        id:d.id,
        idx:d.attributes.idx,
        name:d.attributes.name,
    }))
    const meta=res.meta.pagination
    return {dataAxios:data,meta}
}
export const createStrapiT2=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // dataContent=dataContent.data
    var data=dataContent
    // console.log('url', url)
    // console.log('data', {data})
    const res=await axios.post(url,{data}).then(d=>console.log('create success', d))
}
export const putStrapiT2=async(url,dataContent)=>{
    var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    const res=await axios.put(url,{data}).then(d=>console.log('put success', d))
}
export const deleteStrapiT2=async(url)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // const res=await axios.put(url,{data}).then(d=>console.log('success', d))
    const res=await axios.delete(url).then(d=>console.log('delete success', d))
}

export const getStrapiT3=async(url)=>{
    const res=await axios.get(url).then(d=>d.data)
    // console.log('url', url)
    // console.log('res', await res.data[0].attributes.illustration)
    const data=await res.data.map(d => ({
        id:d.id,
        idx:d.attributes.idx,
        name:d.attributes.name,
        flavor_text:d.attributes.flavor_text,
        effect:d.attributes.effect,
    }))
    const meta=res.meta.pagination
    return {dataAxios:data,meta}
}
export const createStrapiT3=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // dataContent=dataContent.data
    var data=dataContent
    // console.log('url', url)
    // console.log('data', {data})
    const res=await axios.post(url,{data}).then(d=>console.log('create success', d))
}
export const putStrapiT3=async(url,dataContent)=>{
    var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    const res=await axios.put(url,{data}).then(d=>console.log('put success', d))
}
export const deleteStrapiT3=async(url)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // const res=await axios.put(url,{data}).then(d=>console.log('success', d))
    const res=await axios.delete(url).then(d=>console.log('delete success', d))
}

export const getStrapiT4=async(url)=>{
    const res=await axios.get(url).then(d=>d.data)
    // console.log('url', url)
    // console.log('res', await res.data[0].attributes.illustration)
    // console.log('res', await res.data)
    const data=await res.data.map(d => ({
        id:d.id,
        idx:d.attributes.idx,
        icon:d.attributes.pokemon_name.data?.attributes.icon||'',
        pokemon_names:d.attributes.pokemon_name.data,
        pokemon_types:d.attributes.pokemon_types.data,
        pokemon_abilities:d.attributes.pokemon_abilities.data,
    }))
    const meta=res.meta.pagination
    return {dataAxios:data,meta}
}
export const createStrapiT4=async(url,dataContent)=>{
    console.log('data in axios', {data:dataContent})
    const res=await axios.post(url,{data:dataContent}).then(d=>console.log('create success', d))
}
export const putStrapiT4=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    var data={
        pokemon_name:null,
        pokemon_types:null,
        pokemon_abilities:null,
    }
    if (dataContent.pokemon_names) {
        data.pokemon_name=dataContent.pokemon_names.id||dataContent.pokemon_names
    }
    if (dataContent.pokemon_types) {
        data.pokemon_types=dataContent.pokemon_types[0].id?dataContent.pokemon_types.map(d=>d.id):dataContent.pokemon_types
    }
    if (dataContent.pokemon_abilities) {
        data.pokemon_abilities=dataContent.pokemon_abilities[0].id?dataContent.pokemon_abilities.map(d=>d.id):dataContent.pokemon_abilities
    }
    console.log('data in axios', {data:data})
    const res=await axios.put(url,{data}).then(d=>console.log('put success', d)).catch(e=>console.log('failed 369', e))
}
export const deleteStrapiT4=async(url)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // const res=await axios.put(url,{data}).then(d=>console.log('success', d))
    console.log('url', url)
    const res=await axios.delete(url).then(d=>console.log('delete success', d)).catch(e=>console.log('failed 375', e))
}

export const getStrapiT5=async(url)=>{
    // const res=await axios.get(url).then(d=>d.data)
    // // console.log('url', url)
    // // console.log('res', await res.data[0].attributes.illustration)
    // // console.log('res', await res.data)
    // const data=await res.data.map(d => ({
    //     id:d.id,
    //     idx:d.attributes.idx,
    //     icon:d.attributes.pokemon_name.data?.attributes.icon||'',
    //     pokemon_names:d.attributes.pokemon_name.data,
    //     pokemon_types:d.attributes.pokemon_types.data,
    //     pokemon_abilities:d.attributes.pokemon_abilities.data,
    // }))
    // const meta=res.meta.pagination
    // return {dataAxios:data,meta}
}
export const createStrapiT5=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // dataContent=dataContent.data
    // console.log('url', url)
    var data=dataContent
    console.log('data', {data})
    // const res=await axios.post(url,{data}).then(d=>console.log('create success', d))
}
export const putStrapiT5=async(url,dataContent)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    var data={
        pokemon_name:null,
        pokemon_types:null,
        pokemon_abilities:null,
    }
    if (dataContent.pokemon_names) {
        data.pokemon_name=dataContent.pokemon_names.id||dataContent.pokemon_names
    }
    if (dataContent.pokemon_types) {
        data.pokemon_types=dataContent.pokemon_types[0].id?dataContent.pokemon_types.map(d=>d.id):dataContent.pokemon_types
    }
    if (dataContent.pokemon_abilities) {
        data.pokemon_abilities=dataContent.pokemon_abilities[0].id?dataContent.pokemon_abilities.map(d=>d.id):dataContent.pokemon_abilities
    }
    console.log('data in axios', {data:data})
    // const res=await axios.put(url,{data}).then(d=>console.log('put success', d)).catch(e=>console.log('failed 369', e))
}
export const deleteStrapiT5=async(url)=>{
    // var data=Object.fromEntries(Object.entries(dataContent).filter(([key]) => key !== 'id' && key !== 'idx'))
    // const res=await axios.put(url,{data}).then(d=>console.log('success', d))
    console.log('url', url)
    // const res=await axios.delete(url).then(d=>console.log('delete success', d)).catch(e=>console.log('failed 375', e))
}