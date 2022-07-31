import { Session } from "./session.js";

export class AbstractApp extends Session {
    constructor(host) {
        super()
        this.connect(host)
        // login
        document.getElementById('enter').addEventListener('click', () => this.onLogin(this.getLogin()))
        //change password
        document.getElementById('new-password-btn').addEventListener('click', () => this.onChangePassword(this.getAccessKey()))
        // select service from a list of services with class="services"
        this.on('click', '.services', this.onSelectService)
        // search service
        document.getElementById('search-service').addEventListener('click', () => this.onSearchService(this.getSearchService()))
        // select a country in world map
        document.querySelectorAll('.country').forEach(country => {
            country.addEventListener('click', () => this.onSelectCountry(country));
        })
        // select previous country to show nodes of map 
        document.getElementById('button-left-country').addEventListener('click', () => this.onChangeCountry("back"))
        // select next country to show nodes of map 
        document.getElementById('button-right-country').addEventListener('click', () => this.onChangeCountry("next"))
        // select node from a list of nodes with class="nodes"
        document.querySelectorAll('.nodes').forEach(node => {
            node.addEventListener('click', () => this.onSelectNode({ nodeId: node.id }));
        })

        // closes the modal
        document.getElementsByClassName("close")[0].addEventListener('click', () => document.getElementById("myModal").style.display = "none")

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == document.getElementById("myModal")) {
                document.getElementById("myModal").style.display = "none";
            }
        }

    }

    on(eventName, selector, handler) {
        document.addEventListener(eventName, function (event) {
            const elements = document.querySelectorAll(selector);
            const path = event.composedPath();
            path.forEach(function (node) {
                elements.forEach(function (elem) {
                    if (node === elem) {
                        handler.call(elem, event);
                    }
                });
            });
        }, true);
    }

    initialize(data) {
        console.log('initialize... get initial data', data);
    }

    // login request
    onLogin(data) {
        console.log('onLogin:', data.accessKey, data.password)
        this.config.accessKey = data.accessKey
        this.login(this.config.accessKey, data.password)
    }

    // success login completed
    onGranted(data) {
        console.log('onGranted ...', data)
        // login success        
        this.onLoginSuccess(data)
    }

    // error login
    onDenied(data) {
        console.log('onDenied', data)
        document.querySelector('.message').style.display = "block";
    }

    onLoginSuccess(data) {
        console.log('onLoginSuccess:', data)
        document.getElementById('loginForm').innerHTML = `
            <div class="title-login"><b>WELCOME</b></div>
            <p>ID: ${this.config.accessKey}</p>
            <input id="new-password-btn" type="button" value="Send new password" class="button-login">
            <input id="logout" type="button" value="LOGOUT" class="button-login">
        `
        document.getElementById('logout').addEventListener('click', () => this.onLogout())

        // ... simulate get initial data ----------------------------------------------------------------
        this.reply(this.config.accessKey, this.config.peer, {
            subject: 'services'
        })
        this.reply(this.config.accessKey, this.config.peer, {
            subject: 'statistics'
        })
        // ... simulate end ----------------------------------------------------------------
    }

    onChangePassword(data) {
        console.log('onChangePassword:', data.accessKey)
    }

    onLoadServices(data) {
        const servics = data.body.services
        let listServices = document.getElementById('list-services')
        listServices.innerHTML = ``
        servics.forEach(serv => {
            listServices.innerHTML += `
                        <li id="${serv.id}" class="services">
                            <div class="icon-service">${serv.logo}</div>
                            <span>${serv.name}</span>
                        </li>                         
                    `
        });
    }

    onSelectService(e) {
        console.log('onSelectService this:', this.id)
    }

    onSearchService(data) {
        console.log('onSearchService:', data.serviceName)
    }

    onSearchServiceResponse(data) {
        console.log('onSearchServiceResponse:', data)
    }

    onSelectCountry(country) {
        console.log('onSelectCountry:', country)
        document.getElementById('button-center-country').value = country.textContent
        if (country.id !== null && country.id !== undefined) {
            // search map in sessionStorage
            if (sessionStorage.getItem(country.id) !== null) {
                this.onSelectCountrySuccess(
                    {
                        id: country.id,
                        svg: sessionStorage.getItem(country.id)
                    }
                )
            } else {
                document.getElementById('svgContainer').style.display = 'none';
                document.getElementById('map-loading').style.display = 'block';
                this.reply(this.config.accessKey, this.config.peer, {
                    subject: 'select-country',
                    id: country.id
                })
            }
        }
    }

    onSelectCountrySuccess(data) {
        console.log('onSelectCountrySuccess... ')
        document.getElementById('svgContainer').style.display = 'block';
        document.getElementById('map-loading').style.display = 'none';
        if (data.svg !== null) {
            document.getElementById('svgContainer').innerHTML = data.svg;
            // show modal content
            document.getElementById('svg').addEventListener('click', (e) => {
                if (e.target.getAttribute('name') !== null && e.target.id !== null) {
                    this.onSelectNode(e.target.id)
                    document.getElementById("myModal").style.display = "block";
                    document.querySelector('.modal-body').style.display = "none";
                    document.querySelector('.modal-body-loading').style.display = "block";
                    if ((window.innerWidth - e.x) <= 205) {
                        document.getElementById("modal-content").style.top = e.y + "px";
                        document.getElementById("modal-content").style.left = e.x - 160 + "px";
                    } else {
                        document.getElementById("modal-content").style.top = e.y + "px";
                        document.getElementById("modal-content").style.left = e.x - 20 + "px";
                    }
                    document.getElementById('modal-title').textContent = e.target.getAttribute('name')
                }
            })
            // save map in sessionStorage
            sessionStorage.setItem(data.id, data.svg)
        } else {
            document.getElementById('svgContainer').innerHTML = '<div class="not-map">Map Not Found!</div>'
        }
    }

    onChangeCountry(data) {
        console.log('onChangeCountry:', data)
        const countries = document.getElementsByClassName('country')
        const selectedCountry = document.getElementById('button-center-country').value
        for (let i = 0; i < countries.length; i++) {            
            if (countries[i].textContent==selectedCountry) {
                switch (data) {
                    case 'next':
                        if (i==(countries.length-1)) {
                            this.onSelectCountry(countries[0])
                        } else {
                            this.onSelectCountry(countries[i+1])
                        }                        
                        break;
                
                    case 'back':
                        if (i==0) {
                            this.onSelectCountry(countries[countries.length-1])
                        } else {
                            this.onSelectCountry(countries[i-1])
                        }
                        break;
                    default:
                        break;
                }
                break;
            }
            
        }
    }

    onSelectNode(id) {
        console.log('onSelectNode:', id)
        this.reply(this.config.accessKey, this.config.peer, {
            subject: 'node',
            id: id
        })
    }

    onSelectNodeSuccess(data) {
        console.log('onSelectNodeSuccess...')
        this.setNodeDetails(data.body)
    }

    onLoadStatistics(data) {
        this.setStatistics(data)
    }

    onContactUs(data) {
        console.log('onContactUs:', data.fName, data.lName, data.country, data.subject)
    }

    onReply(data) {
        switch (data.body.subject) {
            case 'services':
                this.onLoadServices(data)
                break;
            case 'statistics':
                this.onLoadStatistics(data.body)
                break;
            case 'search-services':
                this.onSearchServiceResponse(data)
                break;
            case 'select-country':
                this.onSelectCountrySuccess(data.body)
                break;
            case 'node':
                this.onSelectNodeSuccess(data)
                break;

            default:
                break;
        }
    }

    onLogout() {
        location.reload();
    }

    /*
       -----------------  DOM get data -----------------
    */
    // return data from login fields
    getLogin() {
        return { accessKey: document.getElementById('access-Key').value, password: document.getElementById('password').value }
    }
    // return accessKey field
    getAccessKey() {
        return { accessKey: document.getElementById('access-Key').value }
    }
    // return the value of search services for filter
    getSearchService() {
        return { serviceName: document.getElementById('service-name').value }
    }
    // return selected region
    getSelectedRegion() {
        return { regionId: document.getElementById('region-selected').value }
    }
    //set statistics
    setStatistics(data) {
        document.getElementById('user-average').textContent = data.avgUsers + '%'
        document.getElementById('average-trafic').textContent = data.avgTraffic + '%'
        document.getElementById('number-netkworks').textContent = data.totalNetworks
        document.getElementById('bussy-networks').textContent = data.bussyNetworks
    }
    // set Node Details on Modal
    setNodeDetails(data) {
        document.querySelector('.modal-body').style.display = "block";
        document.querySelector('.modal-body-loading').style.display = "none";
        document.getElementById('user-average-modal').textContent = data.avgUsers + '%'
        document.getElementById('average-trafic-modal').textContent = data.avgTraffic + '%'
        document.getElementById('number-netkworks-modal').textContent = data.totalNetworks
    }
}
