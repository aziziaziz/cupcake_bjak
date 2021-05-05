<template>
  <div class="cupcake-main">
    <div class="title">Choose your cupcakes</div>
    <div class="cupcakes-container">
      <div class="cupcakes-card" v-for="(c, i) in cupcakesList" :key="i">
        <img class="cupcake-image" :class="{ 'image-no-stock': c['quantity'] == 0 }" :src="c['image']" alt="">
        <div>{{ c['name'] }}</div>
        <div class="price">RM {{ c['price'] ? c['price'].toFixed(2) : '' }}</div>
        <div>Available {{ c['quantity'] }}</div>
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
      cupcakesList: [
        { name: 'cc1', image: 'https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=550&h=275&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F9%2F2015%2F02%2FHD-200805-r-chocolate-cupcake.jpg', description: '', quantity: 5 },
        { name: 'cc2 try longer name', image: '', description: 'asd with longer description here is longer', quantity: 5 },
        { name: 'cc3', image: '', description: 'asdas', quantity: 10 },
        { name: 'cc4', image: '', description: '', quantity: 8 },
        { name: 'cc5', image: 'https://cdn.sallysbakingaddiction.com/wp-content/uploads/2017/06/moist-chocolate-cupcakes-5.jpg', description: '', quantity: 0 },
        { name: 'cc1', image: '', description: '', quantity: 5 },
        { name: 'cc2 try longer name', image: '', description: 'asd with longer description here is longer', quantity: 5 },
        { name: 'cc3', image: '', description: 'asdas', quantity: 10 },
        { name: 'cc4', image: '', description: '', quantity: 8 },
        { name: 'cc5', image: '', description: '', quantity: 0 },
        { name: 'cc1', image: '', description: '', quantity: 5 },
        { name: 'cc2 try longer name', image: '', description: 'asd with longer description here is longer', quantity: 5 },
        { name: 'cc3', image: '', description: 'asdas', quantity: 10 },
        { name: 'cc4', image: '', description: '', quantity: 8 },
        { name: 'cc5', image: '', description: '', quantity: 0 },
      ]
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
    var allCupcakes = await this.$axios.get('/cupcake');
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
  margin-bottom: 10px;
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

.price {
  text-align: center;
  width: 100%;
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
    font-size: 1.2em;
  }
}
</style>