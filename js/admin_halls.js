// Управление залами

const hallsInfo = document.querySelector(".halls__info");
const hallsList = document.querySelector(".halls__list");
const hallButton = document.querySelector(".admin__button_hall");
let hallsDelButton;

// Конфигурация залов

const hallsConfig = document.querySelector(".hall-config");
const hallsConfigList = document.querySelector(".hall-config__list");
let hallsConfigElementy;
const hallsConfigWrap = document.querySelector(".hall-config__wrapper");
let hallsConfigArray = [];

// Схема зала

let currentConfigHall;
let currentConfigHallIndex;
let newConfigHallArray = [];

let formConfigHall;
let lineConfigHall;
let placeConfigHall;
let planHall;
let linePlanHall;
let placePlanHall;
let loungeHall;
let cancelConfigHall;
let saveConfigHall;

// Конфигурация цен

const priceConfig = document.querySelector(".price-config");
const priceConfigList = document.querySelector(".price-config__list");
let priceConfigElementy;
const priceConfigWrap = document.querySelector(".price-config__wrapper");
let formPriceConfig;
let priceStandartConfig;
let priceVipConfig;
let cancelPriceConfig;
let savePriceConfig;

let currentPriceConfig;

// Открыть продажи

const openSale = document.querySelector(".open");
const listOpenSale = document.querySelector(".open__list");
const wrapOpenSale = document.querySelector(".open__wrapper");
let infoOpenSale;
let buttonOpenSale;
let currentOpenSale;

let currentStatusHall;
let newStatusHall;

// Залы в Сетке сеансов

const movieShowtimes = document.querySelector(".movie-seances__timelines");
let deleteShowtimes;

// Проверка наличия залов в блоке "Доступные залы"

function checkListHalls() {
  if (hallsList.innerText) {
    hallsInfo.classList.remove("hidden");
    hallsList.classList.remove("hidden");
    hallsConfig.classList.remove("hidden");
    movieShowtimes.classList.remove("hidden");
    openSale.classList.remove("hidden");
  } else {
    hallsInfo.classList.add("hidden");
    hallsList.classList.add("hidden");
    hallsConfig.classList.add("hidden");
    movieShowtimes.classList.add("hidden");
    openSale.classList.add("hidden");
  }
}

// Открытие popup "Добавить зал"

hallButton.addEventListener("click", () => {
  popupAddHall.classList.remove("popup__hidden");
})

// popup Добавление зала

const popupAddHall = document.querySelector(".popup__hall_add");
const formAddHall = document.querySelector(".popup__form_add-hall");
const inputAddHall = document.querySelector(".add-hall_input");
const buttonAddHall = document.querySelector(".popup__add-hall_button_add");

// Добавить зал

formAddHall.addEventListener("submit", (e) => {
  e.preventDefault();
  addHall(inputAddHall);
})

function addHall(inputAddHall) {
  const infoHall = new FormData();
  infoHall.set("hallName", `${inputAddHall.value}`);

  if(inputAddHall.value.trim()) {
    fetch("https://shfe-diplom.neto-server.ru/hall", {
      method: "POST",
      body: infoHall
    })
      .then(response => response.json())
      .then(function(data) {
        console.log(data);  
        hallsList.insertAdjacentHTML("beforeend", `
        <li class="halls__list_item">
          <span class="halls__list_name" data-id="${data.result.halls.id}>${inputAddHall.value}</span> <span class="admin__button_remove hall_remove"></span></p>
        </li>
        `);

        inputAddHall.value = "";
        location.reload(); 
      })
  } 
}

// Удаление зала в блоке "Доступные залы"

function deleteHall(hallId) {
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    location.reload();
  })
}

// Отрисовка зала

