// Стрелки скрытия/раскрытия разделов

const arrowTitle = document.querySelectorAll(".admin__header_arrow");

// Скрытие/раскрытие разделов

arrowTitle.forEach(arrow => {
  arrow.addEventListener("click", () => {
    let titleElement = arrow.closest(".admin__header");
    let adminWrap = titleElement.nextElementSibling;

    arrow.classList.toggle("admin__header_arrow-hide");
    adminWrap.classList.toggle("admin__wrapper-hide");
  })
})

// popups
const popupWindows = Array.from(document.querySelectorAll(".popup"));
const closePopupWindows = Array.from(document.querySelectorAll(".popup__close"));
const formPopupWindows = Array.from(document.querySelectorAll(".popup__form"));
const cancelPopupWindows = Array.from(document.querySelectorAll(".popup__button_cancel"));

// Закрытие popup

popupWindows.forEach(wind => {
  closePopupWindows.forEach(element => {
    element.addEventListener("click", () => {
      wind.classList.add("popup__hidden");
    })
  })

  // Кнопка "отменить" в popup

  formPopupWindows.forEach(el => {
    cancelPopupWindows.forEach(element => {
      element.addEventListener("click", () => {
        el.reset();
        wind.classList.add("popup__hidden");
      })
    })
  })
})

// Запрос данных у сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    hallOperations(data);
    operationsFilms(data);
    operationsSessions(data);
  })
  
  