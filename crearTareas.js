// ============================================
// SCRIPT PARA FORMULARIO DE TAREAS
// ============================================

// Importaciones específicas para tareas
import { armarListaTareas, armarCardTarea } from "./js/ui/tareas.js";
import { getTareas, crearTarea, actualizarTarea, eliminarTarea, getTareasById, getUsuarioPorDocumento } from "./js/api/index.js";

// Variables globales para tareas
let tareaEditandoId = null;

// Referencias DOM para tareas
const formTarea = document.querySelector("#formTarea");
const docTarea = document.querySelector("#docTarea");
const tituloTarea = document.querySelector("#tituloTarea");
const descripcionTarea = document.querySelector("#descripcionTarea");
const btnCrearTarea = document.querySelector("#btnCrearTarea");
const listaTareas = document.querySelector("#listaTareas");

// ============================================
// FUNCIONES AUXILIARES PARA TAREAS
// ============================================

const limpiarFormularioTarea = () => {
    formTarea.reset();
    docTarea.disabled = false;
    tareaEditandoId = null;
    btnCrearTarea.textContent = "Crear Tarea";
};

const cargarTareasEnLista = async () => {
    try {
        const tareas = await getTareas();
        listaTareas.replaceChildren();
        armarListaTareas(listaTareas, tareas);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
};

// ============================================
// EVENT LISTENERS PARA TAREAS
// ============================================

// Submit formulario tareas
formTarea.addEventListener("submit", async (e) => {
    e.preventDefault();

    const docValor = docTarea.value.trim();
    const tituloValor = tituloTarea.value.trim();
    const descValor = descripcionTarea.value.trim();

    // Limpiar errores
    docTarea.classList.remove("error");
    tituloTarea.classList.remove("error");
    descripcionTarea.classList.remove("error");

    // Validaciones básicas
    if (docValor === "") {
        docTarea.classList.add("error");
        return;
    }

    if (tituloValor === "") {
        tituloTarea.classList.add("error");
        return;
    }

    if (descValor === "") {
        descripcionTarea.classList.add("error");
        return;
    }

    // Verificar que exista el usuario
    const resultados = await getUsuarioPorDocumento(docValor);

    if (resultados.length === 0) {
        docTarea.classList.add("error");
        const msgExistente = formTarea.querySelector(".msgDocTarea");
        if (!msgExistente) {
            const msg = document.createElement("p");
            msg.classList.add("msgNoEncontrado", "msgDocTarea");
            msg.textContent = "No existe un usuario con ese documento";
            docTarea.parentElement.append(msg);
        }
        return;
    }

    // Limpiar mensaje de error si existe
    const msgAnterior = formTarea.querySelector(".msgDocTarea");
    if (msgAnterior) msgAnterior.remove();

    try {
        if (tareaEditandoId !== null) {
            // Actualizar tarea existente
            const tareaActualizada = {
                titulo: tituloValor,
                descripcion: descValor,
                documento_usuario: docValor
            };

            await actualizarTarea(tareaEditandoId, tareaActualizada);

            const cardTarea = listaTareas.querySelector(`[data-id='${tareaEditandoId}']`);
            if (cardTarea) {
                const pDoc = cardTarea.querySelector(".tareaInfo p:first-child");
                pDoc.replaceChildren();
                const strong = document.createElement('strong');
                strong.textContent = 'Documento:';
                pDoc.append(strong, ` ${docValor}`);

                cardTarea.querySelector(".tareaTitulo").textContent = tituloValor;
                cardTarea.querySelector(".tareaDescripcion").textContent = descValor;
            }

            tareaEditandoId = null;
            btnCrearTarea.textContent = "Crear Tarea";
        } else {
            // Crear nueva tarea
            const nuevaTarea = {
                documento_usuario: docValor,
                titulo: tituloValor,
                descripcion: descValor
            };

            const tareaCreada = await crearTarea(nuevaTarea);
            const cardNueva = armarCardTarea(tareaCreada);
            listaTareas.append(cardNueva);
        }

        limpiarFormularioTarea();

    } catch (error) {
        console.error("Error al guardar tarea:", error);
        alert(`Hubo un error al guardar la tarea: ${error.message}`);
    }
});

// Delegacion de eventos en lista de tareas
listaTareas.addEventListener("click", async (e) => {
    const btnEditar = e.target.closest(".btnEditarTarea");
    if (btnEditar) {
        const id = btnEditar.getAttribute("data-id");
        const card = listaTareas.querySelector(`[data-id='${id}']`);

        if (card) {
            const tituloTexto = card.querySelector(".tareaTitulo").textContent;
            const descTexto = card.querySelector(".tareaDescripcion").textContent;
            const docElemento = card.querySelector(".tareaInfo p:first-child");
            const docTexto = docElemento.textContent.replace("Documento:", "").trim();

            docTarea.value = docTexto;
            tituloTarea.value = tituloTexto;
            descripcionTarea.value = descTexto;
            docTarea.disabled = true;

            tareaEditandoId = id;
            btnCrearTarea.textContent = "Actualizar Tarea";
            formTarea.scrollIntoView({ behavior: "smooth" });
        }
    }

    const btnEliminar = e.target.closest(".btnEliminarTarea");
    if (btnEliminar) {
        const idEliminar = btnEliminar.getAttribute("data-id");
        if (confirm("¿Está seguro de eliminar esta tarea?")) {
            try {
                await eliminarTarea(idEliminar);
                const cardEliminar = listaTareas.querySelector(`[data-id='${idEliminar}']`);
                if (cardEliminar) cardEliminar.remove();
            } catch (error) {
                console.error("Error al eliminar tarea:", error);
                alert(`No se pudo eliminar la tarea: ${error.message}`);
            }
        }
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
    await cargarTareasEnLista();
});
