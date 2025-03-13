import { createStore } from 'vuex'

export default createStore({
  state: {
    lessons: [],
    cart: [],
    searchQuery: '',
    filters: {
      category: '',
      price: '',
      level: '',
      rating: ''
    }
  },
  getters: {
    filteredLessons(state) {
      let result = state.lessons;
      
      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(lesson => 
          lesson.title.toLowerCase().includes(query) || 
          lesson.description?.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (state.filters.category) {
        result = result.filter(lesson => lesson.category === state.filters.category);
      }
      
      // Apply price filter
      if (state.filters.price) {
        if (state.filters.price === 'low') {
          result = result.filter(lesson => lesson.price < 50);
        } else if (state.filters.price === 'medium') {
          result = result.filter(lesson => lesson.price >= 50 && lesson.price < 100);
        } else if (state.filters.price === 'high') {
          result = result.filter(lesson => lesson.price >= 100);
        }
      }
      
      // Apply level filter
      if (state.filters.level) {
        result = result.filter(lesson => lesson.level === state.filters.level);
      }
      
      // Apply rating filter
      if (state.filters.rating) {
        const minRating = parseInt(state.filters.rating);
        result = result.filter(lesson => lesson.rating >= minRating);
      }
      
      return result;
    },
    cartTotal(state) {
      return state.cart.reduce((total, item) => total + item.price, 0);
    }
  },
  mutations: {
    setLessons(state, lessons) {
      state.lessons = lessons;
    },
    addToCart(state, lesson) {
      // Check if already in cart
      if (!state.cart.some(item => item._id === lesson._id)) {
        state.cart.push(lesson);
      }
    },
    removeFromCart(state, lessonId) {
      state.cart = state.cart.filter(item => item._id !== lessonId);
    },
    clearCart(state) {
      state.cart = [];
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setFilter(state, {filterType, value}) {
      state.filters[filterType] = value;
    },
    resetFilters(state) {
      state.filters = {
        category: '',
        price: '',
        level: '',
        rating: ''
      };
    }
  },
  actions: {
    async fetchLessons({commit}) {
      try {
        const response = await fetch('http://localhost:4000/api/lessons');
        const data = await response.json();
        commit('setLessons', data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },
    async placeOrder({ state, commit }, orderData) {
      try {
        // Prepare the order payload
        const payload = {
          customer: {
            name: orderData.customer.name,
            phone: orderData.customer.phone,
          },
          lessons: state.cart.map(item => ({
            lessonId: item._id,
            title: item.title,
            price: item.price,
          })),
          totalAmount: state.cart.reduce((total, item) => total + item.price, 0),
          date: new Date(),
        };
  
        // Send the order to the backend
        const response = await fetch('http://localhost:4000/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error('Failed to place order');
        }
  
        // Update lesson availability for each item in the cart
        for (const item of state.cart) {
          const updateResponse = await fetch(`http://localhost:4000/api/update/${item._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ spaces: item.spaces - 1 }),
          });
  
          if (!updateResponse.ok) {
            throw new Error(`Failed to update spaces for lesson: ${item.title}`);
          }
        }
  
        // Clear the cart after successful order placement
        commit('clearCart');
        return true;
      } catch (error) {
        console.error('Error placing order:', error);
        throw error;
      }
    },
  }
})