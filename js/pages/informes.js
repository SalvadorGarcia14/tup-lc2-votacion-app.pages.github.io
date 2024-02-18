const tipoRecuento = 1;

var tipoEleccionActual = "";
var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";
var valoresTotalizadosPositivos = "";

function mostrarMensaje() {
    // Obtener la información del LocalStorage
    const informesString = localStorage.getItem("Informes");

    try {
        // Intentar convertir la cadena JSON a un objeto
        const informesObjeto = JSON.parse(informesString);

        // Obtener el elemento del section
        const seccionContenido = document.getElementById("sec-contenido");

        // Verificar si hay información en el LocalStorage
        if (informesObjeto && informesObjeto.informes && informesObjeto.informes.length > 0) {
            // Mostrar mensaje de éxito
            document.getElementById("mensaje-de-exito-informes").style.display = "block";
            seccionContenido.style.display = "block";
            let informes = informesObjeto.informes;  // Accede al array de informes
            filtrarDatos(informes);
        } else {
            // Mostrar mensaje de exclamación
            document.getElementById("mensaje-de-exclamacion-informes").style.display = "block";
            // Ocultar el section
            seccionContenido.style.display = "none";
        }
    } catch (error) {
        // Mostrar mensaje de error
        document.getElementById("mensaje-de-error-informes").style.display = "block";
    }
}

// Llamar a la función al cargar la página
window.onload = mostrarMensaje;


