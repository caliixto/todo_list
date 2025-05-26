'use strict';

document.addEventListener("DOMContentLoaded", () => {
  mostrarNombreUsuario();
  mostrarDiaSemana();
  obtenerUbicacion();
  cargarTareas();
  establecerFechaMinima();
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
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = ""; // limpiar

  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  const tareas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  const agrupadas = agruparPorFecha(tareas);

  Object.keys(agrupadas).sort().forEach(fecha => {
    const fechaTitulo = document.createElement("h3");
    fechaTitulo.textContent = getEtiquetaFecha(fecha);
    lista.appendChild(fechaTitulo);

    agrupadas[fecha].forEach(tarea => {
      const li = document.createElement("li");
      li.classList.add(getClaseFecha(fecha));
      li.textContent = tarea.texto;

      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.onclick = () => {
        eliminarTarea(tarea);
        cargarTareas();
      };

      li.appendChild(btn);
      lista.appendChild(li);
    });
  });
}

function eliminarTarea(tareaAEliminar) {
  const usuario = localStorage.getItem("usuario-nombre");
  const claveTareas = `tareas_${usuario}`;
  let tareas = JSON.parse(localStorage.getItem(claveTareas)) || [];

  tareas = tareas.filter(t => !(t.texto === tareaAEliminar.texto && t.fecha === tareaAEliminar.fecha));
  localStorage.setItem(claveTareas, JSON.stringify(tareas));
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
