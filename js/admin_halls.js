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

// Хранилище данных о залах
let hallsData = [];
// Хранилище данных о сеансах
let seancesData = [];

// Проверка наличия залов в блоке "Доступные залы"

function checkListHalls() {
  if (hallsList.children.length > 0) {
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
        
        // Добавляем зал в локальное хранилище
        const newHall = {
          id: data.result.halls.id,
          hall_name: inputAddHall.value,
          hall_rows: 10,
          hall_places: 10,
          hall_config: Array(10).fill().map(() => Array(10).fill("standart")),
          hall_price_standart: 300,
          hall_price_vip: 450,
          hall_open: 0
        };
        hallsData.push(newHall);
        
        // Добавляем зал в список доступных залов
        const newHallElement = `
        <li class="halls__list_item">
          <span class="halls__list_name" data-id="${data.result.halls.id}">${inputAddHall.value}</span> 
          <span class="admin__button_remove hall_remove"></span>
        </li>
        `;
        hallsList.insertAdjacentHTML("beforeend", newHallElement);

        // Добавляем зал в конфигурацию залов
        hallsConfigList.insertAdjacentHTML("beforeend", `
          <li class="hall__item hall-config__item" data-id="${data.result.halls.id}">${inputAddHall.value}</li>
        `);

        // Добавляем зал в конфигурацию цен
        priceConfigList.insertAdjacentHTML("beforeend", `
          <li class="hall__item price-config__item" data-id="${data.result.halls.id}">${inputAddHall.value}</li>
        `);

        // Добавляем зал в открытие продаж
        listOpenSale.insertAdjacentHTML("beforeend", `
          <li class="hall__item open__item" data-id="${data.result.halls.id}">${inputAddHall.value}</li>
        `);

        // Добавляем зал в сетку сеансов
        movieShowtimes.insertAdjacentHTML("beforeend", `
          <section class="movie-seances__timeline">
            <div class="timeline__delete">
              <img class="timeline__delete_image" src="./images/delete.png" alt="Удалить сеанс">
            </div>
            <h3 class="timeline__hall_title">${inputAddHall.value}</h3>
            <div class="timeline__seances" data-id="${data.result.halls.id}">
            </div>
          </section>
        `);

        // Обновляем обработчики событий для новых элементов
        updateEventListeners();
        
        // Проверяем отображение списка залов
        checkListHalls();
        
        // Закрываем popup и очищаем поле ввода
        popupAddHall.classList.add("popup__hidden");
        inputAddHall.value = "";
        
        console.log("Зал успешно добавлен");
      })
      .catch(error => {
        console.error("Ошибка при добавлении зала:", error);
        alert("Произошла ошибка при добавлении зала");
      });
  } 
}

// Удаление зала в блоке "Доступные залы"

function deleteHall(hallId, hallElement) {
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    
    // Удаляем зал из локального хранилища
    hallsData = hallsData.filter(hall => hall.id !== Number(hallId));
    
    // Удаляем зал из всех списков
    removeHallFromAllLists(hallId);
    
    // Если удаляемый зал был выбран в каком-либо разделе, выбираем первый доступный зал
    updateSelectedHallsAfterDeletion(hallId);
    
    // Проверяем отображение списка залов
    checkListHalls();
    
    console.log("Зал успешно удален");
  })
  .catch(error => {
    console.error("Ошибка при удалении зала:", error);
    alert("Произошла ошибка при удалении зала");
  });
}

// Удаление зала из всех списков
function removeHallFromAllLists(hallId) {
  // Удаляем из доступных залов
  const hallInList = hallsList.querySelector(`[data-id="${hallId}"]`);
  if (hallInList) {
    hallInList.closest('.halls__list_item').remove();
  }
  
  // Удаляем из конфигурации залов
  const hallInConfig = hallsConfigList.querySelector(`[data-id="${hallId}"]`);
  if (hallInConfig) {
    hallInConfig.remove();
  }
  
  // Удаляем из конфигурации цен
  const hallInPrice = priceConfigList.querySelector(`[data-id="${hallId}"]`);
  if (hallInPrice) {
    hallInPrice.remove();
  }
  
  // Удаляем из открытия продаж
  const hallInOpen = listOpenSale.querySelector(`[data-id="${hallId}"]`);
  if (hallInOpen) {
    hallInOpen.remove();
  }
  
  // Удаляем из сетки сеансов
  const hallInShowtimes = movieShowtimes.querySelector(`.timeline__seances[data-id="${hallId}"]`);
  if (hallInShowtimes) {
    hallInShowtimes.closest('.movie-seances__timeline').remove();
  }
}

