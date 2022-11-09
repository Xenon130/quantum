module.exports = {
    apps : [{
        name            : 'quantum',
        script          : './server.js',
        watch           : ['app', 'config', 'server'],
        max_restart     : 3,
        log_date_format : "YYYY-MM-DD HH:mm:ss Z",
    }]
};