import { config } from "../config.js";

export class ISetting {
    constructor() {
        console.log('ISetting constructor');

        this.globalContainer = document.getElementById('container-global')
        // search theme in local storage
        this.onLoadStyle()
    }

    onISettingEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'light':
                        console.log('go to action:', e.target.id)
                        this.onChangeStyle('light-theme')                        
                        break;
                    case 'dark':
                        console.log('go to action:', e.target.id)
                        this.onChangeStyle('dark-theme')                        
                        break;
                    case 'default':
                        console.log('go to action:', e.target.id)
                        this.onChangeStyle('default-theme')                        
                        break;
                        
                    
                    default:
                        break;
                }
            default:
                break;
        }
    }
    
    onChangeStyle(style) {
        this.globalContainer.className = style;
        localStorage.setItem('global-style', style)
    }

    onLoadStyle(){
        const style = localStorage.getItem('global-style');
        this.onSelectRadio(style);
    }

    onSelectRadio(style){
        if (style!=null) {
            this.onChangeStyle(style) 
            switch (style) {
                case 'light-theme':
                    document.getElementById('light').checked='true'
                    break;
                case 'dark-theme':
                    document.getElementById('dark').checked='true'
                    break;
            
                default:
                    document.getElementById('default').checked='true'
                    break;
            }
        }    
    }
   
}