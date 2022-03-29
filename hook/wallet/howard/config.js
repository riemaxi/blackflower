const config = {
	band : 0,
	token : [1,1,1,1,1,2],
	peer : [0,0,0,0,0,1],
	password: "0000000000000000",
	delay : 2000,

	login : 'http://129.151.198.55:3000/login',

	channel : {
		in : 'http://129.151.198.55:50000',
		out : 'http://129.151.198.55:10000'
	},

	tx : {
		sender: '111112',
		recipient : '111111'
	}		
}

module.exports = config
