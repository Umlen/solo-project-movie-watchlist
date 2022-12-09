const movieListEl = document.querySelector('.movie-list');

window.onload = function() {
    if ( localStorage.length !== 0 ) {
        movieListEl.classList.remove('hide');
        document.querySelector('.list-initial-state').classList.add('hide');
        let userMoviesStr = localStorage.getItem('userMovies');
        movieListEl.innerHTML = userMoviesStr;
    }
}
