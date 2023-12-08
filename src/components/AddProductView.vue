<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'

import DrawerView from '@/components/DrawerView.vue'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, TrashIcon } from '@heroicons/vue/24/outline'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-vue-next'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command'
import VueMultiselect from 'vue-multiselect'
import { useAuthStore } from '../stores/auth'

import { createProduct, fethcStoreTemplates, fethcStoreInventory, updateProduct } from '@/services/apiServices'
import { useAppStore } from '@/stores/app'

interface Product {
  product_name?: string
  product_type?: string
  description?: string
  price?: number
  total_stock?: number
  product_image?: string
  has_variant?: boolean
  first_variant_name?: string
  second_variant_name?: string
  first_variant?: string //128GB,256GB,512GB,1TB,
  second_variant?: string //Blue,Pink,Yellow,Green,Black,
  variant_options?: string
  display?: boolean
  discount?: string
  discount_type?: string
  has_discount?: boolean
  slug?: string
  id?: number
  store?: string
  temp_id?: string
  category?: string
  rating?: string
  review_count?: number
  rate_tracking?: string
  template_id?: number
  from_template?: boolean
  condition?: string
}

const appStore = useAppStore()
const authStore = useAuthStore()
const $toast = useToast()
const focused = ref(false)
onMounted(() => {
  fethcStoreTemplates(authStore.state.account_id).then((res) => {
    //console.log(res.data)

    authStore.state.productTemplates = res.data
    productTemplates.value = res.data
    // products.value = res.data
  })

  //  fethcStoreInventory(authStore.state.account_id).then(res => {
  //   //console.log(res)
  //  })
})



const conditions = ref({
  New: 'NW',
  'Open box': 'OB',
  Excellent: 'EX',
  Good: 'GD',
  Used: 'US',
  'For parts': 'FP'
})
const selectedCondition = ref()
const productTemplates = ref([])
const productsObject = computed(() => {
  let obj = {}
  for (const item of products.value) {
    obj[item.product_name] = item
  }
  return obj
})

// const products = ref([])
const products = computed(() => {
  if (!productTemplates.value.length) return []
  let res = []
  productTemplates.value.map((item) => {
    // let productObject = item
    let obj = {}

    obj.product_name = item.product_name
    obj.id = item.id
    obj.specs = {
      [item.first_variant_name]: item.first_variant.split(','),
      [item.second_variant_name]: item.second_variant.split(',')
    }
    res.push(obj)
  })

  // // compute products object

  return res
})
function generateCombinations(arrays, index, currentCombination, result) {
  if (!Array.isArray(arrays[0])) {
    if (!arrays.length) {
      return
    }
    //console.log(arrays, 'k')

    result.push(arrays)
    return
  }

  if (index === arrays.length) {
    // If we have processed all arrays, add the current combination to the result
    result.push(currentCombination.join('/'))
    return
  }

  const currentArray = arrays[index]
  for (const item of currentArray) {
    currentCombination.push(item)
    generateCombinations(arrays, index + 1, currentCombination, result)
    currentCombination.pop() // Backtrack to explore other combinations
  }
}

// for single products
const selectedProductId = ref()
const selectedProductName = computed(() => {
  if (!selectedProductId.value) return ''
  return products.value.find((item) => item.id == Number(selectedProductId.value)).product_name
})
const variants = ref({})

const selectedProductObject = computed(() => productsObject.value[selectedProductName.value])

// multiple products
const selectedProducts = ref([])
const specs = ref({})

const selectedProductSpecs = ref({})

watch(selectedProductId, (count) => {
  console.log(count)
  selectedProductSpecs.value = {}
})

const uniqueVariants = computed(() => {
  if (selectedProductSpecs.value) {
    let arr = {}
    for (const product in selectedProductSpecs.value) {
      const productData = selectedProductSpecs.value[product]
      let specs = []

      for (const property in productData) {
        const values = productData[property]
        specs.push(Object.values(values))
      }
      const result = []
      //console.log(specs)
      if (specs.length > 0 && Array.isArray(specs[0])) {
        specs = specs?.filter((item) => item.length > 0)
      }
      generateCombinations(specs, 0, [], result)
      arr[product] = result
    }
    //console.log(arr)
    return arr
  }
  return {}
})

