import Cookies from 'js-cookie'
const { cachePrefix } = require('@/settings')

const TokenKey = cachePrefix + 'token';

export function getToken (key) {
  return Cookies.get(key ? key : TokenKey)
}

export function setAuthToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken (key) {
  return Cookies.remove(key ? key : TokenKey)
}

export function setToken (key, token) {
  return Cookies.set(key, token)
}

