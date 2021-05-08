<template>
  <div class="add-main">
    <div class="add-block">
      <input type="file" @change="fileChanged" accept="image/*" id="imageFile">
      <Input placeholder="Name" :text.sync="name" />
      <Input placeholder="Price" :numberText.sync="price" type="number" />
      <Input placeholder="Pcs Available" :numberText.sync="pcs" type="number" />
      <div v-if="error" class="error">Please enter all the values above</div>
    </div>

    <button @click="addCupcake">Add Cupcake</button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {
  },
  data: function() {
    return {
      imageFile: '',
      name: '',
      price: 1,
      pcs: 1,
      error: false
    }
  },
  props: {
  },
  methods: {
    fileChanged: function(e) {
      if (!e.target.files[0]) {
        this.imageFile = '';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => this.imageFile = reader.result;
    },
    addCupcake: async function() {
      this.error = !this.imageFile || !this.name || this.price <= 0 || this.pcs <= 0;

      if (!this.error) {
        var toPost = {
          'name': this.name,
          'image': this.imageFile,
          'price': this.price,
          'quantity': this.pcs
        };

        var add = await this.$axios.post('/cupcake', toPost);
        if (add.data['inserted']) {
          Swal.fire(
            'Cupcake Added',
            `Successfully added ${this.name}!`,
            'success'
          );

          this.name = '';
          this.price = 1;
          this.pcs = 1
          $('#imageFile').val('');
        } else {
          Swal.fire(
            'Error',
            `There was an error occurred while adding ${this.name}. Please try again.`,
            'error'
          );
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-main {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .add-block {
    width: 100%;
    max-width: 500px;
    padding: 10px;

    > .error {
      color: red;
      text-align: center;
    }
  }
}
</style>