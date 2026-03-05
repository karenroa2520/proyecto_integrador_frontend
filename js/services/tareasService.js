// ============================================
// MÓDULO DE EXPORTACIÓN - RF04
// RECIBE LAS TAREAS MAPEA LA INFORMACION Y RETORNA ESTA INFORMACION PARA LUEGO EXPORTARLA
// ============================================

export const procesarTareasParaExportar = (tareas) => {
    return tareas.map(tarea => ({
        id: tarea.id,
        documento_usuario: tarea.documento_usuario,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: tarea.estado || "pendiente"
    }));
};

// ============================================
// MÓDULO DE ORDENAMIENTO - RF02
// Ordenar por: fecha de creación, nombre, estado
// ============================================

export const ordenarTareas = (tareas, criterio) => {
    const copia = tareas.slice();

    if (criterio === "nombre") {
        copia.sort((a, b) => {
            const tituloA = (a.titulo || "").toLowerCase();
            const tituloB = (b.titulo || "").toLowerCase();
            if (tituloA < tituloB) return -1;
            if (tituloA > tituloB) return 1;
            return 0;
        });
    }

    if (criterio === "estado") {
        const orden = { "pendiente": 0, "en proceso": 1, "completada": 2 };
        copia.sort((a, b) => {
            const estadoA = orden[a.estado] !== undefined ? orden[a.estado] : 99;
            const estadoB = orden[b.estado] !== undefined ? orden[b.estado] : 99;
            return estadoA - estadoB;
        });
    }

    if (criterio === "fecha") {
        copia.sort((a, b) => {
            const fechaA = a.created_at ? new Date(a.created_at) : new Date(0);
            const fechaB = b.created_at ? new Date(b.created_at) : new Date(0);
            return fechaA - fechaB;
        });
    }

    return copia;
};

export const inicializarOrdenamiento = (contenedor, obtenerTareas, renderizar) => {
    const selectOrden = document.getElementById("selectOrden");
    if (!selectOrden) return;

    selectOrden.addEventListener("change", () => {
        const criterio = selectOrden.value;
        const tareas = obtenerTareas();
        const tareasOrdenadas = criterio ? ordenarTareas(tareas, criterio) : tareas;
        renderizar(contenedor, tareasOrdenadas);
    });
};