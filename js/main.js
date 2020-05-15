const clientId = 'fd4ce6e13c2ff160d8b2ba0ca3cd67282c43f794c155faa35d018593338d2b6c'
const clientSecret = 'ca2b43e9fd876dbe5feec594035584341ace0445e419e425c3825fd01498bafb'
const url = 'https://api.trakt.tv'

const searchMovie = async query => {
    const res = await fetch(`${url}/search/movie,show?query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': clientId
        }
    })
    const data = await res.json()
    console.log(data)
    // forEach que llama a la función que pide el rating
    // dentro del mismo forEach saca el id de tmdb y llama a la funcion que monta y trae la url de la imagen
    // No devolvemos data, sino un array de objetos con imagen, titulo, año y rating
    return data
}

const input = document.getElementById('searchBox')

input.addEventListener('keyup', async e => {
    if (e.keyCode === 13) {
        const data = await searchMovie(input.value)
        //con lo que recibimos montamos las tarjetas y las cargamos
    }
})