function showHall(data, currentConfigHallIndex) {
  lineConfigHall.value = data.result.halls[currentConfigHallIndex].hall_rows;
  placeConfigHall.value = data.result.halls[currentConfigHallIndex].hall_places;
  
  planHall.innerHTML = "";
  hallsConfigArray.splice(0, hallsConfigArray.length);

  data.result.halls[currentConfigHallIndex].hall_config.forEach(element => {
    planHall.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  linePlanHall = document.querySelectorAll(".hall-config__hall_row");

  for(let i = 0; i < linePlanHall.length; i++) {
    for(let j = 0; j < data.result.halls[currentConfigHallIndex].hall_config[0].length; j++) {
      linePlanHall[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${data.result.halls[currentConfigHallIndex].hall_config[i][j]}"></span>`);
    }
  }

  loungeHall = document.querySelectorAll(".hall-config__hall_chair");

  loungeHall.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("place_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("place_standart");
    } else {
      element.classList.add("place_block");
    }
  })

  hallsConfigArray = JSON.parse(JSON.stringify(data.result.halls[currentConfigHallIndex].hall_config));
}

// Изменение типа мест на схеме зала

function changePlace(linePlanHall, data) {
  newConfigHallArray = JSON.parse(JSON.stringify(hallsConfigArray));

  let changeLine = Array.from(linePlanHall);
  changeLine.forEach(row => {
    let rowIndex = changeLine.findIndex(currentRow => currentRow === row);
    let changePlace = Array.from(row.children);
    changePlace.forEach(place => {
      place.style.cursor = "pointer";
      let placeIndex = changePlace.findIndex(currentPlace => currentPlace === place);
      
      place.addEventListener("click", () => {
        if(place.classList.contains("place_standart")) {
          place.classList.replace("place_standart", "place_vip");
          place.dataset.type = "vip";
          newConfigHallArray[rowIndex][placeIndex] = "vip";
        } else if (place.classList.contains("place_vip")) {
          place.classList.replace("place_vip", "place_block");
          place.dataset.type = "disabled";
          newConfigHallArray[rowIndex][placeIndex] = "disabled";
        } else {
          place.classList.replace("place_block", "place_standart");
          place.dataset.type = "standart";
          newConfigHallArray[rowIndex][placeIndex] = "standart";
        }

        if(JSON.stringify(newConfigHallArray) !== JSON.stringify(data.result.halls[currentConfigHallIndex].hall_config)) {
          cancelConfigHall.classList.remove("button_disabled");
          saveConfigHall.classList.remove("button_disabled");
        } else {
          cancelConfigHall.classList.add("button_disabled");
          saveConfigHall.classList.add("button_disabled");
        }
      })
    })
  })
}

// Изменение размера зала

function changeSizeHall(newConfigHallArray, data) {
  formConfigHall.addEventListener("input", () => {
    newConfigHallArray.splice(0, newConfigHallArray.length);

    planHall.innerHTML = "";

    for(let i = 0; i < lineConfigHall.value; i++) {
      planHall.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
      newConfigHallArray.push(new Array());
    }

    linePlanHall = Array.from(document.querySelectorAll(".hall-config__hall_row"));
      
    for(let i = 0; i < lineConfigHall.value; i++) {
      for(let j = 0; j < placeConfigHall.value; j++) {
        linePlanHall[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair place_standart" data-type="standart"></span>`);
        newConfigHallArray[i].push("standart");
      }
    }

    if(JSON.stringify(newConfigHallArray) !== JSON.stringify(data.result.halls[currentConfigHallIndex].hall_config)) {
      cancelConfigHall.classList.remove("button_disabled");
      saveConfigHall.classList.remove("button_disabled");
    } else {
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");
    }

    changePlace(linePlanHall, data);
  })
}

// Функция для обновления конфигурации зала и сохранения массива newConfigHallArray
function updateConfigHallArray() {
    // Сначала создаем новую пустую структуру для хранения конфигурации
    newConfigHallArray = [];

    // Получаем количество рядов и мест в зале
    const rowCount = Number(lineConfigHall.value);
    const placeCount = Number(placeConfigHall.value);

    // Заполняем newConfigHallArray новыми значениями
    for (let i = 0; i < rowCount; i++) {
        newConfigHallArray[i] = []; // Инициализация ряда
        for (let j = 0; j < placeCount; j++) {
            // Заполняем каждый ряд типом места по умолчанию (например, "standart")
            newConfigHallArray[i][j] = "standart"; 
        }
    }

    // Обновляем тип мест в newConfigHallArray на основе текущего состояния графического интерфейса
    const linePlanHall = document.querySelectorAll(".hall-config__hall_row");
    linePlanHall.forEach((rowElement, rowIndex) => {
        const places = rowElement.children; // Получаем места в ряду
        Array.from(places).forEach((placeElement, placeIndex) => {
            // Определяем текущий тип места из класса элемента
            if (placeElement.classList.contains("place_vip")) {
                newConfigHallArray[rowIndex][placeIndex] = "vip";
            } else if (placeElement.classList.contains("place_block")) {
                newConfigHallArray[rowIndex][placeIndex] = "disabled";
            } else {
                newConfigHallArray[rowIndex][placeIndex] = "standart";
            }
        });
    });
}

// Сохранение конфигурации зала
function funcSaveConfigHall(currentConfigHall) {
    updateConfigHallArray(); 

    const params = new FormData();
    params.set("rowCount", lineConfigHall.value);
    params.set("placeCount", placeConfigHall.value);
    params.set("config", JSON.stringify(newConfigHallArray)); 

    fetch(`https://shfe-diplom.neto-server.ru/hall/${currentConfigHall}`, {
        method: "POST",
        body: params 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert("Конфигурация зала сохранена!");
        location.reload();
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при сохранении конфигурации.");
    });
}

// Отображение цен

function showPrice(data, currentPriceConfig) {
  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentPriceConfig)) {
      priceStandartConfig.value = data.result.halls[i].hall_price_standart;
      priceVipConfig.value = data.result.halls[i].hall_price_vip;
      
      formPriceConfig.addEventListener("input", () => {
        if(priceStandartConfig.value === data.result.halls[i].hall_price_standart && priceVipConfig.value ===data.result.halls[i].hall_price_vip) {
          cancelPriceConfig.classList.add("button_disabled");
          savePriceConfig.classList.add("button_disabled");
        } else {
          cancelPriceConfig.classList.remove("button_disabled");
          savePriceConfig.classList.remove("button_disabled");
        }
      })
    }
  }
}

