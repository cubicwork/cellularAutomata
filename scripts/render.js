var Render = (function (helper) {
  var _self = {}
  _self._mode = 0
  _self._size = [0, 0]
  _self._state = null
  _self._playground = null

  var canvasID = '__canvas_playground'

  function initialPlayGround (newState) {
    // assume an cell with 5px width and 5px height
    _self._playground.innerHTML = ''
    if (_self._mode === 0 || _self._mode === 1) {
      _self._playground.setAttribute('style', 'width: ' + (newState[0].length * 10) + 'px;height: ' + (newState.length * 10) + 'px;')
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          var cell = document.createElement('div')
          cell.setAttribute('id', 'cell-' + vIndex + '-' + hIndex)
          cell.setAttribute('class', newState[vIndex][hIndex] ? 'cell active' : 'cell deactive')
          cell.addEventListener('click', handleClick)
          _self._playground.append(cell)
        }
      }
    } else if (_self._mode === 2 || _self._mode === 3) {
      // prepare canvas object
      var canvas = document.getElementById(canvasID)
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.setAttribute('id', canvasID)
        canvas.setAttribute('width', newState[1].length * 10)
        canvas.setAttribute('height', newState[0].length * 10)
        canvas.addEventListener('click', handleClick)
        _self._playground.append(canvas)
      }
      // draw reacangles
      var drawable = canvas.getContext("2d")
      drawable.clearRect(0, 0, drawable.width, drawable.height)
      drawable.lineWidth = '1'
      drawable.strokeStyle="#ddd"
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          // draw path
          drawable.strokeRect(10 * hIndex, 10 * vIndex, 10, 10)
          // fill
          drawable.fillStyle = newState[vIndex][hIndex] ? '#FF0' : '#333'
          drawable.fillRect(10 * hIndex, 10 * vIndex, 9, 9)
        }
      }
    }
    _self._state = helper.matrixDeepCopy(newState)
  }

  function setPlayGround (newState, previousState) {
    if (_self._mode === 0) {
      // dom with direct refresh
      _self._playground.innerHTML = ''
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          var cell = document.createElement('div')
          cell.setAttribute('id', 'cell-' + vIndex + '-' + hIndex)
          cell.setAttribute('class', newState[vIndex][hIndex] ? 'cell active' : 'cell deactive')
          cell.addEventListener('click', handleClick)
          _self._playground.append(cell)
        }
      }
    } else if (_self._mode === 1) {
      // dom with diff refresh
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          if (_self._state && _self._state[vIndex] && newState[vIndex][hIndex] !== _self._state[vIndex][hIndex]) {
            cell = document.getElementById('cell-' + vIndex + '-' + hIndex)
            cell.setAttribute('class', newState[vIndex][hIndex] ? 'cell active' : 'cell deactive')
          }
        }
      }
    } else if (_self._mode === 2) {
      // dom with direct refresh
      var canvas = document.getElementById(canvasID)
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.setAttribute('id', canvasID)
        canvas.setAttribute('width', newState[1].length * 10)
        canvas.setAttribute('height', newState[0].length * 10)
        canvas.addEventListener('click', handleClick)
        _self._playground.append(canvas)
      }
      var drawable = canvas.getContext("2d")
      drawable.clearRect(0, 0, drawable.width, drawable.height)
      drawable.lineWidth = '1'
      drawable.strokeStyle="#ddd"
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          // draw path
          drawable.strokeRect(10 * hIndex, 10 * vIndex, 10, 10)
          // fill
          drawable.fillStyle = newState[vIndex][hIndex] ? '#FF0' : '#333'
          drawable.fillRect(10 * hIndex, 10 * vIndex, 9, 9)
        }
      }
    } else if (_self._mode === 3) {
      var canvas = document.getElementById(canvasID)
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.setAttribute('id', canvasID)
        canvas.setAttribute('width', newState[1].length * 10)
        canvas.setAttribute('height', newState[0].length * 10)
        _self._playground.append(canvas)
      }
      var drawable = canvas.getContext("2d")
      drawable.clearRect(0, 0, drawable.width, drawable.height)
      drawable.lineWidth = '1'
      drawable.strokeStyle="#ddd"
      for (var vIndex = 0; vIndex < newState.length; vIndex ++) {
        for (var hIndex = 0; hIndex < newState[vIndex].length; hIndex ++) {
          if (_self._state && _self._state[vIndex] && newState[vIndex][hIndex] !== _self._state[vIndex][hIndex]) {
            // fill
            drawable.fillStyle = newState[vIndex][hIndex] ? '#FF0' : '#333'
            drawable.fillRect(10 * hIndex, 10 * vIndex, 9, 9)
          }
        }
      }
    }
    _self._state = helper.matrixDeepCopy(newState)
  }

  function handleClick (ev) {
    if (_self._mode === 0 || _self._mode === 1) {
      var targetData = ev.target.id.match(/cell-(\d+)-(\d+)/)
      if (targetData) {
        _self.onClick(parseInt(targetData[1]), parseInt(targetData[2]))
      }
    } else if (_self._mode === 2 || _self._mode === 3) {
      var targetX = ev.clientX
      var targetY = ev.clientY
      var offsetX = 0
      var offsetY = 0
      var canvas = document.getElementById(canvasID)
      while (canvas && canvas.offsetLeft !== undefined) {
        offsetX += parseFloat(canvas.offsetLeft)
        offsetY += parseFloat(canvas.offsetTop)
        canvas = canvas.parentNode
      }
      var h = Math.floor((targetX - offsetX) / 10)
      var v = Math.floor((targetY - offsetY + 30) / 10)
      _self.onClick(v, h)
    }
  }

  _self.onClick = function (v, h) {}

  return {
    set mode (mode) {
      _self._mode = parseInt(mode)
    },
    get mode () {
      return _self._mode
    },
    set onClick (fn) { _self.onClick = fn },
    set playground (dom) { _self._playground = dom },
    initialPlayGround: initialPlayGround,
    setPlayGround: setPlayGround
  }
})(helper)
