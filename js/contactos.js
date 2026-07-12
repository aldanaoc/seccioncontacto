// js mapas
var map = L.map('map').setView([51.505, -0.09], 13);
// aññadir un marcador (?
var marker = L.marker([51.5, -0.09]).addTo(map);




// arrancamos con lo del formulario
const formulario = document.getElementById("formulario");
const formMessage = document.getElementById("form-message"); // mensaje del form
// otro asunto
const asuntoSelect = document.getElementById("asunto");
const otroAsuntoInput = document.getElementById("otro-asunto");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validadores = { // teléfono opcional. se puede modificar
    nombre: (valor) => {
        if (!valor.trim()) return "Ingrese su nombre";
        if (valor.trim().length < 2) return "El nombre debe tener al menos 2 carácteres";
        return "";
    },
 
    apellido: (valor) => {
        if (!valor.trim()) return "Ingrese su apellido";
        if (valor.trim().length < 2) return "El apellido debe tener al menos 2 carácteres";
        return "";
    },
 
    email: (valor) => {
        if (!valor.trim())
            return "Ingrese su e-mail";
        if (!valor.includes("@")) {
            return "El e-mail debe contener un @."; }
        if (!emailRegex.test(valor.trim()))
            return "E-mail inválido";
        return "";
    },
 
    asunto: (valor) => {
        if (!valor) return "Seleccione un motivo de consulta";
        return ""; // ya no valida el texto de "otro" acá
    },

    "otro-asunto": (valor) => {
        // solo exige contenido si el select está en "otro"
        if (asuntoSelect.value !== "otro") return "";
        
        const texto = valor.trim();
        if (!texto) return "Escriba el motivo de consulta";
        if (texto.length < 10) return "El motivo debe tener al menos 10 caracteres";
        return "";
    },
 
    mensaje: (valor) => {
        if (!valor.trim()) return "Ingrese su mensaje";
        if (valor.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres";
        return "";
    }
};
function mostrarError(idCampo, mensaje) {
    const spanError = document.getElementById(`${idCampo}-error`);
    const input = document.getElementById(idCampo);
 
    if (spanError && input) {
        spanError.textContent = mensaje;
        input.style.borderColor = "#EF4444";
    }
}
function limpiarError(idCampo) {
    const spanError = document.getElementById(`${idCampo}-error`);
    const input = document.getElementById(idCampo);
 
    if (spanError && input) {
        spanError.textContent = "";
        input.style.borderColor = "";
    }
}
function validarCampo(fieldId, value) {
    const validator = validadores[fieldId];
    if (validator) {
        const error = validator(value);
        if (error) {
            mostrarError(fieldId, error);
            return false;
        } else {
            limpiarError(fieldId);
            return true;
        }
    }
    return true;
}
// eso de validación
Object.keys(validadores).forEach((idCampo) => {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
 
    campo.addEventListener("blur", () => {
        validarCampo(idCampo, campo.value);
    });
 
    campo.addEventListener("input", () => {
        const spanError = document.getElementById(`${idCampo}-error`);
        if (spanError && spanError.textContent) {
            validarCampo(idCampo, campo.value);
        }
    });
});

// validar form
function validarForm(datos) {
    let isValid = true;
    
    for (const [fieldId, value] of Object.entries(datos)) {
        if (validadores[fieldId]) {
            if (!validarCampo(fieldId, value)) {
                isValid = false;
            }
        }
    }
    
    return isValid;
}
// mensaje, no alert
function showFormMessage(message, type) {
    formMessage.style.display = "block";
    formMessage.textContent = message;
    formMessage.className = `form_message ${type}`;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}
// asunto: otros
asuntoSelect.addEventListener("change", () => {
    if (asuntoSelect.value === "otro") {
        otroAsuntoInput.classList.add("mostrar");
    }
    else {
        otroAsuntoInput.classList.remove("mostrar");
        otroAsuntoInput.value = "";
        limpiarError("otro-asunto");
    }
});


formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
    nombre : document.getElementById("nombre").value.trim(),
    apellido : document.getElementById("apellido").value.trim(),
    email : document.getElementById("email").value.trim(),
    telefono : document.getElementById("telefono").value.trim(),
    asunto: asuntoSelect.value === "otro" 
        ? otroAsuntoInput.value.trim() 
        : asuntoSelect.value,
    "otro-asunto": otroAsuntoInput.value.trim(),
    mensaje : document.getElementById("mensaje").value.trim(),
    
    };
    // mensaje para vallidar formulario
    if (!validarForm(datos)){
        showFormMessage('Por favor, corrija los errores antes de enviar', 'error');
        return;
    }
    // Disable submit button (a modificar si es necesario)
    const submitButton = formulario.querySelector('button[type=\"submit\"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando...';
    
    try {
        // Submit form via AJAX (a modificar si es neceario)
        const response = await fetch('php/send_mail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormMessage(result.message, 'success');
            formulario.reset(); // Clear form
            
            // Clear any error messages
            ['nombre', 'apellido', 'email', 'telefono', 'asunto', 'mensaje'].forEach(limpiarError);
        } else {
            showFormMessage(result.message || 'Error al enviar el mensaje', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});