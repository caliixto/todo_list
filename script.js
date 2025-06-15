'use strict'


window.addEventListener('load', ()=>{
 
function Registro() {
  const formulario = document.querySelector(".formulario");
  if (!formulario) return;

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const email = document.getElementById("email").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const contra = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar").value;

    // 🧪 Validaciones con regex
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
      alert("El nombre solo debe contener letras");
      return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellidos)) {
      alert("Los apellidos solo deben contener letras");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Correo electrónico no válido");
      return;
    }

    if (!/^[a-zA-Z0-9_]{4,16}$/.test(usuario)) {
      alert("El nombre de usuario debe tener entre 4 y 16 caracteres alfanuméricos");
      return;
    }

    if (contra.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (contra !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoUsuario = {
      nombre,
      apellidos,
      email,
      usuario,
      contra
    };

    if (localStorage.getItem(usuario)) {
    alert("El nombre de usuario ya está registrado. Elige otro.");
    return;
    }


    localStorage.setItem(usuario, JSON.stringify(nuevoUsuario));
    alert("Usuario registrado correctamente");
    formulario.reset();
    window.location.href = "inicio_sesion.html";
  });
}


function Inicio_Sesion(){

   const formulario_v2 = document.querySelector(".formulario_v2");


   if (!formulario_v2) return;

  formulario_v2.addEventListener("submit", function(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const contra = document.getElementById("contrasena").value;

  // Buscar el usuario en localStorage
  const datosGuardados = localStorage.getItem(usuario);

  if (!datosGuardados) {
    alert("Usuario no encontrado");
    window.location.href = "registro.html";
  }


  const usuarioObj = JSON.parse(datosGuardados);

  if (usuarioObj.contra !== contra) {
    alert("Contraseña incorrecta");
    return;
  }

 localStorage.setItem("usuario-nombre", usuario);


  alert(`Bienvenido, ${usuarioObj.nombre}`);

 
  window.location.href = "todoList.html";

});

}

Registro();
Inicio_Sesion();

})