// Сохранение конфигурации цен

function savePrice(currentPriceConfig) {
  const params = new FormData();
  params.set("priceStandart", `${priceStandartConfig.value}`);
  params.set("priceVip", `${priceVipConfig.value}`);

  fetch(`https://shfe-diplom.neto-server.ru/price/${currentPriceConfig}`, {
    method: "POST",
    body: params 
  })
    .then(response => response.json())
    .then(function(data) { 
      console.log(data);
      alert("Конфигурация цен сохранена!");
      location.reload();
    })
}

// Проверка, открыт ли зал

function сheckHallOpen(data, currentOpenSale) {
  infoOpenSale = document.querySelector(".open__info");
  buttonOpenSale = document.querySelector(".admin__button_open");
  let estSeansy = 0;

  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentOpenSale)) {
      currentStatusHall = data.result.halls[i].hall_open;
    }
  }

  // Проверка, установлены ли сеансы для зала

  for (let i = 0; i < data.result.seances.length; i++) {
    if(data.result.seances[i].seance_hallid === Number(currentOpenSale)) {
      estSeansy++;
    }
  }

  if((currentStatusHall === 0) && (estSeansy === 0)) {
    buttonOpenSale.textContent = "Открыть продажу билетов";
    infoOpenSale.textContent = "Добавьте сеансы в зал для открытия";
    buttonOpenSale.classList.add("button_disabled");
  } else if ((currentStatusHall === 0) && (estSeansy > 0)) {
    buttonOpenSale.textContent = "Открыть продажу билетов";
    newStatusHall = 1;
    infoOpenSale.textContent = "Всё готово к открытию";
    buttonOpenSale.classList.remove("button_disabled");
  } else {
    buttonOpenSale.textContent = "Приостановить продажу билетов";
    newStatusHall = 0;
    infoOpenSale.textContent = "Зал открыт";
    buttonOpenSale.classList.remove("button_disabled");
  }
}

// Изменить статус зала

function openHall(currentOpenSale, newStatusHall) {
  const params = new FormData();
  params.set("hallOpen", `${newStatusHall}`)
  fetch( `https://shfe-diplom.neto-server.ru/open/${currentOpenSale}`, {
    method: "POST",
    body: params 
  })
  
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
    alert("Статус зала изменен!");
  })
}

// Получение информации по залам

