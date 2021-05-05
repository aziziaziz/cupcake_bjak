import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartCount: 0
  },
  getters: {
  },
  mutations: {
    async startSignal (state) {
      console.log(state);
    }
  }
})