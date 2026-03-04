// ============================================
// MÓDULO DE NOTIFICACIONES - RF03
// Independiente, reutilizable, sin depender de API
// ============================================

let contenedorNotificaciones = null;

const inicializarContenedor = () => {
    if (contenedorNotificaciones) return;

    contenedorNotificaciones = document.createElement("div");
    contenedorNotificaciones.classList.add("notificacionesContenedor");
    document.body.append(contenedorNotificaciones);
};

const crearNotificacion = (mensaje, tipo) => {
    inicializarContenedor();

    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion", "notificacion--" + tipo);

    const texto = document.createElement("span");
    texto.textContent = mensaje;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("notificacion__cerrar");
    btnCerrar.textContent = "x";
    btnCerrar.addEventListener("click", () => notificacion.remove());

    notificacion.append(texto, btnCerrar);
    contenedorNotificaciones.append(notificacion);

    setTimeout(() => {
        if (notificacion.parentElement) notificacion.remove();
    }, 4000);
};

export const notificarExito = (mensaje) => crearNotificacion(mensaje, "exito");
export const notificarError = (mensaje) => crearNotificacion(mensaje, "error");
export const notificarInfo = (mensaje) => crearNotificacion(mensaje, "info");