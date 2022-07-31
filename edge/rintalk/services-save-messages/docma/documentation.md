# DOCUMENTATION

Remember to install socket.io-client:
    npm install socket.io-client

// FILES:

- config.js :
    Network configuration:
    host: 'http://server_ip:port/'
    accessKey: 'AccessKey_of_Service'
    password: 'Password_of_AccessKey'

- index.js :
    new App() --- create new instace and initialize in console with: node index.js

- abstractapp.js :
    initialize(data)  --- conexion success, then login
    onGranted(data)  --- if login is success.
    onReply(data)  --- listen for request:

        send data with:
            reply(from, to, data){ 
                this.send('reply', {
                    from: from,         // from: Your_AccessKey - ORIGIN
                    to: to,             // to: Remote_AccessKey - DESTINATION
                    ...data             // Data you send        - DATA
                })
            }

        // Use alway this format: 'subject' and 'detail' for send data
        // Ej.:
        this.reply(config.accessKey, config.peer, {
                    subject: 'message',
                    detail: { 
                        name: "Test_Name",
                        active: true,
                        value: 50
                    }
                })
        
        // Description:
        onReply(data) {

            // SEE DATA STRUCTURE RECIVED:
            console.log(data);

            // LISTEN REQUEST IN  'data.body.subject'
            switch (data.body.subject) {  

                // RECIVE MESSAGE AND SEND IT TO DESTINATION
                case 'message':                
                    console.log(data.body);
                    this.reply(config.accessKey, data.body.detail.to, {
                        subject: 'message',
                        detail: { 
                            ...data.body.detail
                        }
                    })
                    break;

                // WAIT FOR DELIVERY CONFIRMATION AND NOTIFY TO ORIGIN
                case 'message-recived':
                    console.log(data.body);
                    this.reply(config.accessKey, data.body.detail.from, {
                        subject: 'message-recived',
                        detail: { 
                            to: data.body.detail.to,
                            time: data.body.detail.time
                            }
                    })
                    break;         

                default:
                    break;
            }
        }

- session.js : ---- DONT TOUCH ---- WARNING
    1- AbstractApp extends of Session. 
    2- Put all your methods in App and AbstractApp
    3- If you use any method of Session do it in AbstractApp, not in App.
