'use strict';

// Test
console.log(document.querySelector('#kitty-greet h1').textContent);

// Paths
const dataPath = '../../kittens.json';

// Variables
let allKittens = [];
let carouselKittens = [];
let activeCarouselItemIndex = 0;
let activeCarouselItemId = 0;
let isAutomaticCarouselCyclingEnabled = true;
let isItemBeingInspected = false;
let searchItemQuantity = 10;

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

const setCarouselKittens = function (data = [], items = 3) {
  if (data.length > 0) {
    let sortedData = data.sort((a, b) => a.age - b.age);
    carouselKittens = [...sortedData].slice(0, items);
  }
  console.log(carouselKittens);
};

setAllKittens(parsedData);
setCarouselKittens(allKittens, 4);

const getKittenById = (id = 0) => allKittens.find((kitten) => kitten.id === id);

// Carousel item render and behaviour section
const renderCarouselItem = function (data = '', status = '') {
  let carouselItem = document.createElement('div');
  carouselItem.id = `citem-id-${data.id}`;
  carouselItem.className = `carousel-item carousel-item--${status}`;

  let carouselItemImg = document.createElement('img');
  carouselItemImg.src = `./assets/img/kittens/${data.name}.jpg`;
  carouselItemImg.addEventListener('error', function () {
    carouselItemImg.src = './assets/img/default.jpg';
  });
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

const getModalBodyInformation = function (id = 0) {
  let kitten = getKittenById(Number(id));
  document.querySelector(
    '.modal-body_name'
  ).innerHTML = `<b>Name: </b> ${kitten.name}`;
  document.querySelector(
    '.modal-body_age'
  ).innerHTML = `<b>Age: </b> ${kitten.age}`;
  document.querySelector(
    '.modal-body_color'
  ).innerHTML = `<b>Color: </b> ${kitten.color}`;
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
  activeCarouselItemId = activeCarouselItem.id.substring(9);
  activeCarouselItem.addEventListener('click', function () {
    isItemBeingInspected = true;
    isAutomaticCarouselCyclingEnabled = false;
    getModalBodyInformation(activeCarouselItemId);
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
  carouselIndicators.innerHTML = '';
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

let carouselCyclerTime = 10000;
let carouselCycler = setInterval(cycleThroughCarousel, carouselCyclerTime);

document
  .querySelector('#cnavigator-left')
  .addEventListener('click', function () {
    prevCarouselItem();
    setActiveCarouselIndicator();
    clearInterval(carouselCycler);
    carouselCycler = setInterval(cycleThroughCarousel, carouselCyclerTime);
  });

document
  .querySelector('#cnavigator-right')
  .addEventListener('click', function () {
    nextCarouselItem();
    setActiveCarouselIndicator();
    clearInterval(carouselCycler);
    carouselCycler = setInterval(cycleThroughCarousel, carouselCyclerTime);
  });

let modalBackdrop = document.querySelector('.modal-backdrop');
modalBackdrop.addEventListener('click', function () {
  isItemBeingInspected = false;
  this.style.display = 'none';
});
document
  .querySelector('.modal-closing-button')
  .addEventListener('click', function () {
    isItemBeingInspected = false;
    modalBackdrop.style.display = 'none';
  });

const renderSearchItem = function (data = '') {
  let searchItem = document.createElement('div');
  searchItem.id = `sitem-id-${data.id}`;
  searchItem.className = 'search-result_card';

  let searchItemImg = document.createElement('img');
  searchItemImg.src = `./assets/img/kittens/${data.name}.jpg`;
  searchItemImg.addEventListener('error', function () {
    searchItemImg.src = './assets/img/default.jpg';
  });
  searchItemImg.alt = `A picture of a kitten named ${data.name}`;

  let searchItemInfo = document.createElement('div');
  searchItemInfo.className = 'search-result_card-info';
  let searchItemName = document.createElement('h4');
  searchItemName.innerText = data.name;
  let searchItemAge = document.createElement('small');
  searchItemAge.innerHTML = `<i class="fa-solid fa-calendar fa-xs"></i> ${data.age} month(s) old`;
  let searchItemColor = document.createElement('small');
  searchItemColor.innerHTML = `<i class="fa-solid fa-palette fa-xs"></i> ${data.color}`;
  let searchItemAdoptBtn = document.createElement('button');
  searchItemAdoptBtn.className = 'button adoption-button';
  searchItemAdoptBtn.innerHTML =
    '<span>Adopt</span><i class="fa-solid fa-paw fa-xl"></i>';
  searchItemAdoptBtn.addEventListener('click', function () {
    removeKittenById(data.id);
  });
  searchItemInfo.appendChild(searchItemName);
  searchItemInfo.appendChild(searchItemAge);
  searchItemInfo.appendChild(searchItemColor);
  searchItemInfo.appendChild(searchItemAdoptBtn);

  searchItem.appendChild(searchItemImg);
  searchItem.appendChild(searchItemInfo);

  return searchItem;
};

const renderSearchItems = function (quantity = 10, snsParams) {
  // sns - Searching And Sorting
  let searchResults = document.querySelector('.search-results');
  let data = [];
  searchResults.innerHTML = '';
  if (snsParams.size == 0) {
    data = allKittens.sort((a, b) => a.age - b.age).slice(0, quantity);
  } else {
    let searchByName = snsParams.has('searchByName')
      ? snsParams.get('searchByName')
      : '';
    let sortBy = snsParams.has('sortBy') ? snsParams.get('sortBy') : '';
    let sortOrder = snsParams.has('sortOrder')
      ? snsParams.get('sortOrder')
      : '';
    let yt6 = snsParams.has('yt6') ? snsParams.get('yt6') : false;
    let yt12 = snsParams.has('yt12') ? snsParams.get('yt12') : false;
    let bc = snsParams.has('bc') ? snsParams.get('bc') : false;
    if (sortBy.length > 0) {
      switch (sortBy) {
        case 'name':
          if (sortOrder.length > 0) {
            data =
              sortOrder == 'desc'
                ? allKittens
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, quantity)
                : allKittens
                    .sort((a, b) => b.name.localeCompare(a.name))
                    .slice(0, quantity);
          } else {
            data = allKittens
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, quantity);
          }
          break;
        case 'age':
          if (sortOrder.length > 0) {
            data =
              sortOrder == 'desc'
                ? allKittens.sort((a, b) => a.age - b.age).slice(0, quantity)
                : allKittens.sort((a, b) => b.age - a.age).slice(0, quantity);
          } else {
            data = allKittens.sort((a, b) => a.age - b.age).slice(0, quantity);
          }
          break;
        default:
          data = allKittens.sort((a, b) => a.age - b.age).slice(0, quantity);
      }
    }

    if (searchByName.length > 0) {
      if (data.length > 0) {
        let temp = [...data];
        data.length = 0;
        data = temp.filter((kitten) =>
          kitten.name.toLowerCase().includes(searchByName)
        );
      } else {
        data = allKittens
          .sort((a, b) => a.age - b.age)
          .slice(0, quantity)
          .filter((kitten) => kitten.name.toLowerCase().includes(searchByName));
      }
    }
  }

  if (data.length > 0) {
    data.forEach((kitten) => {
      searchResults.appendChild(renderSearchItem(kitten));
    });
    if (searchItemQuantity < allKittens.length) {
      let loadMoreBtn = document.createElement('button');
      loadMoreBtn.innerText = 'Load More';
      loadMoreBtn.className = 'button load-more-button';
      loadMoreBtn.addEventListener('click', function () {
        searchItemQuantity += 10;
        renderSearchItems(searchItemQuantity, snsParams);
      });
      searchResults.appendChild(loadMoreBtn);
    }
  }
};

renderSearchItems(searchItemQuantity, new Map());

const removeKittenById = function (id = 0) {
  if (id > -1) {
    let kittenIndex = allKittens.findIndex(
      (kitten) => kitten.id === Number(id)
    );
    allKittens.splice(kittenIndex, 1);
    carouselKittens.length = 0;
    setCarouselKittens(allKittens, 4);
    activeCarouselItemIndex = 0;
    renderCarouselItems(carouselKittens);
    renderCarouselIndicators(carouselKittens);
    setActiveCarouselIndicator();
    renderSearchItems(searchItemQuantity, new Map());
  }
};

document
  .querySelector('.modal-footer .adoption-button')
  .addEventListener('click', function () {
    removeKittenById(activeCarouselItemId);
  });

document
  .querySelector('.search-params')
  .addEventListener('submit', function (e) {
    let snsParams = new Map();
    let searchByName = document.forms['search-form']['search_by-name'].value;
    let sortBy = document.forms['search-form']['search-property'].value;
    let sortOrder = document.forms['search-form']['search-order'].value;
    let searchFilters = document.querySelectorAll(
      '.search-params input[type=checkbox]:checked'
    );
    if (searchByName.length > 0) {
      snsParams.set('searchByName', searchByName);
    }
    if (sortBy.length > 0) {
      snsParams.set('sortBy', sortBy);
    }
    if (sortOrder.length > 0) {
      snsParams.set('sortOrder', sortOrder);
    }
    if (searchFilters.length > 0) {
      searchFilters.forEach((searchFilter) => {
        snsParams.set(searchFilter.value, true);
      });
    }
    renderSearchItems(searchItemQuantity, snsParams);
    e.preventDefault();
  });
