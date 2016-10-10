module.exports = function(type) {
  var prefix;
  switch(type) {
      case 'plan':
          prefix = 'p';
          break;
      case 'discount':
          prefix = 'd'
          break;
      default:
          prefix = 'a'
  }
  return prefix;
}
