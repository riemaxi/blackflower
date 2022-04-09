let config = {
    gates : 10,
    session : {
        path : './session.js',
        greeting : 'Dispatcher on ENTER and EXIT',
        enter : {
            host: 'http://localhost',
            port : 40000
        },
        exit : 50000,
        timeout: 1000
    },

    admin : {
        path: './session.admin.js',
        host : 'http://localhost:4000/request',
        greeting : 'Admin on PORT'
    },

    data : {
        dimensions : 6
    }
}

module.exports = config
