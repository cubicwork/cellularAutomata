var helper = (function () {

  // deep copy
  function matrixDeepCopy (origin) {
    var copy = []
    origin = origin || []
    for (var vIndex = 0; vIndex < origin.length; vIndex ++) {
      copy[vIndex] = []
      for (var hIndex = 0; hIndex < origin[vIndex].length; hIndex ++) {
        copy[vIndex][hIndex] = !!origin[vIndex][hIndex]
      }
    }
    return copy
  }

  return {
    matrixDeepCopy: matrixDeepCopy
  }
})()
