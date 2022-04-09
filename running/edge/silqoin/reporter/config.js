const config = {
	band : 0,
	token : [0,0,0,0,0,0],
	peer : [0,0,0,0,0,0],
	password: "0000000000000000",
	delay : 25,

	login : 'http://localhost:3000/login',

	channel : {
		in : 'http://localhost:50000',
		out : 'http://localhost:10000'
	},
	
	portal : {
		path : './portal.session.js',
		html : './html',
		port: 60000,
		greeting: 'Silqoin portal on PORT'

	}
}

module.exports = config
