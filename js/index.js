const buttonLogin = document.querySelector(".header__button");

const navigationDays = Array.from(document.querySelectorAll(".nav__day"));
const navigationToday = document.querySelector(".nav__day_today");
const arrowNavigationRight = document.querySelector(".right");

let amountDays = 1;

let currentWeekNav;
let currentDateNav;

const daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let todayDayWeek;

const currentDay = new Date();
let verifiedDate;
let selectedDate;
let selectedMonth;
let selectedYear;

let receivedDate;
let receivedMonth;
let data;

let sortDays;

const basis = document.querySelector(".main");
let films;
let film;
let seanceFilm;
let listSeanceFilm;

// Переход на авторизацию с кнопки "Войти"

buttonLogin.addEventListener("click", event => {
  event.preventDefault();
  document.location="./admin-login.html";
})

// Установка даты и дня недели сегодняшнего дня

function installToday(currentDay) {
  todayDayWeek = daysWeek[currentDay.getDay()];

  currentWeekNav = navigationToday.querySelector(".nav__text-week");
  currentWeekNav.textContent = `${todayDayWeek}, `;
  
  currentDateNav = navigationToday.querySelector(".nav__text-date");
  currentDateNav.textContent = ` ${currentDay.getDate()}`;
  
  if (currentWeekNav.textContent === "Сб, " || currentWeekNav.textContent === "Вс, ") {
    currentWeekNav.classList.add("nav__day_weekend");
    currentDateNav.classList.add("nav__day_weekend");
  }
}

// Установка дат и дней недели на остальные дни

