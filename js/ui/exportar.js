// ============================================
// MÓDULO DE EXPORTACIÓN - RF04
// Exporta las tareas visibles en pantalla a JSON
// ============================================

const procesarTareasParaExportar = (tareas) => {
    return tareas.map(tarea => ({
        id: tarea.id,
        documento_usuario: tarea.documento_usuario,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: tarea.estado || "pendiente"
    }));
};

export const exportarTareasJSON = (tareas) => {
    if (!tareas || tareas.length === 0) return false;

    const datos = procesarTareasParaExportar(tareas);
    const json = JSON.stringify(datos, null, 2);

    const enlace = document.createElement("a");
    enlace.href = "data:application/json;charset=utf-8," + encodeURIComponent(json);
    enlace.download = "tareas.json";
    enlace.click();

    return true;
};