watch(selectedProducts.value, (newSelectedProducts, oldSelectedProducts) => {
  // Loop through the removed items and delete corresponding properties
  //console.log('watch', oldSelectedProducts, newSelectedProducts)
  for (const product of Object.keys(selectedProductSpecs.value)) {
    if (!newSelectedProducts.includes(product)) {
      //console.log('delete')
      delete selectedProductSpecs.value[product]
    }
  }
})
// watch(selectedProducts, (newSelectedProducts) => {
//   if(newSelectedProducts == []) {
//     selectedProductSpecs.value = {}
//   }
// })
// const selectedProductSpecs = computed(() => {
//   let obj = {}
//   let availableSpecs = Object.keys(specs)
//   for (const item of selectedProducts.value) {
//     obj[item] = { specs: {} }

//     // for (const sp of Object.keys(productsObject[item].specs)) {
//     //   obj[item].specs[sp] = obj[item].specs[sp] ?? []
//     // }
//   }
//   return obj
// })

const selectProduct = (product) => {
  const index = selectedProducts.value.indexOf(product.name)

  if (index !== -1) {
    // If the item exists in the array, remove it
    selectedProducts.value.splice(index, 1)
  } else {
    // If the item doesn't exist, add it
    selectedProducts.value.push(product.name)
  }
}

function addItemToArrayWithCheck(array, item) {
  const index = array.indexOf(item)

  if (index !== -1) {
    // If the item exists in the array, remove it
    array.splice(index, 1)
  } else {
    // If the item doesn't exist, add it
    array.push(item)
  }

  return array
}

const handleSelectSpec = (e, product, spec, value) => {
  //console.log(e.target.checked, product, spec, value, [value])
  // if(selectedProductSpecs.value[product].specs[spec] == undefined){
  //   selectedProductSpecs.value = {}
  // }
  if (!selectedProductSpecs.value[product]) {
    selectedProductSpecs.value[product] = {
      [spec]: []
    }
  }
  if (!selectedProductSpecs.value[product][spec]) {
    selectedProductSpecs.value[product][spec] = []
  }

  addItemToArrayWithCheck(selectedProductSpecs.value[product][spec], value)

  //console.log(selectedProductSpecs.value)
}
const handleSelectCondition = (e, product, spec, value) => {
  // console.log(e.target.checked, product, spec, value, [value])
  selectedCondition.value = value
  // if(selectedProductSpecs.value[product].specs[spec] == undefined){
  //   selectedProductSpecs.value = {}
  // }
  // if (!selectedProductSpecs.value[product]) {
  //   selectedProductSpecs.value[product] = {
  //     [spec]: []
  //   }
  // }
  // if (!selectedProductSpecs.value[product][spec]) {
  //   selectedProductSpecs.value[product][spec] = []
  // }

  // addItemToArrayWithCheck(selectedProductSpecs.value[product][spec], value)

  //console.log(selectedProductSpecs.value)
}

const anyVariantsSelected = Object.values(uniqueVariants).some((item) => item?.length > 0)

const handleChange = (e, variantName, property) => {
  // //console.log(e.target.value, variantName)

  variants.value[variantName] = { ...variants.value[variantName], [property]: e.target.value }

  //console.log(variants.value)
}

const stringifiedVariants = computed(() => {
  let result = ''

  for (let variant in variants.value) {
    result += `${variant},${variants.value[variant].qty},${variants.value[variant].price},${variants.value[variant].condition};`
  }

  return result
})

const handleSubmit = () => {
  const inventoryItem: Product = {}
  let specs = Object.keys(selectedProductObject.value.specs)

  inventoryItem.product_name = selectedProductName.value
  inventoryItem.has_variant = true
  inventoryItem.first_variant_name = specs[0]
  inventoryItem.second_variant_name = specs[1]
  inventoryItem.first_variant = selectedProductObject.value.specs[specs[0]].join(',')
  inventoryItem.second_variant = selectedProductObject.value.specs[specs[1]].join(',')
  inventoryItem.slug = authStore.state.store.slug
  inventoryItem.store = authStore.state.store.store_name
  inventoryItem.variant_options = stringifiedVariants.value
  inventoryItem.template_id = selectedProductObject.value.id
  inventoryItem.from_template = true
  // inventoryItem.condition = selectedCondition.value
  // inventoryItem.product_image = "/media/static/images/default_product.png"
  // inventoryItem.category = "gadgets"
  // compute variants

  //console.log(inventoryItem, stringifiedVariants)
  createNewProduct(inventoryItem)

  // inventoryItem.product_image =
}
const new_product = ref({
  product_name: '',
  price: '',
  description: ''
})

