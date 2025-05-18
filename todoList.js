'use strict'

document.addEventListener("DOMContentLoaded", () => {
  mostrarNombreUsuario();
  mostrarDiaSemana();
  obtenerUbicacion();
  cargarTareas();
});

function mostrarNombreUsuario() {
  const usuarioLogueado = localStorage.getItem("usuario-nombre");
  if (!usuarioLogueado) {
    alert("No hay usuario logueado");
    window.location.href = "inicio_sesion.html";
    return;
  }

  const datos = JSON.parse(localStorage.getItem(usuarioLogueado));
  document.getElementById("usuario-nombre").textContent = datos.nombre;
}

function mostrarDiaSemana() {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date();
  const nombreDia = dias[hoy.getDay()];
  document.getElementById("dia-semana").textContent = nombreDia;
}

function obtenerUbicacion() {
  fetch('https://ipinfo.io/json?token=TU_TOKEN_AQUI') // <-- reemplaza TU_TOKEN_AQUI
    .then(response => response.json())
    .then(data => {
      const ciudad = data.city;
      const pais = data.country;
      document.getElementById("ciudad").textContent = `${ciudad}, ${pais}`;
    })
    .catch(error => {
      console.error("Error al obtener la ubicación:", error);
      document.getElementById("ciudad").textContent = "Ubicación no disponible";
    });


if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      const respuesta = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await respuesta.json();
      
      // Asegurarse de revisar varias opciones
      const direccion = data.address;
      const ciudad =
        direccion.city ||
        direccion.town ||
        direccion.village ||
        direccion.hamlet ||
        direccion.state ||
        "No disponible";

      document.getElementById("ciudad").textContent = ciudad;
    } catch (error) {
      console.error("Error al obtener la ciudad:", error);
      document.getElementById("ciudad").textContent = "No disponible";
    }
  }, () => {
    document.getElementById("ciudad").textContent = "Ubicación denegada";
  });
} else {
  document.getElementById("ciudad").textContent = "Geolocalización no soportada";
}



}

// ------------------------
// TODO LIST
// ------------------------

function agregarTarea() {
  const input = document.getElementById("nueva-tarea");
  const tareaTexto = input.value.trim();
  const fecha = document.getElementById("seleccion-calendario").value;

  if (!tareaTexto) return;

  const tareaItem = document.createElement("li");
  tareaItem.textContent = fecha ? `${tareaTexto} (📅 ${fecha})` : tareaTexto;

  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;

  const tareasGuardadas = JSON.parse(localStorage.getItem(claveTareas)) || [];
  tareasGuardadas.push(tareaTexto);
  localStorage.setItem(claveTareas, JSON.stringify(tareasGuardadas));

  mostrarTareaEnLista(tareaTexto);
  input.value = "";
}

function mostrarTareaEnLista(tareaTexto) {
  const lista = document.getElementById("lista-tareas");

  const li = document.createElement("li");
  li.textContent = tareaTexto;

  // Botón eliminar
  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.onclick = () => {
    eliminarTarea(tareaTexto);
    li.remove();
  };

  li.appendChild(btn);
  lista.appendChild(li);
}

function cargarTareas() {
  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  const tareasGuardadas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  tareasGuardadas.forEach(tarea => {
    mostrarTareaEnLista(tarea);
  });
}

function eliminarTarea(tareaTexto) {
  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  let tareas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  tareas = tareas.filter(t => t !== tareaTexto);
  localStorage.setItem(claveTareas, JSON.stringify(tareas));
}

