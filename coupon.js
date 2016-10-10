var genCode = require('./libs/genCode');
var checkType = require('./libs/checkType');

module.exports = (function() {

  var coupons = [];

  // Genareate
  var gen = function(type, option) {
    var coupon = {
      option: option,
      type: type
    }
    var code = null;
    var prefix = checkType(type);


    coupon.code = genCode(prefix);
    coupons.push(coupon);
    return coupon.code;
  }

  // Multi Generate
  var genMulti = function(types, option) {

    var prefix = '';
    var coupon = {
      types: types,
      option: option
    }

    types.forEach( (option) => {
      prefix += checkType(option.type);
    })

    coupon.code = genCode(prefix);
    coupons.push(coupon);
    return coupon.code;
  }

  // Use Coupon
  var use = function(code, userInfo) {
    var found = coupons.find(function(coupon){
      return coupon.code == code;
    });
    // console.log('found', found)

    if (found) {
      isValidate = validator(found, userInfo)
      if (isValidate) {

        decreaseLimit(found)
        addUsageList(found, userInfo)

        return {
          msg: 'OK'
        }
      }
      else {
        return {
          msg: 'NO'
        }
      }

    }
    else {
      return {
        msg: 'NO'
      }
    }
  }

  var decreaseLimit = function(coupon) {
    if (coupon.option && coupon.option.limit) {
      coupon.option.limit--
    }
  }

  var addUsageList = function(coupon, userInfo) {
    if (userInfo && userInfo.name) {
      if (!coupon.usageList) {
        coupon.usageList = [userInfo.name]
      } else {
        coupon.usageList.push(userInfo.name)
      }
    }
  }

  var validator = function(coupon, userInfo) {
    validatefunctions = [
      limitValidator,
      countryValidator,
      expireValidator,
      repeatValidator,
    ]

    result = validatefunctions.every(function(fn){
      return fn(coupon, userInfo)
    })

    return result
  }

  var limitValidator = function(coupon, userInfo) {
    if ( !coupon.option || typeof coupon.option.limit == 'undefined') {
      return true
    } else {
      if (coupon.option.limit > 0) {
        return true;
      } else {
        return false;
      }
    }
  }


  var countryValidator = function(coupon, userInfo) {
    if ( !coupon.option || typeof coupon.option.userZone == 'undefined') {
      return true
    } else {
      if (coupon.option.userZone == userInfo.userZone) {
        return true;
      } else {
        return false;
      }
    }
  }


  var expireValidator = function(coupon, userInfo) {
    if ( !coupon.option || typeof coupon.option.expire == 'undefined') {
      return true
    } else {
      if (new Date(coupon.option.expire).getTime() > new Date().getTime()) {
        return true;
      } else {
        return false;
      }
    }
  }

  var repeatValidator = function(coupon, userInfo) {
    if ( !coupon.option || typeof coupon.option.repeat == 'undefined') {
      return true
    } else {
      if (coupon.option.repeat || typeof coupon.usageList == 'undefined') {
        return true;
      } else {
        foundUser = coupon.usageList.find(function(used) {
          return used == userInfo.name
        })
        if (foundUser) {
          return false;
        } else {
          return true;
        }

      }
    }
  }

  // Get Coupon
  var getCoupons = function() {
    return coupons;
  }

  // Clear Coupon
  var clearCoupons = function() {
    coupons = [];
  }


  return {
    use,
    gen,
    genMulti,
    getCoupons,
    clearCoupons
  }
})();
