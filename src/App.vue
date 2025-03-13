



// src/App.vue
<template>
  <div class="app-container">
    
    <header>
      <div class="logo">LessonManagerApp</div>
      <nav>
        <router-link to="/">Home</router-link>
        <!-- <router-link to="/lessons">Lessons</router-link> -->
        <div class="cart-icon" @click="showCart = !showCart">
          Cart ({{ cart.length }})
        </div>
        <button class="login-btn">Login</button>
      </nav>
    </header>

    <main>
      <div class="container">
        <div class="row">
          <!-- Lesson Browser Section -->
          <div class="col-md-3">
            <div class="sidebar">
              <h2>Browse Lessons</h2>
              <div class="filters">
                <h3>Filters</h3>
                <div class="filter-group">
                  <label>Category</label>
                  <select v-model="selectedCategory" @change="applyFilter('category', selectedCategory)">
                    <option value="">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label>Price</label>
                  <select v-model="selectedPrice" @change="applyFilter('price', selectedPrice)">
                    <option value="">All Prices</option>
                    <option value="low">Under $50</option>
                    <option value="medium">$50 - $99</option>
                    <option value="high">$100+</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label>Level</label>
                  <select v-model="selectedLevel" @change="applyFilter('level', selectedLevel)">
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label>Rating</label>
                  <select v-model="selectedRating" @change="applyFilter('rating', selectedRating)">
                    <option value="">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <button class="btn-apply" @click="applyFilters">Apply Filters</button>
              </div>
              
              <div class="featured-section">
                <h3>FEATURED</h3>
                <div v-for="lesson in featuredLessons" :key="lesson._id" class="featured-lesson">
                  <h4>{{ lesson.title }}</h4>
                  <p>${{ lesson.price.toFixed(2) }} • {{ lesson.level }}</p>
                  <div class="lesson-actions">
                    <button class="btn-add" @click="handleAddToCart(lesson)">Add to Cart</button>
                    <button class="btn-details" @click="viewLessonDetails(lesson)">Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Content Section -->
          <div class="col-md-6">
            <div class="lesson-details" v-if="selectedLesson">
              <img :src="selectedLesson.image" alt="Lesson Image" class="lesson-image">
              <h2>{{ selectedLesson.title }}</h2>
              <div class="lesson-meta">
                <span class="level-badge">{{ selectedLesson.level }}</span>
                <span class="duration">{{ selectedLesson.duration }} hours</span>
              </div>
              <div class="lesson-price">${{ selectedLesson.price.toFixed(2) }}</div>
              <button class="btn-add-large" @click="handleAddToCart(selectedLesson)">Add to Cart</button>
              
              <div class="description-section">
                <h3>Description</h3>
                <p>{{ selectedLesson.description }}</p>
              </div>
              
              <div class="instructor-section">
                <h3>Instructor</h3>
                <div class="instructor-info">
                  <img :src="selectedLesson.instructor.avatar" alt="Instructor" class="instructor-avatar">
                  <div>
                    <h4>{{ selectedLesson.instructor.name }}</h4>
                    <p>{{ selectedLesson.instructor.title }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lesson-list" v-else>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchQuery" 
      @input="updateSearch"
      placeholder="Search lessons..."
      class="search-input"
    >
  </div>
  
  <div v-if="filteredLessons.length === 0" class="no-results">
    No lessons found matching your criteria.
  </div>
  
  <div class="lesson-boxes-container">
    <div 
      v-for="lesson in filteredLessons" 
      :key="lesson._id" 
      class="lesson-box"
    >
      <div class="lesson-box-content">
        <div class="lesson-info">
          <div><strong>Subject:</strong> {{ lesson.title }}</div>
          <div><strong>Location:</strong> {{ lesson.instructor.name }}</div>
          <div><strong>Price:</strong> £{{ lesson.price.toFixed(2) }}</div>
          <div><strong>Spaces:</strong> 5</div>
        </div>
        <div class="lesson-icon">
          <!-- Subject icons -->
          <div v-if="lesson.title.includes('Web')">
            <i class="fas fa-laptop-code"></i>
          </div>
          <div v-else-if="lesson.title.includes('Data')">
            <i class="fas fa-database"></i>
          </div>
          <div v-else-if="lesson.title.includes('Design')">
            <i class="fas fa-palette"></i>
          </div>
          <div v-else>
            <i class="fas fa-book"></i>
          </div>
        </div>
      </div>
      <button class="btn-add-cart" @click="handleAddToCart(lesson)">
  Add to cart
</button>
    </div>
  </div>
</div>
</div>
          <!-- Cart Section -->
          <div class="col-md-3" v-if="showCart">
            <div class="cart-panel">
              <h2>Your Cart ({{ cart.length }} items)</h2>
           
              <div class="customer-details">
    <h3>Contact Information</h3>
    <div class="form-group">
      <label>Full Name:</label>
      <input 
        type="text" 
        v-model="customerName" 
        placeholder="Enter your name"
        class="form-input"
        required
      >
    </div>
    <div class="form-group">
      <label>Phone Number:</label>
      <input 
        type="tel" 
        v-model="customerPhone" 
        placeholder="Enter your phone number"
        class="form-input"
        required
      >
    </div>
  
  

              <div v-if="cart.length === 0" class="empty-cart">
                Your cart is empty.
              </div>
              
              <div v-else>
                <div v-for="item in cart" :key="item._id" class="cart-item">
                  <div class="item-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.level }} • {{ item.duration }} hours</p>
                    <div class="item-price">${{ item.price.toFixed(2) }}</div>
                  </div>
                  <button class="btn-remove" @click="handleRemoveFromCart(item._id)">×</button>
                </div>
                
                <div class="order-summary">
                  <h3>Order Summary</h3>
                  <div class="summary-row">
                    <span>Subtotal ({{ cart.length }} items)</span>
                    <span>${{ cartSubtotal.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row discount" v-if="discount > 0">
                    <span>Discount</span>
                    <span>-${{ discount.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>${{ cartTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
                
                <button class="btn-checkout" @click="checkout">Checkout</button>
              </div>
          
          </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      showCart: false,
      selectedLesson: null,
      selectedCategory: '',
      selectedPrice: '',
      selectedLevel: '',
      selectedRating: '',
      searchQuery: '',
       customerName: '',
    customerPhone: '',
          discount: 10, // Fixed discount for demo
    };
  },
  computed: {
    ...mapState(['lessons', 'cart']),
    ...mapGetters(['filteredLessons', 'cartTotal']),
    featuredLessons() {
      return this.lessons.filter(lesson => lesson.featured).slice(0, 2);
    },
    cartSubtotal() {
      return this.cart.reduce((total, item) => total + item.price, 0);
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'removeFromCart', 'clearCart', 'setSearchQuery', 'setFilter', 'resetFilters']),
    ...mapActions(['fetchLessons', 'placeOrder']),
    viewLessonDetails(lesson) {
      this.selectedLesson = lesson;
    },
    updateSearch() {
      this.setSearchQuery(this.searchQuery);
    },
    applyFilter(filterType, value) {
      this.setFilter({ filterType, value });
    },
    applyFilters() {
      this.setFilter({ filterType: 'category', value: this.selectedCategory });
      this.setFilter({ filterType: 'price', value: this.selectedPrice });
      this.setFilter({ filterType: 'level', value: this.selectedLevel });
      this.setFilter({ filterType: 'rating', value: this.selectedRating });
    },
    resetAllFilters() {
      this.selectedCategory = '';
      this.selectedPrice = '';
      this.selectedLevel = '';
      this.selectedRating = '';
      this.resetFilters();
    },
    // Modified addToCart method to show toast
    handleAddToCart(lesson) {
      // Call the Vuex mutation to add the item to cart
      this.addToCart(lesson);
      
      // Show toast notification - using $toast instead of $toaster for Vue 3
      this.$toast.success(`${lesson.title} added to cart successfully!`);
    },
    // When removing from cart
    handleRemoveFromCart(itemId) {
      this.removeFromCart(itemId);
      
      this.$toast.info('Item removed from cart');
    },
    async checkout() {
      if (!this.customerName || !this.customerPhone) {
    this.$toast.error('Please fill in all required fields');
    return;
  }
  const orderData = {
    items: this.cart,
    customer: {
      name: this.customerName,
      phone: this.customerPhone
    },
    total: this.cartTotal
  };

  try {
    await this.placeOrder(orderData);
    this.$toast.success('Order placed successfully!');
    this.showCart = false;
    // Clear form fields
    this.customerName = '';
    this.customerPhone = '';
  } catch (error) {
    this.$toast.error('Error placing order: ' + error.message);
  }
      const success = await this.placeOrder();
      if (success) {
        this.$toast.success('Your order has been placed successfully!');
        this.showCart = false;
      } else {
        this.$toast.error('There was an error processing your order. Please try again.');
      }
    },
    // Load cart from localStorage when component is created
    loadCartFromStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          // If you want to manually restore cart instead of doing it in Vuex store
          const parsedCart = JSON.parse(savedCart);
          parsedCart.forEach(item => {
            this.addToCart(item);
          });
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  },
  created() {
    this.fetchLessons();
    // Load cart data is now handled in the Vuex store initialization
  }
}
</script>
<style>
/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

/* Layout */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
}
.customer-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
}

.col-md-3 {
  flex: 0 0 25%;
  padding: 10px;
}

.col-md-6 {
  flex: 0 0 50%;
  padding: 10px;
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #4a90e2;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

nav {
  display: flex;
  align-items: center;
}

nav a, .cart-icon {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  cursor: pointer;
}

.login-btn {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 5px 15px;
  border-radius: 3px;
  margin-left: 20px;
  cursor: pointer;
}

/* Sidebar */
.sidebar {
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filters h3 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1rem;
}

.filter-group {
  margin-bottom: 10px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.filter-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.btn-apply {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
}

.featured-section {
  margin-top: 30px;
}

.featured-section h3 {
  background-color: #ff9800;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.8rem;
  display: inline-block;
}

.featured-lesson {
  margin-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.featured-lesson h4 {
  margin-bottom: 5px;
}

.featured-lesson p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.toast-success {
  background-color: #0d110d !important;

}

.lesson-actions {
  display: flex;
}

.btn-add, .btn-details {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-add {
  background-color: #4a90e2;
  color: white;
  margin-right: 5px;
}

.btn-details {
  background-color: #f1f1f1;
  color: #333;
}

/* Lesson List */
.lesson-list {
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.lesson-card {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.lesson-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 3px;
}

.lesson-info {
  flex: 1;
  padding-left: 15px;
}

.lesson-info h3 {
  margin-bottom: 5px;
}

.lesson-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.lesson-meta span {
  margin-right: 10px;
}

.lesson-price {
  font-weight: bold;
  color: #4a90e2;
}

/* Lesson Details */
.lesson-details {
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lesson-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}

.lesson-meta {
  margin-bottom: 15px;
}

.level-badge {
  background-color: #4a90e2;
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.8rem;
}

.btn-add-large {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
}

.description-section, .instructor-section {
  margin-top: 20px;
}

.instructor-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.instructor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

/* Cart Panel */
.cart-panel {
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-cart {
  text-align: center;
  padding: 20px;
  color: #666;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.item-info h4 {
  margin-bottom: 5px;
}

.item-info p {
  color: #666;
  font-size: 0.9rem;
}

.btn-remove {
  background-color: #f44336;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.order-summary {
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.discount {
  color: #4caf50;
}
/* Add these styles to your existing <style> section */
/* Add these styles to your existing <style> section */
.lesson-boxes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
  
}
.lesson-box {
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column; /* Column layout */
  justify-content: space-between; /* Space between content & button */
  height: 100%; /* Ensure all boxes have the same height */
}

.lesson-box-content {
  padding: 15px;
  flex-grow: 1; /* This will push the button to the bottom */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn-add-cart {
  background-color: #4a7eff;
  color: white;
  border: none;
  width: 100%;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  margin-top: auto; /* Ensures the button stays at the bottom */
  transition: background-color 0.2s;
}

.btn-add-cart:hover {
  background-color: #3a6eef;
}

.lesson-box {
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lesson-box-content {
  padding: 15px;
  display: flex;
  justify-content: space-between;
}

.lesson-info {
  font-size: 13px;
  line-height: 1.5;
}

.lesson-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.lesson-icon i {
  font-size: 40px; /* Adjust the size as needed */
  color: #4a90e2; /* Adjust the color as needed */
}

.btn-add-cart {
  background-color: #4a7eff;
  color: white;
  border: none;
  width: 100%;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  
  transition: background-color 0.2s;
}

.btn-add-cart:hover {
  background-color: #3a6eef;
}
.total {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.btn-checkout {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 0;
  border-radius: 3px;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
}

/* Responsive */
@media (max-width: 992px) {
  .col-md-3, .col-md-6 {
    flex: 0 0 100%;
  }
}
</style>