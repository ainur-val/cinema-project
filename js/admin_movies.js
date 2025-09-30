// Добавление фильма
const buttonAddFilm = document.querySelector(".admin__button_movie");
const wrapSessionFilms = document.querySelector(".movie-seances__wrapper");

// Открытие popup "Добавить фильм"

buttonAddFilm.addEventListener("click", () => {
  popupAddFilm.classList.remove("popup__hidden");
})

// popup Добавление фильма

const popupAddFilm = document.querySelector(".popup__movie_add");
const formAddFilm = document.querySelector(".popup__form_add-movie");
const inputNameFilm = document.querySelector(".add-movie_name_input");
const inputDurationFilm = document.querySelector(".add-movie_time_input");
const inputDescriptionFilm = document.querySelector(".add-movie_synopsis_input");
const inputCountryFilm = document.querySelector(".add-movie_country_input");

const buttonDownloadPoster = document.querySelector(".input_add_poster");

let filePoster;

// Добавление фильма

function addFilm(filePoster) {
  const infoHall = new FormData();
  let numberDuration = Number(inputDurationFilm.value);

  infoHall.set("filmName", `${inputNameFilm.value}`);
  infoHall.set("filmDuration", `${numberDuration}`);
  infoHall.set("filmDescription", `${inputDescriptionFilm.value}`);
  infoHall.set("filmOrigin", `${inputCountryFilm.value}`);
  infoHall.set("filePoster", filePoster);

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: infoHall
  })
    .then(response => response.json())
    .then(function(data) {
      alert(`Фильм ${inputNameFilm.value} добавлен!`);
      location.reload();  
    })
}

// Удаление фильма

function deleteFilm(filmId) {
  fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    alert(`Фильм ${filmId} удален!`);
    location.reload();
  })
}

// Загрузить постер

buttonDownloadPoster.addEventListener("change", event => {
  event.preventDefault();
  let sizeFile = buttonDownloadPoster.files[0].size;

  if(sizeFile > 3000000) {
    alert("Размер файла должен быть не более 3 Mb!");
  } else {
    filePoster = buttonDownloadPoster.files[0];
  }
})

// Добавить фильм

formAddFilm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (filePoster === undefined) {
    alert("Загрузите постер!");
    return;
  } else {
    addFilm(filePoster);
  }
})

// Удалить фильм

let filmId;

wrapSessionFilms.addEventListener("click", (e) => {  
  if(e.target.classList.contains("movie-seances__movie_delete")) {
    filmId = e.target.closest(".movie-seances__movie").dataset.id;
    deleteFilm(filmId);
  } else {
    return;
  }
}) 

// Отображение фильмов

function operationsFilms(data) {
  let counterFilms = 1;

  for(let i = 0; i < data.result.films.length; i++) {
    wrapSessionFilms.insertAdjacentHTML("beforeend", `
    <div class="movie-seances__movie background_${counterFilms}" data-id="${data.result.films[i].id}" draggable="true" >
              <img src="${data.result.films[i].film_poster}" alt="постер" class="movie-seances__movie_poster">

              <div class="movie-seances__movie_info">
                  <p class="movie_info-title">${data.result.films[i].film_name}</p>
                  <p class="movie_info-length"><span class="movie_info-time">${data.result.films[i].film_duration}</span> минут</p> 
              </div>
              
              <span class="admin__button_remove movie-seances__movie_delete"></span>
            </div>
    `);

    counterFilms++;

    if (counterFilms > 5) {
      counterFilms = 1;
    }  
  }
}
