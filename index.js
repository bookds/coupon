// Module: Coupon V1
var coupon = require('./coupon');

var couponCode01 = coupon.gen('plan', {
  market: 'TH',
  limit: '20',
  userZone: 'TH',
  expire: '2016-10-12',
  repeat: true
});
console.log(couponCode01);

var couponCode02 = coupon.gen('discount', {
  discount: 20
});
console.log(couponCode02);

console.log('CHECK Coupon-01', coupon.use(couponCode01));
console.log('CHECK Coupon-02', coupon.use(couponCode02));
console.log('CHECK Coupon error', coupon.use('E12345'));


// Module: Coupon V2
var couponCode03 = coupon.genMulti([
  {type: 'plan',option: {market:'TH'}},
  {type: 'discount',option: {discount:50}}
], option);

console.log(couponCode03);
console.log('CHECK Coupon-03', coupon.use(couponCode03));
console.log('CHECK Coupon error', coupon.use('xxx'));
