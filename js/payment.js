const idSession = Number(localStorage.getItem("seanceId"));
const verifiedDate = localStorage.getItem("checkedDate");
const coupons = JSON.parse(localStorage.getItem("tickets"));

const infoFilm = document.querySelector(".ticket__info-movie");
const infoPlace = document.querySelector(".ticket__info-places");
const infoHall = document.querySelector(".ticket__info-hall");
const infoTimes = document.querySelector(".ticket__info-time");
const infoPrice = document.querySelector(".ticket__info-price");

let seatsArray = [];
let priceArray = [];
let totalAmount;

const buttonTicket = document.querySelector(".ticket__button");

// Отображение данных о билете

function getInfoTicket(data) {
  let indexSession = data.result.seances.findIndex(item => item.id === Number(idSession));
  let indexFilm = data.result.films.findIndex(item => item.id === data.result.seances[indexSession].seance_filmid);
  let indexHall = data.result.halls.findIndex(item => item.id === data.result.seances[indexSession].seance_hallid);

  infoFilm.textContent = data.result.films[indexFilm].film_name;
  infoHall.textContent = data.result.halls[indexHall].hall_name;
  infoTimes.textContent = data.result.seances[indexSession].seance_time;

  coupons.forEach(ticket => {
    seatsArray.push(ticket.row + "/" + ticket.place);
    priceArray.push(ticket.coast);
  })

  infoPlace.textContent = seatsArray.join(", ");

  totalAmount = priceArray.reduce((acc, price) => acc + price, 0);
  infoPrice.textContent = totalAmount;
}

// Запрос к серверу

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    getInfoTicket(data);
  })

// Клик по кнопке "Получить код бронирования"

buttonTicket.addEventListener("click", event => {
  event.preventDefault();

  const params = new FormData();
    params.set("seanceId", idSession);
    params.set("ticketDate", verifiedDate);
    params.set("tickets", JSON.stringify(coupons));
  
    fetch("https://shfe-diplom.neto-server.ru/ticket", {
      method: "POST",
      body: params
      })
      .then(response => response.json())
      .then(function(data) {
        console.log(data); 
        
        if(data.success === true) { 
          localStorage.setItem("ticketsInfo", JSON.stringify(data));
          document.location="./ticket.html";
        } else {
          alert("Места недоступны для бронирования!");
          return;
        }
    })  
})
