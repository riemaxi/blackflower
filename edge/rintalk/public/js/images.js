/**Add avatar - Add contact View */
function mostrarImagenChat(event) {
    /* var imagenSource = event.target.result;
    var previewImage = document.getElementById('preview');
  
    previewImage.src = imagenSource; */
    socket.emit(“sendImage”, { base64: e.target.result });
  }
  
  function procesarImgChat(event) {
    var imagen = event.target.files[0];
  
    var lector = new FileReader();
    lector.addEventListener('load', mostrarImagenChat, false);
  
    lector.readAsDataURL(imagen);
  }
  
  document.getElementById('archivo-addimg')
    .addEventListener('change', procesarImgChat, false)
  
//----------------------------------------------------------------

// The client recevie the data from the server
socket.on(‘Server - sent - data’, function (data) {
    $(‘#show - message’).append(‘<p>’ + data + ‘</p>’);
});

// The client send data to the server
$(document).ready(function () {
    $(‘#send’).on(‘click’, function () {
        var message = $(‘#message’).val();
        socket.emit(“Client - sent - data”, message);
        $(‘#message’).val(”);
        document.getElementById(“message”).focus();
    })

})

// Handle image
window.onload = function () {
    document.getElementById(“file”).addEventListener(“change”, function () {
        submitImage();
    });
};

function submitImage() {
    var selector = document.getElementById(“file”);
    var img = document.getElementById(“preview”);

    var reader = new FileReader();
    reader.onload = function (e) {
        // img.src = e.target.result;
        // client send
        socket.emit(“sendImage”, { base64: e.target.result });
    }
    reader.readAsDataURL(selector.files[0]);
}