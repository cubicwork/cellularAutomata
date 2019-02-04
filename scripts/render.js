var Render = (function (helper) {
  var _self = {}
  _self._mode = 0
  _self._size = [0, 0]
  _self._state = null
  _self._playground = null

  function initialPlayGround (newState) {
    // assume an cell with 5px width and 5px height
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