async function filtrarDatos(informes) {
    console.log("Se está ejecutando la función filtrarDatos");

    // Obtener la referencia al cuerpo de la tabla
    var cuerpoTabla = document.getElementById('Cuerpo-tabla-infomes');

    // Obtener la referencia al encabezado de la tabla
    var encabezadoTabla = document.getElementById('Cabeza-tabla-iformes');

    // Limpiar el contenido actual de la tabla
    cuerpoTabla.innerHTML = '';

    // Agregar columna por cada encabezado
    var thProvincia = document.createElement('th');
    thProvincia.textContent = 'PROVINCIA';
    encabezadoTabla.appendChild(thProvincia);

    var thEleccion = document.createElement('th');
    thEleccion.textContent = 'ELECCIÓN';
    encabezadoTabla.appendChild(thEleccion);

    var thDatosGenerales = document.createElement('th');
    thDatosGenerales.textContent = 'DATOS GENERALES';
    encabezadoTabla.appendChild(thDatosGenerales);

    var thDatosAgrupacion = document.createElement('th');
    thDatosAgrupacion.textContent = 'DATOS POR AGRUPACIÓN';
    encabezadoTabla.appendChild(thDatosAgrupacion);

    if (informes && informes.length > 0) {
        console.log("Entro al if");

        for (let i = 0; i < informes.length; i++) {
            // Acciones a realizar en cada iteración
            const informe = informes[i];

            // Acceder a las propiedades directamente según la estructura del objeto informe
            console.log("Entra al for");
            let anioEleccion = informe.anioEleccion;
            let categoriaId = informe.categoriaId;
            let circuitoId = "";
            let distritoId = informe.distritoId;
            let mesaId = "";
            let seccionId = informe.seccionId;
            let seccionProvincialId = informe.seccionProvincialId;
            let tipoRecuento = informe.tipoRecuento;
            let tipoEleccion = informe.tipoEleccion;

            let nombreCargo = informe.nombreCargo; // Asegúrate de que esta propiedad exista en tu objeto informe
            let nombreDistrito = informe.nombreDistrito; // Asegúrate de que esta propiedad exista en tu objeto informe
            let nombreSeccion = informe.nombreSeccion; // Asegúrate de que esta propiedad exista en tu objeto informe

            console.log(
                "Muestras las variables",
                "Año de Eleccion: ", anioEleccion,
                "CargoID: ", categoriaId,
                "circuitoId: ", circuitoId,
                "ProvinciaID: ", distritoId,
                "mesaId: ", mesaId,
                "DepartamentoID: ", seccionId,
                "seccionProvincialId: ", seccionProvincialId,
                "tipoRecuento: ", tipoRecuento,
                "tipoRecuento: ", tipoEleccion,
                "nombreCargo: ", nombreCargo,
                "nombreDistrito: ", nombreDistrito,
                "nombreSeccion: ", nombreSeccion
            );

            if (tipoEleccion == 1) {
                tipoEleccionActual = "PASO";
            } else {
                tipoEleccionActual = "General";
            }

            let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }

                const data = await response.json();

                console.log("Resultados obtenidos: ", data);

                mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
                electores = data.estadoRecuento.cantidadElectores;
                participacionSobreEscrutado = data.estadoRecuento.participacionPorcentaje;

                console.log(
                    "Año:", anioEleccion,
                    "Categoria:", categoriaId,
                    "Tipo de elección:", tipoEleccion,
                    "Tipo de recuento:", tipoRecuento,
                    "ID Distrito:", distritoId,
                    "ID Sección Provincial:", seccionProvincialId,
                    "ID Sección:", seccionId,
                    "mesasEscrutadas: ", mesasEscrutadas,
                    "electores: ", electores,
                    "participacionSobreEscrutado: ", participacionSobreEscrutado,
                );


                actualizarTituloYSubtitulo(anioEleccion, tipoEleccionActual, nombreCargo, nombreDistrito, nombreSeccion)
                /*mostrarTablaDeInformesDesdeLocalStorage(informes);*/

                // Obtener la referencia a la fila actual
                var tr = document.createElement('tr');


                // Añadir celdas con los datos específicos de cada informe
                var tdProvincia = document.createElement('td');
                tdProvincia.textContent = informe.provincia; // Asegúrate de tener la propiedad 'provincia' en tu objeto informe
                tr.appendChild(tdProvincia);

                var tdEleccion = document.createElement('td');
                tdEleccion.innerHTML = `<p>Elecciones ${informe.anioEleccion} | ${tipoEleccionActual}</p><p>${anioEleccion} > ${tipoEleccionActual} > ${nombreCargo} > ${nombreSeccion} > ${nombreDistrito}</p>`;
                tr.appendChild(tdEleccion);

                var tdDatosGenerales = document.createElement('td');
                // Aquí debes agregar la lógica para los datos generales
                // Puedes utilizar innerHTML para insertar contenido HTML más complejo
                tdDatosGenerales.innerHTML = `<p>Mesas escrutadas: ${mesasEscrutadas}</p><p>Electores: ${electores}</p> <p>Participación del escrutado: ${participacionSobreEscrutado} %`;
                tr.appendChild(tdDatosGenerales);

                var tdDatosAgrupacion = document.createElement('td');
                // Llamar a la función para agregar los SVG
                tr.appendChild(tdDatosAgrupacion);

                // Verificar si la propiedad valoresTotalizadosPositivos es un array
                if (data.valoresTotalizadosPositivos && Array.isArray(data.valoresTotalizadosPositivos)) {
                    // Ordenar los valoresTotalizadosPositivos de mayor a menor por porcentaje de votos
                    const partidosOrdenados = data.valoresTotalizadosPositivos.sort((a, b) => b.votosPorcentaje - a.votosPorcentaje);

                    // Limitar a los primeros 6 partidos
                    const primeros6Partidos = partidosOrdenados.slice(0, 6);

                    // Iterar sobre los primeros 6 partidos y agregar la información a la celda
                    for (let j = 0; j < primeros6Partidos.length; j++) {
                        const valor = primeros6Partidos[j];
                        const p = document.createElement('p');
                        p.textContent = `${valor.nombreAgrupacion}: Votos - ${valor.votos}, Porcentaje - ${valor.votosPorcentaje}%`;
                        tdDatosAgrupacion.appendChild(p);
                    }
                } else {
                    console.error("La propiedad valoresTotalizadosPositivos no es un array o está indefinida.");
                }

                // Agregar la celda a la fila
                tr.appendChild(tdDatosAgrupacion);


                cuerpoTabla.appendChild(tr);


            } catch (error) {
                console.error(`Error en la solicitud: ${error.message}`);
                console.error(error);
            }
        }  // Cierra el bucle for
    } else {
        console.log("No hay informes en el LocalStorage");
    }
}



