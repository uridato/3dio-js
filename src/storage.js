import put from './storage/put.js'
import get from './storage/get.js'
import getUrlFromStorageId from './storage/get-url-from-id.js'
import getNoCdnUrlFromStorageId from './storage/get-no-cdn-url-from-id.js'
import getStorageIdFromUrl from './storage/get-id-from-url.js'
import convert from './storage/convert.js'

var { exportObj, exportDae } = convert

var storage = {
  get: get,
  put: put,
  getUrlFromStorageId: getUrlFromStorageId,
  getNoCdnUrlFromStorageId: getNoCdnUrlFromStorageId,
  getStorageIdFromUrl: getStorageIdFromUrl,
  exportObj: exportObj,
  exportDae: exportDae
}

export default storage
