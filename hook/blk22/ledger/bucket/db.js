const mysql = require('mysql')

class DB{
	constructor(config){
		this.pool = mysql.createPool( config.connection)

		this.pool.getConnection( (err, con) => {
			if (err)
				this.error(err)
			else{
				con.release()
				this.initialize(config)
			}
		})
	}

	initialize(config){
		if (config.create){
			this.execute('drop table if exists item', _ => {
				this.execute(config.item, result => this.ready(result, config), error  => this.error(error))
			})
		}else
			this.ready(null, config)
	}

	close(){}

	ready(result, config){}

	error(err){}

	execute(statement, handle, error){
		this.pool.query(
			statement,
			(e,r) => {
				if (e)
					error && error(e)
				else
					handle(r)
			})
	}

}


module.exports = DB
