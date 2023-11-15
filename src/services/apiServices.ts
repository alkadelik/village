import axios from 'axios'
import * as urls from './urls'

export const apiLogin = (data) => {
  return axios({
    method: 'post',
    url: urls.loginUrl,
    data
  })
}
export const createCampaign = (data) => {
  return axios({
    method: 'post',
    url: urls.createCampaignUrl,
    data
  })
}
export const createStore = (data) => {
  return axios({
    method: 'post',
    url: urls.createStoreUrl,
    data
  })
}
export const signUp = (data) => {
	return axios({
	  method: "post",
	  url: urls.signUpUrl,
	  data,
	});
  };
export const createProduct = (data) => {
  return axios({
    method: 'post',
    url: urls.createProductUrl,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const fetchCampaigns = (store) => {
  axios({
    method: 'get',
    url: `${urls.listCampaignsUrl}${store}/`
  })
}
export const fetchCampaignDetails = (id) => {
  axios({
    method: 'get',
    url: `${urls.campaignDetailUrl}${id}/`
  })
}
export const fethcStoreInventory = (slug) => {
  return axios({
    method: 'get',
    url: `${urls.inventoryUrl}/`
  })
}
export const fethcStoreTemplates = (slug) => {
  return axios({
    method: 'get',
    url: `${urls.inventoryTemplatesUrl}`
  })
}
export const fetchMetrics = (period) => {
  return axios({
    method: 'get',
    url: `${urls.metricsUrl}${period}/`
  })
}
export const fetchOrders = () => {
  return axios({
    method: 'get',
    url: urls.ordersUrl
  })
}
export const fetchOrderItems = (id) => {
  return axios({
    method: 'get',
    url: `${urls.orderItemsUrl}${id}/`
  })
}
export const joinWaitlist = (data) => {
  return axios({
    method: 'post',
    url: urls.joinWaitListUrl,
    data
  })
}
export const saveCustomer = (data) => {
  return axios({
    method: 'post',
    url: urls.saveCustomerUrl,
    data
  })
}
export const saveOrder = (data) => {
  return axios({
    method: 'post',
    url: urls.saveOrderUrl,
    data
  })
}
export const saveOrderItems = (data) => {
  return axios({
    method: 'post',
    url: urls.saveOrderItemUrl,
    data
  })
}
export const updateCampaign = (data, id) => {
  return axios({
    method: 'patch',
    url: `${urls.updateCampaignUrl}${id}/`,
    data
  })
}
export const updateCustomer = (data, id) => {
  return axios({
    method: 'patch',
    url: `${urls.updateCustomerUrl}${id}/`,
    data
  })
}
export const updateProduct = (data, id) => {
  return axios({
    method: 'patch',
    url: `${urls.updateProductUrl}${id}/`,
    data
  })
}
export const verifyWaitlistEmail = (otp, email) => {
  return axios({
    method: 'get',
    url: `${urls.verifyWaitlistEmailUrl}${email}/${otp}/`
  })
}

export const search = (searchQuery: string) => {
  return axios({
    method: 'get',
    url: urls.searchUrl + searchQuery
  })
}