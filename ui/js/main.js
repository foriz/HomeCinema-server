var movies_btn = null;
var series_btn = null;

window.onload = function() {
    movies_btn = document.getElementById("movies_btn");
    series_btn = document.getElementById("series_btn");

    moviesBtnClick();
}

function moviesBtnClick() {
    movies_btn.classList.add('active');
    series_btn.classList.remove('active');
}

function seriesBtnClick() {
    series_btn.classList.add('active');
    movies_btn.classList.remove('active');
}