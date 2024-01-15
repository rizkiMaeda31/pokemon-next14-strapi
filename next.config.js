/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        mypokeapi:"pokemon-names,pokemon-types,pokemon-abilities,pokemons,pokedexes",
        host_mypokeapi:"http://localhost:1337/api/",
        host_pokeapi:"https://pokeapi.co/v2/"
    },
    reactStrictMode: false,
}

module.exports = nextConfig
