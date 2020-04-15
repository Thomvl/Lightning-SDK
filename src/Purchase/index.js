import Profile from '../Profile'
import Settings from '../Settings'

let doPurchase = paymentObj => {
  let obj
  return Promise.all([
    Profile.household(),
    Profile.countryCode(),
    Profile.operator(),
    Profile.mac(),
  ])
    .then(values => {
      obj = JSON.stringify({
        purchase: paymentObj || {},
        identifier: Settings.get('app', 'id'),
        name: Settings.get('app', 'id'),
        household: values[0],
        country: values[1],
        operator: values[2],
        mac: values[3],
        type: 'in-app',
      })
      return Promise.resolve(obj)
    })
    .then(obj => {
      return fetch('https://payment-sdk.metrological.com/', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(obj),
      })
    })
    .then(response => {
      console.log(response)
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
      return response.json()
    })
}
let doConfirm = transactionId => {
  return fetch('https://payment-sdk.metrological.com/confirm', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ transactionId: transactionId }),
  }).then(response => {
    console.log(response)
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
    return response.json()
  })
}

export const initPurchase = config => {
  doPurchase = config.doPurchase
  doConfirm = config.doConfirm
}

// public API
export default {
  buy(params) {
    return doPurchase(params)
  },
  confirm(params) {
    return doConfirm(params)
  },
}
