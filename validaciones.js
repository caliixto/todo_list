'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const formularioRegistro = document.querySelector(".formulario");
  const formularioLogin = document.querySelector(".formulario_v2");

  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", validarRegistro);
  }

  if (formularioLogin) {
    formularioLogin.addEventListener("submit", validarLogin);
  }
});

function validarRegistro(e) {
  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const confirmar = document.getElementById("confirmar").value;

  // Validaciones
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    alert("El nombre solo debe contener letras.");
    e.preventDefault(); return;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos)) {
    alert("Los apellidos solo deben contener letras.");
    e.preventDefault(); return;
  }

  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    alert("Correo electrónico no válido.");
    e.preventDefault(); return;
  }

  if (!/^[a-zA-Z0-9]{4,}$/.test(usuario)) {
    alert("El usuario debe tener al menos 4 caracteres, solo letras y números.");
    e.preventDefault(); return;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(contrasena)) {
    alert("La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.");
    e.preventDefault(); return;
  }

  if (contrasena !== confirmar) {
    alert("Las contraseñas no coinciden.");
    e.preventDefault(); return;
  }

  // Si llega aquí, todo está bien (no se necesita e.target.submit() porque no se canceló)
}

function validarLogin(e) {
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  if (!/^[a-zA-Z0-9]{4,}$/.test(usuario)) {
    alert("Usuario no válido. Debe tener al menos 4 caracteres.");
    e.preventDefault(); return;
  }

  if (!contrasena || contrasena.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    e.preventDefault(); return;
  }

  // Aquí también se podría comprobar usuario/contraseña desde localStorage si quisieras
}
