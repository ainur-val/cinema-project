const formLogin = document.querySelector(".login__form");
const emailLogin = document.querySelector(".login__email");
const passwordLogin = document.querySelector(".login__password");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  if(emailLogin.value.trim() && passwordLogin.value.trim()) {
    const infoHall = new FormData(formLogin);

    fetch("https://shfe-diplom.neto-server.ru/login", {
      method: "POST",
      body: infoHall
    })
    .then(response => response.json())
    .then(function(data) {
      if(data.success === true) {
        document.location="./admin-index.html";
      } else {
        alert("Неверный логин/пароль!");
      }
    })
  }
})
