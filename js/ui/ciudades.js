export const armarCiudades = (elemento, datos) => {
  const fragmento = document.createDocumentFragment();
  datos.forEach(ciudad => {
    const opcion = document.createElement('option');
    // Creamos los atributos
    opcion.setAttribute("value", ciudad.id);
    opcion.textContent = ciudad.ciudad;
    fragmento.append(opcion)
  });

  elemento.append(fragmento);
}