// Обновление выбранных залов после удаления
function updateSelectedHallsAfterDeletion(deletedHallId) {
  // Если удаленный зал был выбран в конфигурации залов
  if (currentConfigHall === deletedHallId) {
    const firstConfigHall = hallsConfigList.querySelector('.hall__item');
    if (firstConfigHall) {
      firstConfigHall.classList.add('hall_item-selected');
      currentConfigHall = firstConfigHall.getAttribute('data-id');
      // Обновляем отображение схемы зала
      loadHallConfiguration(currentConfigHall);
    }
  }
  
  // Если удаленный зал был выбран в конфигурации цен
  if (currentPriceConfig === deletedHallId) {
    const firstPriceHall = priceConfigList.querySelector('.hall__item');
    if (firstPriceHall) {
      firstPriceHall.classList.add('hall_item-selected');
      currentPriceConfig = firstPriceHall.getAttribute('data-id');
      // Обновляем отображение цен
      loadPriceConfiguration(currentPriceConfig);
    }
  }
  
  // Если удаленный зал был выбран в открытии продаж
  if (currentOpenSale === deletedHallId) {
    const firstOpenHall = listOpenSale.querySelector('.hall__item');
    if (firstOpenHall) {
      firstOpenHall.classList.add('hall_item-selected');
      currentOpenSale = firstOpenHall.getAttribute('data-id');
      // Обновляем статус зала
      loadHallStatus(currentOpenSale);
    }
  }
}

// Загрузка конфигурации зала
function loadHallConfiguration(hallId) {
  const hall = hallsData.find(h => h.id === Number(hallId));
  if (hall) {
    showHall(hall);
  }
}

// Загрузка конфигурации цен
function loadPriceConfiguration(hallId) {
  const hall = hallsData.find(h => h.id === Number(hallId));
  if (hall) {
    showPrice(hall);
  }
}

// Загрузка статуса зала
function loadHallStatus(hallId) {
  const hall = hallsData.find(h => h.id === Number(hallId));
  if (hall) {
    checkHallOpenImproved(hall);
  }
}

// Обновление обработчиков событий
function updateEventListeners() {
  // Обновляем обработчики для кнопок удаления
  hallsDelButton = document.querySelectorAll(".hall_remove");
  hallsDelButton.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      let hallElement = e.target.closest('.halls__list_item');
      deleteHall(hallId, hallElement);
    })  
  });

  // Обновляем обработчики для выбора залов в конфигурации
  updateHallSelectionListeners();
}

// Обновление обработчиков выбора залов
function updateHallSelectionListeners() {
  // Обработчики для конфигурации залов
  hallsConfigElementy = document.querySelectorAll(".hall-config__item");
  hallsConfigElementy.forEach(item => {
    item.addEventListener("click", () => {
      hallsConfigElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      });
      item.classList.add("hall_item-selected");
      currentConfigHall = item.getAttribute("data-id");
      // Обновляем отображение схемы зала
      loadHallConfiguration(currentConfigHall);
    });
  });

  // Обработчики для конфигурации цен
  priceConfigElementy = document.querySelectorAll(".price-config__item");
  priceConfigElementy.forEach(item => {
    item.addEventListener("click", () => {
      priceConfigElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      });
      item.classList.add("hall_item-selected");
      currentPriceConfig = item.getAttribute("data-id");
      // Обновляем отображение цен
      loadPriceConfiguration(currentPriceConfig);
    });
  });

  // Обработчики для открытия продаж
  const elementyopenSale = document.querySelectorAll(".open__item");
  elementyopenSale.forEach(item => {
    item.addEventListener("click", () => {
      elementyopenSale.forEach(i => {
        i.classList.remove("hall_item-selected");
      });
      item.classList.add("hall_item-selected");
      currentOpenSale = item.getAttribute("data-id");
      // Обновляем статус зала
      loadHallStatus(currentOpenSale);
    });
  });
}

