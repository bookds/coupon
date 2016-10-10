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
  var use = function(code, userOption) {
    var found = coupons.find(function(coupon){
      return coupon.code == code;
    });
    // console.log('found', found)

    if (found) {
      isValidate = validator(found, userOption)
      if (isValidate) {

        decreaseLimit(found)
        addUsageList(found, userOption)

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

  var addUsageList = function(coupon, userOption) {
    if (userOption && userOption.name) {
      if (!coupon.usageList) {
        coupon.usageList = [userOption.name]
      } else {
        coupon.usageList.push(userOption.name)
      }
    }
  }

  var validator = function(coupon, userOption) {
    validatefunctions = [
      limitValidator,
      countryValidator,
      expireValidator,
      repeatValidator,
    ]

    result = validatefunctions.every(function(fn){
      return fn(coupon, userOption)
    })

    return result
  }

  var limitValidator = function(coupon, userOption) {
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


  var countryValidator = function(coupon, userOption) {
    if ( !coupon.option || typeof coupon.option.userZone == 'undefined') {
      return true
    } else {
      if (coupon.option.userZone == userOption.userZone) {
        return true;
      } else {
        return false;
      }
    }
  }


  var expireValidator = function(coupon, userOption) {
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

  var repeatValidator = function(coupon, userOption) {
    if ( !coupon.option || typeof coupon.option.repeat == 'undefined') {
      return true
    } else {
      if (coupon.option.repeat || typeof coupon.usageList == 'undefined') {
        return true;
      } else {
        foundUser = coupon.usageList.find(function(used) {
          return used == userOption.name
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
