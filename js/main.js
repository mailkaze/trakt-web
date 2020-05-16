const traktClientId = 'fd4ce6e13c2ff160d8b2ba0ca3cd67282c43f794c155faa35d018593338d2b6c'
const traktClientSecret = 'ca2b43e9fd876dbe5feec594035584341ace0445e419e425c3825fd01498bafb'
const tmdbApiKey = 'b5b72fd56d635b01367976dd0ef04121'
const traktUrl = 'https://api.trakt.tv'
const tmdbUrl = 'https://api.themoviedb.org/3'
const tmdbImageUrl = 'https://image.tmdb.org/t/p/'
const tmdbImageSize = 'w154'

// TODO: mostrar mensaje de cargando
// no mostrar las tarjetas que no tienen imagen
// redondear el rating

const getRating = async (slug, media) => {
    const res = await fetch(`${traktUrl}/${media}/${slug}/ratings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': traktClientId
        }
    })
    const ratings = await res.json()
    return ratings.rating
}

const getPoster = async (tmdbId, media) => {
    const res = await fetch(`${tmdbUrl}/${media}/${tmdbId}?api_key=${tmdbApiKey}`)
    const data = await res.json()
    const poster = `${tmdbImageUrl}${tmdbImageSize}${data.poster_path}`
    return poster
}

const searchMedia = async query => {
    const res = await fetch(`${traktUrl}/search/movie,show?query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': traktClientId
        }
    })
    const data = await res.json()
    let elements = []
    let element = {}

    for (e of data) {
        if (e.type === 'movie') {
            element = {
                img: await getPoster(e.movie.ids.tmdb, 'movie'),
                title: e.movie.title,
                year: e.movie.year,
                rating: await getRating(e.movie.ids.slug, 'movies')
            }
        } else if (e.type === 'show') {
            element = {
                img: await getPoster(e.show.ids.tmdb, 'tv'),
                title: e.show.title,
                year: e.show.year,
                rating: await getRating(e.show.ids.slug, 'shows')
            }
        }
        elements.push(element)
    }
    return elements
}

const renderCards = data => {
    const cardsContainer = document.getElementsByClassName('cards-container')[0]
    cardsContainer.innerHTML = ''
    const fragment = new DocumentFragment
    data.forEach(e => {
        const card = document.createElement('article')
        card.classList.add('card')
        card.innerHTML = `
            <picture>
                <img src=${e.img} alt=${e.title}>
            </picture>
            <div class="content">
                <h4 class="title">${e.title}</h4>
                <p class="year">${e.year}</p>
                <p class="ratings">${e.rating}</p>
            </div>
        `
        fragment.appendChild(card)
    })
    cardsContainer.appendChild(fragment)
}

const searchBox = document.getElementById('searchBox')

searchBox.addEventListener('keyup',async e => {
    if (e.keyCode === 13) {
        const data = await searchMedia(searchBox.value)
        renderCards(data)
    }
})