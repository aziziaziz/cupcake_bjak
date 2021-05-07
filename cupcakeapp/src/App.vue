<template>
  <div class="app-main">
    <div class="top-bar">
      <div class="cart-icon" @click="showCart = true">
        <img src="./assets/cart.png" alt="">
        <div class="cart-count" v-if="$store.state.cartCount > 0">{{ $store.state.cartCount }}</div>
      </div>
    </div>
    <router-view style="margin-bottom: 60px"></router-view>
    <div class="bottom-bar"></div>
    <transition name="fade">
      <div v-if="showCart" class="cart-section cart-background" @click="showCart = false"></div>
    </transition>
    <transition name="slide">
      <div v-if="showCart" class="cart-section cart-container">
        <img class="close-icon" src="./assets/close.png" alt="" @click="showCart = false">
        <div class="cart-title">Your cart</div>
        <div v-if="$store.state.groupedListing.length <= 0">Ooops nothing in your cart</div>
        <div class="cart-list" v-for="(c, i) in $store.state.groupedListing" :key="i">
          <div>{{ c['cupcake']['name'] }}</div>
          <img class="small-img" :src="c['cupcake']['image']" alt="">
          <div class="qty-container">
            <div class="add-minus-button" @click="changeQuantity(c, false)">-</div>
            <div class="qty">{{ c['qty'] }}</div>
            <div class="add-minus-button" @click="changeQuantity(c, true)">+</div>
            <span class="total-per-item">RM {{ (c['qty'] * c['cupcake']['price']).toFixed(2) }}</span>
          </div>
        </div>
        <div style="height: 50px"></div>
        <div class="pricing-table">
          <div class="pricing">
            <div class="label">Subtotal</div>
            <div class="price">{{ $store.state.subtotal.toFixed(2) }}</div>
          </div>
          <div class="pricing">
            <div class="label">SST 6%</div>
            <div class="price">{{ $store.state.sst.toFixed(2) }}</div>
          </div>
          <div class="horizontal-line"></div>
          <div class="pricing">
            <div class="label">Total</div>
            <div class="price">RM {{ $store.state.total.toFixed(2) }}</div>
          </div>
        </div>
        <button class="checkout-btn" @click="showDetails = true">Checkout</button>
      </div>
    </transition>
    <div v-if="showDetails" class="details-popup">
      <div class="details-content">
        <div class="title">Checkout</div>
        <div class="description">You are about to checkout a total of<br/>RM {{ $store.state.total.toFixed(2) }}</div>
        <div>Please fill in your details below</div>
        <Input placeholder="Name" :text.sync="name" :required="true" :errorMessage.sync="nameError" />
        <Input placeholder="Phone Number" :text.sync="phone" :required="true" :errorMessage.sync="phoneError" />
        <Input placeholder="Location" :text.sync="location" :required="true" :errorMessage.sync="locationError" />
        <button @click="checkoutClicked">Confirm Checkout</button>
        <button class="cancel" @click="showDetails = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {
  },
  data: function() {
    return {
      showCart: false,
      showDetails: false,

      name: '',
      phone: '',
      location: '',

      nameError: '',
      phoneError: '',
      locationError: '',
    }
  },
  props: {
  },
  methods: {
    changeQuantity: function(item, add) {
      var cupcake = this.$store.state.cupcakeListing.filter(c => c['_id'] == item['id'])[0];
      if (add) {
        if (cupcake['quantity'] > 0) {
          cupcake['quantity']--;
          item['qty']++;
        }
      } else {
        cupcake['quantity']++;
        item['qty']--;

        if (item['qty'] == 0) {
          var index = this.$store.state.groupedListing.indexOf(item);
          this.$store.state.groupedListing.splice(index, 1);
        }
      }
      
      sessionStorage.setItem('cart', JSON.stringify(this.$store.state.groupedListing));
      this.$store.commit('countCart');
      this.$store.commit('countTotal');
    },
    checkoutClicked: async function() {
      var isError = !this.name || !this.phone || !this.location;
      if (!this.name) {
        this.nameError = 'Please enter your name';
      }
      if (!this.phone) {
        this.phoneError = 'Please enter your phone number';
      }
      if (!this.location) {
        this.locationError = 'Please tell us your location';
      }

      if (isError) {
        console.log('error');
        return;
      }

      var d = new Date();
      var orderDetails = {
        name: this.name,
        phone: this.phone,
        location: this.location,
        orders: [],
        total: this.$store.state.total,
        orderTime: `${this.padNumber(d.getDate())}/${this.padNumber(d.getMonth() + 1)}/${d.getFullYear()} ${this.padNumber(d.getHours())}:${this.padNumber(d.getMinutes())}:${this.padNumber(d.getSeconds())}`
      };
      
      var toUpdate = [];
      for (var g of this.$store.state.groupedListing) {
        toUpdate.push({ id: g['id'], qty: g['qty'] });
        var cupcakeName = this.$store.state.cupcakeListing.filter(c => c['_id'] == g['id'])[0]['name'];
        orderDetails['orders'].push({
          cupcake: cupcakeName,
          qty: g['qty']
        });
      }

      var submitOrder = await this.$axios.post('/cupcake/orders', orderDetails);
      if (submitOrder.data['inserted']) {
        var updated = await this.$axios.patch('/cupcake/update', toUpdate);
        updated.data.forEach((u) => {
          if (u['updated']) {
            var currentCupcake = this.$store.state.cupcakeListing.filter(c => c['_id'] == u['id'])[0];
            currentCupcake['quantity'] = u['newQuantity'];
          }
        });
        this.$store.state.groupedListing = [];
        sessionStorage.removeItem('cart');
        this.$store.commit('countCart');
        this.$store.commit('countTotal');

        this.name = '';
        this.phone = '';
        this.location = '';

        this.showDetails = false;
        this.showCart = false;
        
        Swal.fire(
          'Checkout Complete',
          `We've received your order. We will contact you soon.
          
          Your order number is ${submitOrder.data['orderNo']}.
          Thank you for shopping with us!`,
          'success'
        );
      } else {
        Swal.fire(
          'Checkout Error',
          `Oops! There was an error while trying to submit your order. Please try again.`,
          'error'
        );
      }
    },
    padNumber: function(num) {
      var numStr = num.toString();
      
      if (numStr.length < 2) {
        return `0${numStr}`;
      } else {
        return numStr;
      }
    }
  },
  async mounted() {
    var allCupcakes = await this.$axios.get('/cupcake/get');
    this.$store.state.cupcakeListing = allCupcakes.data;
    
    var savedCarts = sessionStorage.getItem('cart');
    if (savedCarts) {
      this.$store.state.groupedListing = JSON.parse(savedCarts);
      this.$store.commit('countCart');
      this.$store.commit('countTotal');

      this.$store.state.groupedListing.forEach((g) => {
        var cupcake = this.$store.state.cupcakeListing.filter(c => c['_id'] == g['id'])[0];
        cupcake['quantity'] -= g['qty'];
      });
    }
  },
  watch: {
    showCart: function(val) {
      var bod = document.getElementsByTagName('body');
      bod[0].style.overflow = val ? 'hidden' : 'auto';
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
      cursor: pointer;

      > img {
        height: 75%;
      }

      > .cart-count {
        position: absolute;
        bottom: 5px;
        right: -5px;
        z-index: 1;
        background-color: lime;
        padding: 10px;
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

  > .details-popup {
    background-color: rgba(128,128,128,0.5);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 20;

    > .details-content {
      padding: 5px;
      background-color: white;
      max-width: 80%;

      > .title {
        font-size: 1.2em;
        text-align: center;
        font-weight: bold;
      }

      > .description {
        text-align: center;
      }
      
      > button {
        width: 100%;
        margin-top: 5px;
        padding: 10px;
      }

      > .cancel {
        background-color: red;
        color: white;
      }
    }
  }
}

.cart-section {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 5;
}

.cart-background {
  background: rgba(128,128,128,0.5);
  left: 0;
}

.cart-container {
  right: 0;
  max-width: 400px;
  width: 80%;
  background-color: white;
  padding: 5px;
  overflow: auto;

  > .close-icon {
    position: fixed;
    height: 25px;
    top: 5px;
    right: 5px;
    cursor: pointer;
    z-index: 10;
  }

  > .cart-title {
    font-size: 1.2em;
    font-weight: bold;
    position: sticky;
    top: -5px;
    background-color: white;
    z-index: 1;
  }

  > .checkout-btn, > .pricing-table {
    padding: 10px 15px;
    position: fixed;
    bottom: 5px;
    max-width: 400px;
    width: 80%;
  }

  > .cart-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid gray;
    border-radius: 5px;
    margin: 5px 0;
    padding: 10px;
    position: relative;

    > .cupcake-name-cart {
      font-weight: bold;
    }
    
    > .qty-container {
      display: flex;
      align-items: center;

      > .qty {
        width: 30px;
        text-align: center;
      }

      > .add-minus-button {
        border: 1px solid gray;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: bolder;
        height: 20px;
        width: 20px;
        border-radius: 100%;
        cursor: pointer;
        user-select: none;
      }

      > .total-per-item {
        margin-left: 10px;
      }
    }

    > .small-img {
      position: absolute;
      right: 10px;
      height: calc(100% - 20px);
    }
  }

  > .pricing-table {
    bottom: 40px;
    padding: 5px;
    background-color: white;

    > .pricing {
      display: flex;
      align-items: center;

      > .price {
        flex-grow: 1;
        text-align: right;
        padding-right: 10px;
      }
    }

    > .horizontal-line {
      height: 1px;
      background-color: black;
      width: calc(100% - 10px);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}
</style>

<style>
body {
  margin: 0;
  font-family: 'Baloo 2', cursive;
}

button {
  border-radius: 10px;
  border: none;
  background-color: lime;
  padding: 0 15px;
  cursor: pointer;
  font-weight: bold;
}
</style>