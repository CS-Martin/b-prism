module.exports = {
    apps: [
        {
            name: 'activity-log-service',
            script: 'dist/apps/activity-log-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'authentication-service',
            script: 'dist/apps/authentication-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'dispensing-point-service',
            script: 'dist/apps/map-service/dispensing-point-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'warehouse-service',
            script: 'dist/apps/map-service/warehouse-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'road-network-service',
            script: 'dist/apps/map-service/road-network-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'rescue-post-service',
            script: 'dist/apps/rescue-post-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'user-service',
            script: 'dist/apps/user-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'verification-service',
            script: 'dist/apps/verification-service/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'web-app',
            script: 'dist/apps/web-app/main.js',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
