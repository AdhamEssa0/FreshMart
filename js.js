
// Product Data
const products = [
    { id: 1, name: 'Organic Apples', price: 2.99, category: 'fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', badge: 'New' },
    { id: 2, name: 'Fresh Bananas', price: 1.49, category: 'fruits', image: 'https://images.unsplash.com/photo-1601001435828-89cd6ef542e2?w=400&h=300&fit=crop', badge: 'Sale' },
    { id: 3, name: 'Carrots', price: 1.99, category: 'vegetables', image: 'https://images.unsplash.com/photo-1610981583974-7d5f761a9bc9?w=400&h=300&fit=crop' },
    { id: 4, name: 'Broccoli', price: 2.49, category: 'vegetables', image: 'https://images.unsplash.com/photo-1611747068075-3d3d6e1e8d86?w=400&h=300&fit=crop' },
    { id: 5, name: 'Milk 1L', price: 3.29, category: 'dairy', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop' },
    { id: 6, name: 'Cheddar Cheese', price: 4.99, category: 'dairy', image: 'https://images.unsplash.com/photo-1589092580876-8bd808a7a6fa?w=400&h=300&fit=crop' },
    { id: 7, name: 'Potato Chips', price: 2.79, category: 'snacks', image: 'https://images.unsplash.com/photo-1632849735925-6f8f5a3c74d5?w=400&h=300&fit=crop' },
    { id: 8, name: 'Chocolate Cookies', price: 3.49, category: 'snacks', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
    { id: 9, name: 'Orange Juice', price: 3.99, category: 'drinks', image: 'https://images.unsplash.com/photo-1571933564036-b6943a8f67f6?w=400&h=300&fit=crop' },
    { id: 10, name: 'Coca Cola 2L', price: 2.99, category: 'drinks', image: 'https://images.unsplash.com/photo-1623157822864-7c8ed4b9d807?w=400&h=300&fit=crop' },
    { id: 11, name: 'Avocado', price: 1.89, category: 'fruits', image: 'https://images.unsplash.com/photo-1546548970-146fdb0116b9?w=400&h=300&fit=crop' },
    { id: 12, name: 'Spinach', price: 2.29, category: 'vegetables', image: 'https://images.unsplash.com/photo-1548245455-9ca7d3f656a3?w=400&h=300&fit=crop' }
];

// State
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('search-input');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const toast = document.getElementById('toast');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    updateCartUI();
});

// Render Products
function renderProducts(productsToShow) {
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span class="quantity">0</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach event listeners for new product cards
    attachProductListeners();
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    let filtered = products;

    if (category !== 'all') {
        filtered = products.filter(p => p.category === category);
    }

    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    renderProducts(filtered);
    updateFilterButtons();
}

// Update Filter Buttons
function updateFilterButtons() {
    filters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentFilter);
    });
}

// Search Products
searchInput.addEventListener('input', (e) => {
    filterProducts(currentFilter);
});

// Filter Button Listeners
filters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const category = e.target.dataset.category;
        filterProducts(category);
    }
});

// Category Card Listeners
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        document.querySelector(`[data-category="${category}"]`).click();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

// Product Card Listeners
function attachProductListeners() {
    productsGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const productId = parseInt(productCard.dataset.id);
        const product = products.find(p => p.id === productId);

        if (e.target.classList.contains('add-to-cart')) {
            addToCart(product, 1);
        } else if (e.target.dataset.action === 'increase') {
            const qty = parseInt(productCard.querySelector('.quantity').textContent) + 1;
            productCard.querySelector('.quantity').textContent = qty;
            addToCart(product, qty);
        } else if (e.target.dataset.action === 'decrease') {
            const qty = parseInt(productCard.querySelector('.quantity').textContent) - 1;
            if (qty >= 0) {
                productCard.querySelector('.quantity').textContent = qty;
                addToCart(product, qty);
            }
        }
    });
}

// Cart Functions
function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    updateCartUI();
    showToast('Product added to cart!');
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--gray);">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateCartQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            renderCart();
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartUI();
}

// Event Listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    document.getElementById('cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        cartBtn.click();
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Expose cart functions globally for inline onclick handlers
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
