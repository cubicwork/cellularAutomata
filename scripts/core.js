var CA = (function (helper) {
  var _self = {}
  _self._state = null
  _self._size = [0, 0]
  _self._step = 0
  _self.eventListener = {
    mutation: [],
    beformutation: []
  }

  // initialize
  function init (v, h) {
    _self._size = [v, h]
    var matrix = []
    for (var vIndex = 0; vIndex < _self._size[0]; vIndex ++) {
      matrix[vIndex] = []
      for (var hIndex = 0; hIndex < _self._size[1]; hIndex ++) {
        matrix[vIndex][hIndex] = false
      }
    }
    _self._step = 0
    setMutation(matrix)
  }

  // setState
  function setState (targetMap) {
    var matrix = []
    for (var vIndex = 0; vIndex < _self._size[0]; vIndex ++) {
      matrix[vIndex] = []
      for (var hIndex = 0; hIndex < _self._size[1]; hIndex ++) {
        matrix[vIndex][hIndex] = targetMap && targetMap[vIndex] && targetMap[vIndex][hIndex]
      }
    }
    _self._step = 0
    setMutation(matrix)
  }

  // proceed one step
  function goNextStep () {
    var nextState = []
    for (var vIndex = 0; vIndex < _self._state.length; vIndex ++) {
      nextState[vIndex] = []
      for (var hIndex = 0; hIndex < _self._state[vIndex].length; hIndex ++) {
        nextState[vIndex][hIndex] = _self.rules(getMatrix9(vIndex, hIndex))
      }
    }
    _self._step++
    setMutation(nextState)
  }

  _self.rules = function (matrix9) {
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
      for (var hIndex = h - 1; hIndex < h + 2; hIndex ++) {
        final.push(getCellValue(vIndex, hIndex))
      }
    }
    return final
  }

  // function get cell value
  function getCellValue(v, h) {
    if (_self._state && _self._state.length) {
      if (v < 0 || v >= _self._state.length || h < 0 || h >= _self._state[0].length) {
        return false
      }
      return _self._state[v][h]
    }
    return false
  }

  // toggle single cell change
  function toogleCellValue (v, h) {
    setCellValue(v, h, !getCellValue(v, h))
  }

  // set single cell change
  function setCellValue(v, h, value) {
    var copy = helper.matrixDeepCopy(_self._state)
    if (copy[v] && typeof copy[v][h] === 'boolean') {
      copy[v][h] = !!value
      setMutation(copy)
    }
  }

  // set mutation
  function setMutation (object) {
    var currentState = helper.matrixDeepCopy(_self._state)
    var nextState = helper.matrixDeepCopy(object)
    // fire event before mucation
    dispatch('beformutation', {
      current: currentState,
      next: nextState
    })
    _self._state = nextState
    // fire after mutation
    dispatch('mutation', {
      current: nextState,
      previous: currentState
    })
  }

  // add a eventListener
  function addEventListener (eventType, fn) {
    if (!eventType || !_self.eventListener[eventType]) {
      return null
    }

    for (var eventListIndex = 0; eventListIndex < _self.eventListener[eventType].length; eventListIndex ++) {
      if (_self.eventListener[eventType][eventListIndex] === fn) {
        return fn
      }
    }

    _self.eventListener[eventType].push(fn)
    return fn
  }

  // remove a eventListener
  function removeEventListener (eventType, fn) {
    if (!eventType || !_self.eventListener[eventType]) {
      return null
    }

    for (var eventListIndex = 0; eventListIndex < _self.eventListener[eventType].length; eventListIndex ++) {
      if (_self.eventListener[eventType][eventListIndex] === fn) {
        _self.eventListener[eventType].splice(eventListIndex, 1)
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

    if (!eventType || !_self.eventListener[eventType]) {
      return false
    }

    for (var eventListIndex = 0; eventListIndex < _self.eventListener[eventType].length; eventListIndex ++) {
      _self.eventListener[eventType][eventListIndex](event)
    }

    return true
  }

  return {
    get size() { return _self._size },
    get state() { return _self._state },
    get step() { return _self._step },
    rules: _self.rules,
    init: init,
    setCellValue: setCellValue,
    setState: setState,
    toogleCellValue: toogleCellValue,
    goNextStep: goNextStep,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  }
})(helper)
