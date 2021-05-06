<template>
  <div class="app-main">
    <div class="top-bar">
      <div class="cart-icon">
        <img src="./assets/cart.png" alt="">
        <div class="cart-count" v-if="$store.state.cartCount > 0">{{ $store.state.cartCount }}</div>
      </div>
    </div>
    <router-view style="margin-bottom: 60px"></router-view>
    <div class="bottom-bar"></div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
  },
  methods: {
  },
  mounted() {
    var cartCount = this.$cookies.get('test');
    if (cartCount) {
      this.$store.state.cartCount = cartCount;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  > .top-bar {
    height: 50px;
    box-shadow: 0 0 10px 0px gray;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;

    > .cart-icon {
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      margin-right: 10px;
      display: flex;
      align-items: center;

      > img {
        height: 75%;
      }

      > .cart-count {
        position: absolute;
        bottom: 5px;
        right: 0;
        z-index: 1;
        background-color: lime;
        padding: 5px;
        border-radius: 100%;
        font-size: 0.6em;
        width: 10px;
        height: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  > .bottom-bar {
    height: 50px;
    width: 100%;
    position: fixed;
    bottom: 0;
    box-shadow: 0 0 10px 0px gray;
    background-color: white;
  }
}
</style>

<style>
body {
  margin: 0;
  font-family: 'Baloo 2', cursive;
}
</style>