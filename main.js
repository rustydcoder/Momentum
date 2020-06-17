const time = document.getElementById("time"),
  greeting = document.getElementById("greeting"),
  name = document.getElementById("name"),
  focus = document.getElementById("focus");
const showamPm = true;
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
  hour = hour % 12 || 12;

  const amPm = hour < 12 ? "PM" : "AM";
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
    sec
  )} ${showamPm ? amPm : ""}`;
  setTimeout(showTime, 1000);
}
function addZero(num) {
  return (parseInt(num, 10) < 10 ? "0" : " ") + num;
}
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();
  if (hour < 12) {

    greeting.innerHTML = "Good Morning";
  } else if (hour < 18) {

    greeting.innerHTML = "Good Afternoon";
  } else {

    greeting.innerHTML = "Good Evening";
  }
}
function setName(event) {
  if (event.type === "keypress") {
    if (event.which == 13 || event.keyCode == 13) {
      localStorage.setItem("name", event.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem("name", event.target.innerText);
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
    name.innerText = "[Enter Name]";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.innerText = "[------]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
showTime();
setBgGreet();
getName();
getFocus();
