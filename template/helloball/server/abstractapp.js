
class AbstractApp extends require('./session'){
    constructor(host){
        super()

	this.connect(host)
    }

    onGranted(data){
	this.serve(null, null, data)
    }

    onReply(data){
	this.play(null, data)
    }

     serve(accessKey, peer, data){
        this.signal(
            accessKey,
            peer, {
		subject: 'play',
                detail : 'POW'
            })
     }

      play(accessKey, data){
        this.reply(
            accessKey,
            data.body.from, {
                subject: 'play',
                detail : 'POW'
            })
      }
}

module.exports = AbstractApp
