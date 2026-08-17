// FN Queensland Imagery - Photo Shop Application

class PhotoShop {
    constructor() {
        this.cart = [];
        this.photos = this.initializePhotos();
        this.init();
    }

    initializePhotos() {
        return {
            'landscape-1': {
                id: 'landscape-1',
                title: 'Dense Rainforest Valley',
                price: 3.99,
                category: 'landscape',
                fileName: 'dense-rainforest-valley.jpg'
            },
            'landscape-2': {
                id: 'landscape-2',
                title: 'Mountain Peaks Through Mist',
                price: 4.99,
                category: 'landscape',
                fileName: 'mountain-peaks-mist.jpg'
            },
            'landscape-3': {
                id: 'landscape-3',
                title: 'Pristine Rainforest Stream',
                price: 3.49,
                category: 'landscape',
                fileName: 'rainforest-stream.jpg'
            },
            'sunset-1': {
                id: 'sunset-1',
                title: 'Golden Canopy Sunset',
                price: 4.99,
                category: 'sunset',
                fileName: 'golden-canopy-sunset.jpg'
            },
            'sunset-2': {
                id: 'sunset-2',
                title: 'Dusk Over Rainforest',
                price: 4.49,
                category: 'sunset',
                fileName: 'dusk-rainforest.jpg'
            },
            'amphibian-1': {
                id: 'amphibian-1',
                title: 'Vibrant Tree Frog',
                price: 2.99,
                category: 'amphibian',
                fileName: 'vibrant-tree-frog.jpg'
            },
            'amphibian-2': {
                id: 'amphibian-2',
                title: 'Rainforest Toad Portrait',
                price: 2.49,
                category: 'amphibian',
                fileName: 'rainforest-toad.jpg'
            }
        };
    }

    init() {
        this.attachEventListeners();
        this.loadCartFromLocalStorage();
    }

    attachEventListeners() {
        // Buy button event listeners
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e.target.dataset.photoId));
        });

        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => this.checkout());

        // Category navigation
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('href');
                document.querySelector(category).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    addToCart(photoId) {
        const photo = this.photos[photoId];
        if (!photo) return;

        // Check if already in cart
        const existingItem = this.cart.find(item => item.id === photoId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...photo,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.saveCartToLocalStorage();
        this.showNotification(`${photo.title} added to cart!`);
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('total-price');

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<p style="color: #999;">Your cart is empty</p>';
            totalElement.textContent = '0.00';
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.title}</strong>
                    <p style="font-size: 0.9em; color: #666;">Qty: ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8em;" onclick="shop.removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = total.toFixed(2);
    }

    removeFromCart(photoId) {
        this.cart = this.cart.filter(item => item.id !== photoId);
        this.updateCartDisplay();
        this.saveCartToLocalStorage();
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderSummary = this.cart
            .map(item => `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
            .join('\n');

        const message = `Order Summary:\n\n${orderSummary}\n\nTotal: $${total.toFixed(2)}\n\nProceeding to payment...`;
        alert(message);

        // Simulate order processing
        this.processOrder();
    }

    processOrder() {
        // Here you would integrate with a payment processor (Stripe, PayPal, etc.)
        const orderId = this.generateOrderId();
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        console.log('Processing order:', {
            orderId,
            items: this.cart,
            total: totalPrice,
            timestamp: new Date().toISOString()
        });

        // Simulate order success
        setTimeout(() => {
            alert(`Order #${orderId} confirmed!\n\nDigital files will be sent to your email immediately.`);
            this.cart = [];
            this.updateCartDisplay();
            this.saveCartToLocalStorage();
        }, 1500);
    }

    generateOrderId() {
        return 'FNQ' + Date.now();
    }

    saveCartToLocalStorage() {
        localStorage.setItem('fnq_photo_cart', JSON.stringify(this.cart));
    }

    loadCartFromLocalStorage() {
        const saved = localStorage.getItem('fnq_photo_cart');
        if (saved) {
            this.cart = JSON.parse(saved);
            this.updateCartDisplay();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #52b788;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 200;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the photo shop when DOM is ready
let shop;
document.addEventListener('DOMContentLoaded', () => {
    shop = new PhotoShop();
    console.log('FN Queensland Photo Shop initialized');
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
