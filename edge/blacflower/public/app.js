import { AbstractApp } from "./abstractapp.js";

export class App extends AbstractApp {
    
    constructor() {
        super('http://75.115.61.92:61000/')
        this.config = {
            //host: 'http://75.115.61.92:61000/',
            accessKey: '',
            /* accessKey: '00000000-0CC01FF00B',
            password: 'C9360BE5174E144BC0575D9184798C48DB408022FF691D7091CFE30BF887CA7C', */
            peer: '00000000-0CC01FF00A'
        }
    }
    
    initialize(data){
        super.initialize(data);
    }

}
