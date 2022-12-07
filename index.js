const searchInputEl = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const movieListEl = document.querySelector('.movie-list');
const pagesWrapperEl = document.querySelector('.pages-wrapper');

let searchTitle = '';

searchBtn.addEventListener('click', getListPages);

function getListPages() {
    pagesWrapperEl.innerHTML = '';
    searchTitle = searchInputEl.value.replaceAll(' ', '+');
    fetch(`http://www.omdbapi.com/?apikey=4ddb92a8&s=${searchTitle}`)
        .then( response => response.json() )
        .then( data => {
            const pages =  Math.ceil( data.totalResults / 10 );
            renderPageNums(pages);
            getMovieList(searchTitle, 1);
        } );
}

function getMovieList(title, page) {
    fetch(`http://www.omdbapi.com/?apikey=4ddb92a8&s=${title}&page=${page}`)
        .then( response => response.json() )
        .then( data => {
            getMoviesInfo(data.Search);
        } );
}

function getMoviesInfo(moviesArr) {
    movieListEl.innerHTML = '';
    moviesArr.forEach( movie => {
        fetch(`http://www.omdbapi.com/?apikey=4ddb92a8&i=${movie.imdbID}`)
            .then( response => response.json() )
            .then( data => {
                console.log(data);
                renderMovieList(data);
            } );
    } );
}

function renderPageNums(pages) {
    pagesWrapperEl.innerHTML = `<span class="page-num page-num-selected">1</span>`;
    for(let i = 2; i <= pages; i++) {
        pagesWrapperEl.innerHTML += `<span class="page-num">${i}</span>`;
    }
    pagesWrapperEl.addEventListener( 'click', (e) => pagesHandler(e) );
}

function pagesHandler(e) {
    if ( e.target.classList.contains('page-num') ) {
        for(let page of pagesWrapperEl.children) {
            page.classList.remove('page-num-selected')
        }
        e.target.classList.add('page-num-selected');
        getMovieList(searchTitle, e.target.textContent);
    }
} 

function renderMovieList(movieObj) {
    document.querySelector('.list-initial-state').classList.add('hide');
    const movieStr = `
        <div class="movie-wrapper">
            <img src="${movieObj.Poster}" alt="${movieObj.Title} poster" class="movie-poster">
            <div class="movie-info-wrapper">
                <div class="wrapper">
                    <h3 class="movie-title">${movieObj.Title}</h3>
                    <p>${movieObj.imdbRating}</p>
                </div>
                <div class="wrapper">
                    <p>${movieObj.Runtime}</p>
                    <p>${movieObj.Genre}</p>
                    <p>Watchlist</p>
                </div>
                <p class="movie-plot">${movieObj.Plot}</p>
            </div>
        </div>
    `;
    movieListEl.innerHTML += movieStr;
}