function actualizarTituloYSubtitulo(anioEleccion, tipoEleccionActual, nombreCargo, nombreDistrito, nombreSeccion) {
    const textoTitulo = `Elecciones ${anioEleccion} | ${tipoEleccionActual}`;
    const textoSubtitulo = `${anioEleccion} > ${tipoEleccionActual} > ${nombreCargo} > ${nombreSeccion} > ${nombreDistrito}`;

    // Obtener los elementos
    const elementoTitulo = document.getElementById("texto-elecciones-chico-id");
    const elementoSubtitulo = document.getElementById("texto-path-chico-id");

    // Verificar si los elementos existen antes de actualizar su contenido
    if (elementoTitulo && elementoSubtitulo) {
        elementoTitulo.innerHTML = textoTitulo;
        elementoSubtitulo.innerHTML = textoSubtitulo;
    } else {
        console.error("No se encontraron elementos con los IDs especificados.");
    }
}



// Llamar a la función después de cargar el contenido HTML

/*

function mostrarTablaDeInformesDesdeLocalStorage(informes) {
    // Obtener el cuerpo de la tabla existente en el documento HTML
    var cuerpoTabla = document.getElementById('Cuerpo-tabla-infomes');

    // Limpiar el contenido actual de la tabla
    cuerpoTabla.innerHTML = '';

    // Crear filas de datos y agregarlas al cuerpo de la tabla existente
    for (let i = 0; i < informes.length; i++) {
        const informe = informes[i];

        // Crear una fila para el título y subtitulo
        var trTitulo = document.createElement('tr');

        // Añadir celda para la columna "ELECCIÓN"
        var thEleccion = document.createElement('th');

        // Obtener los valores para el título y subtitulo desde el informe actual
        const anioEleccion = informe.anioEleccion;
        const tipoEleccionActual = informe.tipoEleccion === 1 ? "PASO" : "General";
        const nombreCargo = informe.nombreCargo;
        const nombreDistrito = informe.nombreDistrito;
        const nombreSeccion = informe.nombreSeccion;

        const textoTitulo = `Elecciones ${anioEleccion} | ${tipoEleccionActual}`;
        const textoSubtitulo = `${anioEleccion} > ${tipoEleccionActual} > ${nombreCargo} > ${nombreSeccion} > ${nombreDistrito}`;

        // Crear los elementos HTML y agregarlos a la fila
        var divTitulo = document.createElement('div');
        divTitulo.id = 'titulo-eleccion';
        divTitulo.innerHTML = textoTitulo;

        var divSubtitulo = document.createElement('div');
        divSubtitulo.id = 'subtitulo-eleccion';
        divSubtitulo.innerHTML = textoSubtitulo;

        thEleccion.appendChild(divTitulo);
        thEleccion.appendChild(divSubtitulo);

        // Agregar la fila del título al cuerpo de la tabla
        trTitulo.appendChild(thEleccion);
        cuerpoTabla.appendChild(trTitulo);

        // Crear una fila de datos y agregarla al cuerpo de la tabla existente
        var tr = document.createElement('tr');

        // Añadir celdas con los datos específicos de cada informe
        var tdAnioEleccion = document.createElement('td');

        var tdCategoriaId = document.createElement('td');

        // Agregar más celdas según sea necesario...

        cuerpoTabla.appendChild(tr);
    }
}
*/











