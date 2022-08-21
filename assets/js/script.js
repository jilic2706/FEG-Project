'use strict';

// Test
console.log(document.querySelector('#kitty-greet h1').textContent);

// Paths
const dataPath = '../../kittens.json';

// Variables
let allKittens = [];
let carouselKittens = [];
let activeCarouselItemIndex = 0;
let isItemBeingInspected = false;
let isAutomaticCarouselCyclingEnabled = true;

// Constants
const parsedData =
  localStorage.getItem('data') !== null
    ? JSON.parse(localStorage.getItem('data'))
    : [];

// Data retrieval section
(async function () {
  const response = await fetch(dataPath);
  const data = await response.json();

  const dataChecker = setInterval(function () {
    if (localStorage.getItem('data') !== null) {
      clearInterval(dataChecker);
    } else {
      if (data) {
        if (
          localStorage.getItem('data') === null ||
          (localStorage.getItem('last-updated') !== null &&
            data['last-updated'] !== localStorage.getItem('last-updated'))
        ) {
          localStorage.setItem('data', JSON.stringify(data['kittens']));
          localStorage.setItem(
            'last-updated',
            JSON.stringify(data['last-updated'])
          );
          clearInterval(dataChecker);
          window.location.reload();
        }
      }
    }
  }, 500);
})();

const setAllKittens = function (data = []) {
  if (data.length > 0) {
    allKittens = [...data];
  }
  console.log(allKittens);
};

const setCarouselKittens = function (data = [], items = 4) {
  if (data.length > 0) {
    let sortedData = data.sort((a, b) => a.age - b.age);
    carouselKittens = [...sortedData].slice(0, items);
  }
  console.log(carouselKittens);
};

setAllKittens(parsedData);
setCarouselKittens(parsedData, 5);

const getKittenById = function (id = 0) {};

// Carousel item render and behaviour section
const renderCarouselItem = function (data = '', status = '') {
  let carouselItem = document.createElement('div');
  carouselItem.id = `citem-id-${data.id}`;
  carouselItem.className = `carousel-item carousel-item--${status}`;

  let carouselItemImg = document.createElement('img');
  carouselItemImg.src = `./assets/img/kittens/${data.name}.jpg`;
  carouselItemImg.alt = `A picture of a kitten named ${data.name}`;

  carouselItem.appendChild(carouselItemImg);
  if (status === 'active') {
    let carouselItemInfo = document.createElement('div');
    carouselItemInfo.className = 'carousel-item-info';

    let carouselItemInfoName = document.createElement('h3');
    carouselItemInfoName.textContent = `${data.name}`;

    carouselItemInfo.appendChild(carouselItemInfoName);
    carouselItem.appendChild(carouselItemInfo);
  }

  return carouselItem;
};

const renderCarouselItems = function (data = '') {
  let carouselItems = document.querySelector('.carousel-items');
  carouselItems.innerHTML = '';

  let prevCarouselItemIndex = (activeCarouselItemIndex) => {
    if (activeCarouselItemIndex - 1 < 0) {
      return carouselKittens.length - 1;
    } else {
      return activeCarouselItemIndex - 1;
    }
  };
  let nextCarouselItemIndex = (activeCarouselItemIndex) => {
    if (activeCarouselItemIndex + 1 > carouselKittens.length - 1) {
      return 0;
    } else {
      return activeCarouselItemIndex + 1;
    }
  };
  carouselItems.appendChild(
    renderCarouselItem(
      carouselKittens[prevCarouselItemIndex(activeCarouselItemIndex)],
      'prev'
    )
  );
  let activeCarouselItem = renderCarouselItem(
    carouselKittens[activeCarouselItemIndex],
    'active'
  );
  activeCarouselItem.addEventListener('click', function () {
    isItemBeingInspected = true;
    isAutomaticCarouselCyclingEnabled = false;
    document.querySelector('.modal-backdrop').style.display = 'flex';
  });
  activeCarouselItem.addEventListener('mouseover', function () {
    isAutomaticCarouselCyclingEnabled = false;
  });
  activeCarouselItem.addEventListener('mouseout', function () {
    isAutomaticCarouselCyclingEnabled = true;
  });
  carouselItems.appendChild(activeCarouselItem);
  carouselItems.appendChild(
    renderCarouselItem(
      carouselKittens[nextCarouselItemIndex(activeCarouselItemIndex)],
      'next'
    )
  );
};

