// module.exports = api => {
//   const isTest = api.env('test');
//   // "plugins": ["@babel/plugin-transform-regenerator"],
//
//   if(isTest){
//     return {
//       'presets': [
//         ['@babel/preset-env', {
//           "modules": false
//         }]
//       ]
//     };
//   } else {
//     return {
//       'presets': [
//         [
//           '@babel/preset-env',
//           {
//             modules: false
//           }
//         ]
//       ]
//     };
//   }
//
// };


module.exports =  {
  'presets': [
    '@babel/preset-env'
  ]
};
