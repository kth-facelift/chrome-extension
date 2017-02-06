
/**
 * Convert an html string into a dom object node
 * @param  {String}           html HTML source string
 * @return {Element|Elements}      An Element object or an array of Elements
 */

exports.fromString = function fromString(html) {
  const div = document.createElement('div');
  div.innerHTML = html;

  if (div.children.length > 1) {
    return Array.prototype.map.call(div.children, child => child);
  }

  return div.children[0];
};