function hallOperations(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    // Заполнение блока "Доступные залы"

    hallsList.insertAdjacentHTML("beforeend", `
      <li class="halls__list_item">
        <span class="halls__list_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span></p>
      </li>
    `);

    // Проверка наличия залов в списке

    checkListHalls();

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация залов"

    hallsConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация цен"

    priceConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение блока "Выберите зал для открытия/закрытия продаж"

    listOpenSale.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Создание таймлайнов залов в блоке "Сетка сеансов"

    movieShowtimes.insertAdjacentHTML("beforeend", `
    <section class="movie-seances__timeline">
      <div class="timeline__delete">
         <img class="timeline__delete_image" src="./images/delete.png" alt="Удалить сеанс">
      </div>
      <h3 class="timeline__hall_title">${data.result.halls[i].hall_name}</h3>
      <div class="timeline__seances" data-id="${data.result.halls[i].id}">
      </div>
    </section>
    `);

    // Спрятать корзины

    deleteShowtimes = document.querySelectorAll(".timeline__delete");

    deleteShowtimes.forEach(element => {
      element.classList.add("hidden");
    })

  }

  // Схема первого зала в списке 

  hallsConfigList.firstElementChild.classList.add("hall_item-selected");
  currentConfigHall = hallsConfigList.firstElementChild.getAttribute("data-id");

  formConfigHall = document.querySelector(".hall-config__size");
  lineConfigHall = document.querySelector(".hall-config__rows");
  placeConfigHall = document.querySelector(".hall-config__places");

  planHall = document.querySelector(".hall-config__hall_wrapper");

  currentConfigHallIndex = data.result.halls.findIndex(hall => hall.id === Number(currentConfigHall));

  lineConfigHall.value = data.result.halls[currentConfigHallIndex].hall_rows;
  placeConfigHall.value = data.result.halls[currentConfigHallIndex].hall_places;

  cancelConfigHall = document.querySelector(".hall-config__batton_cancel");
  saveConfigHall = document.querySelector(".hall-config__batton_save");

  showHall(data, currentConfigHallIndex);
  changePlace(linePlanHall, data);
  changeSizeHall(newConfigHallArray, data);

  // Клик по кнопке "Отмена" в блоке Конфигурация залов

  cancelConfigHall.addEventListener("click", event => {
    if(cancelConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");

      showHall(data, currentConfigHallIndex);
      changePlace(linePlanHall, data);
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация залов

  saveConfigHall.addEventListener("click", event => {
    if(saveConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      funcSaveConfigHall(currentConfigHall, newConfigHallArray);
    }
  })

  // Загрузка цен для первого зала в списке 

  priceConfigList.firstElementChild.classList.add("hall_item-selected");
  currentPriceConfig = priceConfigList.firstElementChild.getAttribute("data-id");

  formPriceConfig = document.querySelector(".price-config__form");

  priceStandartConfig = document.querySelector(".price-config__input_standart");
  priceVipConfig = document.querySelector(".price-config__input_vip");
  
  showPrice(data, currentPriceConfig);

  // Клик по кнопке "Отмена" в блоке Конфигурация цен

  cancelPriceConfig = document.querySelector(".price-config__batton_cancel");
  savePriceConfig = document.querySelector(".price-config__batton_save");

  cancelPriceConfig.addEventListener("click", event => {
    if(cancelPriceConfig.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      cancelPriceConfig.classList.add("button_disabled");
      savePriceConfig.classList.add("button_disabled");

      showPrice(data, currentPriceConfig)
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация цен

  savePriceConfig.addEventListener("click", event => {
    if(savePriceConfig.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      savePrice(currentPriceConfig);
    }
  })

  // Проверка, открыт ли первый зал в списке 

  listOpenSale.firstElementChild.classList.add("hall_item-selected");
  currentOpenSale = listOpenSale.firstElementChild.getAttribute("data-id");

  сheckHallOpen(data, currentOpenSale);

  // Выбор зала в блоке "Конфигурация залов"

  hallsConfigElementy = document.querySelectorAll(".hall-config__item");

  hallsConfigElementy.forEach(item => {
    item.addEventListener("click", () => {
      hallsConfigElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentConfigHall = item.getAttribute("data-id");
      }

      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");

      currentConfigHallIndex = data.result.halls.findIndex(hall => hall.id === Number(currentConfigHall));

      lineConfigHall.value = data.result.halls[currentConfigHallIndex].hall_rows;
      placeConfigHall.value = data.result.halls[currentConfigHallIndex].hall_places;

      // Отрисовка зала

      showHall(data, currentConfigHallIndex);
      changePlace(linePlanHall, data);

      // Изменение размера зала

      changeSizeHall(newConfigHallArray, data);

    })

  })

  // Выбор зала в блоке "Конфигурация цен"

  priceConfigElementy = document.querySelectorAll(".price-config__item");

  priceConfigElementy.forEach(item => {
    item.addEventListener("click", () => {
      priceConfigElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentPriceConfig = item.getAttribute("data-id");
      }

      cancelPriceConfig.classList.add("button_disabled");
      savePriceConfig.classList.add("button_disabled");

      // Отображение цены

      showPrice(data, currentPriceConfig);
    })

  })

  // Выбор зала в блоке "Открыть продажи"

  elementyopenSale = document.querySelectorAll(".open__item");

  elementyopenSale.forEach(item => {
    item.addEventListener("click", () => {
      elementyopenSale.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentOpenSale = item.getAttribute("data-id");
      }

      сheckHallOpen(data, currentOpenSale);
    })
  }) 

  // Клик по кнопке в блоке "Открыть продажи"

  buttonOpenSale.addEventListener("click", event => {
    if(buttonOpenSale.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      openHall(currentOpenSale, newStatusHall);

      for(let i = 0; i < data.result.halls.length; i++) {
        if(data.result.halls[i].id === Number(currentOpenSale)) {
          currentStatusHall = data.result.halls[i].hall_open;
        }
      }
    
      if (newStatusHall === 0) {
        buttonOpenSale.textContent = "Открыть продажу билетов";
        infoOpenSale.textContent = "Всё готово к открытию";
        newStatusHall = 1;
      } else {
        buttonOpenSale.textContent = "Приостановить продажу билетов";
        infoOpenSale.textContent = "Зал открыт";
        newStatusHall = 0;
      }
    }
  })

  // Удалить зал

  hallsDelButton = document.querySelectorAll(".hall_remove");

  hallsDelButton.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      deleteHall(hallId);
    })  
  })

}
