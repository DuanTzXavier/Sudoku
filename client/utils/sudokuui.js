/**
 * 判断九宫格是否位于边的中间
 * 用于区分相邻九宫格的色值
 */
var isMiddleSubgrids = (x, y) => {
  x = parseInt(x / 3)
  y = parseInt(y / 3)
  if (x == 1 && (y != 1)) {
    return true
  }

  if (x != 1 && y == 1) {
    return true
  }
  return false
}

module.exports = { isMiddleSubgrids }