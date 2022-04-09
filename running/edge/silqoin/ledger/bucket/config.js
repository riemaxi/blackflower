const config = {
	band : 0,
	token : [2,0,0,0,0,0],
	peer : [4,0,0,0,0,0],
	password: "0000000000000000",
	delay : 25,

	login : 'http://129.151.198.55:3000/login',

	channel : {
		in : 'http://129.151.198.55:50000',
		out : 'http://129.151.198.55:10000'
	},

	db : {
		create : false,
		item : 'create table item(time timestamp, creator char(10), secret char(64), data varchar(1024))',
		connection : {
			user: 'root',
			host: 'localhost',
			database: 'bucket',
			password: 'password',
			multipleStatements : true
		}
	}

}

module.exports = config
