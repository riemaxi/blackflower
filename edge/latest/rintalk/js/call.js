import { config } from "../config.js";

export class ICall {
  constructor() {
    console.log("ICall constructor");

    window.ringtone = document.getElementById("calling-audio");
    window.ringtone.load();
    window.endtone = document.getElementById("end-audio");
    window.endtone.load();
    window.bussy = false;  
  }

  onICallEvent(e, ctx) {
    switch (e.type) {
      case "click":
        switch (e.target.id) {
          case "micro-calling-btn":
            console.log("call, ...go to action: ", e.target.id);
            window.reciveMicro = !window.reciveMicro
            this.muteUnmute();
            break;
          case "video-calling-btn":
            console.log("call, ...go to action: ", e.target.id);
            window.reciveVideo = !window.reciveVideo;
            this.playStop();
            break;
          case "micro-reciving-call-btn":
            console.log("call, ...go to action: ", e.target.id);
            window.reciveMicro = !window.reciveMicro
            if (window.reciveMicro) {
              this.setEnableAudioIcon();
            } else {
              this.setDisableAudioIcon();
            }
            break;
          case "video-reciving-call-btn":
            console.log("call, ...go to action: ", e.target.id);
            window.reciveVideo = !window.reciveVideo;
            if (window.reciveVideo) {
              this.setEnableVideoIcon();
            } else {
              this.setDisableVideoIcon();
            }
            break;  
          case "micro-active-vidcall":
            console.log("call, ...go to action: ", e.target.id);
            this.muteUnmute();
            break;
          case "video-active-vidcall":
            console.log("call, ...go to action: ", e.target.id);
            this.playStop();
            window.connection.send({
              remoteVideo: window.localStream.getVideoTracks()[0].enabled                        
            });
            break;
          case "end-active-vidcall":
            console.log("call, ...go to action: ", e.target.id);
            window.connection.close();
            break;
          default:
            break;
        }

      default:
        break;
    }
  }

  call(id, ctx, activeVideo) {
    window.reciveVideo = activeVideo;
    window.reciveMicro = true;
    this.setEnableAudioIcon();  
    if (!activeVideo) {      
      this.setDisableVideoIcon();
    } else {
      this.setEnableVideoIcon();
    }
    if (id == config.accessKey) {
      /* alert("You can't call yourself."); */
      console.log("You can't call yourself.");
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          window.localStream = stream;
          document.getElementById("localVideo").srcObject = window.localStream;
          console.log('ACTIVE VIDEO: ', activeVideo);
          if (!activeVideo) {
            window.localStream.getVideoTracks()[0].enabled = false;
            document.getElementById('localVideo').style.visibility= 'hidden';
            document.getElementById('my-avatar-videocall-recive').style.visibility= '';
          } else {
            document.getElementById('localVideo').style.visibility= '';
            document.getElementById('my-avatar-videocall-recive').style.visibility= 'hidden';
          }
          
          window.bussy = true;
          window.connection = window.peer.connect(id);

          window.connection.on('open', function() {
            // Receive messages
            window.connection.send({
              remoteVideo: window.reciveVideo                        
            });

            window.connection.on('data', (data) => {
              console.log('Received: ', data.remoteVideo);
              switch (data.remoteVideo) {
                case false:
                  document.getElementById('img-videocall-recive').style.visibility= '';
                  document.getElementById('remoteVideo').style.visibility= 'hidden';
                  break;
                case true:
                  document.getElementById('remoteVideo').style.visibility= '';
                document.getElementById('img-videocall-recive').style.visibility= 'hidden';
                  break;
                default:
                  break;
              }     
            });
          });

          window.call = window.peer.call(id, window.localStream); // A

          this.callTone();
          
          ctx.initCall();
          
        })
        .catch((err) => {
          console.log("You got an error:" + err);          
          ctx.goContactsScreen();
          if (window.connection!=undefined) {
            window.connection.close();
          }
          
        });
    }
  }

  playRingTone() {
    window.ringtone.load();
    window.ringtone.play();
  }

  stopRingTone() {
    window.ringtone.pause();
  }

  playEndTone() {
    window.endtone.load();
    window.endtone.play();
  }

  //-----    ------    -----------------

  muteUnmute() {
    const enabled = window.localStream.getAudioTracks()[0].enabled;
    if (enabled) {
      window.localStream.getAudioTracks()[0].enabled = false;
      this.setDisableAudioIcon();
    } else {
      window.localStream.getAudioTracks()[0].enabled = true;
      this.setEnableAudioIcon();
    }
  }

  playStop() {
    let enabled = window.localStream.getVideoTracks()[0].enabled;
    if (enabled) {
      window.localStream.getVideoTracks()[0].enabled = false;
      document.getElementById('my-avatar-videocall-recive').style.visibility= '';
      document.getElementById('localVideo').style.visibility= 'hidden';       
      this.setDisableVideoIcon();
    } else {      
      window.localStream.getVideoTracks()[0].enabled = true;
      document.getElementById('localVideo').style.visibility= '';
      document.getElementById('my-avatar-videocall-recive').style.visibility= 'hidden';      
      this.setEnableVideoIcon();
    }
  }

  callTone(){
    window.calltone = setInterval(this.callingToneInterval, 3500);
  }

  callingToneInterval() {
    document.getElementById('caller-audio').load();
    document.getElementById('caller-audio').play();
  }

  callTime(){
    window.minutescalling = 0;
    window.secondscalling = 0;
    window.calltime = setInterval(this.callingTimeInterval, 1000);
  }

  callingTimeInterval() {    
    window.secondscalling++;
    if (window.secondscalling==60) {
      window.minutescalling++;
      window.secondscalling = 0
    }
    let seconds = ('0' + window.secondscalling).split('').reverse().splice(0, 2).reverse().join('');
    let minutes = ('0' + window.minutescalling).split('').reverse().splice(0, 2).reverse().join('');    
    let hour = minutes + ':' + seconds;
    document.getElementById('call-time-active-video').textContent = hour;
  }

  setDisableAudioIcon(){
    document.getElementById('micro-active-call').src= 'images/microfono-off.svg';
    document.getElementById('micro-calling-btn').src= 'images/microfono-off.svg';
    document.getElementById('micro-reciving-call-btn').src= 'images/microfono-off.svg';
    document.getElementById('micro-active-vidcall').src= 'images/microfono-off.svg';
  }

  setEnableAudioIcon(){
    document.getElementById('micro-active-call').src= 'images/microfono.svg';
    document.getElementById('micro-calling-btn').src= 'images/microfono.svg';
    document.getElementById('micro-reciving-call-btn').src= 'images/microfono.svg';
    document.getElementById('micro-active-vidcall').src= 'images/microfono.svg';
  }

  setDisableVideoIcon(){
    document.getElementById('video-active-call').src= 'images/videocall-off.svg';
    document.getElementById('video-calling-btn').src= 'images/videocall-off.svg';
    document.getElementById('video-reciving-call-btn').src= 'images/videocall-off.svg';
    document.getElementById('video-active-vidcall').src= 'images/videocall-off.svg';

    document.getElementById('turn-active-vidcall').style.visibility = 'hidden';
  }

  setEnableVideoIcon(){
    document.getElementById('video-active-call').src= 'images/video-call.svg';
    document.getElementById('video-calling-btn').src= 'images/video-call.svg';
    document.getElementById('video-reciving-call-btn').src= 'images/video-call.svg';
    document.getElementById('video-active-vidcall').src= 'images/video-call.svg';

    document.getElementById('turn-active-vidcall').style.visibility = '';
  }
  
}
