// Сетка сеансов
let timesSession;
let timesFilm;
let selectedFilm;
let selectedHall;

let sessionsHall;
let startSession;
let endSession;
let currentSessionDuration;
let currentStartSession;
let currentSessionStart;
let currentSessionEnd;

let sessionsOpen = false;

// Кнопки

let cancelSessionsFilms;
let saveSessionsFilms;

// popup Добавление сеанса

const popupAddSession = document.querySelector(".popup__seance_add");
const formAddSession = document.querySelector(".popup__form_add-seance");
const selectSessionHall = document.querySelector(".select__add-seance_hall");
let variantNameHall;
let variantNameFilm;
const selectSessionFilm = document.querySelector(".select__add-seance_movie");
const inputTimeSession = document.querySelector(".add-seans__input_time");
let checkIdHall;
let checkIdFilm;
let checkNameFilm;
let checkDurationFilm;
let checkTimeSession;
let buttonCancelSession;

// popup Удаление сеанса

const popupDeleteSession = document.querySelector(".popup__seance_remove");
let headDeleteSession;
let buttonDeleteSession;
let buttonCancelDeleteSession;

// Удаление сеансов

let selectedSessions;
let selectedForDelete;

let selectedSession;
let selectedIdSession;
let selectedTime;
let selectedIdHall;
let selectedNameFilm;

let deletedSessions = [];
let filterDeletedSessions = [];

// Загрузка сеансов

function loadSessions(data) {
  timesSession.forEach(timeline => {
    timeline.innerHTML = "";

    for(let i = 0; i < data.result.seances.length; i++) {
      let idFilmaSeansa = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));
      
      if(Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[idFilmaSeansa].film_name}</p>
          <p class="timeline__movie_start" data-duration="${data.result.films[idFilmaSeansa].film_duration}">${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }
    
  })

  // Загрузка фона сеансов

  setBackgroundFilm();

  // Позиционирование сеансов
  
  positionSession();

  // Отслеживание изменения ширины окна

  window.addEventListener("resize", event => {
    positionSession();
  })

  // Кнопка Отмена под сеткой сеансов

  cancelSessionsFilms = document.querySelector(".movie-seances__batton_cancel");

  cancelSessionsFilms.addEventListener("click", event => {
    if(cancelSessionsFilms.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      deletedSessions.length = 0;
      filterDeletedSessions.length = 0;
      loadSessions(data);
    
      deleteSession();

      cancelSessionsFilms.classList.add("button_disabled");
      saveSessionsFilms.classList.add("button_disabled");
    }
  })
}

// Установка цвета фона для фильмов в таймлайнах

function setBackgroundFilm() {
  const films = document.querySelectorAll(".movie-seances__movie");
  let backgroundFilm;
  const infoFilms = new Array();

  // Собираем массив из загруженных фильмов

  films.forEach(movie => {
    backgroundFilm = movie.classList.value.match(/\d+/)[0];

    const infoFilm = new Object();
    infoFilm.movieInfoId = movie.dataset.id;
    infoFilm.background = backgroundFilm;

    infoFilms.push(infoFilm);
  })

  // Проставление номера цвета фона в фильмы в таймлайне с сеансами

  timesFilm = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  timesFilm.forEach(element => {
    for (let i = 0; i < infoFilms.length; i++)
      if(Number(element.dataset.filmid) === Number(infoFilms[i].movieInfoId)) {
        element.classList.add(`background_${infoFilms[i].background}`);
      }
  })

}

// Позиционирование сеансов по таймлайну и определение ширины блока с сеансом

let minutesDay = 24 * 60;
let startSessionFilm;
let durationFilm;
let widthFilm;
let positionSessionFilm;

function positionSession() {

  timesFilm.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]); 
    let minutes = Number(time[1]);

    startSessionFilm = (hours * 60) + minutes;
    positionSessionFilm = (startSessionFilm / minutesDay) * 100;

    durationFilm = item.lastElementChild.dataset.duration;
    widthFilm = (durationFilm / minutesDay) * 100;

    item.style.left = positionSessionFilm + "%";
    item.style.width = widthFilm + "%";

    // Уменьшение размера шрифта и padding при слишком маленькой ширине сеанса

    if(item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let widthFilmPx = item.getBoundingClientRect().width;

    if(widthFilmPx < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    } 
  })

}

// Перетаскивание фильма в таймлайн зала (открытие popup Добавление сеанса)

