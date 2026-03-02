export const armarCardTarea = (tarea) => {
  const card = document.createElement('div');
  card.classList.add('cardTarea');
  card.setAttribute('data-id', tarea.id);

  const tareaInfo = document.createElement('div');
  tareaInfo.classList.add('tareaInfo');

  const crearParrafo = (label, valor, spanClass) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label + ':';
    p.append(strong, ' ');

    if (spanClass) {
      const span = document.createElement('span');
      span.classList.add(spanClass);
      span.textContent = valor || '';
      p.append(span);
    } else {
      p.append(valor || '');
    }
    return p;
  };

  tareaInfo.append(
    crearParrafo('Documento', tarea.documento_usuario),
    crearParrafo('Titulo', tarea.titulo, 'tareaTitulo'),
    crearParrafo('Descripcion', tarea.descripcion, 'tareaDescripcion')
  );

  const tareaAcciones = document.createElement('div');
  tareaAcciones.classList.add('tareaAcciones');

  const btnEditar = document.createElement('button');
  btnEditar.classList.add('btn', 'btnEditarTarea');
  btnEditar.setAttribute('data-id', tarea.id);
  btnEditar.textContent = 'Editar';

  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn', 'btnEliminarTarea');
  btnEliminar.setAttribute('data-id', tarea.id);
  btnEliminar.textContent = 'Eliminar';

  tareaAcciones.append(btnEditar, btnEliminar);
  card.append(tareaInfo, tareaAcciones);

  return card;
};

export const armarListaTareas = (contenedor, tareas) => {
  contenedor.replaceChildren();
  const fragmento = document.createDocumentFragment();
  tareas.forEach(tarea => {
    const card = armarCardTarea(tarea);
    fragmento.append(card);
  });
  contenedor.append(fragmento);
};
