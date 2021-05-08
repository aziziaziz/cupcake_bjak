<template>
  <div class="orders-main">
    <div class="order-block" v-for="(o, i) in allOrders" :key="i">
      <div class="order-row">
        <div class="order-name">{{ o['name'] }}</div>
        <div class="order-date">{{ o['orderTime'] }}</div>
      </div>
      <div>{{ o['phone'] }}</div>
      <div>{{ o['location'] }}</div>
      <div>Orders:</div>
      <div class="order-list" v-for="(or, oi) in o['orders']" :key="oi">
        {{ oi + 1 }}. {{ or['cupcake'] }} - {{ or['qty'] }} pcs
      </div>
      <div class="total-price">RM {{ o['total'].toFixed(2) }}</div>
    </div>
    <div v-if="allOrders.length <= 0">Oops, there are no orders at the moment :(</div>  
  </div>
</template>

<script>
export default {
  components: {
  },
  data: function() {
    return {
      allOrders: []
    }
  },
  props: {
  },
  methods: {
  },
  async mounted() {
    var orders = await this.$axios.get('/orders');
    this.allOrders = orders.data;
    var sorted = this.allOrders.sort((a, b) => {
      var dt1 = new Date(a['orderTime']);
      var dt2 = new Date(b['orderTime']);
      return dt2.getTime() - dt1.getTime();
    });
    console.log(sorted);
  }
};
</script>

<style lang="scss" scoped>
.orders-main {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > .order-block {
    padding: 10px;
    width: 100%;
    max-width: 500px;
    border: 1px solid gray;
    margin-bottom: 10px;
    position: relative;

    > .order-row {
      display: flex;

      > .order-name {
        flex-grow: 1;
        padding-right: 10px;
      }

      > .order-date {
        text-align: right;
      }
    }

    > .order-list {
      margin-left: 10px;
    }

    > .total-price {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}

@media only screen and (max-width: 500px) {
  .orders-main {
    font-size: 0.8em;
  }
}

@media only screen and (max-width: 300px) {
  .orders-main {
    font-size: 0.6em;
  }
}
</style>