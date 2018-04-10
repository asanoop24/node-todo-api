const {SHA256} = require('crypto-js');
const {sign, verify} = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc!';
var hashedPassword = '$2a$10$z/owAqsAd61z2G.LFQcfe.TVug.t8RkyGLhOGXGf183CaVEh/5Uaq';
var hashedPassword = '$2a$10$92MHiGPo2xCACAImRcvnnuIg/iSz2g29IC2kygJDtYcog5b7ZGhXS';
//
// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     hashedPassword = hash;
//   })
// })

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
})

// var message = 'Im user number 3';
//
// // console.log(message);
// // console.log(SHA256(message));
// // console.log(SHA256(message).toString());
//
// var data = {
//   id: 10
// };
//
// var jwt_encoded = sign(data, '123abc');
// console.log(jwt_encoded);
// var jwt_decoded = verify(jwt_encoded, '123abc');
// console.log(jwt_decoded);
// //
// // var token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data)).toString()
// // };
