'use strict';

// Paths
const dataPath = '../../kittens.json';

// Variables
let localData = [];
let localSortedData = [];
const parsedData =
  localStorage.getItem('data') !== null
    ? JSON.parse(localStorage.getItem('data'))
    : [];

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

const setLocalData = function (data = []) {
  if (data.length > 0) {
    data.forEach((kitten) => {
      localData.push(kitten);
    });
  }
  console.log(localData);
};

const setLocalSortedData = function (data = []) {
  if (data.length > 0) {
    let sortedData = data.sort((a, b) => a.age - b.age);
    localSortedData = [...sortedData];
  }
  console.log(localSortedData);
};

setLocalData(parsedData);
setLocalSortedData(parsedData);

// Test
console.log(document.querySelector('#kitty-greet h1').textContent);

const renderCarousel = function (data = '') {
  let carousel = document.querySelector('.carousel');
  console.log(carousel);
};

//let dataSortedByAge = data.sort((a, b) => a.age - b.age);
