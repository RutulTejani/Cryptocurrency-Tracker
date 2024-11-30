const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
const currency = "usd";
let cryptoData = [];
let comparisonList = JSON.parse(localStorage.getItem("comparisonList")) || [];
let userPreferences = JSON.parse(localStorage.getItem("userPreferences")) || {
  sortBy: "market_cap_desc",
  perPage: 10,
  headerBackgroundColor: "#1a73e8", // Default blue
  buttonColor: "#007bff",           // Default blue
  favoriteCoins: [],
};
const perpageEle = document.getElementById("per-page");
perpageEle.value = userPreferences.perPage;
const sortingEle = document.getElementById("sorting");
sortingEle.value = userPreferences.sortBy;
const colorpickerEle = document.getElementById("color-picker");
colorpickerEle.value = userPreferences.buttonColor;


async function fetchCryptoData() {
    console.log(userPreferences.perPage);
    
  const response = await fetch(
    `${apiUrl}?vs_currency=${currency}&per_page=${userPreferences.perPage}`
  );
  cryptoData = await response.json();
  sortCryptoData();
  displayCryptoData();
  displayComparison();
  displayFavorites();
}

function displayCryptoData() {
  const container = document.getElementById("crypto-container");
  container.innerHTML = ""; // Clear previous data

  cryptoData.forEach((crypto) => {
    const card = document.createElement("div");
    card.classList.add("crypto-card");
    card.innerHTML = `
        <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
        <p>Price: $${crypto.current_price.toFixed(2)}</p>
        <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
        <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
        <button style="background-color: ${userPreferences.buttonColor }" onclick="addToComparison('${crypto.id}')">Add to Compare</button>
        <button style="background-color: ${userPreferences.buttonColor }" onclick="toggleFavorite('${crypto.id}')">${
      userPreferences.favoriteCoins.includes(crypto.id)
        ? "Remove from Favorites"
        : "Add to Favorites"
    }</button>
    `;
    container.appendChild(card);
  });
}

function addToComparison(cryptoId) {
    if(comparisonList.length >= 5 ){
        alert("You can add a maximum of 5 cryptocurrencies to the comparison.");
    }
  if (!comparisonList.includes(cryptoId)) {
    comparisonList.push(cryptoId);
    localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
    displayComparison();
  } else {
    alert("This cryptocurrency already exist in the comparison.");
  }
}

function displayComparison() {
  const container = document.getElementById("comparison-container");
  container.innerHTML = ""; // Clear previous comparison data

  comparisonList.forEach((id) => {
    const data = cryptoData.find((crypto) => crypto.id === id);
    if (data) {
      const card = document.createElement("div");
      card.classList.add("crypto-card");
      card.innerHTML = `
        <h3>${data.name} (${data.symbol.toUpperCase()})</h3>
        <p>Price: $${data.current_price.toFixed(2)}</p>
        <p>24h Change: ${data.price_change_percentage_24h.toFixed(2)}%</p>
        <p>Market Cap: $${data.market_cap.toLocaleString()}</p>
        <button style="background-color: ${userPreferences.buttonColor }" onclick="removeFromComparison('${id}')">Remove</button>
      `;
      container.appendChild(card);
    }
  });
}

function removeFromComparison(cryptoId) {
  comparisonList = comparisonList.filter((id) => id !== cryptoId);
  localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
  displayComparison();
}

document.getElementById("reset-comparison").addEventListener("click", () => {
  comparisonList = [];
  localStorage.removeItem("comparisonList");
  displayComparison();
});
document.getElementById("reset-comparison-fav").addEventListener("click", () => {
    userPreferences.favoriteCoins = [];
  localStorage.removeItem("userPreferences", userPreferences);
  displayFavorites();
  displayCryptoData()
});

// Sorting Functionality (Local Sorting)
function sortCryptoData() {
  switch (userPreferences.sortBy) {
    case "market_cap_desc":
      cryptoData.sort((a, b) => b.market_cap - a.market_cap);
      break;
    case "market_cap_asc":
      cryptoData.sort((a, b) => a.market_cap - b.market_cap);
      break;
    case "price_desc":
      cryptoData.sort((a, b) => b.current_price - a.current_price);
      break;
    case "price_asc":
      cryptoData.sort((a, b) => a.current_price - b.current_price);
      break;
    default:
      break;
  }
}

function toggleFavorite(cryptoId) {
  const isFavorite = userPreferences.favoriteCoins.includes(cryptoId);
  if (isFavorite) {
    userPreferences.favoriteCoins = userPreferences.favoriteCoins.filter(
      (id) => id !== cryptoId
    );
  } else {
    userPreferences.favoriteCoins.push(cryptoId);
  }
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  displayFavorites();
  displayCryptoData();
}

function displayFavorites() {
  const container = document.getElementById("favorite-crypto-container");
  container.innerHTML = ""; // Clear previous favorites data

  userPreferences.favoriteCoins.forEach((id) => {
    const data = cryptoData.find((crypto) => crypto.id === id);
    if (data) {
      const card = document.createElement("div");
      card.classList.add("crypto-card");
      card.innerHTML = `
        <h3>${data.name} (${data.symbol.toUpperCase()})</h3>
        <p>Price: $${data.current_price.toFixed(2)}</p>
        <p>24h Change: ${data.price_change_percentage_24h.toFixed(2)}%</p>
        <p>Market Cap: $${data.market_cap.toLocaleString()}</p>
      `;
      container.appendChild(card);
    }
  });
}

function changeSorting(sortBy) {
  userPreferences.sortBy = sortBy;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  fetchCryptoData();
}

function changePerPage(perPage) {
  userPreferences.perPage = parseInt(perPage);
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  fetchCryptoData();
}

function changeColor(color) {
  userPreferences.headerBackgroundColor = color;
  userPreferences.buttonColor = color;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  updateDisplayColors();
}

function updateDisplayColors() {
  document.querySelector("header").style.backgroundColor =
    userPreferences.headerBackgroundColor;
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.backgroundColor = userPreferences.buttonColor;
  });
}

// Load initial data
updateDisplayColors();
fetchCryptoData();
