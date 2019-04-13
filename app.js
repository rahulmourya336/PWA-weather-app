let validUser = "NULL";
// let userDetails = '';

const getValidUser = () => validUser;
const setValidUser = status => (validUser = status);

document.onload = _ => {
  console.log("DOM LOADED");
  reRenderDOM();
};

function onSignIn(googleUser) {
  console.log("Signing User");
  var profile = googleUser.getBasicProfile();
  console.log(profile);
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  setValidUser("SIGNED_IN");
  showUserDetails(profile);
  reRenderDOM();
}

const signOut = _ => {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => console.log("User signed out."));
  setValidUser("SIGNED_OUT");
  clearContainer("userInfo");
  reRenderDOM();
};

const toggleElementById = (id, property) => {
  let target = document.getElementById(id);
  if (target) {
    target.style.visibility = property;
  } else {
    console.warn(`Invalid DOM ID ${id}`);
  }
};

const reRenderDOM = () => {
  console.log("RE-RENDERING DOM");
  let signin = document.getElementsByClassName("g-signin2");
  let signout = document.getElementById("signout");

  if (validUser === "SIGNED_IN") {
    signin[0].style.display = "none";
    signout.style.display = "block";
    toggleElementById("signin-helper-text", "hidden");
  } else if (validUser === "SIGNED_OUT") {
    signin[0].style.display = "block";
    signout.style.display = "none";
    toggleElementById("signin-helper-text", "visible");
  } else {
    signin[0].style.display = "block";
    signout.style.display = "none";
  }
};

clearContainer = targetDiv => {
  document.getElementById(targetDiv).innerText = "";
};

const showUserDetails = profile => {
  clearContainer("userInfo");

  let parent = document.getElementById("userInfo");

  let userProfilePicture = document.createElement("img");
  userProfilePicture.setAttribute("src", profile.getImageUrl());
  userProfilePicture.setAttribute("alt", profile.getName());

  const userID = document.createElement("p");
  userID.innerText = "ID: " + profile.getId();

  const userName = document.createElement("p");
  userName.innerText = "Name: " + profile.getName();

  const userEmail = document.createElement("p");
  userEmail.innerText = "E-mail: " + profile.getEmail();

  // parent.appendChild(userProfilePicture);
  // parent.appendChild(userID);
  // parent.appendChild(userName);
  // parent.appendChild(userEmail);
};

const weatherLookup = () => {
  let cityName = document.getElementById("country-input").value;
  if (!cityName) {
    let data = {
      message: "Please enter a location name",
      status: "error"
    };
    notification(data);
    return;
  }
  console.warn("Looking up for", cityName);
  weatherByCity(cityName);
};

const populateData = data => {
  data = JSON.parse(data);

  let container = document.getElementById("country-weather-info");
  if (data.hasOwnProperty("message") === "city not found") {
    clearContainer("country-weather-info");
    let status_text = {
      message: "Please enter a location name",
      status: "error"
    };
    notification(status_text);
  } else {
    clearContainer("country-weather-info");

    let cityName = document.createElement("h2");
    cityName.innerHTML = data.name;

    let temperature = document.createElement("p");
    console.log("data sampling", data.main.temp);
    temperature.innerText = Math.ceil(data.main.temp - 273.15) + "° Celsius";

    let description = document.createElement("p");
    description.innerText = data.weather[0].description;

    container.appendChild(cityName);
    container.appendChild(temperature);
    container.appendChild(description);

    // container.innerText = data;
    return;
  }
};

const notification = obj => {
  let parent = document.getElementById("error-block");
  const elementId = "status-text";

  let messageText = document.createElement("p");
  messageText.innerHTML = obj.message;
  messageText.setAttribute("id", elementId);

  if (obj.status === "error") {
    messageText.setAttribute("class", obj.status);
  } else if (obj.status === "success") {
    messageText.setAttribute("class", obj.status);
  } else {
    messageText.setAttribute("class", "default");
  }

  parent.append(messageText);
  hideElementById(elementId);
};

const hideElementById = id => {
  let elementList = document.querySelectorAll("#status-text");
  for (let i = 0; i < elementList.length; i++) {
    setTimeout(() => {
      elementList[i].style.display = "none";
    }, 1000);
  }
};
