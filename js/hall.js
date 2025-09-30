let idSession = Number(localStorage.getItem("seanceId"));
let verifiedDate = localStorage.getItem("checkedDate");

const screen = document.querySelector("body");
const infoPurchase = document.querySelector(".buying__info");

const nameFilm = document.querySelector(".buying__info_title");
const sessionStartTime = document.querySelector(".buying__info-time");
const nameHall = document.querySelector(".buying__info_hall");

const plan = document.querySelector(".buying__scheme_places");
let rowPlanHall;
let chairHall;

const priceStandartHall = document.querySelector(".price_standart");
const priceVipHall = document.querySelector(".price_vip");
let priceStandart;
let priceVip;

let selectedPlace;
let coupons = [];
let price;

const buttonBuy = document.querySelector(".buying__button");

// Увеличение экрана при двойном тапе на мобильных устройствах

screen.addEventListener("dblclick", () => {
  if((Number(screen.getBoundingClientRect().width)) < 1200) {
    if(screen.getAttribute("transformed") === "false" || !screen.hasAttribute("transformed")) {
      screen.style.zoom = "1.5";
      screen.style.transform = "scale(1.5)";
      screen.style.transformOrigin = "0 0";
      screen.setAttribute("transformed", "true")
    } else if(screen.getAttribute("transformed") === "true") {
      screen.style.zoom = "1";
      screen.style.transform = "scale(1)";
      screen.style.transformOrigin = "0 0";
      screen.setAttribute("transformed", "false");
    }
  }
})

// Отображение данных о фильме, сеансе и зале

function addInfo(data) {
  let indexSession = data.result.seances.findIndex(item => item.id === Number(idSession));
  let indexFilm = data.result.films.findIndex(item => item.id === data.result.seances[indexSession].seance_filmid);
  let indexHall = data.result.halls.findIndex(item => item.id === data.result.seances[indexSession].seance_hallid);

  nameFilm.textContent = data.result.films[indexFilm].film_name;
  sessionStartTime.textContent = data.result.seances[indexSession].seance_time;
  nameHall.textContent = data.result.halls[indexHall].hall_name;

  priceStandartHall.textContent = data.result.halls[indexHall].hall_price_standart;
  priceVipHall.textContent = data.result.halls[indexHall].hall_price_vip;

  priceStandart = data.result.halls[indexHall].hall_price_standart;
  priceVip = data.result.halls[indexHall].hall_price_vip;
}

// Отображение данных о схеме зала

function showHallPlan(data) {
  let configHall = data.result;

  configHall.forEach(() => {
    plan.insertAdjacentHTML("beforeend", `<div class="buying__scheme_row"></div>`);
  });
    
  rowPlanHall = document.querySelectorAll(".buying__scheme_row");

  for(let i = 0; i < rowPlanHall.length; i++) {
    for(let j = 0; j < configHall[i].length; j++) {
      rowPlanHall[i].insertAdjacentHTML("beforeend", `<span class="buying__scheme_chair" data-type="${configHall[i][j]}"></span>`);
    }
  }

  chairHall = document.querySelectorAll(".buying__scheme_chair");

  chairHall.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("chair_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("chair_standart");
    } else if (element.dataset.type === "taken") {
      element.classList.add("chair_occupied");
    } else {
      element.classList.add("no-chair");
    }
  })

}

// Выбор мест

function choosingSeat(rowPlanHall) {
  let selectedRow = Array.from(rowPlanHall);
  selectedRow.forEach(row => {
    let selectedPlace = Array.from(row.children);
    selectedPlace.forEach(place => {   
      if(place.dataset.type !== "disabled" && place.dataset.type !== "taken") {
        place.addEventListener("click", () => {
          place.classList.toggle("chair_selected");

          selectedPlace = document.querySelectorAll(".chair_selected:not(.buying__scheme_legend-chair)");

          // Активация кнопки "Забронировать"

          if (selectedPlace.length === 0) {
            buttonBuy.classList.add("buying__button_disabled");
          } else {
            buttonBuy.classList.remove("buying__button_disabled");
          }
        })

      }
    })
  })  
}

// Клик по кнопке "Забронировать"

function clickButtonReserve() {
  buttonBuy.addEventListener("click", event => {
    event.preventDefault();

    if(buttonBuy.classList.contains("buying__button_disabled")) {
      return;
    } else {

      let selectedRow = Array.from(document.querySelectorAll(".buying__scheme_row"));

      coupons = [];

      selectedRow.forEach(row => {
        let indexRow = selectedRow.findIndex(currentRow => currentRow === row);
       
        let selectedPlace = Array.from(row.children);

        selectedPlace.forEach(place => {
          let indexPlace = selectedPlace.findIndex(currentPlace => currentPlace === place);

          if(place.classList.contains("chair_selected")) {
            if(place.dataset.type === "standart") {
              price = priceStandart;
            } else if(place.dataset.type === "vip") {
              price = priceVip;
            }

            coupons.push({
              row: indexRow + 1,
              place: indexPlace + 1,
              coast: price,
            })
          }

        })
      })

      localStorage.setItem("tickets", JSON.stringify(coupons));

      document.location="./payment.html";
    }

  })

}


// Получение общих данные с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    addInfo(data);

    // Получение данных о схеме зала

    fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${idSession}&date=${verifiedDate}`)
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      showHallPlan(data);
      choosingSeat(rowPlanHall);
      clickButtonReserve();
    })

  })
  
  