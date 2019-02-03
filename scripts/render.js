var Render = (function () {
  var self = this
  self._mode = 0
  self._size = [0, 0]

  function initialPlayGround (dom, data) {
    // assume an cell with 5px width and 5px height
    if (self._mode === 0 || self._mode === 1) {
      dom.setAttribute('style', 'width: ' + (data[0].length * 10) + 'px;height: ' + (data.length * 10) + 'px;')
      for (var vIndex = 0; vIndex < data.length; vIndex ++) {
        for (var hIndex = 0; hIndex < data[vIndex].length; hIndex ++) {
          var cell = document.createElement('div')
          cell.setAttribute('id', 'cell-' + vIndex + '-' + hIndex)
          cell.setAttribute('class', data[vIndex][hIndex] ? 'cell active' : 'cell deactive')
          cell.addEventListener('click', handleClick)
          dom.append(cell)
        }
      }
    } else if (self._mode === 2 || self._mode === 3) {

    }
  }

  function setPlayGround (newState) {

  }

  function handleClick (ev) {
    if (self._mode === 0 || self._mode === 1) {
      var targetData = ev.target.id.match(/cell-(\d+)-(\d+)/)
      if (targetData) {
        self.onClick(parseInt(targetData[1]), parseInt(targetData[2]))
      }
    } else if (self._mode === 2 || self._mode === 3) {

    }
  }

  self.onClick = function (v, h) {}

  return {
    set mode (mode) {
      self._mode = parseInt(mode)
    },
    get mode () {
      return self._mode
    },
    set onClick (fn) { self.onClick = fn },
    initialPlayGround: initialPlayGround
  }
})()
