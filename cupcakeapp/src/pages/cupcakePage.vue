<template>
  <div class="cupcake-main">
    <div class="title">Choose your cupcakes</div>
    <div class="cupcakes-container">
      <div class="cupcakes-card" v-for="(c, i) in cupcakesList" :key="i">
        <img class="cupcake-image" :class="{ 'image-no-stock': c['quantity'] == 0 }" :src="c['image']" alt="">
        <div class="cupcake-name">{{ c['name'] }}</div>
        <div class="price">RM {{ c['price'] ? c['price'].toFixed(2) : '' }}/pc</div>
        <div class="availability">Available: {{ c['quantity'] }} pcs</div>
        <button v-if="c['quantity'] > 0" class="add-cart" @click="addClicked">Add to Cart</button>
        <div v-else class="no-stock">Out Of Stock</div>
      </div>
      <div v-if="cupcakesList.length <= 0" class="no-cupcakes">
        No cupcakes available at the moment.<br />Please come back later.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data: function() {
    return {
      cupcakesList: []
    }
  },
  props: {
  },
  methods: {
    addClicked: function() {
      var number = Math.random() * 25;
      this.$store.state.cartCount = Math.ceil(number);
      this.$cookies.set('test', Math.ceil(number));
    }
  },
  async mounted() {
    var allCupcakes = await this.$axios.get('/cupcake/get');
    this.cupcakesList = allCupcakes.data;
  }
};
</script>

<style lang="scss" scoped>
$card-size: 200px;

.cupcake-main {
  width: calc(100% - 20px);
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 2em;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.cupcakes-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.cupcakes-card {
  padding: 5px;
  min-width: $card-size;
  max-width: $card-size;
  border: 1px solid black;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 40px;
}

.cupcake-image {
  height: calc(#{$card-size} - 10px);
  width: calc(#{$card-size} - 10px);
  object-fit: contain;
}

.image-no-stock {
  opacity: 0.5;
}

.price, .cupcake-name {
  text-align: center;
  width: 100%;
  font-weight: bold;
}

.cupcake-name {
  font-size: 1.2em;
}

.add-cart, .no-stock {
  position: absolute;
  bottom: 5px;
  height: 30px;
}

.add-cart {
  border-radius: 10px;
  border: none;
  background-color: lime;
  padding: 0 15px;
  cursor: pointer;
  font-weight: bold;
}

.no-stock {
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
}

.no-cupcakes {
  text-align: center;
}

@media only screen and (max-width: 500px) {
  .title {
    font-size: 1.3em;
  }
}
</style>