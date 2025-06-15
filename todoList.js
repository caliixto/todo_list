'use strict';

document.addEventListener("DOMContentLoaded", () => {
  mostrarNombreUsuario();
  mostrarDiaSemana();
  obtenerUbicacion();
  cargarTareas();
  establecerFechaMinima();
  inicializarModoOscuro();

  document.getElementById("cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("usuario-nombre");
  window.location.href = "inicio_sesion.html";
});

});

// ------------------------
// Funciones Generales
// ------------------------

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
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const respuesta = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await respuesta.json();
        console.log(data);
        const direccion = data.address;
        const ciudad = direccion.city || direccion.town || direccion.village || direccion.hamlet || direccion.state || "No disponible";
        document.getElementById("ciudad").textContent = ciudad;
      } catch {
        document.getElementById("ciudad").textContent = "No disponible";
      }
    }, () => {
      document.getElementById("ciudad").textContent = "Ubicación denegada";
    });
  } else {
    document.getElementById("ciudad").textContent = "Geolocalización no soportada";
  }
}

function establecerFechaMinima() {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("seleccion-calendario").setAttribute("min", hoy);
}

// ------------------------
// TODO List
// ------------------------

function agregarTarea() {
  const input = document.getElementById("nueva-tarea");
  const tareaTexto = input.value.trim();
  const fecha = document.getElementById("seleccion-calendario").value;

  if (!tareaTexto) {
    alert("Escribe una tarea antes de agregar.");
    return;
  }

  if (!fecha) {
    alert("Selecciona una fecha válida antes de agregar la tarea.");
    return;
  }

  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  const tareasGuardadas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  const nuevaTarea = { texto: tareaTexto, fecha: fecha };
  tareasGuardadas.push(nuevaTarea);
  localStorage.setItem(claveTareas, JSON.stringify(tareasGuardadas));

  input.value = "";
  cargarTareas(); // recargar lista agrupada
}

function cargarTareas() {
  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  const tareas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  tareas.forEach((tarea, index) => {
    const li = document.createElement("li");
    const fechaTarea = new Date(tarea.fecha);
    fechaTarea.setHours(0, 0, 0, 0);

    const diferencia = (fechaTarea - hoy) / (1000 * 60 * 60 * 24);

    if (diferencia < 0) li.classList.add("pasada");
    else if (diferencia === 0) li.classList.add("hoy");
    else if (diferencia === 1) li.classList.add("maniana");
    else li.classList.add("futura");

    li.textContent = `${tarea.texto} (${tarea.fecha})`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "X";
    btnEliminar.onclick = () => eliminarTarea(index);
    li.appendChild(btnEliminar);

    lista.appendChild(li);
  });
}


function eliminarTarea(index) {
  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  const tareas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  tareas.splice(index, 1);
  localStorage.setItem(claveTareas, JSON.stringify(tareas));
  cargarTareas();
}


// ------------------------
// Utilidades
// ------------------------

function agruparPorFecha(tareas) {
  return tareas.reduce((acc, tarea) => {
    if (!acc[tarea.fecha]) acc[tarea.fecha] = [];
    acc[tarea.fecha].push(tarea);
    return acc;
  }, {});
}

function getEtiquetaFecha(fecha) {
  const hoy = new Date();
  const fechaTarea = new Date(fecha);
  const diff = (fechaTarea - hoy) / (1000 * 60 * 60 * 24);
  const dias = Math.floor(diff);

  if (dias < 0) return `📅 ${fecha} (Pasada)`;
  if (dias === 0) return "📅 Hoy";
  if (dias === 1) return "📅 Mañana";
  return `📅 ${fecha}`;
}

function getClaseFecha(fecha) {
  const hoy = new Date();
  const fechaTarea = new Date(fecha);
  const diff = (fechaTarea - hoy) / (1000 * 60 * 60 * 24);
  const dias = Math.floor(diff);

  if (dias < 0) return "pasada";
  if (dias === 0) return "hoy";
  if (dias === 1) return "maniana";
  return "futura";
}


function inicializarModoOscuro() {
  const boton = document.getElementById("toggle-darkmode");
  const body = document.body;

  // Si ya hay preferencia guardada
  if (localStorage.getItem("modo-oscuro") === "true") {
    body.classList.add("darkmode");
    boton.textContent = "☀️ Modo Claro";
  }

  boton.addEventListener("click", () => {
    const oscuro = body.classList.toggle("darkmode");
    boton.textContent = oscuro ? "☀️" : "🌙 ";
    localStorage.setItem("modo-oscuro", oscuro);
  });
}