/*

function actualizarTituloYSubtitulo(anioEleccion, tipoEleccionActual, nombreCargo, nombreDistrito, nombreSeccion) {
    const textoTitulo = `Elecciones ${anioEleccion} | ${tipoEleccionActual}`;
    const textoSubtitulo = `${anioEleccion} > ${tipoEleccionActual} > ${nombreCargo} > ${nombreSeccion} > ${nombreDistrito}`;

    // Obtener los elementos
    const elementoTitulo = document.getElementById("texto-elecciones-chico-id");
    const elementoSubtitulo = document.getElementById("texto-path-chico-id");

    // Verificar si los elementos existen antes de actualizar su contenido
    if (elementoTitulo && elementoSubtitulo) {
        elementoTitulo.innerHTML = textoTitulo;
        elementoSubtitulo.innerHTML = textoSubtitulo;
    } else {
        console.error("No se encontraron elementos con los IDs especificados.");
    }
}

function crearYOrdenarAgrupaciones(valoresTotales) {
    // Ordenar las agrupaciones por la cantidad de votos (de mayor a menor)
    valoresTotales.sort((a, b) => b.votos - a.votos);

    // Crear el contenedor
    const contenedorAgrupaciones = document.createElement("div");
    contenedorAgrupaciones.id = "datosPorAgrupacion";
    contenedorAgrupaciones.style.overflowY = "auto";


    valoresTotales.forEach((agrupacion) => {
        let nombreAgrupacion = agrupacion.nombreAgrupacion;
        let votosPorcentaje = agrupacion.votosPorcentaje;
        let votos = agrupacion.votos;

        // Crear y configurar los elementos HTML
        const divAgrupacion = document.createElement("div");
        divAgrupacion.classList.add("datos-por-agrupacion");

        const pNombre = document.createElement("p");
        pNombre.style.fontWeight = "bold";
        pNombre.textContent = nombreAgrupacion;

        const divPorcentaje = document.createElement("div");
        const pPorcentaje = document.createElement("p");
        pPorcentaje.innerHTML = `${votosPorcentaje}% <br> (${votos} votos)`;

        // Construir la estructura del DOM
        divPorcentaje.appendChild(pPorcentaje);
        divAgrupacion.appendChild(pNombre);
        divAgrupacion.appendChild(divPorcentaje);

        // Agregar los elementos al contenedor
        contenedorAgrupaciones.appendChild(divAgrupacion);
    });

    return contenedorAgrupaciones;
}


/*
function actualizarMapa(distritoId) {
    const imagenMapa = document.createElement("div");
    const provinciaEncontrada = provincias.find(
        (provincia) => provincia.idDistrito == distritoId
    );
    console.log(provinciaEncontrada)

    if (provinciaEncontrada) {
        imagenMapa.innerHTML = `${provinciaEncontrada.svg}`;
        imagenMapa.style.width = "100px";
        return imagenMapa;
    } else {
        console.log(
            "No se encontró una provincia correspondiente al distrito seleccionado."
        );
        return document.createElement("div"); // Retorna vacío si no se encuentra la provincia
    }
}

*/




/*


  // Acciones a realizar en cada iteración
            const informe = informes[i];

            // Acceder a las propiedades directamente según la estructura del objeto informe
            console.log("Entra al for");
            let anioEleccion = informe.anioEleccion;
            let categoriaId = informe.categoriaId;
            let circuitoId = "";
            let distritoId = informe.distritoId;
            let mesaId = "";
            let seccionId = informe.seccionId;
            let seccionProvincialId = informe.seccionProvincialId;
            let tipoRecuento = informe.tipoRecuento;
            let tipoEleccion = informe.tipoEleccion;

            let nombreCargo = informe.nombreCargo; // Asegúrate de que esta propiedad exista en tu objeto informe
            let nombreDistrito = informe.nombreDistrito; // Asegúrate de que esta propiedad exista en tu objeto informe
            let nombreSeccion = informe.nombreSeccion; // Asegúrate de que esta propiedad exista en tu objeto informe

            console.log(
                "Muestras las variables",
                anioEleccion,
                categoriaId,
                circuitoId,
                distritoId,
                mesaId,
                seccionId,
                seccionProvincialId,
                tipoRecuento,
                tipoEleccion,
                nombreCargo,
                nombreDistrito,
                nombreSeccion
            );
        }



*/