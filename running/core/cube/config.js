let config = {
    gates : 10,
    session : {
        path : './session.js',
        greeting : 'Cube on ENTER and EXIT',
        enter : {
            host : 'http://localhost',
            port : 20000
        },
        exit : 40000
    },

    admin : {
        path: './session.admin.js',
        port : 3000,
        greeting : 'Admin on PORT'
    },

    internal :  {
        port : 4000,
        greeting : 'Internal service on PORT'
    },

    data : {
        dimensions : 6
    }
}

module.exports = config
