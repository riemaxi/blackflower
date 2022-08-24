/**Add avatar - Add contact View */
function mostrarImagen(event) {
  var imagenSource = event.target.result;
  var previewImage = document.getElementById('preview');

  previewImage.src = imagenSource;
}

function procesarArchivo(event) {
  var imagen = event.target.files[0];

  var lector = new FileReader();
  lector.addEventListener('load', mostrarImagen, false);

  lector.readAsDataURL(imagen);
}

document.getElementById('archivo')
  .addEventListener('change', procesarArchivo, false)


/**Add avatar - My Profile (Personal) View */

/*Personal avatar */
function mostrarImagenAvatarPer(event) {
  var imagenSource = event.target.result;
  var previewImage = document.getElementById('preview-profile');

  previewImage.src = imagenSource;
}

function procesarArchivoPer(event) {
  var imagenProfile = event.target.files[0];

  var lector = new FileReader();
  lector.addEventListener('load', mostrarImagenAvatarPer, false);

  lector.readAsDataURL(imagenProfile);
}

document.getElementById('archivo-profile')
  .addEventListener('change', procesarArchivoPer, false)

/*Profesional avatar */

function mostrarImagenPro(event) {
  var imagenSource = event.target.result;
  var previewImage = document.getElementById('preview-profile1');

  previewImage.src = imagenSource;
}

function procesarArchivoPro(event) {
  var imagenProfile1 = event.target.files[0];

  var lector = new FileReader();
  lector.addEventListener('load', mostrarImagenPro, false);

  lector.readAsDataURL(imagenProfile1);
}

document.getElementById('archivo-profile1')
  .addEventListener('change', procesarArchivoPro, false)

