// arrancamos con lo del formulario
function mensajeUsuario() {
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let email =document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    let asunto = document.getElementById("asunto").value;
    let mensaje = document.getElementById("mensaje").value;
        if (nombre === "" || apellido === "" || email === "" || telefono === "" || asunto === "" || mensaje === "") {
            alert("Complete todos los campos, por favor.");
            return;
        }
    // usamos php para usar lo de abajo
    let datosUsuario = {nombre: nombre,
        apellido: apellido,
        email: email,
        telefono: telefono,
        asunto: asunto,
        mensaje: mensaje
    };
    alert("¡Consulta enviada! En un momente nos contactamos con vos.");
    document.querySelector("form").reset();
}