// Отрисовка зала

function showHall(hall) {
  lineConfigHall.value = hall.hall_rows;
  placeConfigHall.value = hall.hall_places;
  
  planHall.innerHTML = "";
  hallsConfigArray.splice(0, hallsConfigArray.length);

  hall.hall_config.forEach(element => {
    planHall.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  linePlanHall = document.querySelectorAll(".hall-config__hall_row");

  for(let i = 0; i < linePlanHall.length; i++) {
    for(let j = 0; j < hall.hall_config[0].length; j++) {
      linePlanHall[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${hall.hall_config[i][j]}"></span>`);
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

  hallsConfigArray = JSON.parse(JSON.stringify(hall.hall_config));
}

// Изменение типа мест на схеме зала

function changePlace(linePlanHall) {
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

        const currentHall = hallsData.find(h => h.id === Number(currentConfigHall));
        if(JSON.stringify(newConfigHallArray) !== JSON.stringify(currentHall.hall_config)) {
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

function changeSizeHall(newConfigHallArray) {
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

    const currentHall = hallsData.find(h => h.id === Number(currentConfigHall));
    if(JSON.stringify(newConfigHallArray) !== JSON.stringify(currentHall.hall_config)) {
      cancelConfigHall.classList.remove("button_disabled");
      saveConfigHall.classList.remove("button_disabled");
    } else {
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");
    }

    changePlace(linePlanHall);
  })
}

// Функция для обновления конфигурации зала и сохранения массива newConfigHallArray
function updateConfigHallArray() {
    newConfigHallArray = [];

    // Получаем количество рядов и мест в зале
    const rowCount = Number(lineConfigHall.value);
    const placeCount = Number(placeConfigHall.value);
    
    for (let i = 0; i < rowCount; i++) {
        newConfigHallArray[i] = []; 
        for (let j = 0; j < placeCount; j++) {
          newConfigHallArray[i][j] = "standart"; 
        }
    }

    const linePlanHall = document.querySelectorAll(".hall-config__hall_row");
    linePlanHall.forEach((rowElement, rowIndex) => {
        const places = rowElement.children; 
        Array.from(places).forEach((placeElement, placeIndex) => {
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
        
        // Обновляем локальные данные
        const hallIndex = hallsData.findIndex(h => h.id === Number(currentConfigHall));
        if (hallIndex !== -1) {
            hallsData[hallIndex].hall_rows = Number(lineConfigHall.value);
            hallsData[hallIndex].hall_places = Number(placeConfigHall.value);
            hallsData[hallIndex].hall_config = JSON.parse(JSON.stringify(newConfigHallArray));
        }
        
        cancelConfigHall.classList.add("button_disabled");
        saveConfigHall.classList.add("button_disabled");
        
        alert("Конфигурация зала сохранена!");
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при сохранении конфигурации.");
    });
}

// Отображение цен

function showPrice(hall) {
  priceStandartConfig.value = hall.hall_price_standart;
  priceVipConfig.value = hall.hall_price_vip;
  
  formPriceConfig.addEventListener("input", () => {
    if(priceStandartConfig.value == hall.hall_price_standart && priceVipConfig.value == hall.hall_price_vip) {
      cancelPriceConfig.classList.add("button_disabled");
      savePriceConfig.classList.add("button_disabled");
    } else {
      cancelPriceConfig.classList.remove("button_disabled");
      savePriceConfig.classList.remove("button_disabled");
    }
  });
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
      
      // Обновляем локальные данные
      const hallIndex = hallsData.findIndex(h => h.id === Number(currentPriceConfig));
      if (hallIndex !== -1) {
          hallsData[hallIndex].hall_price_standart = Number(priceStandartConfig.value);
          hallsData[hallIndex].hall_price_vip = Number(priceVipConfig.value);
      }
      
      cancelPriceConfig.classList.add("button_disabled");
      savePriceConfig.classList.add("button_disabled");
      
      alert("Конфигурация цен сохранена!");
    })
}

function checkSeancesInLocalStorage(hallId) {
  const hallSeances = document.querySelector(`.timeline__seances[data-id="${hallId}"]`);
  if (hallSeances && hallSeances.children.length > 0) {
    return hallSeances.children.length;
  }
  
  return 0;
}

// Проверка, открыт ли зал
function checkHallOpenImproved(hall) {
  infoOpenSale = document.querySelector(".open__info");
  buttonOpenSale = document.querySelector(".admin__button_open");
  
  currentStatusHall = hall.hall_open;

  fetch("https://shfe-diplom.neto-server.ru/seances")
    .then(response => {
      if (response.ok) {
        return response.json().catch(() => {
          return { result: { seances: [] } };
        });
      }
      throw new Error('Network response was not ok');
    })
    .then(data => {
      const seances = data.result?.seances || [];
      let estSeansy = seances.filter(seance => 
        seance.seance_hallid === Number(currentOpenSale)
      ).length;
      
      updateSaleButton(estSeansy);
    })
    .catch(error => {
      console.log("Используем альтернативный метод проверки сеансов");
      let estSeansy = checkSeancesInLocalStorage(currentOpenSale);
      updateSaleButton(estSeansy);
    });
}

function updateSaleButton(estSeansy) {
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
    
    // Обновляем локальные данные
    const hallIndex = hallsData.findIndex(h => h.id === Number(currentOpenSale));
    if (hallIndex !== -1) {
        hallsData[hallIndex].hall_open = newStatusHall;
    }
    
    // Обновляем отображение статуса
    loadHallStatus(currentOpenSale);
    
    alert("Статус зала изменен!");
  })
}

// Получение информации по залам

function hallOperations(data) {
  hallsData = data.result.halls;

  for(let i = 0; i < data.result.halls.length; i++) {


    hallsList.insertAdjacentHTML("beforeend", `
      <li class="halls__list_item">
        <span class="halls__list_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span></p>
      </li>
    `);

    checkListHalls();

    hallsConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);


    priceConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);


    listOpenSale.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);


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

  const currentHall = hallsData.find(hall => hall.id === Number(currentConfigHall));

  lineConfigHall.value = currentHall.hall_rows;
  placeConfigHall.value = currentHall.hall_places;

  cancelConfigHall = document.querySelector(".hall-config__batton_cancel");
  saveConfigHall = document.querySelector(".hall-config__batton_save");

  showHall(currentHall);
  changePlace(linePlanHall);
  changeSizeHall(newConfigHallArray);

  // Клик по кнопке "Отмена" в блоке Конфигурация залов

  cancelConfigHall.addEventListener("click", event => {
    if(cancelConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");

      loadHallConfiguration(currentConfigHall);
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация залов

  saveConfigHall.addEventListener("click", event => {
    if(saveConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else if(lineConfigHall.value <= 0 || placeConfigHall.value <= 0){
      event.preventDefault();
      alert('Значение рядов/мест должно быть не менее единицы');
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
  
  loadPriceConfiguration(currentPriceConfig);

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

      loadPriceConfiguration(currentPriceConfig)
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация цен

  savePriceConfig.addEventListener("click", event => {
    if(savePriceConfig.classList.contains("button_disabled")) {
      event.preventDefault();
    } else if(priceStandartConfig.value <= 0 || priceVipConfig.value <= 0){
      event.preventDefault();
      alert('Стоимость билетов должно быть более 0');
    } else {
      savePrice(currentPriceConfig);
    }
  })

  // Проверка, открыт ли первый зал в списке 

  listOpenSale.firstElementChild.classList.add("hall_item-selected");
  currentOpenSale = listOpenSale.firstElementChild.getAttribute("data-id");

  checkHallOpenImproved(hallsData.find(h => h.id === Number(currentOpenSale)));

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

      // Отрисовка зала

      loadHallConfiguration(currentConfigHall);

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

      loadPriceConfiguration(currentPriceConfig);
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

      checkHallOpenImproved(hallsData.find(h => h.id === Number(currentOpenSale)));
    })
  }) 

  // Клик по кнопке в блоке "Открыть продажи"

  buttonOpenSale.addEventListener("click", event => {
    if(buttonOpenSale.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      openHall(currentOpenSale, newStatusHall);
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