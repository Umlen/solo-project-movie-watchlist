const movieListEl = document.querySelector('.movie-list');

movieListEl.addEventListener( 'click', (e) => removeFromWatchList(e) );

window.onload = function() {
    if ( localStorage.length !== 0 ) {
        const userMoviesArr = JSON.parse( localStorage.getItem('userMovies') );
        userMoviesArr.forEach( movie => renderMovieList(movie) );
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
                    <div class="remove-btn">
                        <img src="/images/minus-icon.png" alt="">
                        <p>Remove</p>
                    </div>
                </div>
                <p class="movie-plot">${movieObj.Plot}</p>
            </div>
        </div>
    `;
    movieListEl.innerHTML += movieStr;
}

function removeFromWatchList(e) {
    if ( e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn') ) {
        const movieEl = e.target.closest('.movie-wrapper');
        const movieTitle = movieEl.querySelector('.movie-title').textContent;
        userMoviesArr = JSON.parse( localStorage.getItem('userMovies') );
        userMoviesArr = userMoviesArr.filter( movie => movie.Title !== movieTitle );
        localStorage.setItem( 'userMovies', JSON.stringify(userMoviesArr) );
        movieListEl.innerHTML = '';
        userMoviesArr.forEach( movie => renderMovieList(movie) );
    }
}
