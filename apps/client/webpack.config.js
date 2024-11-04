   // apps/client/webpack.config.js
   const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
   const { join } = require('path');

   module.exports = {
       output: {
           path: join(__dirname, '../../dist/apps/client'),
           filename: 'bundle.js', // Adjust as necessary
       },
       plugins: [
           new NxAppWebpackPlugin({
               target: 'web',
               compiler: 'tsc',
               main: './src/main.ts',
               tsConfig: './tsconfig.json',
               optimization: false,
               outputHashing: 'none',
               generatePackageJson: true,
           }),
       ],
   };