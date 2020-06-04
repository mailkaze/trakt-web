const traktClientId = 'fd4ce6e13c2ff160d8b2ba0ca3cd67282c43f794c155faa35d018593338d2b6c'
const tmdbApiKey = 'b5b72fd56d635b01367976dd0ef04121'
const traktUrl = 'https://api.trakt.tv'
const tmdbUrl = 'https://api.themoviedb.org/3'
const tmdbImageUrl = 'https://image.tmdb.org/t/p/'
const tmdbImageSize = 'w154'

const searchBox = document.getElementById('searchBox')
const cardsContainer = document.getElementsByClassName('cards-container')[0]
const loadMore = document.getElementById('load-more')
const checkbox = document.getElementById('dark-mode-checkbox')
const searchIcon = document.getElementsByClassName('search-icon')[0]

let currentPage = 0
let totalPages = 0

// que la paginación se carge al hacer scroll casi al fondo

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
    let poster = ''
    data.poster_path
    ? poster = `${tmdbImageUrl}${tmdbImageSize}${data.poster_path}`
    : poster = null
    return poster
}

const searchMedia = async (query, page=1) => {
    const res = await fetch(`${traktUrl}/search/movie,show?query=${query}&page=${page}&limit=12`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': traktClientId
        }
    })
    currentPage = res.headers.get('X-Pagination-Page')
    totalPages = res.headers.get('X-Pagination-Page-Count')
    console.log('current page: ', currentPage, 'total pages: ', totalPages)
    const data = await res.json()
    console.log(data)
    let element = {}

    for (i = 0; i < 12; i++) { 
        const e = data[i]
        if (e.type === 'movie') {
            element = {
                img: await getPoster(e.movie.ids.tmdb, 'movie'),
                title: e.movie.title,
                year: e.movie.year,
                rating: await getRating(e.movie.ids.slug, 'movies'),
                imdb: e.movie.ids.imdb
            }
        } else if (e.type === 'show') {
            element = {
                img: await getPoster(e.show.ids.tmdb, 'tv'),
                title: e.show.title,
                year: e.show.year,
                rating: await getRating(e.show.ids.slug, 'shows'),
                imdb: e.show.ids.imdb
            }
        }
        renderCard(element)
    }
    currentPage++
    if (currentPage <= totalPages) {
        loadMore.style.display = 'block'
    }
}

const renderCard = data => {
    if (data.img) { 
        const card = document.createElement('article')
        card.classList.add('card')
        const rating = Math.round(data.rating * 10)
        const imdbUrl = 'https://www.imdb.com/title/'
        card.innerHTML = `
            <a href=${imdbUrl}${data.imdb} target="_blank">
                <picture>
                    <img src=${data.img} alt=${data.title}>
                </picture>
                <div class="content">
                    <h4 class="title">${data.title}</h4>
                    <p class="year"><i class="fas fa-calendar-alt"></i><span>${data.year}</span></p>
                    <p class="ratings"><i class="fas fa-star"></i><span>${rating}%</span></p>
                </div>
            </a>
        `
        cardsContainer.appendChild(card)
    }
}

searchBox.addEventListener('keyup', async e => {
    if (e.keyCode === 13) {
        cardsContainer.innerHTML = ''
        loadMore.style.display = 'none'
        await searchMedia(searchBox.value)
    }
})

searchIcon.addEventListener('click',async e => {
    cardsContainer.innerHTML = ''
    loadMore.style.display = 'none'
    await searchMedia(searchBox.value)
})

loadMore.addEventListener('click', async () => {
    loadMore.style.display = 'none'
    await searchMedia(searchBox.value, currentPage)
})

checkbox.addEventListener('change', function(e) {
    if (e.target.checked === true) {
        document.body.classList.add('is-dark-mode')
    } else {
        document.body.classList.remove('is-dark-mode')
    }
})

// const renderLoading = () => {
//     const loading = document.createElement('h3')
//     loading.classList.add('loading')
//     loading.textContent = 'Loading, please wait ...'
//     const cardsContainer = document.getElementsByClassName('cards-container')[0]
//     cardsContainer.innerHTML = ''
//     cardsContainer.appendChild(loading)
// }

// window.addEventListener('scroll', async () => {
//     if (this.oldScroll < this.scrollY) {
//         if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300) {

//         }
//     }
//     this.oldScroll = this.scrollY
// })