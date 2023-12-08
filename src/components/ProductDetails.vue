<script setup lang="ts">
import {
  createProduct,
  updateProduct,
} from '@/services/apiServices'

import DrawerView from '@/components/DrawerView.vue'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from 'vue-toast-notification'
const props = defineProps(['product'])
const $toast = useToast()

const editing = ref(false)
const imageData = ref('')
const product_to_edit = ref(props.product)
function previewImage(event) {
  saveProduct(event)
  var input = event.target
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result
    }
    reader.readAsDataURL(input.files[0])
  }
}

function saveProduct(e) {
  let new_product = new FormData()
  try {
    new_product.append('product_image', e.target.files[0])
    // this.uploading_image = true
  } catch {
    null
  }

  // this.editProduct(edit_product.value, edit_product.value.id)
}

function editProduct(product, id) {
  updateProduct(product, id)
    .then((res) => {
      this.new_product.id ?
        this.$store.commit(mutationTypes.SAVE_PRODUCT, res.data.product) :
        this.$store.commit(mutationTypes.UPDATE_PRODUCT, { 'id': id, 'updated_product': res.data.product })
    })
    .catch((err) => {
      console.log(err.response.statusText);
      $toast.error(err.response.statusText)


    })
    .finally(() => {
      // this.loading = false;
      // clear new_product.id when done
    });
}
</script>

<template>
  <DrawerView drawerTitle="Select products" stateKey="showProductDetails">
    <div class="container h-screen overflow-y-scroll pb-48">
      <!-- <Header back_to='inventory' @back="back"></Header> -->
      <div v-if="editing">
        <div id="edit-product-modal" ref="close-product-modal" title="BootstrapVue">
          <div class="product-body-wrapper">
            <div class="product-header">
              <h2 class="font-bold text-lg my-6">Edit {{ product.product_name }}</h2>
            </div>
            <div class="product-body">
              <div class="form">
                <div class="form-group">
                  <p class="dark label">Edit Product image</p>
                  <input class="" type="file" id="editUploadProductImage" name="editUploadProductImage"
                    @change="previewImage" accept="image/*" />
                  <label for="editUploadProductImage" class="uploadProductImage ">Tap here to change product image</label>
                  <div class="image-preview" v-if="imageData.length > 0">
                    <img class="preview" :src="imageData" alt="preview" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="edit-product-name">Product Name</label>
                  <Input type="text" id="edit-product-name" class="form-control" v-model="product_to_edit.product_name" />
                </div>
                <div class="form-group">
                  <label for="edit-product-price">Product Price</label>
                  <Input type="text" id="edit-product-price" v-model="product_to_edit.price" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="product-description">Product Description <span>(Optional)</span></label>
                  <Textarea id="product-description" class="form-control"
                    v-model="product_to_edit.description"></Textarea>
                </div>
                <div class="flex justify-between">
                  <Button variant="destructive" @click="editing = false">
                    Cancel
                  </Button>
                  <Button variant="outline" class="btn-style " @click="editProduct(product_to_edit, product.id)">
                    Save edits
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="product-body nav-margin-top">
        <h2 class="font-bold text-lg my-6">Product Details</h2>

        <div class="img-wrapper bg-gray-200 my-2">
          <img :src="'https://api.leyyow.com' + product.product_image" alt="" />
        </div>
        <div class="product-detail-wrapper">
          <hr />
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
          <hr />
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
          <hr />
          <div class="product-detail">
            <div class="row">
                <div class="col-6">
                  <span>Description</span>
                </div>
                <div class="col-6">
                  <p>{{ product.description }}</p>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div class="product-btn mt-6 w-full">
          <Button variant="outline" class="border w-full border-primary" @click="editing = true">Edit</Button>
        </div>
      </div>
    </div>
  </DrawerView>
</template>

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
  justify-content: space-between;
  padding: 10px;
  /* border-top: 0.5px solid blue; */
  /* border-bottom: 0.5px solid blue; */
}

.row div:first-of-type,
.description {
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
  color: #445b54;
}

button {
  /* position: absolute;              */
  right: 0;
  margin-right: 20px;
  transition: all 1s ease;
  /* border: 2px solid #4caf50;
  color: #4caf50; */
  border-radius: 8px;
  font-weight: 600 !important;
  height: 45px;
  background: #fff;
  /* width: 120px; */
}



/* edit product styles */

.image-preview {
  width: 330px;
}

img {
  width: 100%;
}

.form {
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
}

.form label {
  color: #0c3e26;
  margin-bottom: 8px;
}

.form label.uploadProductImage {
  display: block;
  background: #fdfdfd;
  border: 0.5px dashed rgba(20, 62, 50, 0.25);
  border-radius: 8px;
  padding: 35px 50px;
  width: 100%;
  color: #69747e;
  text-align: center;
}

.form input[type='file'] {
  display: none;
}

p,
.p {
  color: #9c9c9c;
}
</style>