function openPopupSession(data) {

  const arrayFilms = document.querySelectorAll(".movie-seances__movie");
  const arrayHalls = document.querySelectorAll(".timeline__seances");

  // Определение выбранного элемента

  let selectedElement;

  arrayFilms.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {  
      selectedFilm = movie.dataset.id;
      selectedElement = event.target;
    }) 
  })

  // Очищаем значение выбранного элемента

  arrayFilms.forEach(movie => {
    movie.addEventListener("dragend", () => {  
      selectedElement = undefined;
    }) 
  })

  arrayHalls.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  })

  arrayHalls.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();
      
      if(selectedElement === undefined) {
        return;
      }

      selectedHall = timeline.dataset.id;
      
      // Открытие popup "Добавление сеанса"

      popupAddSession.classList.remove("popup__hidden");

      // Очищение значений в popup

      selectSessionHall.innerHTML = "";
      selectSessionFilm.innerHTML = "";
      formAddSession.reset();

      // Формирование select "Название зала"

      for(let i = 0; i < data.result.halls.length; i++) {
        selectSessionHall.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      } 

      variantNameHall = document.querySelectorAll(".hall__name");

      variantNameHall.forEach(hallName => {
        if(Number(hallName.dataset.id) === Number(selectedHall)) {
          hallName.setAttribute("selected", "true");
        }
      })

      // Формирование select "Название фильма"

      for(let i = 0; i < data.result.films.length; i++) {
        selectSessionFilm.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}" data-duration="${data.result.films[i].film_duration}">${data.result.films[i].film_name}</option>
        `);
      } 

      variantNameFilm = document.querySelectorAll(".movie__name");

      variantNameFilm.forEach(movieName => {
        if(Number(movieName.dataset.id) === Number(selectedFilm)) {
          movieName.setAttribute("selected", "true");
        }
      })

    })
  })
}

// Клик по кнопке "Добавить сеанс"

let verifiedSessions = [];

function clickButtonAddSession() {
  formAddSession.addEventListener("submit", (event) => {
    event.preventDefault();
    verifiedSessions.length = 0;

    // Сохранение данных по залу

    let checkHall = selectSessionHall.value;

    variantNameHall.forEach(hallName => {
      if(hallName.textContent === checkHall) {
        checkIdHall = hallName.dataset.id;
      }
    })

    // Сохранение данных по фильму

    let checkFilm = selectSessionFilm.value;

    variantNameFilm.forEach(movieName => {
      if(movieName.textContent === checkFilm) {
        checkIdFilm = movieName.dataset.id;
        checkNameFilm = checkFilm;
        checkDurationFilm = movieName.dataset.duration;
      }
    })

    // Сохранение данных по выбранному времени

    checkTimeSession = inputTimeSession.value;

    let timeSession = checkTimeSession.split(':', [2]);
    startSession = Number(timeSession[0]) * 60 + Number(timeSession[1]);

    endSession = startSession + Number(checkDurationFilm);

    // Последний сеанс должен заканчиваться не позднее 23:59

    let lastTime = 23 * 60 + 59;

    if(endSession > lastTime) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    // Проверка на пересечение с другими сеансами в зале

    timesSession = document.querySelectorAll(".timeline__seances");
    
    // Сбор сеансов в искомом зале

    timesSession.forEach(timeline => {
      if(Number(timeline.dataset.id) === Number(checkIdHall)) {
        sessionsHall = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    })

    // Если зал пуст, без проверки сеансов закрыть popup и добавить новый сеанс

    if (sessionsHall.length === 0) {
      popupAddSession.classList.add("popup__hidden");
      addNewSession();
      return;
    }

    // Информация о всех существующих сеансах в конкретном зале

    for (let seance of sessionsHall) {

      // Получение длительности фильма в каждом существующем сеансе
      
      currentSessionDuration = seance.lastElementChild.dataset.duration;

      // Получение времени начала каждого существующего сеанса

      currentStartSession = seance.lastElementChild.textContent;
 
      // Расчет старта и окончания каждого существующего сеанса

      let currentSessionTime = currentStartSession.split(':', [2]);
      currentSessionStart = Number(currentSessionTime[0]) * 60 + Number(currentSessionTime[1]);

      currentSessionEnd = currentSessionStart + Number(currentSessionDuration);

      // Проверка добавляемого сеанса

      if(startSession >= currentSessionStart && startSession <= currentSessionEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        verifiedSessions.push("false");
        break;
      } else if (endSession >= currentSessionStart && endSession <= currentSessionEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        verifiedSessions.push("false");
        break;
      } else {
        verifiedSessions.push("true");
      }

    }

    if(!verifiedSessions.includes("false")) {
      popupAddSession.classList.add("popup__hidden");
      addNewSession();
    } else {
      return;
    }

  })
}

// Добавление сеанса в таймлайн зала

function addNewSession() {
  cancelSessionsFilms.classList.remove("button_disabled");
  saveSessionsFilms.classList.remove("button_disabled");

  timesSession.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(checkIdHall)) {
      timeline.insertAdjacentHTML("beforeend", `
      <div class="timeline__seances_movie" data-filmid="${checkIdFilm}" data-seanceid="" draggable="true">
        <p class="timeline__seances_title">${checkNameFilm}</p>
        <p class="timeline__movie_start" data-duration="${checkDurationFilm}">${checkTimeSession}</p>
      </div>
      `);
    }      
    
  })

  setBackgroundFilm();
  
  positionSession();

  deleteSession();
}


// Удаление сеанса из таймлайна

function deleteSession() {
  selectedSessions = document.querySelectorAll(".timeline__seances_movie");

  // Определение выбранного сеанса

  let selectedElement;

  selectedSessions.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      selectedSession = seance;
      selectedTime = seance.closest(".movie-seances__timeline");
      selectedFilm = seance.dataset.filmid;
      selectedNameFilm = seance.firstElementChild.textContent;
      selectedIdHall = seance.parentElement.dataset.id;
      selectedForDelete = selectedTime.firstElementChild;

      selectedForDelete.classList.remove("hidden");

      selectedElement = event.target;

      selectedForDelete.addEventListener("dragover", (event) => {  
        event.preventDefault();
      })
    
      selectedForDelete.addEventListener("drop", (event) => {  
        event.preventDefault();
    
        // Открытие popup "Удаление сеанса"
    
        popupDeleteSession.classList.remove("popup__hidden");

        headDeleteSession = document.querySelector(".seance-remove_title");
        headDeleteSession.textContent = selectedNameFilm;

        buttonDeleteSession = document.querySelector(".popup__remove-seance_button_delete");

        // Кнопка "Удалить" в popup "Удаление сеанса"

        buttonDeleteSession.addEventListener("click", (e) => {
          e.preventDefault();

          popupDeleteSession.classList.add("popup__hidden");

          if(selectedSession.dataset.seanceid !== "") {
            selectedIdSession = selectedSession.dataset.seanceid;
            deletedSessions.push(selectedIdSession);
          }

          selectedSession.remove();

          // Очищение массива с удаляемыми сеансами от повторов

          filterDeletedSessions = deletedSessions.filter((item, index) => {
            return deletedSessions.indexOf(item) === index;
          });

          if(filterDeletedSessions.length !== 0) {
            cancelSessionsFilms.classList.remove("button_disabled");
            saveSessionsFilms.classList.remove("button_disabled");
          } else {
            cancelSessionsFilms.classList.add("button_disabled");
            saveSessionsFilms.classList.add("button_disabled");
          }
        
        })

      })

    })
  })

  selectedSessions.forEach(seance => {
    seance.addEventListener("dragend", () => {
      selectedElement = undefined;
      selectedForDelete.classList.add("hidden");
    })
  })

}

// Отображение сеансов

function operationsSessions(data) {
  timesSession = document.querySelectorAll(".timeline__seances");

  // Загрузкa сеансов

  loadSessions(data);

  openPopupSession(data);
  clickButtonAddSession();

  deleteSession();
}

// Кнопка Сохранить под сеткой сеансов

saveSessionsFilms = document.querySelector(".movie-seances__batton_save");

// Сохранить сетку сеансов

saveSessionsFilms.addEventListener("click", event => {
  if(saveSessionsFilms.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const arraySessions = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    // Добавление сеансов

    arraySessions.forEach(seance => {
      if(seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        addSession(params);
      }
    })
    
    // Удаление сеансов

    if (filterDeletedSessions.length !== 0) {
      filterDeletedSessions.forEach(seance => {
        let seanceId = seance;
        deleteSessions(seanceId);
      })
    }

    alert("Сеансы сохранены!");
    
 }
})

// Добавить сеанс на сервер

function addSession(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
  method: "POST",
  body: params 
})
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
  })
}

// Удалить сеанс с сервера

function deleteSessions(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
    })
}
