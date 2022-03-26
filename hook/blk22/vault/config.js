const config = {
	band : 0,
	token : [0,0,0,0,0,1],
	peer : [0,0,0,0,0,1],
	password: "0000000000000000",
	delay : 1000,

	login : 'http://129.151.198.55:3000/login',

	channel : {
		in : 'http://129.151.198.55:50000',
		out : 'http://129.151.198.55:10000'
	},

	db : {
		create : false,
		item : 'create table item(serial bigint, owner char(10), secret char(64), primary key (serial))',
		connection : {
			user: 'root',
			host: 'localhost',
			database: 'vault',
			password: 'password'
		}
	}

}

module.exports = config
