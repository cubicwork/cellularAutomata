var CA = (function () {
  var self = this
  self._state = null
  self._size = [0, 0]
  self._step = 0
  self.eventListener = {
    mutation: [],
    beformutation: []
  }

  // initialize
  function init(v, h) {
    self._size = [v, h]
    var matrix = []
    for (var vIndex = 0; vIndex < self._size[0]; vIndex ++) {
      matrix[vIndex] = []
      for (var hIndex = 0; hIndex < self._size[1]; hIndex ++) {
        matrix[vIndex][hIndex] = false
      }
    }
    setMutation(matrix)
  }

  // proceed one step
  function goNextStep () {
    var nextState = []
    for (var vIndex = 0; vIndex < self._state.length; vIndex ++) {
      nextState[vIndex] = []
      for (var hIndex = 0; hIndex < self._state[vIndex].length; hIndex ++) {
        nextState[vIndex][hIndex] = self.rules(getMatrix9(vIndex, hIndex))
      }
    }
    setMutation(nextState)
  }

  self.rules = function (matrix9) {
    //    a | b | c                   v
    //    d | M | f  ==> [a, b, c, d, M, f, g, h, i]
    //    g | h | i       0  1  2  3  4  5  6  7  8
    var mainStatus = matrix9[4]
    matrix9[4] = false
    var finalCount = matrix9.reduce(function(accumulator, item) {
      item && accumulator++
      return accumulator
    }, 0)

    if (finalCount === 2) {
      return mainStatus
    } else if (finalCount === 3) {
      return true
    }
    return false
  }

  // get vector of neighbors
  function getMatrix9(v, h) {
    var final = []
    for (var vIndex = v - 1; vIndex < v + 2; vIndex ++) {
      nextState[vIndex] = []
      for (var hIndex = h - 1; hIndex < h + 2; hIndex ++) {
        final.push(getCellValue(vIndex, hIndex))
      }
    }
    return final
  }

  // function get cell value
  function getCellValue(v, h) {
    if (self._state && self._state.length) {
      if (v < 0 || v >= self._state.length || h < 0 || h >= self._state[0].length) {
        return false
      }
      return self._state[v, h]
    }
    return false
  }

  // set single cell change
  function setCellValue(v, h, value) {
    var copy = matrixDeepCopy(self._state)
    if (copy[v] && typeof copy[v][h] === 'boolean') {
      copy[v][h] = !!value
      setMutation(copy)
    }
  }

  // deep copy
  function matrixDeepCopy (origin) {
    var copy = []
    origin = origin || []
    for (var vIndex = 0; vIndex < origin.length; vIndex ++) {
      copy[vIndex] = []
      for (var hIndex = 0; hIndex < origin[vIndex].length; hIndex ++) {
        copy[vIndex][hIndex] = origin[vIndex][hIndex]
      }
    }
    return copy
  }

  // set mutation
  function setMutation (object) {
    var currentState = matrixDeepCopy(self._state)
    var nextState = matrixDeepCopy(object)
    // fire event before mucation
    dispatch('beformutation', {
      current: currentState,
      next: nextState
    })
    self._state = nextState
    // fire after mutation
    dispatch('mutation', {
      current: nextState,
      previous: currentState
    })
  }

  // add a eventListener
  function addEventListener (eventType, fn) {
    if (!eventType || !self.eventListener[eventType]) {
      return null
    }

    for (var eventListIndex = 0; eventListIndex < self.eventListener[eventType].length; eventListIndex ++) {
      if (self.eventListener[eventType][eventListIndex] === fn) {
        return fn
      }
    }

    self.eventListener[eventType].push(fn)
    return fn
  }

  // remove a eventListener
  function removeEventListener (eventType, fn) {
    if (!eventType || !self.eventListener[eventType]) {
      return null
    }

    for (var eventListIndex = 0; eventListIndex < self.eventListener[eventType].length; eventListIndex ++) {
      if (self.eventListener[eventType][eventListIndex] === fn) {
        self.eventListener[eventType].splice(eventListIndex, 1)
        return fn
      }
    }

    return null
  }

  // dispatch an event
  function dispatch(eventType, target) {
    var event = {
      type: eventType,
      target: target
    }

    if (!eventType || !self.eventListener[eventType]) {
      return false
    }

    for (var eventListIndex = 0; eventListIndex < self.eventListener[eventType].length; eventListIndex ++) {
      self.eventListener[eventType][eventListIndex](event)
    }

    return true
  }

  return {
    get size() { return self._size },
    get state() { return self._state },
    get step() { return self._step },
    rules: self.rules,
    init: init,
    setCellValue: setCellValue,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  }
})()
