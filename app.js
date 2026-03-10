// app.js - VERSIÓN FINAL CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos del DOM
  const modal = document.getElementById('modalTyC');
  const aceptarBtn = document.getElementById('aceptarTyC');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const mainContent = document.getElementById('mainContent');
  const verTyCModal = document.getElementById('verTyCModal');
  const comprarBtn = document.getElementById('comprarBtn');
  const formularioSection = document.getElementById('formularioSection');
  const volverBtn = document.getElementById('volverBtn');
  
  // Elementos del selector
  const cantidadInput = document.getElementById('cantidad');
  const decrementBtn = document.getElementById('decrementBtn');
  const incrementBtn = document.getElementById('incrementBtn');
  const totalPagar = document.getElementById('totalPagar');
  const montoHidden = document.getElementById('monto_hidden');
  
  // Constantes
  const PRECIO_BOLETO = 500;
  const MIN_BOLETOS = 2;
  const MAX_BOLETOS = 1000;
  
  // Manejo de archivo
  const archivoInput = document.getElementById('comprobante');
  const archivoNombre = document.querySelector('.archivo-nombre');
  
  // ========== MODAL TÉRMINOS ==========
  const tycAceptado = localStorage.getItem('tycAceptado');
  if (!tycAceptado) {
    modal.classList.remove('hidden');
    mainContent.classList.add('hidden');
  } else {
    mainContent.classList.remove('hidden');
  }
  
  aceptarBtn.addEventListener('click', function() {
    localStorage.setItem('tycAceptado', 'true');
    modal.classList.add('hidden');
    mainContent.classList.remove('hidden');
  });
  
  closeModalBtn.addEventListener('click', function() {
    if (!localStorage.getItem('tycAceptado')) {
      alert('Debes aceptar los términos y condiciones para continuar');
    } else {
      modal.classList.add('hidden');
    }
  });
  
  if (verTyCModal) {
    verTyCModal.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.remove('hidden');
    });
  }
  
  // ========== BOTÓN COMPRAR TICKETS ==========
  if (comprarBtn) {
    comprarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      formularioSection.classList.remove('hidden');
      setTimeout(() => {
        formularioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }
  
  // ========== BOTÓN VOLVER ==========
  if (volverBtn) {
    volverBtn.addEventListener('click', function() {
      formularioSection.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // ========== SELECTOR DE CANTIDAD ==========
  function actualizarTotal() {
    let cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < MIN_BOLETOS) cantidad = MIN_BOLETOS;
    if (cantidad > MAX_BOLETOS) cantidad = MAX_BOLETOS;
    cantidadInput.value = cantidad;
    
    const total = cantidad * PRECIO_BOLETO;
    totalPagar.textContent = total.toFixed(2) + ' Bs.';
    if (montoHidden) montoHidden.value = total.toFixed(2);
    
    localStorage.setItem('cantidadSeleccionada', cantidad);
  }
  
  decrementBtn.addEventListener('click', function() {
    let valor = parseInt(cantidadInput.value, 10) || MIN_BOLETOS;
    if (valor > MIN_BOLETOS) {
      cantidadInput.value = valor - 1;
      actualizarTotal();
    }
  });
  
  incrementBtn.addEventListener('click', function() {
    let valor = parseInt(cantidadInput.value, 10) || MIN_BOLETOS;
    if (valor < MAX_BOLETOS) {
      cantidadInput.value = valor + 1;
      actualizarTotal();
    }
  });
  
  cantidadInput.addEventListener('change', actualizarTotal);
  
  const cantidadGuardada = localStorage.getItem('cantidadSeleccionada');
  if (cantidadGuardada) {
    cantidadInput.value = Math.min(MAX_BOLETOS, Math.max(MIN_BOLETOS, parseInt(cantidadGuardada, 10)));
  }
  actualizarTotal();
  
  // ========== CONTADOR REGRESIVO ==========
  const fechaSorteo = new Date(2026, 2, 9, 22, 0, 0); // 9 marzo 2026 22:00
  const diasEl = document.getElementById('dias');
  const horasEl = document.getElementById('horas');
  const minutosEl = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  
  function actualizarContador() {
    const ahora = new Date();
    const diferencia = fechaSorteo - ahora;
    if (diferencia <= 0) {
      if (diasEl) diasEl.textContent = '00';
      if (horasEl) horasEl.textContent = '00';
      if (minutosEl) minutosEl.textContent = '00';
      if (segundosEl) segundosEl.textContent = '00';
      return;
    }
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    if (diasEl) diasEl.textContent = dias.toString().padStart(2, '0');
    if (horasEl) horasEl.textContent = horas.toString().padStart(2, '0');
    if (minutosEl) minutosEl.textContent = minutos.toString().padStart(2, '0');
    if (segundosEl) segundosEl.textContent = segundos.toString().padStart(2, '0');
  }
  actualizarContador();
  setInterval(actualizarContador, 1000);
  
  // ========== MANEJO DE ARCHIVO ==========
  if (archivoInput) {
    archivoInput.addEventListener('change', function(e) {
      if (this.files && this.files.length > 0) {
        const file = this.files[0];
        archivoNombre.textContent = file.name;
        if (file.size > 10 * 1024 * 1024) {
          alert('El archivo es demasiado grande. Máximo 10 MB.');
          this.value = '';
          archivoNombre.textContent = 'Sin archivos seleccionados';
        } else if (!file.type.match(/image\/(jpeg|png)|application\/pdf/)) {
          alert('Solo se permiten archivos JPG, PNG o PDF');
          this.value = '';
          archivoNombre.textContent = 'Sin archivos seleccionados';
        }
      } else {
        archivoNombre.textContent = 'Sin archivos seleccionados';
      }
    });
  }
  
  // ========== RADIO BUTTONS CÉDULA ==========
  const cedulaV = document.getElementById('cedula1');
  const cedulaE = document.getElementById('cedula2');
  if (cedulaV && cedulaE) {
    cedulaV.addEventListener('change', function() { if (this.checked) cedulaE.checked = false; });
    cedulaE.addEventListener('change', function() { if (this.checked) cedulaV.checked = false; });
  }
  
  // ========== BARRA DE PROGRESO (simulada) ==========
  const barra = document.querySelector('.barra-llenado');
  if (barra) barra.style.width = '39%'; // 100% - 61%
  
  // ========== PREVENIR ENVÍO POR DEFECTO (Netlify lo maneja) ==========
  const form = document.getElementById('formRifa');
  if (form) {
    form.addEventListener('submit', function(e) {
      console.log('Formulario enviado a Netlify');
    });
  }
});