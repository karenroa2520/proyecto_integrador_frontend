// ============================================
// UI DE TAREAS
// ============================================

export const armarCardTarea = (tarea) => {
    const card = document.createElement("div");
    card.classList.add("cardTarea");
    card.setAttribute("data-id", tarea.id);

    const tareaInfo = document.createElement("div");
    tareaInfo.classList.add("tareaInfo");

    const crearParrafo = (label, valor, spanClass) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label + ":";
        p.append(strong, " ");

        if (spanClass) {
            const span = document.createElement("span");
            span.classList.add(spanClass);
            span.textContent = valor || "";
            p.append(span);
        } else {
            p.append(valor || "");
        }
        return p;
    };

    const estadoValor = tarea.estado || "pendiente";
    const spanEstado = document.createElement("span");
    spanEstado.classList.add("tareaEstado", "tareaEstado--" + estadoValor.replace(" ", "-"));
    spanEstado.textContent = estadoValor;

    const pEstado = document.createElement("p");
    const strongEstado = document.createElement("strong");
    strongEstado.textContent = "Estado:";
    pEstado.append(strongEstado, " ", spanEstado);

    tareaInfo.append(
        crearParrafo("Documento", tarea.documento_usuario),
        crearParrafo("Titulo", tarea.titulo, "tareaTitulo"),
        crearParrafo("Descripcion", tarea.descripcion, "tareaDescripcion"),
        pEstado
    );

    const tareaAcciones = document.createElement("div");
    tareaAcciones.classList.add("tareaAcciones");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "btnEditarTarea");
    btnEditar.setAttribute("data-id", tarea.id);
    btnEditar.textContent = "Editar";

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btnEliminarTarea");
    btnEliminar.setAttribute("data-id", tarea.id);
    btnEliminar.textContent = "Eliminar";

    tareaAcciones.append(btnEditar, btnEliminar);
    card.append(tareaInfo, tareaAcciones);

    return card;
};

export const armarListaTareas = (contenedor, tareas) => {
    contenedor.replaceChildren();

    if (tareas.length === 0) {
        const msg = document.createElement("p");
        msg.classList.add("msgNoTareas");
        msg.textContent = "No hay tareas para mostrar.";
        contenedor.append(msg);
        return;
    }

    const fragmento = document.createDocumentFragment();
    tareas.forEach(tarea => {
        const card = armarCardTarea(tarea);
        fragmento.append(card);
    });
    contenedor.append(fragmento);
};

// ============================================
// FILTROS - RF01
// Filtrar por: estado, usuario, combinados
// ============================================

let todasLasTareas = [];

export const guardarTareasParaFiltro = (tareas) => {
    todasLasTareas = tareas;
};

export const obtenerTodasLasTareas = () => todasLasTareas;

const aplicarFiltros = (contenedor) => {
    const filtroDocumento = document.getElementById("filtroDocumento").value.trim().toLowerCase();
    const filtroEstado = document.getElementById("filtroEstado").value;
    const filtroUsuario = document.getElementById("filtroUsuario").value.trim().toLowerCase();

    const tareasFiltradas = todasLasTareas.filter(tarea => {
        const cumpleDocumento = !filtroDocumento || (tarea.documento_usuario && tarea.documento_usuario.toLowerCase().includes(filtroDocumento));
        const cumpleEstado = !filtroEstado || (tarea.estado && tarea.estado === filtroEstado);
        const cumpleUsuario = !filtroUsuario || (tarea.documento_usuario && tarea.documento_usuario.toLowerCase().includes(filtroUsuario));
        return cumpleDocumento && cumpleEstado && cumpleUsuario;
    });

    armarListaTareas(contenedor, tareasFiltradas);
};

const limpiarFiltros = (contenedor) => {
    document.getElementById("filtroDocumento").value = "";
    document.getElementById("filtroEstado").value = "";
    document.getElementById("filtroUsuario").value = "";
    armarListaTareas(contenedor, todasLasTareas);
};

export const inicializarFiltros = (contenedor) => {
    const btnAplicar = document.getElementById("btnAplicarFiltros");
    const btnLimpiar = document.getElementById("btnLimpiarFiltros");
    const inputDocumento = document.getElementById("filtroDocumento");
    const selectEstado = document.getElementById("filtroEstado");
    const inputUsuario = document.getElementById("filtroUsuario");

    btnAplicar.addEventListener("click", () => aplicarFiltros(contenedor));
    btnLimpiar.addEventListener("click", () => limpiarFiltros(contenedor));
    inputDocumento.addEventListener("input", () => aplicarFiltros(contenedor));
    selectEstado.addEventListener("change", () => aplicarFiltros(contenedor));
    inputUsuario.addEventListener("input", () => aplicarFiltros(contenedor));
};