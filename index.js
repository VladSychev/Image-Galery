let time = 100;
let timerId;
let counterImg = 0;
let loadingCount = 4;
/*Таймер для перелистывания*/
function updateTimer() {
  timerId = setTimeout(updateTimer, 2);
  time -= 0.1;
  if (time <= 0) {
    counterImg++;
    if (counterImg === 4) {
      counterImg = 0;
      showNewImages();
    }
    nextImage();
    time = 100;
  }

  document.querySelector(".progress").style.width = time + "%";
}

/*Обновление картинок*/
function showNewImages() {
  loadingCount = 4;
  clearTimeout(timerId);
  time = 100;
  counterImg = 0;
  document.querySelector(".progress").style.width = time + "%";
  let buttonStopStart = document.querySelector(".play-image-button");
  buttonStopStart.textContent = "Stop";
  const images = document.querySelectorAll(".random-img");
  images.forEach((img) => {
    img.classList.remove("img-shadow");
  });
  const imagePreview = document.querySelector(".imgPreview");
  images[0].classList.toggle("img-shadow");
  if (images[0].classList.contains("img-shadow")) {
    imagePreview.src = images[0].src;
  }
  const page = Math.floor(Math.random() * 200);
  fetch("https://loremflickr.com/320/240")
    .then((response) => response.json())
    .then((data) => {
      const images = document.querySelectorAll(".random-img");
      const imagePreview = document.querySelector(".imgPreview");
      const authorName = document.querySelector(".author");
      images.forEach((img, i) => {
        img.src = data[i].download_url;
        imagePreview.src = data[0].download_url;
        authorName.textContent = data[0].author;
        img.classList.add("loading");
      });
    });
}

/*Просмотр полноэкранного изображения*/
function zoomInImage(event) {
  const images = document.querySelectorAll(".random-img");
  images.forEach((img) => {
    img.classList.remove("img-shadow");
  });
  if (event.target.tagName === "IMG") {
    event.target.classList.toggle("img-shadow");
    const imagePreview = document.querySelector(".imgPreview");
    imagePreview.src = event.target.src;

    const page = Math.floor(Math.random() * 200);
    fetch("https://loremflickr.com/320/240")
      .then((response) => response.json())
      .then((data) => {
        const images = document.querySelectorAll(".random-img");
        const authorName = document.querySelector(".author");
        images.forEach((img, i) => {
          authorName.textContent = data[i].author;
        });
      });
  }
  let buttonStopStart = document.querySelector(".play-image-button");
  clearTimeout(timerId);
  time = 100;
  document.querySelector(".progress").style.width = time + "%";
  buttonStopStart.textContent = "Play";
}
/*Функция перелистывания*/
function nextImage() {
  const images = document.querySelectorAll(".random-img");
  images.forEach((img) => {
    img.classList.remove("img-shadow");
  });
  const imagePreview = document.querySelector(".imgPreview");
  images[counterImg].classList.toggle("img-shadow");
  if (images[counterImg].classList.contains("img-shadow")) {
    imagePreview.src = images[counterImg].src;
  }
}
/*Остановка/запуск таймера*/
function stopStart() {
  let buttonStopStart = document.querySelector(".play-image-button");
  clearTimeout(timerId);
  time = 100;
  document.querySelector(".progress").style.width = time + "%";
  if (buttonStopStart.textContent === "Play") {
    buttonStopStart.textContent = "Stop";
    const images = document.querySelectorAll(".random-img");
    for (let i = 0; i < images.length; i++) {
      if (images[i].classList.contains("img-shadow")) {
        counterImg = i;
      }
    }
    updateTimer();
  } else if (buttonStopStart.textContent === "Stop") {
    buttonStopStart.textContent = "Play";
  }
}
function loaded(event) {
  loadingCount -= 1;

  if (loadingCount === 0) {
    updateTimer();
  }
  event.target.classList.remove("loading");
}
/*Функция для загрузки DOM*/
function init() {
  const newImagesButton = document.querySelector(".new-image-button");
  newImagesButton.onclick = showNewImages;
  document
    .querySelector(".img-container")
    .addEventListener("click", zoomInImage);

  /*Добавление картинок*/
  function addImages() {
    clearTimeout(timerId);
    const imageContainer = document.querySelector(".img-container");
    const page = Math.floor(Math.random() * 200);
    fetch("https://loremflickr.com/320/240")
      .then((response) => response.json())
      .then((data) => {
        const imagePreview = document.querySelector(".imgPreview");
        const authorName = document.querySelector(".author");
        for (let i = 0; i < 4; i++) {
          let blockImg = `
            <div class="overlay">
              <img class="random-img" src="${data[i].download_url}">
            </div>`;
          let div = document.createElement("div");
          let divElement = imageContainer.appendChild(div);
          divElement.innerHTML = blockImg;
          authorName.textContent = data[0].author;
          imagePreview.src = data[0].download_url;
        }
        let imgShadow = document.querySelectorAll(".random-img");
        imgShadow[0].classList.add("img-shadow");
        imgShadow.forEach((image) => {
          image.classList.add("loading");
        });
        const img = document.querySelectorAll("img");
        for (let i = 0; i < img.length; i++) {
          img[i].onload = loaded;
        }
      });
  }
  addImages();
  let buttonStopStart = document.querySelector(".play-image-button");
  buttonStopStart.addEventListener("click", stopStart);
}

window.addEventListener("DOMContentLoaded", init);
