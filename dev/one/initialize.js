const fs = require('fs')

let path = a => '/mnt/d/blackflower/storage/messaging/data-' + (a+'').padStart(3,'0')

for(let p=0; p<256; p++){
	let name = path(p)
	fs.writeFile(name, '[]', {flag : 'wx'}, error => {
		console.log( error ? error : name )
	})
}
