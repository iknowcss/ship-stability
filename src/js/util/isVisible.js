let contains;
if (document.documentElement.compareDocumentPosition) {
  contains = (a, b) => !!(a.compareDocumentPosition(b) & 16)
} else if (document.documentElement.contains) {
  contains = (a, b) => a !== b && ( a.contains ? a.contains(b) : false )
} else {
  contains = (a, b) => {
    while (b = b.parentNode) {
      if (b === a) return true
    }
    return false
  }
}

const container = document.body

/// ----------------------------------------------------------------------------

export default function isVisible(elt, offset = 0) {
  if (!contains(document.documentElement, elt) || !contains(document.documentElement, container)) {
    return false;
  }

  // Check if the element is visible
  // https://github.com/jquery/jquery/blob/740e190223d19a114d5373758127285d14d6b71e/src/css/hiddenVisibleSelectors.js
  if (!elt.offsetWidth || !elt.offsetHeight) {
    return false;
  }

  var eltRect = elt.getBoundingClientRect();
  var viewport = {};

  if (container === document.body) {
    viewport = {
      top: -offset,
      left: -offset,
      right: document.documentElement.clientWidth + offset,
      bottom: document.documentElement.clientHeight + offset
    };
  } else {
    var containerRect = container.getBoundingClientRect();
    viewport = {
      top: containerRect.top - offset,
      left: containerRect.left - offset,
      right: containerRect.right + offset,
      bottom: containerRect.bottom + offset
    };
  }

  // The element must overlap with the visible part of the viewport
  return (
    eltRect.right >= viewport.left &&
    eltRect.left <= viewport.right &&
    eltRect.bottom >= viewport.top &&
    eltRect.top <= viewport.bottom
  );
}