let products = [];
let filteredProducts = [];

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('../html/data/clothes.json');
        const data = await response.json();
        products = data.products;
        filteredProducts = [...products];
        displayProducts(filteredProducts);
        setupPriceFilter();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in cards
function displayProducts(productsToShow) {
    const clothesContainer = document.getElementById('clothes-container');
    clothesContainer.innerHTML = '';

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'html/images/placeholder.jpg'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price.toLocaleString()} ₽</p>
            </div>
        `;
        clothesContainer.appendChild(card);
    });
}

// Setup price filter
function setupPriceFilter() {
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    document.getElementById('min-price').value = minPrice;
    document.getElementById('max-price').value = maxPrice;
    document.getElementById('price-min').textContent = minPrice.toLocaleString() + ' ₽';
    document.getElementById('price-max').textContent = maxPrice.toLocaleString() + ' ₽';

    // Update filtered products when price range changes
    document.getElementById('min-price').addEventListener('input', filterProducts);
    document.getElementById('max-price').addEventListener('input', filterProducts);
}

// Filter products by price
function filterProducts() {
    const minPrice = parseInt(document.getElementById('min-price').value);
    const maxPrice = parseInt(document.getElementById('max-price').value);
    
    document.getElementById('price-min').textContent = minPrice.toLocaleString() + ' ₽';
    document.getElementById('price-max').textContent = maxPrice.toLocaleString() + ' ₽';

    filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );

    displayProducts(filteredProducts);
}

// Sort products by price
function sortProducts(direction) {
    const container = document.getElementById('products-container');
    const products = Array.from(container.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.card-text').textContent.replace('€', ''));
        const priceB = parseFloat(b.querySelector('.card-text').textContent.replace('€', ''));
        
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Add sorted products back
    products.forEach(product => {
        container.appendChild(product);
    });
}

// Initialize catalog
document.addEventListener('DOMContentLoaded', fetchProducts);
