'use strict'


window.addEventListener('load', ()=>{
 
function Registro(){

  const formulario = document.querySelector(".formulario");

   if (!formulario) return;

  formulario.addEventListener("submit", function(event){
     event.preventDefault();

   const nombre = document.getElementById("nombre").value;
   const apellidos = document.getElementById("apellidos").value;
   const email= document.getElementById("email").value;
   const usuario = document.getElementById('usuario').value;
   const contra= document.getElementById("contrasena").value;
   const confirmar = document.getElementById("confirmar").value;


   if(contra !== confirmar){
    alert("Las contraseñas no coinciden");
    return;
   }

   const nuevoUsuario = {
    nombre,
    apellidos,
    email,
    usuario,
    contra,
    confirmar
   };

   // Guardamos  el nombre de usuarios como clave
  localStorage.setItem(usuario, JSON.stringify(nuevoUsuario));

  alert("Usuario registrado correctamente");

  window.location.href = "inicio_sesion.html";



formulario.reset();

  })


   
};

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
    return;
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



