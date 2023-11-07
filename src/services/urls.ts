const prefix = import.meta.env.VITE_API_BASE_URL;
// Signup and registration
export const joinWaitListUrl = `${prefix}/account/waitlist/join/`
export const loginUrl = `${prefix}/account/get_auth_token/`
export const requestPasswordResetUrl = `${prefix}/account/password_reset/`
export const signUpUrl = `${prefix}/account/signup/`
export const updatePasswordUrl = `${prefix}/account/password_reset/confirm/`
export const verifyEmailPhoneUrl = `${prefix}/account/verify_email_phone/`
export const verifyPasswordResetTokenUrl = `${prefix}/account/password_reset/verify_token/`
export const verifyWaitlistEmailUrl = `${prefix}/account/waitlist/verify_email/`

// Store particulars
// export const createStoreUrl = `${prefix}/account/store/create/`
export const createStoreUrl = `${prefix}user/_create_store/`
export const updateStoreUrl = `${prefix}/account/store/update/`

// Paystack
export const bankListUrl = `https://.paystack.co/bank`
export const createSubAccUrl = `https://.paystack.co/subaccount`
export const resolveAccUrl = `https://.paystack.co/bank/resolve?account_number=`
export const transCodeUrl = `https://.paystack.co/transferrecipient`

// Campaigns
export const createCampaignUrl = `${prefix}/campaign/create/`
export const listCampaignsUrl = `${prefix}/campaign/list/`
export const campaignDetailUrl = `${prefix}/campaign/detail/`
export const updateCampaignUrl = `${prefix}/campaign/update/`

// Customer
export const saveCustomerUrl = `${prefix}/account/customer/create/`
export const updateCustomerUrl = `${prefix}/account/customer/`

// Products
export const createImageUrl = `${prefix}/inventory/product/image/create/`
export const createProductUrl = `${prefix}/inventory/product/create/from_template`
export const initialiseProductUrl = `${prefix}product/initialise/`
export const inventoryUrl = `${prefix}/inventory/product/`
export const inventoryTemplatesUrl = `${prefix}/inventory/templates/`
export const updateProductUrl = `${prefix}/inventory/product/update/`
export const deleteProductUrl = `${prefix}/inventory/product/`

// Orders
export const ordersUrl = `${prefix}/inventory/order/`
export const orderItemsUrl = `${prefix}/inventory/order_items/`
export const updateOrderStatus = `${prefix}/inventory/order_item/update/`
export const saveOrderUrl = `${prefix}/inventory/order/create/`
export const saveOrderItemUrl = `${prefix}/inventory/order_item/create/`

// Metrics
export const metricsUrl = `${prefix}/inventory/order/metrics/`

// Merchant payments
export const saveBankUrl = `${prefix}/settlement/bank/create/`

// Store
export const storeUrl = `${prefix}/account/store/gadgets`

