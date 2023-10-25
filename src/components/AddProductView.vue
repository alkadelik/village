<script setup>
import { ref, computed, watch, reactive } from 'vue'

import DrawerView from '@/components/DrawerView.vue'
import MultiCombo from '@/components/MultiCombo.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

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

const products = [
  {
    name: 'iphone 15',
    specs: {
      color: ['black', 'silver', 'grey'],
      capacity: ['128GB', '256GB', '512GB', '1TB']
    }
  },
  {
    name: 'iphone 15 pro',
    specs: {
      color: ['black', 'silver', 'grey'],
      capacity: ['128GB', '256GB', '512GB', '1TB']
    }
  },
  {
    name: 'iphone 15 pro max',
    specs: {
      color: ['black', 'silver', 'grey'],
      capacity: ['128GB', '256GB', '512GB', '1TB']
    }
  },
  {
    name: 'iphone 15 plus',
    specs: {
      color: ['black', 'silver', 'grey'],
      capacity: ['128GB', '256GB', '512GB', '1TB']
    }
  }
]
function generateCombinations(arrays, index, currentCombination, result) {


  if (!Array.isArray(arrays[0])) {
    if (!arrays.length) {
      return
    }
    console.log(arrays, 'k')

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

const productsObject = {}

for (const item of products) {
  productsObject[item.name] = item
}

const selectedProducts = ref([])
const specs = ref({})

const selectedProductSpecs = ref({})

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
      console.log(specs)
      if (specs.length > 0 && Array.isArray(specs[0])) {
        specs = specs?.filter((item) => item.length > 0)
      }
      generateCombinations(specs, 0, [], result)
      arr[product] = result
    }
    console.log(arr)
    return arr
  }
  return {}
})

watch(selectedProducts.value, (newSelectedProducts, oldSelectedProducts) => {
  // Loop through the removed items and delete corresponding properties
  console.log('watch', oldSelectedProducts, newSelectedProducts)
  for (const product of Object.keys(selectedProductSpecs.value)) {
    if (!newSelectedProducts.includes(product)) {
      console.log('delete')
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
  console.log(e.target.checked, product, spec, value, [value])
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

  console.log(selectedProductSpecs.value)
}

const anyVariantsSelected = Object.values(uniqueVariants).some((item) => item?.length > 0)
</script>

<template>
  <DrawerView>
    <div class="px-4 h-full py-6">
      <Input placeholder="Search templates" />

      <div class="my-6">
        <h2 class="font-bold text-lg my-6">Select Product</h2>
        {{ uniqueVariants }}
        <div class="flex justify-around flex-wrap gap-x-4">
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
        </div>

        <!-- <div class="flex justify-end">
          <Button variant="outline" class="text-secondary">next</Button>
        </div> -->
      </div>

      <div>
        <h2 class="font-bold text-lg my-6">Select specifications</h2>
        <p v-if="!selectedProducts.length" class="text-center">Please select a product template</p>

        <div v-for="product in selectedProducts" :key="product" class="my-4">
          <h2 class="font-bold my-2">{{ product }}</h2>
          <div
            v-for="spec in Object.keys(productsObject[product].specs)"
            :key="spec"
            class="flex justify-between"
          >
            <h4 class="font-medium">{{ spec }}</h4>
            <div class="flex flex-row gap-4">
              <div v-for="(value, idx) in productsObject[product].specs[spec]" :key="idx">
                <input
                  type="checkbox"
                  :id="`${product}-${value}-${idx}`"
                  :name="`${product}-${value}-${idx}`"
                  :value="value"
                  @change="(e) => handleSelectSpec(e, product, spec, value)"
                />
                <label :for="`${product}-${value}-${idx}`">
                  <span class="ml-2">{{ value }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-bold text-lg my-6">Select Price and quantity</h2>
        <p v-if="!Object.values(uniqueVariants).flat().length" class="text-center">
          Please select a product specifications
        </p>
        <div v-else>
          <div v-for="item in Object.keys(selectedProductSpecs)" :key="item">
            <h4 class="font-bold my-4">{{ item }}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[100px]"> Variant Name </TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead class="text-right"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(variants, idx) in uniqueVariants[item]" :key="idx">
                  <TableCell class="font-medium"> {{ variants }} </TableCell>
                  <TableCell><Input type="number" class="w-20" /></TableCell>
                  <TableCell><Input type="number" class="w-20" /></TableCell>
                  <TableCell class="text-right">
                    <Button variant="link" class="underline text-gray-400">Clear</Button>
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
    </div>
  </DrawerView>
</template>

<style scoped>
.selected {
}
</style>
