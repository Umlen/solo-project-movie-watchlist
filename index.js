const searchInputEl = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const movieListEl = document.querySelector('.movie-list');

searchBtn.addEventListener('click', getListPages);

function getListPages() {
    const searchTitle = searchInputEl.value.replaceAll(' ', '+');
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
    moviesArr.forEach( movie => {
        fetch(`http://www.omdbapi.com/?apikey=4ddb92a8&i=${movie.imdbID}`)
            .then( response => response.json() )
            .then( data => {
                renderMovieList(data);
            } );
    } );
}

function renderPageNums(pages) {
    let pagesStr = '';
    for(let i = 1; i <= pages; i++) {
        pagesStr += `<span class="page-num">${i}</span>`;
    }
    movieListEl.innerHTML = `<div class="pages-wrapper">${pagesStr}</div>`;
}

function renderMovieList(movieObj) {
    const movieStr = `
        <div class="movie-wrapper">
            <img src="${movieObj.Poster}" alt="${movieObj.Title} poster" class="movie-poster">
            <div class="movie-info-wrapper">
                <h3 class="movie-title">${movieObj.Title}</h3>
                <p class="movie-plot">${movieObj.Plot}</p>
            </div>
        </div>
    `;
    movieListEl.innerHTML = movieStr + movieListEl.innerHTML;
}