function installDays() {
  navigationDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * i));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${daysWeek[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Смена дней недели и дат

function changeDays(amountDays) {
  navigationDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * (i + amountDays)));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${daysWeek[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Преобразование выбранной даты для параметров

function transformDay(selectedDate, selectedMonth, selectedYear) {
  if(selectedDate < 10) {
    receivedDate = `0${selectedDate}`;
  } else {
    receivedDate = selectedDate;
  }

  if(selectedMonth < 9) {
    receivedMonth = `0${selectedMonth}`;
  } else {
    receivedMonth = selectedMonth;
  }

  data = `${selectedYear}-${selectedMonth}-${selectedDate}`;
}

// Сортировка списка дней (избавление от кнопок со стрелками)

function filterDays(navigationDays) {
  sortDays = navigationDays.filter(item => !item.classList.contains("nav__arrow"));
}

// Выделение сегодняшнего дня

navigationToday.classList.add("nav__day-checked");
navigationToday.style.cursor = "default";
navigationToday.dataset.date = currentDay.toJSON().split("T")[0];

if(navigationToday.classList.contains("nav__day-checked")) {
  selectedDate = currentDay.getDate();
  selectedMonth = currentDay.getMonth() + 1;
  selectedYear = currentDay.getFullYear();

  transformDay(selectedDate, selectedMonth, selectedYear);
  localStorage.setItem("checkedDate", data);
}

installToday(currentDay);
installDays();
filterDays(navigationDays);
markPastSession();

// При нажатии на правую стрелку

arrowNavigationRight.addEventListener("click", () => {
  amountDays++;
  
  navigationToday.classList.remove("nav__day-checked");
  navigationToday.classList.add("nav__arrow");
  navigationToday.classList.add("left");
  navigationToday.style.cursor = "pointer";
  navigationToday.style.display = "flex";

  navigationToday.innerHTML = `
    <span class="nav__arrow-text">&lt;</span>
  `;

  changeDays(amountDays);
  filterDays(navigationDays);
})

// При нажатии на левую стрелку

navigationToday.addEventListener("click", () => {
  if(navigationToday.classList.contains("nav__arrow")) {
    amountDays--;

    if(amountDays > 0) {
      changeDays(amountDays);
      filterDays(navigationDays);
    } else if (amountDays === 0) {
      navigationToday.classList.remove("nav__arrow");
      navigationToday.classList.remove("left");
      navigationToday.style.display = "block";
    
      navigationToday.innerHTML = `
        <span class="nav__text-today">Сегодня</span>
        <br><span class="nav__text-week"></span> <span class="nav__text-date"></span>
      `;
  
      installToday(currentDay);
      installDays();

      navigationDays.forEach(day => {
        if(!day.classList.contains("nav__day-checked")) {
          navigationToday.classList.add("nav__day-checked");
          navigationToday.style.cursor = "default";

          selectedDate = currentDay.getDate();
          selectedMonth = currentDay.getMonth() + 1;
          selectedYear = currentDay.getFullYear();
        
          transformDay(selectedDate, selectedMonth, selectedYear);
          localStorage.setItem("checkedDate", data);
        }
      })
  
      filterDays(navigationDays);
    } else {
      return;
    }

  } else {
    return;
  }
  
})

// Выбор дня

sortDays.forEach(day => {
  day.addEventListener("click", () => {

    sortDays.forEach(item => {
      item.classList.remove("nav__day-checked");
      item.style.cursor = "pointer";
    })

    if(!day.classList.contains("nav__arrow")) {
      day.classList.add("nav__day-checked");
      day.style.cursor = "default";

      verifiedDate = new Date(day.dataset.date);

      selectedDate = verifiedDate.getDate();
      selectedMonth = verifiedDate.getMonth() + 1;
      selectedYear = verifiedDate.getFullYear();
        
      transformDay(selectedDate, selectedMonth, selectedYear);
      localStorage.setItem("checkedDate", data);

      markPastSession();
      clickSession();
    }
    
  })
})

// Формирование списка фильмов и сеансов по ним

let dataFilms;
let dataSeances;
let dataHalls;

let sessionsHalls;
let currentSeances;

function getFilms(data) {
  dataFilms = data.result.films;
  dataSeances = data.result.seances;
  dataHalls = data.result.halls.filter(hall => hall.hall_open === 1);

  dataFilms.forEach(film => {
    sessionsHalls = "";

    dataHalls.forEach(hall => {

      //Фильтрация по сеансам в холлах, где показывается фильм

      currentSeances = dataSeances.filter(seance => (
        (Number(seance.seance_hallid) === Number(hall.id)) && 
        (Number(seance.seance_filmid) === Number(film.id))
      ));

      // Сортировка полученного массива по времени сеансов

      currentSeances.sort(function(a, b) {
        if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) < 0) {
          return -1;
        } else if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) > 0) {
          return 1;
        }
      });

      if (currentSeances.length > 0) {

        // Формирование названия зала и списка для сеансов

        sessionsHalls += `
        <h3 class="movie-seances__hall" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="movie-seances__list">
        `;

        currentSeances.forEach(seance => {
          // Формирование сеансов для нужного зала

          sessionsHalls += `
          <li class="movie-seances__time" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">
            ${seance.seance_time}
          </li>
          `;
        });
        
        sessionsHalls += `</ul>`;
      };
    });
  
    if (sessionsHalls) {
      // Формирование блока с фильмом

      basis.insertAdjacentHTML("beforeend", `
        <section class="movie" data-filmid="${film.id}">
          <div class="movie__info">
            <div class="movie__poster">
              <img src="${film.film_poster}" alt="Постер фильма ${film.film_name}" class="movie__poster_image">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${film.film_name}</h2>
              <p class="movie__synopsis">${film.film_description}</p>
              <p class="movie__data">
                <span class="movie__data-length">${film.film_duration} минут</span>
                <span class="movie__data-country">${film.film_origin}</span>
              </p>
            </div>
          </div>

          <div class="movie-seances">
            ${sessionsHalls}
          </div>
        </section>
      `);
    } 
  })

  markPastSession();

  clickSession();
}

// Запрос данных с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    getFilms(data);
  })

// Отмечание прошедших сеансов неактивными

function markPastSession() {

  // Получение текущего времени (часы:минуты)

  const currentHours = currentDay.getHours();
  const currentMin = currentDay.getMinutes();

  listSeanceFilm = document.querySelectorAll(".movie-seances__time");
  listSeanceFilm.forEach(seance => {

    if (Number(selectedDate) === Number(currentDay.getDate())) {
   
      if(Number(currentHours) > Number(seance.textContent.trim().slice(0,2))) {
        seance.classList.add("movie-seances__time_disabled");
      } else if(Number(currentHours) === Number(seance.textContent.trim().slice(0,2))) {
        if(Number(currentMin) > Number(seance.textContent.trim().slice(3))) {
          seance.classList.add("movie-seances__time_disabled");

        } else {
          seance.classList.remove("movie-seances__time_disabled");
        }
      } else {
        seance.classList.remove("movie-seances__time_disabled");
      }
  
    } else {
      seance.classList.remove("movie-seances__time_disabled");
    }
  })
}

// Переход в зал выбранного сеанса

let idSession;

function clickSession() {
  listSeanceFilm = document.querySelectorAll(".movie-seances__time");

  listSeanceFilm.forEach(seance => {
    if(!seance.classList.contains("movie-seances__time_disabled")) {
      seance.addEventListener("click", () => {
        idSession = seance.dataset.seanceid;
        localStorage.setItem("seanceId", idSession);

        document.location="./hall.html";
      })
    }
  })

}
