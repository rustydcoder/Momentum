"use strict"

// code imported from https://github.com/rustydcoder/todo-list-js/blob/master/index.js
// made a few tweaks

class Todo {
  constructor(input, container) {
    this.input = document.querySelector(input)
    this.container = document.querySelector(container)

    this._data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
      todo: [],
      state: true
    }
  }

  addToList() {
    const val = this.capitalizeVal(this.input.value);
    const regex = (/([^\s])/);

    if (regex.test(val) && !this._data.todo.includes(val)) {
      this.insertToDom(val)
      this._data.todo.push(val)
      this.updateSavedData()
    }

    this.input.value = '';
    this.input.focus()
  }

  capitalizeVal(val) {
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  }

  insertToDom(val) {
    const list = document.createElement('div')
    const span = document.createElement('span')
    span.innerText = val.trim()
    list.classList.add('list__item')

    const div = document.createElement('div')
    div.classList.add('btn__group')

    const removeBtn = document.createElement('button')
    removeBtn.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'
    removeBtn.classList.add('remove-list__item')
    removeBtn.addEventListener('click', (event) => this.removeFromList(event))

    const checkbox = document.createElement('input')
    checkbox.classList.add('complete-list__item')
    checkbox.type = 'checkbox'
    checkbox.value = val.trim()
    checkbox.addEventListener('click', (event) => this.completeItem(event))

    list.appendChild(span)
    div.appendChild(checkbox)
    div.appendChild(removeBtn)
    list.appendChild(div)

    this.container.insertBefore(list, this.container.childNodes[0])
  }

  emptyState() {
    this.container.insertAdjacentHTML('afterend', `
      <h2 class="empty__state" style="display: none">
        Nothing to do?
      </h2>
      `)
  }

  updateSavedData() {
    this._data.state = this._data.todo.length > 0 ? false : true
    localStorage.setItem('todoList', JSON.stringify(this._data))
  }

  removeFromList(event) {
    const item = event.target.parentNode.parentNode.parentNode;
    const parent = item.parentNode
    const id = (/done/).test(item.className)
    const value = item.firstElementChild.innerText

    if (!id) {
      this._data.todo.splice(this._data.todo.indexOf(value), 1)
    }

    this.updateSavedData()
    parent.removeChild(item)
  }

  completeItem(event) {
    const item = event.target.parentNode.parentNode;
    const id = (/done/).test(item.className)
    const value = event.target.value

    if (event.target.checked) {
      item.classList.add('done')
    }
    else {
      item.classList.remove('done')
    }

    if (id) {
      this._data.todo.push(value)
    } else {
      this._data.todo.splice(this._data.todo.indexOf(value), 1)
    }

    this.updateSavedData()
  }

  renderTodoList() {
    this.emptyState()
    this._data.todo.forEach(val => {
      this.insertToDom(val)
    })
  }

  init() {
    this.renderTodoList()

    this.input.addEventListener('keypress', (e) => {
      if (e.keyCode == 13 || e.which == 13) {
        this.addToList()
      }
    })

  }
}

const todo = new Todo('#focus', '#list')
todo.init()

// Variable declaration
const time = document.getElementById("time"),
  greeting = document.getElementById("greeting"),
  name = document.getElementById("name"),
  focus = document.getElementById("focus"),
  img = document.querySelector('.bg-img')

// Event Listeners
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);

// Handles Clock
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  hour = hour % 12 || 12; // 12 hour format

  const amPm = today.getHours() < 12 ? "AM" : "PM";

  time.innerHTML = `
  <span>${hour}:</span>
  <span>${addZero(min)}</span>
  <span class="sec">${addZero(sec)} ${amPm}</span>`;
  setTimeout(showTime, 1000);
}

async function fetchImage(query) {
  const url = "https://api.unsplash.com/photos/random?query="
    + query +
    "&count=8&client_id=yR6wwzEL63OWRgnba7liHfBDspTNj0sRDDrJMgmICgQ"

  const options = {
    method: 'GET',
    redirect: 'follow'
  };

  const data = await fetch(url, options);
  const response = await data.json()

  // returns a filtered array of images with city and country
  // and the conditions
  return response.filter(({
    location: { city, country },
    height,
    width
  }) => city && country && width > 2000 && height > 2000);
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

  img.onload = function () { console.log('Image Loaded') }
  img.src = imgObj.raw
  document.querySelector('.name').innerHTML = imgObj.name
  document.querySelector('.country').innerHTML = imgObj.name === imgObj.city ? imgObj.country : `${imgObj.city}, ${imgObj.country}`
  setTimeout(() => {
    document.querySelector('.bg-alt').style.display = imgObj.raw ? 'none' : 'block'
  }, 9000);
}

function setName(event) {
  if (event.type === "keypress") {
    if (event.which == 13 || event.keyCode == 13) {
      localStorage.setItem("name", event.target.value.trim());

      // Makes the width of the input === to the number of characters
      // Hence the hardcoded 26
      this.style.width = ((this.value.length + 1) * 26) + 'px';
      this.disabled = true
      name.blur();
    }
  } else {
    localStorage.setItem("name", event.target.value.trim());
    this.disabled = true
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
render()