document.addEventListener("DOMContentLoaded", function () {
    fetch('../products.json') // Ensure the correct filename
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            let productContainer = document.querySelector(".products");
            productContainer.innerHTML = ""; // Clear any existing content

            products.forEach(product => {
                let productDiv = document.createElement("div");
                productDiv.classList.add("product");

                // let priceHtml = `<div class="product_price">
                //                     <div class="new_price">${product.price}</div>
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
                            <div class="old_price">₹${product.range.min}</div>
                            <div class="new_price">- ₹${product.range.max}</div>
                        </div>
                    </div>
                </div>
                `;

                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error loading products:', error));
});
