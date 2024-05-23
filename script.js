import { emotions } from "./emotions.js";
import { genres } from "./genres.js";

const mainContainer = document.querySelector(".main-container"); 
const genreGrid = document.querySelector(".genre-grid");
const userInput = document.querySelector(".user-input");
const submitButton = document.querySelector(".submit");
const movieDisplay = document.querySelector(".movie-display");

userInput.disabled = true; 


const buildGrid = () => { //arrow function
    let columns = 4;
    let rows = 10;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            const gridElement = document.createElement('div');
            //get emotion stuff
            const emotion = document.createElement('p');
            emotion.textContent = emotions.pop();
            emotion.classList.add('emotion-text');
            gridElement.appendChild(emotion);
            //grid element stuff
            gridElement.classList.add('emotion-box');
            genreGrid.appendChild(gridElement);
            addBoxEvent(gridElement);
        }
    }
}

buildGrid(); //function call
let emotionList = [];
let genreList = []; 

function addBoxEvent(box) {
    box.addEventListener('click', () => {
        //add word into a list (array)
        emotionList.push(box.textContent);
        userInput.value += box.textContent + ", ";
    })
}

async function getMovieData() {

    let genreIds = []; 

    emotionList.forEach(emotion => {
        // genreList.push(genres.find(genre => genre.emotions === emotion).id); 
        genreIds.push(genres
        .filter(genre => genre.emotions.includes(emotion))
        .map(genre => genre.id));
    });

    console.log(genreIds)

    genreIds.forEach(idList => {
        genreList.push(idList.toString()); 
    });

    console.log(genreList.toString())


    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDNmOTI2OTUzMmJjZDg1MDZlNDRmNmM3MDI1YmVkOCIsInN1YiI6IjY2MzYzYTY2OTU5MGUzMDEyNmJjMjhkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqoIGOTidk8Umb8-BazUsPd4T2BNA7zEh1eCI467A_k'
        }
    }

    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&with_genres=${genreList.toString()}`, options)

    const data = await response.json();
    let movieData = data.results;
    return movieData; 
}


submitButton.addEventListener("click", async () => {
    let movieData = await getMovieData();

    mainContainer.removeChild(userInput); 
    mainContainer.removeChild(genreGrid); 
    mainContainer.removeChild(submitButton); 

    const movieMessage = document.createElement("p"); 
    movieMessage.innerHTML = "Here are our suggestions..."; 
    movieMessage.classList.add("movie-message"); 
    mainContainer.appendChild(movieMessage); 

    const refreshButton = document.createElement("button"); 
    refreshButton.innerHTML = "New Search"; 
    refreshButton.classList.add("refresh-button");
    mainContainer.append(refreshButton);

    refreshButton.onclick = () => {
        window.location.reload(); 
    }

    const movieDisplay = document.createElement("div"); 
    movieDisplay.classList.add("movie-display"); 
    mainContainer.appendChild(movieDisplay); 
    
    displayMovies(movieData, movieDisplay)
})

function displayMovies(data, display) {
    
    data.forEach(movie => {
        console.log(movie)
        const movieBox = document.createElement("div");
        movieBox.classList.add("movie-data-item");

        const movieName = document.createElement("p"); 
        movieName.innerHTML = movie.original_title;
        movieName.classList.add("movie-name"); 
        movieBox.appendChild(movieName); 

        const movieBackdrop = document.createElement("img");
        movieBackdrop.src = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
        movieBackdrop.classList.add("movie-poster");  
        movieBox.appendChild(movieBackdrop); 

        display.appendChild(movieBox);
    });
}
