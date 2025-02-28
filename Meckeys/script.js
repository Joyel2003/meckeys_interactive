const filterSelect = document.getElementById('filter-select');
let ratingFilters = [];

// Slider functions
const minLimit = document.getElementById("min-limit");
const maxLimit = document.getElementById("max-limit");

function onChangeSlider() {
  loadData();
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
}

function loadData() {
  fetch('../products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(productsData => {
      let products = productsData;
      // Filter Data based on select-filter
      switch (filterSelect.value) {
        case "rating":
          products = products.sort((a, b) => b.star - a.star)
          break;
        case "latest":
          products = products.sort((a, b) => {
            const aDate = parseDate(a.date);
            const bDate = parseDate(b.date);
            return bDate - aDate;
          })
          break;
        case "low-to-high":
          products = products.sort((a, b) => {
            if (a.price && b.price) return a.price - b.price;
            if (a.price && !b.price) return a.price - b.range.min;
            if (!a.price && b.price) return a.range.min - b.price;
            return a.range.min - b.range.min;
          });
          break;
        case "high-to-low":
          products = products.sort((a, b) => {
            if (a.price && b.price) return b.price - a.price;
            if (a.price && !b.price) return b.range.min - a.price;
            if (!a.price && b.price) return b.price - a.range.min;
            return b.range.min - a.range.min;
          });
          break;
          default:
            products = products;
            break;
      }

      if(ratingFilters.length > 0) {
        products = products.filter(product => ratingFilters.includes(product.star + ""));
      }

      console.log(maxLimit.value)

      products = products.filter(product => {
        if(product.price) return product.price > minLimit.value && product.price < maxLimit.value;
        else return product.range.min > minLimit.value && product.range.max < maxLimit.value;
      })

      let productContainer = document.querySelector(".products");
      productContainer.innerHTML = "";

      products.forEach(product => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // let priceHtml = `<div class="product_price">
        //                     <div class="new_pric+e">${product.price}</div>
        //                 </div>`;

        productDiv.innerHTML = `
                  <div class="product">
                  <div class="product_img">
                      <div class="like_logo">
                          <svg width="16" height="16" fill="white" viewBox="0 0 512 512">
                              <path xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                  d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z">
                              </path>
                          </svg>
                      </div>
                      <img src="${product.img}" alt="${product.name}">
                  </div>
                  <div class="product_content">
                      <div class="product_name">${product.name}</div>
                      <div class="rating">${product.rating}</diV>
                      <div class="product_price">
                      ${product.mrp ?
            `
                          <div class="old_price">₹${product.mrp}</div>
                          <div class="new_price">₹${product.price}</div>
                          ` :
            `
                          <div class="old_price">₹${product.range.min}</div>
                          <div class="new_price">- ₹${product.range.max}</div>
                          `
          }
                      </div>
                  </div>
              </div>
              `;

        productContainer.appendChild(productDiv);
      });
    })
    .catch(error => console.error('Error loading products:', error));
}

document.addEventListener("DOMContentLoaded", loadData);
let rangeMin = 100;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    if (maxRange - minRange < rangeMin) {
      if (e.target.className === "min") {
        rangeInput[0].value = maxRange - rangeMin;
      } else {
        rangeInput[1].value = minRange + rangeMin;
      }
    } else {
      rangePrice[0].value = minRange;
      rangePrice[1].value = maxRange;
      range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
    }
  });
});

rangePrice.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = rangePrice[0].value;
    let maxPrice = rangePrice[1].value;
    if (maxPrice - minPrice >= rangeMin && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

// Filter Selection
filterSelect.onchange = loadData;

document.querySelectorAll(".filter-check").forEach((el) => {
  el.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    if (e.target.checked) {
      ratingFilters.push(filterValue);
    } else {
      ratingFilters = ratingFilters.filter((filter) => filter!== filterValue);
    }
    loadData()
  })
})