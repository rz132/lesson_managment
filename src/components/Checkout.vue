<!-- src/components/CheckoutPage.vue -->
<template>
    <div class="checkout-container">
      <h1 class="checkout-title">Checkout</h1>
      
      <div class="checkout-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="customerName" placeholder="Enter your name" class="form-input">
        </div>
        
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="text" id="phone" v-model="customerPhone" placeholder="Enter your phone number" class="form-input">
        </div>
        
        <button class="btn-process-checkout" @click="processCheckout" :disabled="!isFormValid">
          Checkout
        </button>
      </div>
      
      <div class="shopping-cart">
        <h2>Shopping Cart</h2>
        
        <div v-if="cart.length === 0" class="empty-cart-message">
          Your cart is empty.
        </div>
        
        <div v-else class="cart-items-container">
          <div v-for="item in cart" :key="item._id" class="cart-item-box">
            <div class="cart-item-details">
              <div><strong>Subject:</strong> {{ item.title }}</div>
              <div><strong>Location:</strong> {{ item.instructor.name }}</div>
              <div><strong>Price:</strong> £{{ item.price.toFixed(2) }}</div>
              <div><strong>Spaces:</strong> {{ item.spaces || 5 }}</div>
            </div>
            <div class="cart-item-icon">
              <!-- Subject icons -->
              <div v-if="item.title.includes('Web')">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"/><path d="M9 22h6"/><path d="M12 17v5"/></svg>
              </div>
              <div v-else-if="item.title.includes('Data')">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </div>
              <div v-else-if="item.title.includes('Design')">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              </div>
              <div v-else-if="item.title.includes('English')">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><line x1="3" y1="6" x2="3" y2="19"/><line x1="12" y1="6" x2="12" y2="19"/><line x1="21" y1="6" x2="21" y2="19"/></svg>
              </div>
              <div v-else-if="item.title.includes('Math')">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="7" x2="17" y2="17"/><line x1="17" y1="7" x2="7" y2="17"/><line x1="7" y1="17" x2="17" y2="17"/><line x1="7" y1="7" x2="17" y2="7"/></svg>
              </div>
              <div v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
              </div>
            </div>
            <button class="btn-remove" @click="removeItem(item._id)">Remove</button>
          </div>
        </div>
        
        <div v-if="cart.length > 0" class="cart-summary">
          <div class="summary-row">
            <span>Subtotal ({{ cart.length }} items):</span>
            <span>£{{ cartSubtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>£{{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Order confirmation modal -->
      <div v-if="showConfirmation" class="confirmation-modal">
        <div class="modal-content">
          <h2>Order Confirmed!</h2>
          <p>Thank you for your order, {{ customerName }}.</p>
          <p>We'll send a confirmation to your phone: {{ customerPhone }}</p>
          <p>Order total: £{{ cartTotal.toFixed(2) }}</p>
          <button class="btn-close-modal" @click="closeConfirmation">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  
  export default {
    name: 'CheckoutPage',
    data() {
      return {
        customerName: '',
        customerPhone: '',
        showConfirmation: false
      };
    },
    computed: {
      ...mapState(['cart']),
      ...mapGetters(['cartTotal']),
      cartSubtotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
      },
      isFormValid() {
        return this.customerName.trim() !== '' && 
               this.customerPhone.trim() !== '' && 
               this.cart.length > 0;
      }
    },
    methods: {
      ...mapMutations(['removeFromCart', 'clearCart']),
      ...mapActions(['placeOrder']),
      
      removeItem(itemId) {
        this.removeFromCart(itemId);
        this.$toast.info('Item removed from cart');
      },
      
      async processCheckout() {
        if (!this.isFormValid) {
          this.$toast.error('Please fill in all required fields');
          return;
        }
        
        try {
          // Add customer info to the order
          const orderSuccess = await this.placeOrder({
            customerName: this.customerName,
            customerPhone: this.customerPhone
          });
          
          if (orderSuccess) {
            // Show confirmation modal
            this.showConfirmation = true;
          } else {
            this.$toast.error('There was an error processing your order. Please try again.');
          }
        } catch (error) {
          console.error('Checkout error:', error);
          this.$toast.error('An unexpected error occurred during checkout.');
        }
      },
      
      closeConfirmation() {
        this.showConfirmation = false;
        this.customerName = '';
        this.customerPhone = '';
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .checkout-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .checkout-title {
    text-align: center;
    margin-bottom: 30px;
    color: #4a90e2;
  }
  
  .checkout-form {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
  
  .form-group label {
    width: 80px;
    font-weight: bold;
  }
  
  .form-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 16px;
  }
  
  .btn-process-checkout {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 3px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .btn-process-checkout:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .shopping-cart {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .shopping-cart h2 {
    margin-bottom: 20px;
    color: #4a90e2;
    text-align: center;
  }
  
  .empty-cart-message {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .cart-items-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
  
  .cart-item-box {
    width: 220px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    position: relative;
  }
  
  .cart-item-details {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .cart-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  
  .cart-item-icon svg {
    color: #4a90e2;
  }
  
  .btn-remove {
    background-color: #f44336;
    color: white;
    border: none;
    width: 100%;
    padding: 8px 0;
    border-radius: 3px;
    margin-top: 10px;
    cursor: pointer;
  }
  
  .cart-summary {
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 15px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .summary-row.total {
    font-weight: bold;
    font-size: 18px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
  
  /* Modal styles */
  .confirmation-modal {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 5px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 400px;
    width: 90%;
  }
  
  .btn-close-modal {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 3px;
    margin-top: 20px;
    cursor: pointer;
  }
  
  /* Responsive */
  @media (max-width: 600px) {
    .form-group {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .form-group label {
      margin-bottom: 5px;
    }
    
    .cart-item-box {
      width: 100%;
    }
  }
  </style>