const new_product_id = ref()


const createNewProduct = (new_product) => {
  // creates new product with the image only
  createProduct(new_product)
    .then((res) => {
      // $toast.success('product added successfully')
      // authStore.state.inventory.push(res.data)
      console.log(res.data.id)
      new_product_id.value = res.data.id
      console.log(new_product.value)
      // this.new_product.temp_id = res.data.id; // when creating multiple products at a time
    })
    .catch((err) => {
      $toast.error('error something happened')
      console.log(err);

    })
    .finally(() => {
      // this.uploading_image = false;
    })
}

const dropdown = ref()
const props = defineProps(['stateKey'])

const close = () => {
  setTimeout(() => {
    appStore.showAddProductView = false
  }, 500)
}



//

const imageData = ref('')

const saveProduct = (e) => {
  let new_product_formData = new FormData()
  try {
    new_product_formData.append("product_image", e.target.files[0])
    // this.uploading_image = true
  } catch { null }


  new_product_id.value ? editProduct(new_product, new_product_id) : createNewProduct(new_product_formData)

}

const editProduct = () => {

  updateProduct({ ...new_product.value, price: Number(new_product.value.price), id: new_product_id.value }, new_product_id.value)
    .then((res) => {
      // console.log(res)
      $toast.success('product added successfully')

    })
    .catch((err) => {
      console.log(err);
      $toast.success('product added successfully')
      close()

    })
    .finally(() => {
      // this.loading = false;
      // clear new_product.id when done
    });
}

const previewImage = (event) => {
  saveProduct(event)
  var input = event.target;
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
</script>

<template>
  <DrawerView :step="0" @close="close">
    <div class="px-4 h-full py- overflow-y-scroll pb-64">
      <!-- <Input placeholder="Search templates" /> -->

      <div class="my-6">
        <h2 class="font-bold text-lg my-6">Add product</h2>

        <div class="product-body">
          <div class="form">
            <div class="form-group">
              <p class="dark label">Edit Product image</p>
              <input class="" type="file" id="editUploadProductImage" name="editUploadProductImage" @change="previewImage"
                accept="image/*" />
              <label for="editUploadProductImage">
                <div class="image-preview" v-if="imageData.length > 0">
                  <img class="preview" :src="imageData" alt="preview" />
                </div>
                <div v-else  class="uploadProductImage bg-gray-200 flex justify-center items-center rounded-md h-20 "> <p>Tap here to change product image</p></div>
              </label>

            </div>
            <div class="form-group">
              <label for="edit-product-name">Product Name</label>
              <Input type="text" id="edit-product-name" class="form-control" v-model="new_product.product_name" />
            </div>
            <div class="form-group">
              <label for="edit-product-price">Product Price</label>
              <Input type="text" id="edit-product-price" v-model="new_product.price" class="form-control" />
            </div>
            <div class="form-group">
              <label for="product-description">Product Description <span>(Optional)</span></label>
              <Textarea id="product-description" class="form-control" v-model="new_product.description"></Textarea>
            </div>
            <div class="flex justify-between">

              <!-- <Button variant="outline" class="btn-style " @click="editProduct(new_product, product.id)">
                    Save 
                  </Button> -->
              <Button class="w-full mt-8" @click="editProduct">Create Product</Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </DrawerView>
</template>

<style scoped>
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
  color: #0C3E26;
  margin-bottom: 8px;
}

.form label.uploadProductImage {
  background: #FDFDFD;
  border: 0.5px dashed rgba(20, 62, 50, 0.25);
  border-radius: 8px;
  padding: 35px 50px;
  width: 100%;
  color: #69747E;
  text-align: center;
}

.form input[type="file"] {
  display: none;
}

p,
.p {
  color: #9C9C9C;
}
</style>