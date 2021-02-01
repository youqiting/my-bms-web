/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} name
 * @returns {Boolean}
 */
export function isDbName(name) {// 非数字开头的 字母数字_ 字符串
  return /^[a-zA-Z]+[a-zA-Z\_1-9]+$/.test(name)
}