const idSession = Number(localStorage.getItem("seanceId"));
const verifiedDate = localStorage.getItem("checkedDate");
const coupons = JSON.parse(localStorage.getItem("tickets"));
const infoCoupons = JSON.parse(localStorage.getItem("ticketsInfo"));

const infoFilm = document.querySelector(".ticket__info-movie");
const infoPlace = document.querySelector(".ticket__info-places");
const infoHall = document.querySelector(".ticket__info-hall");
const infoTimes = document.querySelector(".ticket__info-time");

const qrTicket = document.querySelector(".ticket__info-qr");
let textQr;
let codeQr;

let places = [];
let price = [];
let totalAmount;

// Отображение данных о билете

function getInfoTicket(data) {
  let indexSession = data.result.seances.findIndex(item => item.id === Number(idSession));
  let indexFilm = data.result.films.findIndex(item => item.id === data.result.seances[indexSession].seance_filmid);
  let indexHall = data.result.halls.findIndex(item => item.id === data.result.seances[indexSession].seance_hallid);

  infoFilm.textContent = data.result.films[indexFilm].film_name;
  infoHall.textContent = data.result.halls[indexHall].hall_name;
  infoTimes.textContent = data.result.seances[indexSession].seance_time;

  coupons.forEach(ticket => {
    places.push(ticket.row + "/" + ticket.place);
    price.push(ticket.coast);
  })

  infoPlace.textContent = places.join(", ");

  totalAmount = price.reduce((acc, price) => acc + price, 0);

  // Создание QR-кода с информацией по билетам

  textQr = `
    Дата: ${verifiedDate}, 
    Время: ${infoTimes.textContent}, 
    Название фильма: ${infoFilm.textContent}, 
    Зал: ${infoHall.textContent}, 
    Ряд/Место: ${places.join(", ")}, 
    Стоимость: ${totalAmount}, 
    Билет действителен строго на свой сеанс
  `

  codeQr = QRCreator(textQr, 
    { mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "PNG",
      modsize: 3,
      margin: 3
    });

  qrTicket.append(codeQr.result);

  localStorage.clear();
}

// Запрос к серверу (получение информации по фильму, залу и сеансу)

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    getInfoTicket(data);
  })
  