// 1. SISTEMA DE TOAST (Reemplazo de Alerts)
function showToast(msj) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msj;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// 2. APERTURA CINEMATOGRÁFICA
document.getElementById('btn-abrir').addEventListener('click', function() {
    const btn = this;
    const portada = document.getElementById('portada');
    const flash = document.getElementById('flash-dorado');
    const contenido = document.getElementById('contenido-principal');
    const contMariposas = document.getElementById('contenedor-mariposas');
    
    // Capturamos el audio y lo reproducimos al instante del clic
    const musica = document.getElementById('musica-fondo');
    if(musica) {
        musica.play().catch(e => console.log("Audio en espera de interacción", e));
    }
    
    btn.classList.add('presionado');
    
    setTimeout(() => {
        portada.style.transform = 'scale(1.05)';
        portada.style.opacity = '0';
        flash.style.opacity = '1'; 
        
        setTimeout(() => {
            portada.style.display = 'none';
            flash.style.opacity = '0';
            contenido.style.display = 'block';
            document.body.classList.remove('bloqueado');
            
            // Forzar scroll al inicio exacto para evitar saltos
            window.scrollTo(0, 0);
            
            void contenido.offsetWidth; // Reflow
            contenido.classList.add('abierto');
            contMariposas.classList.add('activado');
        }, 800);
    }, 250);
});

// 3. LÓGICA CORE Y CONTADORES
document.addEventListener('DOMContentLoaded', function() {
    
    // Nombre de URL
    const params = new URLSearchParams(window.location.search);
    const nombreInv = params.get('invitado');
    let nombreFamiliaVal = "Nuestros Invitados";
    if (nombreInv) {
        nombreFamiliaVal = nombreInv.replace(/_/g, ' ');
        document.getElementById('saludo-familia').textContent = nombreFamiliaVal;
    }

    // Actualización de contadores con microinteracción
    function updateNumber(id, val) {
        const el = document.getElementById(id);
        if (el.innerText !== val) {
            el.innerText = val;
            el.classList.remove('num-flip');
            void el.offsetWidth;
            el.classList.add('num-flip');
        }
    }

    // Fechas actualizadas: 22 de Agosto (Evento) y 14 de Agosto (RSVP)
    const fEv = new Date("August 22, 2026 17:00:00").getTime();
    const fRs = new Date("August 14, 2026 23:59:59").getTime();
    
    setInterval(function() {
        const now = new Date().getTime();
        
        // Evento principal
        const dEv = fEv - now;
        if (dEv >= 0) {
            updateNumber("dias", Math.floor(dEv / 86400000).toString().padStart(2, '0'));
            updateNumber("horas", Math.floor((dEv % 86400000) / 3600000).toString().padStart(2, '0'));
            updateNumber("minutos", Math.floor((dEv % 3600000) / 60000).toString().padStart(2, '0'));
            updateNumber("segundos", Math.floor((dEv % 60000) / 1000).toString().padStart(2, '0'));
        }
        
        // RSVP
        const dRs = fRs - now;
        if (dRs >= 0) {
            updateNumber("r-dias", Math.floor(dRs / 86400000).toString().padStart(2, '0'));
            updateNumber("r-horas", Math.floor((dRs % 86400000) / 3600000).toString().padStart(2, '0'));
            updateNumber("r-minutos", Math.floor((dRs % 3600000) / 60000).toString().padStart(2, '0'));
            updateNumber("r-segundos", Math.floor((dRs % 60000) / 1000).toString().padStart(2, '0'));
        }
    }, 1000);

    // 4. ANIMACIONES SCROLL CONTINUAS
    const scrollObs = new IntersectionObserver((e) => {
        e.forEach((en) => { if(en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.1 }); 
    document.querySelectorAll('.animar-up, .animar-zoom, .animar-fade, .animar-side, .linea-ornamental').forEach(el => scrollObs.observe(el));

    // 5. VALIDACIÓN FORMULARIO Y WHATSAPP UX
    document.getElementById('form-rsvp').addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const i1 = document.getElementById('nombre1');
        const i2 = document.getElementById('nombre2');
        let valid = true;

        [i1, i2].forEach(input => {
            if(!input.value.trim()) {
                input.classList.add('error');
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });

        if(!valid) return;

        const p1 = i1.value.trim();
        const p2 = i2.value.trim();
        
        // Mensaje con el número solicitado
        const msj = `¡Hola! Damaris con mucha alegría confirmamos nuestra asistencia a tus XV Años.%0A%0A✨ *Asistirán:* ${p1} y ${p2}.%0A%0A¡Nos vemos pronto!`;
        
        showToast('Preparando mensaje...');
        setTimeout(() => {
            window.open(`https://wa.me/593959839850?text=${msj}`, '_blank');
            this.reset();
        }, 1000);
    });

    // Quitar error on input
    document.querySelectorAll('.form-input').forEach(inp => {
        inp.addEventListener('input', function() { this.classList.remove('error'); });
    });
});

// 6. LIGHTBOX CINE (Para ampliar las fotos de la galería estática)
function abrirLightbox(el) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = el.querySelector('img').src;
    lb.style.display = 'flex';
    setTimeout(() => lb.classList.add('mostrar'), 10);
}

function cerrarLightbox() { 
    const lb = document.getElementById('lightbox');
    lb.classList.remove('mostrar');
    setTimeout(() => lb.style.display = 'none', 400);
}

// 7. COPIAR CUENTA
function copiarCuenta() {
    navigator.clipboard.writeText(document.getElementById('num-cuenta').innerText)
    .then(() => { showToast("✓ Número de cuenta copiado"); })
    .catch(() => { showToast("Error al copiar"); });
}
