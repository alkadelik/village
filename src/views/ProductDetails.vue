<template>
  <div class="container">
    adfa
    <!-- <Header back_to='inventory' @back="back"></Header> -->
    <div class="product-body nav-margin-top">
      <div class="img-wrapper">
        <img :src="baseUrl + product.product_image" alt="">
      </div>
      <div class="product-detail-wrapper">
        <hr>
        <div class="product-detail">
          <div class="row">
            <div class="col-3">
              <span>Name</span>
            </div>
            <div class="col-9">
              <h3>{{ product.product_name }}</h3>
            </div>
          </div>
        </div>
        <hr>
        <div class="product-detail">
          <div class="row">
            <div class="col-6">
              <span>Price</span>
            </div>
            <div class="col-6">
              <h3>&#8358;{{ product.price }}</h3>
            </div>
          </div>
        </div>
        <hr>
        <div class="product-detail">
          <div class="description">
            <span>Description</span>
            <p>{{ product.description }}</p>
          </div>
        </div>
        <hr>
      </div>
      <div class="product-btn">
        <button @click="editProduct">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
// import Header from "@/components/Header"
// import { mapGetters } from "vuex"
// import { SET_HEADER_SETTINGS } from "@/store/mutationTypes"
// import StarRating from 'vue-star-rating'

// Vue.component('star-rating', StarRating)
export default {
  name: 'ProductDetails',
  components: {
    // Header,
    // StarRating
  },
  data() {
    return {
      imageData: "", // we will store base64 format of image in this string
      showProductInventory: false,
      noProduct: false,
      activeTab: '1',
      rating: 3.8,
      max: 50,
      fiveStarValue: 75,
      fourStarValue: 16,
      threeStarValue: 5,
      twoStarValue: 5,
      oneStarValue: 1,
      product: {}
    }
  },
  methods:{
    back() {
      this.$router.go(-1)
    },
    editProduct() {
      this.$router.push({name: 'add_product'})
    },
    previewImage: function (event) {
      // Reference to the DOM input element
      var input = event.target;
      console.log("hello")
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    setRating: function(rating) {
      this.rating = rating;
    }
  },
	computed: {
		// ...mapGetters({
    //   product: 'getProductToBeEditted'
		// }),
	},
  // beforeMount() {
  //   this.$store.commit(SET_HEADER_SETTINGS, 10)
  // }
}
</script>

<style scoped>
.img-wrapper {
  width: 100%;
  height: 186px;
  border-radius: 8px;
  overflow: hidden;
}
.img-wrapper img {
  max-width: 100%;
}
.row {
  display: flex;
  /* border-top: 0.5px solid blue; */
  /* border-bottom: 0.5px solid blue; */
}
.row div:first-of-type, .description {
  text-align: left;
}
.row h3 {
  margin: 0;
}
hr {
  height: 0.5px;
  color: #999999;
}
.row div:last-of-type {
  text-align: right;
  /* border-bottom: 0.5px solid blue; */
}
.description p {
  margin-top: 10px;
}
.h3 {
  color: #445B54;
}
button {
  position: absolute;
  right: 0;
  margin-right: 20px;
  transition: all 1s ease;
  border: 2px solid #4CAF50;
  color: #4CAF50;
  border-radius: 8px;
  font-weight: 600 !important;
  height: 45px;
  background: #FFF;
  width: 120px;
}
</style>
