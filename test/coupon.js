var assert = require('assert');
var coupon = require('../coupon');
var genCode = require('../libs/genCode');
var checkType = require('../libs/checkType');

describe('Units Test', function() {
  describe('genCode()', function() {
    it('should return string', function() {
      var code = genCode('p');
      assert.equal(typeof code, 'string');
    });

    it('should return string start with prefix', function() {
      var prefix = 'p';
      var pattern = new RegExp(prefix, 'i');
      var code = genCode('p');
      assert.equal( pattern.test(code), true);
    });
  });

  describe('checkType()', function() {
    it('should return string', function() {
      var prefix = checkType('plan');
      assert.equal(typeof prefix, 'string');
    });

    it('should return "p" when type is "plan"', function() {
      var prefix = checkType('plan');
      assert.equal(prefix, 'p');
    });

    it('should return "d" when type is "discount"', function() {
      var prefix = checkType('discount');
      assert.equal(prefix, 'd');
    });
  });

  describe('gen()', function() {
    it('should have empty coupon', function() {
      coupon.clearCoupons();
      assert.equal(coupon.getCoupons().length, 0);
    });

    it('should return string', function() {
      var code = coupon.gen('plan', {
        market: 'TH'
      });
      assert.equal(typeof code, 'string');
    });

    it('should have 1 coupon', function() {
      assert.equal(coupon.getCoupons().length, 1);
    });

    it('should save option in coupons', function() {

      coupons = coupon.getCoupons()
      assert.equal(coupons[0].option.market, 'TH')
    });

  });

  describe('genMulti()', function() {
    it('should have empty coupon', function() {
      coupon.clearCoupons();
      assert.equal(coupon.getCoupons().length, 0);
    });

    it('should return string', function() {
      var code = coupon.genMulti([
        {type: 'plan', option: {market:'US'}},
        {type: 'discount', option: {discount:20}}
      ]);
      assert.equal(typeof code, 'string');
    });

    it('should have 1 coupon', function() {
      assert.equal(coupon.getCoupons().length, 1);
    });

    it('should save option in coupons', function() {

      coupons = coupon.getCoupons()
      assert.equal(coupons[0].types[0].option.market, 'US')
      assert.equal(coupons[0].types[1].option.discount, 20)
    });
  });

  describe('getCoupons()', function() {
    it('should return array', function() {
      var coupons = coupon.getCoupons();
      assert.equal(Array.isArray(coupons), true);
    });
  });
});




describe('Integration Test', function() {
  describe('Use coupon', function() {
    it('should return result of using coupon', function() {
      couponCode01 = coupon.gen('plan', {
        market: 'TH'
      });
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
    });

    it('should return NO when coupon not exists', function() {
      result = coupon.use('xxx')
      assert.equal(result.msg, 'NO');
    });

    it('should return NO when use invalid coupon', function() {
      couponCode01 = coupon.gen('plan', {
        market: 'TH'
      });
      result = coupon.use('123213')
      assert.equal(result.msg, 'NO');
    });

    it('should return OK when use multi coupon', function() {
      couponCode01 = coupon.genMulti([
        {type: 'plan'},
        {type: 'discount'}
      ]);
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
    });

    it('should return NO when use invalid multi coupon', function() {
      couponCode01 = coupon.genMulti([
        {type: 'plan'},
        {type: 'discount'}
      ]);
      result = coupon.use('123213')
      assert.equal(result.msg, 'NO');
    });

  });
});



describe('Integration Test V2', function() {

  describe('Coupon Limit', function() {

    it('should return YES when coupon has no limit', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
      });
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
    });

    it('should return NO when coupon limit = 0', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        limit: 2
      });
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'NO');
    });
  });


  describe('Coupon zone', function() {

    it('should return YES when use same country', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        userZone: 'TH'
      });
      result = coupon.use(couponCode01, {userZone:'TH'})
      assert.equal(result.msg, 'OK');
    });


    it('should return NO when use different country', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        userZone: 'TH'
      });
      result = coupon.use(couponCode01, {userZone:'US'})
      assert.equal(result.msg, 'NO');
    });

  });

  describe('Coupon expire', function() {

    it('should return NO when coupon expired', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        expire: '2016-10-05'
      });
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'NO');
    });

    it('should return YES when coupon not expired', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        expire: '2016-10-15'
      });
      result = coupon.use(couponCode01)
      assert.equal(result.msg, 'OK');
    });

  });

  describe('Coupon repeatable', function() {

    it('should return YES when coupon can repeatable', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        repeat: true
      });
      result = coupon.use(couponCode01, {name: 'neng'})
      assert.equal(result.msg, 'OK');
      result = coupon.use(couponCode01, {name: 'neng'})
      assert.equal(result.msg, 'OK');
      result = coupon.use(couponCode01, {name: 'neng'})
      assert.equal(result.msg, 'OK');
    });

    it('should return NO when coupon not repeatable', function() {
      coupon.clearCoupons();
      couponCode01 = coupon.gen('plan', {
        market: 'TH',
        repeat: false
      });
      result = coupon.use(couponCode01, {name: 'neng'})
      assert.equal(result.msg, 'OK');
      result = coupon.use(couponCode01, {name: 'neng'})
      assert.equal(result.msg, 'NO');
      result = coupon.use(couponCode01, {name: 'kao'})
      assert.equal(result.msg, 'OK');
    });


  });



});


