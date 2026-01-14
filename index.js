import axios from 'axios'

import constants from './remote/constants'
import commonUtil from './local/common-util'
import sessionmgr from './local/sessionmgr-api'
import stringUtil from './local/string-api'
import dataProcessUtil from './local/dataprocess-api'
import auth from './remote/authorization-api'
import account from './remote/account-api'
import usermgmt from './remote/usermgmt'
import configmgmt from './remote/configmgmt'
import resourcemgmt from './remote/resourcemgmt'
import packagemgmt from './remote/packagemgmt'
import taskmgmt from './remote/taskmgmt'
import alarmmgmt from './remote/alarmmgmt'
import alarmStatistic from './remote/alarmStatistic'
import logmgmt from './remote/logmgmt'
import perfmgmt from './remote/perfmgmt'
import devicemanager from './remote/devicemanager'
import aerialmanager from './remote/aerialmanager'
import collectTemplate from './remote/collectTemplate'

import { store } from "@/base/store.js";

axios.defaults.timeout = constants.REMOTE_TIMEOUT
axios.defaults.baseURL = constants.REMOTE_BASE_URL
axios.defaults.withCredentials = true

/**
 * HTTP请求拦截器
 */
axios.interceptors.request.use(config => {
  // 如果不是调用认证（即登录）相关的接口，则在判断会话有效后，自动带上accessToken
  if (config.baseURL !== constants.AUTH_BASE_URL) {
    if (sessionmgr.isSessionAvailable()) {
      config.headers = {
        'Authorization': constants.AUTH_TOKEN_TYPE + sessionmgr.getSession().accessToken,
        'accessToken': sessionmgr.getSession().accessToken
      }
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

/**
 * HTTP响应拦截器
 * 将返回非200状态的HTTP CODE和无响应均调用promise reject
 */
axios.interceptors.response.use(res => {
  return Promise.resolve(res)
}, error => {
  const res = error.response
  if (res && res.status === 401 && res.config.baseURL !== constants.AUTH_BASE_URL) {
    store.clearSession()
    window.location.reload()
    // return Promise.reject(error)
  }

  return Promise.reject(error)
})

export default {
  constants,
  // local
  commonUtil,
  sessionmgr,
  stringUtil,
  dataProcessUtil,
  // remote
  auth,
  account,
  usermgmt,
  configmgmt,
  resourcemgmt,
  packagemgmt,
  taskmgmt,
  alarmmgmt,
  alarmStatistic,
  logmgmt,
  perfmgmt,
  devicemanager,
  aerialmanager,
  collectTemplate,
}
