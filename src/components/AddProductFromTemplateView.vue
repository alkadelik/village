<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'

import DrawerView from '@/components/DrawerView.vue'
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

import { createProduct, fethcStoreTemplates, fethcStoreInventory } from '@/services/apiServices'
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

// const products = [
//   {
//     name: 'iphone 15',
//     specs: {
//       color: ['black', 'silver', 'grey'],
//       capacity: ['128GB', '256GB', '512GB', '1TB']
//     }
//   },
//   {
//     name: 'iphone 15 pro',
//     specs: {
//       color: ['black', 'silver', 'grey'],
//       capacity: ['128GB', '256GB', '512GB', '1TB']
//     }
//   },
//   {
//     name: 'iphone 15 pro max',
//     specs: {
//       color: ['black', 'silver', 'grey'],
//       capacity: ['128GB', '256GB', '512GB', '1TB']
//     }
//   },
//   {
//     name: 'iphone 15 plus',
//     specs: {
//       color: ['black', 'silver', 'grey'],
//       capacity: ['128GB', '256GB', '512GB', '1TB']
//     }
//   }
// ]

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
    if (item.first_variant_name) {
      obj.specs = { ...obj.specs, ...{ [item.first_variant_name]: item.first_variant.split(',').filter(item => item !== '') } }
    }
    if (item.second_variant_name) {
      obj.specs = { ...obj.specs, ...{ [item.second_variant_name]: item.second_variant.split(',').filter(item => item !== '') } }

    }
    // obj.specs = {
    //   [item.first_variant_name]: item.first_variant.split(',').filter(item => item !== ''),
    //   [item.second_variant_name]: item.second_variant.split(',').filter(item => item !== '')
    // }
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
  inventoryItem.second_variant_name = specs[1] || ''
  inventoryItem.first_variant = selectedProductObject.value.specs[specs[0]]?.join(',') || ''
  inventoryItem.second_variant = selectedProductObject.value.specs[specs[1]]?.join(',') || ''
  inventoryItem.slug = authStore.state.store.slug
  inventoryItem.store = authStore.state.store.store_name
  inventoryItem.variant_options = stringifiedVariants.value
  inventoryItem.template_id = selectedProductObject.value.id
  inventoryItem.from_template = true
  inventoryItem.condition = 'new'
  // inventoryItem.product_image = "/media/static/images/default_product.png"
  // inventoryItem.category = "gadgets"
  // compute variants

  //console.log(inventoryItem, stringifiedVariants)
  createNewProduct(inventoryItem)

  // inventoryItem.product_image =
}

const createNewProduct = (new_product) => {
  // creates new product with the image only
  console.log(new_product)
  createProduct(new_product)
    .then((res) => {
      $toast.success('product added successfully')
      authStore.state.inventory.push(res.data)
      close()
      // this.new_product.id = res.data.id
      // this.new_product.temp_id = res.data.id; // when creating multiple products at a time
    })
    .catch((err) => {
      $toast.error('error something happened')
    })
    .finally(() => {
      // this.uploading_image = false;
    })
}
const props = defineProps(['stateKey'])
const appStore = useAppStore()

const close = () => {
  console.log(props)

  setTimeout(() => {
    appStore.showAddProductFromTemplateView = false
  }, 500)
  console.log(appStore)
}

const dropdown = ref()
</script>

