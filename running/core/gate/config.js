let config = {
    port : 10000,
    gates : 10,
    session : {
        enter : 10000,
        exit : 20000,
        path : './session.js',
        greeting : 'Gate on ENTER and EXIT'
    },

    data : {
        dimensions: 6
    }
}

module.exports = config
