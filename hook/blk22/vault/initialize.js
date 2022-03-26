const crypto = require('crypto')
const config = require('./config')


class DB extends require('./db'){
	constructor(config){
		super(config)
	}

	async  hash(string, consume) {
		const utf8 = new TextEncoder().encode(string);
		const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
		  .map((bytes) => bytes.toString(16).padStart(2, '0'))
		  .join('');
		consume(hashHex);
	}

	serial(i, consume){
		consume(i)
	}

	async populate(config, ready){
		/**
		 * 1 sells : 60
		2 development : 16
		4 airdrop : 1
		5 company budget : 20
		6 miscelanias : 3

		 */
		
		let founder = [
			{id: '111110', secret : 'f15f25e9c91e45a008430fbfe9ab0c833a949e4812d573684294984cf0f4d0ff' },
			{id: '111111', secret : '3292bef42975c0ab63a2e9ab72143d6e2658dbd6e81a28cb9cf7618ff906c97' },
			{id: '111112', secret : '864995ea35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035' },
			{id: '111113', secret : '462c39f8e9bbf461369150222f7493055e67079106a1a721824544b113519bf3' },
		]

		let currency = 2**8
		let max = 40000
		let count = 0
		for(let i=0, s = 0; i<max; i++, s += currency){
			let owner = founder[i % founder.length]
			this.serial(s, h => {
				let query = `insert into item values(${h}, '${owner.id}', '${owner.secret}')`

				this.execute(query, result => {
					console.log(count, h)
					count++
	
					if (count==max)
						ready(count + ' created')
				})

			})
		}

	}

	ready(result){
		this.populate(config, result => {
			console.log('initialized ...')
			this.close()
		})

	}

	error(err){
		console.log('initialize::error',err)
	}
}

new DB(config.db)