<template>
  <DrawerView :step="0" @close="close">
    <div class="px-4 h-full py- overflow-y-scroll pb-64">
      <!-- <Input placeholder="Search templates" /> -->

      <div class="my-6">
        <h2 class="font-bold text-lg my-6">Select Product</h2>
        <!-- {{ variants }} {{}} -->

        <div class="z-50">
          <v-autocomplete label="Select Product" item-title="product_name" item-value="id" :items="products"
            v-model="selectedProductId" variant="underlined" class="z-50" elevation="2"
            style="position: relative; z-index: 3">
            <template v-slot:chip="{ props, item }">
              <v-chip v-bind="props" :text="item.raw.product_name"></v-chip>
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item?.raw?.product_name"></v-list-item>
            </template>
          </v-autocomplete>
        </div>

        <!-- <Select :ref="dropdown" v-model="selectedProductId">
          <SelectTrigger>
            <SelectValue placeholder="Select a product template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem :value="`${item.id}`" v-for="(item, idx) in products" :key="idx">
                {{ item.product_name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> -->
        <!-- <div class="flex justify-around flex-wrap gap-x-4">
          <div
            v-for="(item, key) in products"
            :key="key"
            :class="`w-48p mb-4 cursor-pointer hover:bg-slate-100 rounded-md ${
              selectedProducts.includes(item.name) ? 'selected bg-slate-200' : ''
            }`"
            @click="selectProduct(item)"
          >
            <div class="rounded-md bg-orange-300 h-32"></div>
            <h3 class="font-medium mt-2 text-lg p-2">{{ item.name }}</h3>
          </div>
        </div> -->

        <!-- <div class="flex justify-end">
          <Button variant="outline" class="text-secondary">next</Button>
        </div> -->
      </div>

      <div v-if="selectedProductObject.specs">
        <h2 class="font-bold text-lg my-6">Select specifications</h2>
        <p v-if="!selectedProductName" class="text-center">Please select a product template</p>
        <div class="my-4" v-else>
          <h2 class="font-bold my-2">{{ selectedProductName }}</h2>
          <div v-for="spec in Object.keys(selectedProductObject.specs || {})" :key="spec" class="flex justify-between">
            <h4 class="font-medium">{{ spec }}</h4>
            <div class="flex flex-row gap-2">
              <div class="no-wrap flex" v-for="(value, idx) in selectedProductObject.specs[spec]" :key="idx">
                <input type="checkbox" :id="`${selectedProductName}-${value}-${idx}`"
                  :name="`${selectedProductName}-${value}-${idx}`" :value="value"
                  @change="(e) => handleSelectSpec(e, selectedProductName, spec, value)" />
                <label :for="`${selectedProductName}-${value}-${idx}`">
                  <span class="ml-2">{{ value }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 
      <div>
        <h2 class="font-bold text-lg my-6">Select condition</h2>
        <p v-if="!selectedProductName" class="text-center">Please select a product template</p>

        <div class="my-4" v-else>
          <h2 class="font-bold my-2">{{ selectedProductName }}</h2>
          <div class="justify-between">
            <h4 class="font-medium">Condition</h4>
            <div class="flex-row gap-2">
              <div class="no-wrap flex" v-for="(value, idx) in Object.keys(conditions)" :key="idx">
                <input
                  type="radio"
                  :id="value"
                  name="condition"
                  :value="conditions[value]"
                  @change="
                    (e) => handleSelectCondition(e, selectedProductName, spec, conditions[value])
                  "
                />
                <label :for="value">
                  <span class="ml-2">{{ value }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div>
        <h2 class="font-bold text-lg my-6">Select Price and quantity</h2>
        <p v-if="!selectedProductName " class="text-center">Please select a product template</p>

        <p v-else-if="!Object.values(uniqueVariants).flat().length" class="text-center">
          Please select a product specifications
        </p>
        <div v-else>
          <div v-for="item in Object.keys(selectedProductSpecs)" :key="item">
            <h4 class="font-bold my-4">{{ item }}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[50px] px-0 text-center"> Variant Name </TableHead>
                  <TableHead class="px-0 text-center">Qty</TableHead>
                  <TableHead class="px-0 text-center">Price</TableHead>
                  <TableHead class="px-0 text-center">Condition</TableHead>
                  <TableHead class="text-right px-0 text-center"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="py-2" v-for="(variant, idx) in uniqueVariants[item]" :key="idx">
                  <TableCell class="font-medium px-1">
                    <p class="w-20  variant-key">{{ variant.split('/').join(' / ') }}</p>
                  </TableCell>
                  <TableCell class="px-1"><Input type="number" :name="`${variant}-qty`" :id="`${variant}-qty`"
                      class="w-12 px-1 text-center" @change="(e) => handleChange(e, variant, 'qty')" /></TableCell>
                  <TableCell class="px-1"><Input type="number" :name="`${variant}-price`" :id="`${variant}-price`"
                      class="w-20 px-1 text-center" @change="(e) => handleChange(e, variant, 'price')" /></TableCell>
                  <TableCell class="px-1">
                    <Select v-if="variants[variant]" v-model="variants[variant].condition">
                      <SelectTrigger class="">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <!-- <SelectLabel>Fruits</SelectLabel> -->
                          <SelectItem :value="conditions[condition]" v-for="condition in Object.keys(conditions)"
                            :key="condition">
                            {{ condition }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p v-else class="w-20">select price and qty first</p>
                  </TableCell>
                  <TableCell class="text-right px-1">
                    <Button variant="link" class="underline w-8 text-gray-400 p-0">
                      <TrashIcon class="w-6 h-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- <Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution
    required.
  </CollapsibleContent>
</Collapsible> -->

        <!-- <Collapsible

      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDownIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible> -->
      </div>

      <Button class="w-full mt-8" @click="handleSubmit">Create Product</Button>
    </div>
  </DrawerView>
</template>

<style scoped>
.selected {}

.variant-key {
  overflow-wrap: break-word
}
</style>
