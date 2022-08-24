import {Session} from './session.js'

let elem = id => document.getElementById(id)

let LoginPage = handle => {
	elem('login-ok').onclick = () => handle({id:'login', data: {accessKey: 'key'}})
	elem('login-fail').onclick = () => handle({id:'login', data: {}})
	elem('login-password').onclick = () => handle({id:'password', data: {accessKey: 'key'}})
}

let HomePage = handle => {
	elem('menu-logout').onclick = () => handle({id:'logout'})
	elem('home-sell').onclick = () => handle({id:'sell'})
	elem('home-buy').onclick = () => handle({id:'buy'})
	elem('home-balance').onclick = () => handle({id:'balance'})
}

let BalancePage = handle => {
	elem('balance-home').onclick = () => handle({id:'home'})
	elem('balance-fav').onclick = () => handle({id:'fav'})
	elem('balance-add-token').onclick = () => handle({id:'add-token'})
	elem('balance-see-all').onclick = () => handle({id:'see-all'})
	elem('balance-see-token').onclick = () => handle({id:'see-token'})
}

let TokenPage = handle => {
	elem('token-home').onclick = () => handle({id:'home'})
	elem('token-add-to-fav').onclick = () => handle({id:'add-to-fav'})
}

let AddTokenPage = handle => {
	elem('at-logout').onclick = () => handle({id:'logout'})
}

let ReceiveCoinPage = handle => {
	elem('rc-logout').onclick = () => handle({id:'logout'})
}

let SendCoinPage = handle => {
	elem('sc-logout').onclick = () => handle({id:'logout'})
}

let BuyPage = handle => {
	elem('buy-logout').onclick = () => handle({id:'logout'})
	elem('buy-home').onclick = () => handle({id:'home'})
}

let SellPage = handle => {
	elem('sell-logout').onclick = () => handle({id:'logout'})
	elem('sell-home').onclick = () => handle({id:'home'})

}

export class AbstractApp extends Session {
	constructor(host) {
	super()
		this.navigate('login')
	}

	navigate(page){
		if (this.current)
			this.current.style.display = 'none'

		this.current = elem(page)
		this.current.style.display = 'block'

		switch(page){
			case 'login': LoginPage( event => this.onLoginPageEvent(event) ); break;
			case 'home' : HomePage( event => this.onHomePageEvent(event) ); break;
			case 'balance' : BalancePage( event => this.onBalancePageEvent(event) ); break;
			case 'add-token' : AddTokenPage( event => this.onAddTokenPageEvent(event) ); break;
			case 'receive-coin' : ReceiveCoinPage( event => this.onReceiveCoinPageEvent(event) ); break;
			case 'send-coin' : SendCoinPage( event => this.onSendCoinPageEvent(event) ); break;
			case 'buy' : BuyPage( event => this.onBuyPageEvent(event) ); break;
			case 'sell' : SellPage( event => this.onSellPageEvent(event) ); break;
			case 'see-token' : TokenPage( event=> this.onTokenPageEvent(event) ); break;

		}
	}

	initialize(data){
		this.navigate('login')
	}

	onGranted(data) {
		this.navigate('home')
	}

	onDenied(data) {}
	onReply(data) {
		switch (data.body.subject) {
		    default:
		        break;
			}
	}

	//LoginPage events
	onLoginPageEvent(event){
		switch(event.id){
			case 'login' : this.onLogin(event.data); break;
			case 'password' : this.onPassword(event.data); break;

			default: break;
		}
	}

	onLogin(data){}
	onPassword(data){}

	//HomePage events
	onHomePageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
			case 'sell' : this.navigate('sell'); break;
			case 'buy' : this.navigate('buy'); break;
			case 'balance' : this.navigate('balance'); break;
		}
	}

	//BalancePage events
	onBalancePageEvent(event){
		switch(event.id){
			case 'add-token' : this.onBalanceAddToken(); break;
			case 'see-all' : this.onBalanceSeeAll(); break;
			case 'see-token' : this.onBalanceSeeToken({id: 1011, name:'token-1011'}); break;
			case 'fav' : this.onBalanceFav(); break;
			case 'home' : this.onHome(); break;
		}
	}

	onBalanceAddToken(){
		console.log('balance add token')
	}

	onBalanceSeeToken(data){
		this.navigate('see-token')
	}

	onBalanceSeeAll(){
		console.log('balance see all')
	}

	onBalanceFav(){
		console.log('balance favs')
	}

	//TokenPage events
	onTokenPageEvent(event){
		switch(event.id){
			case 'home' : this.onHome(); break;
			case 'add-to-fav' : this.onTokenToFav(); break;
		}
	}

	onTokenToFav(){
		console.log('add token to favs')
	}

	//ReceiveCoinPage events
	onReceiveCoinPageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
		}
	}

	//SendCoinPage events
	onSendCoinPageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
		}
	}

	//AddTokenPage events
	onAddTokenPageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
		}
	}

	//BuyPage events
	onBuyPageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
			case 'home' : this.onHome(); break;
		}
	}

	//SellPage events
	onSellPageEvent(event){
		switch(event.id){
			case 'logout' : this.onLogout(); break;
			case 'home' : this.onHome(); break;
		}
	}


	//General events
	onLogout(){
		this.logout()
		this.navigate('login')
	}

	onHome(){
		this.navigate('home')
	}


}
