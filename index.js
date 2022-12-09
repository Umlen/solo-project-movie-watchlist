const searchInputEl = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const movieListEl = document.querySelector('.movie-list');
const pagesWrapperEl = document.querySelector('.pages-wrapper');

let searchTitle = '';

searchBtn.addEventListener('click', getListPages);
movieListEl.addEventListener( 'click', (e) => addToWatchList(e) );
pagesWrapperEl.addEventListener( 'click', (e) => pagesHandler(e) );

function getListPages() {
    pagesWrapperEl.innerHTML = '';
    searchTitle = searchInputEl.value.replaceAll(' ', '+');
    fetch(`http://www.omdbapi.com/?apikey=4ddb92a8&s=${searchTitle}`)
        .then( response => response.json() )
        .then( data => {
            if (data.Response === 'True') {
                const pages =  Math.ceil( data.totalResults / 10 );
                renderPageNums(pages);
                getMovieList(searchTitle, 1);
            } else {
                noMoviesFound();
            }
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
                renderMovieList(data);
            } );
    } );
}

function renderPageNums(pages) {
    pagesWrapperEl.classList.remove('hide');
    pagesWrapperEl.innerHTML = `<span class="page-num page-num-selected">1</span>`;
    for(let i = 2; i <= pages; i++) {
        pagesWrapperEl.innerHTML += `<span class="page-num">${i}</span>`;
    }
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
    movieListEl.classList.remove('hide');
    const movieStr = `
        <div class="movie-wrapper">
            <img src="${movieObj.Poster}" alt="${movieObj.Title} poster" class="movie-poster">
            <div>
                <div class="movie-info-wrapper">
                    <h3 class="movie-title">${movieObj.Title}</h3>
                    <img src="/images/star-icon.png" alt="">
                    <p id="imdb-rating">${movieObj.imdbRating}</p>
                </div>
                <div class="movie-info-wrapper">
                    <p id="runtime">${movieObj.Runtime}</p>
                    <p id="genre">${movieObj.Genre}</p>
                    <div class="add-btn">
                        <img src="/images/plus-icon.png" alt="">
                        <p>Watchlist</p>
                    </div>
                </div>
                <p class="movie-plot">${movieObj.Plot}</p>
            </div>
        </div>
    `;
    movieListEl.innerHTML += movieStr;
}

function addToWatchList(e) {
    if ( e.target.classList.contains('add-btn') || e.target.parentElement.classList.contains('add-btn') ) {
        const movieEl = e.target.closest('.movie-wrapper');
        const movieObj = {
            Title: movieEl.querySelector('.movie-title').textContent,
            Poster: movieEl.querySelector('.movie-poster').src,
            imdbRating: movieEl.querySelector('#imdb-rating').textContent,
            Runtime: movieEl.querySelector('#runtime').textContent,
            Genre: movieEl.querySelector('#genre').textContent,
            Plot: movieEl.querySelector('.movie-plot').textContent,
        };
        let userMoviesArr = []
        if ( localStorage.length !== 0 ) {
            userMoviesArr = JSON.parse( localStorage.getItem('userMovies') );
        }
        userMoviesArr.unshift(movieObj);
        console.log(userMoviesArr);
        localStorage.setItem( 'userMovies', JSON.stringify(userMoviesArr) );
    }
}

function noMoviesFound() {
    movieListEl.innerHTML = '';
    movieListEl.classList.add('hide');
    pagesWrapperEl.classList.add('hide');
    document.querySelector('.list-initial-state').classList.remove('hide');
    document.querySelector('.list-initial-state').innerHTML = `
        <p class="list-error-state">
            Unable to find what you’re looking for. Please try another search.
        </p>
    `;
}