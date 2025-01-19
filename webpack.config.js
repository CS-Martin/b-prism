const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'class-transformer/storage': path.resolve(__dirname, 'node_modules/class-transformer/cjs/storage'),
        },
    },
};
