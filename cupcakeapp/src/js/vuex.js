import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cupcakeListing: [],
    groupedListing: [],
    cartCount: 0,

    subtotal: 0,
    sst: 0,
    total: 0
  },
  getters: {
  },
  mutations: {
    countCart (state) {
      var cartCount = 0;
      var carts = state.groupedListing.map(c => c['qty']);
      if (carts.length > 0) {
        cartCount = carts.reduce((a, b) => { return a + b });
      }
      state.cartCount = cartCount;
    },
    countTotal (state) {
      var total = 0;
      state.groupedListing.forEach(c => total += (c['qty'] * c['cupcake']['price']));
      
      state.subtotal = total;
      state.sst = total * 0.06;
      state.total = state.subtotal + state.sst;
    }
  }
})