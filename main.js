"use strict"

// Variable declaration
const time = document.getElementById("time"),
  greeting = document.getElementById("greeting"),
  name = document.getElementById("name"),
  focus = document.getElementById("focus"),
  img = document.querySelector('.bg-img')

// Event Listeners
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

// Handles Clock
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  hour = hour % 12 || 12; // 12 hour format

  const amPm = hour < 12 ? "AM" : "PM";

  time.innerHTML = `
  <span>${hour}:</span>
  <span>${addZero(min)}</span>
  <span class="sec">${addZero(sec)} ${amPm}</span>`;
  setTimeout(showTime, 1000);
}

async function fetchImage(query) {
  const url = "https://api.unsplash.com/photos/random?query=" + query + "&count=8&client_id=yR6wwzEL63OWRgnba7liHfBDspTNj0sRDDrJMgmICgQ"

  const options = {
    method: 'GET',
    redirect: 'follow'
  };

  const data = await fetch(url, options);
  const response = await data.json()

  // returns a filtered array of images with city and country
  return response.filter(({ location: { city, country } }) => city && country);
}

async function render() {

  let today = new Date(),
    hour = today.getHours();
  if (hour < 12) {
    greeting.innerHTML = "Good Morning";
  } else if (hour < 18) {
    greeting.innerHTML = "Good Afternoon";
  } else {
    greeting.innerHTML = "Good Evening";
  }
  const day_night = hour < 18 ? 'nature' : 'night-forest'
  const unsplash = await fetchImage(day_night).catch(error => console.log('error', error));
  const imgObj = format(unsplash[0])

  img.src = imgObj.raw
  document.querySelector('.name').innerHTML = imgObj.name
  document.querySelector('.country').innerHTML = imgObj.name === imgObj.city ? imgObj.country : `${imgObj.city}, ${imgObj.country}`
}

function setName(event) {
  if (event.type === "keypress") {
    if (event.which == 13 || event.keyCode == 13) {
      localStorage.setItem("name", event.target.value.trim());

      // Makes the width of the input === to the number of characters
      // Hence the hardcoded 27
      this.style.width = ((this.value.length + 1) * 26) + 'px';
      this.disabled = true
      name.blur();
    }
  } else {
    localStorage.setItem("name", event.target.value.trim());
    this.disabled = true
  }
}

function setFocus(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 12) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem("focus", e.target.innerText);
  }
}

function getName() {
  if (
    localStorage.getItem("name") === null ||
    localStorage.getItem("name") == ""
  ) {
    name.disabled = false;
  } else {
    name.value = localStorage.getItem("name");
    name.disabled = true;
  }
}

function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.innerText = "[------]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

function addZero(num) {
  return (parseInt(num, 10) < 10 ? "0" : " ") + num;
}

function format({ urls: { raw }, location: { name, city, country } }) {
  return {
    raw,
    city,
    country,
    name: name.split(',').slice(0, 1).toString()
  }
}

showTime();
getName();
getFocus();
render()