// Carousel indicator rendering and behaviour section
const renderCarouselIndicators = function (data = '') {
  let carouselIndicators = document.querySelector('.carousel-indicators');
  data.forEach((kitten) => {
    carouselIndicators.appendChild(createCarouselIndicator(kitten));
  });
};

const createCarouselIndicator = function (data = '') {
  let span = document.createElement('span');
  span.id = `cindicator-id-${data.id}`;

  let i = document.createElement('i');
  i.className = 'fa-solid fa-circle';

  span.appendChild(i);
  return span;
};

const setActiveCarouselIndicator = function () {
  if (document.querySelector('.carousel-indicator--active')) {
    document
      .querySelector('.carousel-indicator--active')
      .classList.remove('carousel-indicator--active');
  }

  let activeCarouselItemId = document
    .querySelector('.carousel-item--active')
    .id.substring(9);
  let activeCarouselIndicator = document.getElementById(
    `cindicator-id-${activeCarouselItemId}`
  );
  activeCarouselIndicator.classList.add('carousel-indicator--active');
};

// Carousel content initialization section
const initCarouselContents = function () {
  renderCarouselItems(carouselKittens);
  renderCarouselIndicators(carouselKittens);
  setActiveCarouselIndicator();
};

initCarouselContents();

const nextCarouselItem = function () {
  if (activeCarouselItemIndex + 1 > carouselKittens.length - 1) {
    activeCarouselItemIndex = 0;
  } else {
    activeCarouselItemIndex++;
  }
  renderCarouselItems();
  setActiveCarouselIndicator();
};

const prevCarouselItem = function () {
  if (activeCarouselItemIndex - 1 < 0) {
    activeCarouselItemIndex = carouselKittens.length - 1;
  } else {
    activeCarouselItemIndex--;
  }
  renderCarouselItems();
  setActiveCarouselIndicator();
};

const cycleThroughCarousel = function () {
  if (isAutomaticCarouselCyclingEnabled && !isItemBeingInspected) {
    nextCarouselItem();
    setActiveCarouselIndicator();
  }
};

let carouselCycler = setInterval(cycleThroughCarousel, 5000);

document
  .querySelector('#cnavigator-left')
  .addEventListener('click', function () {
    prevCarouselItem();
    setActiveCarouselIndicator();
    clearInterval(carouselCycler);
    carouselCycler = setInterval(cycleThroughCarousel, 5000);
  });

document
  .querySelector('#cnavigator-right')
  .addEventListener('click', function () {
    nextCarouselItem();
    setActiveCarouselIndicator();
    clearInterval(carouselCycler);
    carouselCycler = setInterval(cycleThroughCarousel, 5000);
  });

let modalBackdrop = document.querySelector('.modal-backdrop');
let modal = document.querySelector('.modal');

document
  .querySelector('.modal-closing-button')
  .addEventListener('click', function () {
    isItemBeingInspected = false;
    modalBackdrop.style.display = 'none';
  });

modalBackdrop.addEventListener('click', function () {
  isItemBeingInspected = false;
  this.style.display = 'none';
});

/*
let cycleThroughCarousel = setInterval(nextCarouselItem, 5000);
document.querySelector('.carousel-item--active').onmouseover = function () {
  clearInterval(cycleThroughCarousel);
  console.log(cycleThroughCarousel);
};
document.querySelector('.carousel-item--active').onmouseout = function () {
  cycleThroughCarousel = setInterval(nextCarouselItem, 5000);
  console.log(cycleThroughCarousel);
};
*/
