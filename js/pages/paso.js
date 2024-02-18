
const tipoEleccion = 1;
const tipoRecuento = 1;

/* Variables globales */
var selectAnio = document.getElementsByClassName("filtro-Año");
var selectCargo = document.getElementsByClassName("filtro-Cargo");
var selectDistrito = document.getElementsByClassName("filtro-Distrito");
var selectSeccion = document.getElementsByClassName("filtro-Seccion");
var seccionProvincial = document.getElementsByClassName("hdSeccionProvincial");

var arregloDeCargos = [];
var arregloDeDistritos = [];
var arregloDeSecciones = [];
const vDistritoVacio = "Distrito";

var contenedorAgrupacionesPoliticas = document.getElementById("tres-recuadros");

//agarrando los elementos con su ID
var selectAnio = document.getElementById("select-año");
var selectCargo = document.getElementById("select-cargo");
var selectDistrito = document.getElementById("select-distrito");
var selectSeccion = document.getElementById("select-seccion");
var seccionProvincial = document.getElementById("hdSeccionProvincial");

//consultamos en la API todos los períodos disponibles
async function solicitarAñosApi() {
    try {
        const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (!respuesta.ok) {
            throw new Error("Hubo un error para obtener los datos");
        }
        const años = await respuesta.json();
        return años;
    }
    catch (error) {
        console.error("Ocurrió un error al obtener los datos:", error);
        throw error;
    }
}

//ejecutando la funcion solicitarAñosApi
solicitarAñosApi()
    .then((años) => { //si la promesa se resuelve se ejecuta el .then y se pasa el arreglo devuelto a cargarAños
        cargarAños(años);
        console.log(años);
    })
    .catch((error) => {
        console.error("Error:", error);
    });



function cargarAños(años) {
    const elementoAño = document.getElementById("select-año");
    elementoAño.innerHTML = '<option value="0">Año</option>';

    años.forEach(año => {
        const opcion = document.createElement('option');
        opcion.value = año;
        opcion.textContent = año;
        elementoAño.appendChild(opcion);
    });
}



function añoElegido(event) {
    var añoSeleccionado = event.target.value;

    if (añoSeleccionado != 0) {
        solicitarCargosApi(añoSeleccionado); //Llamo a solicitarCargosApi con el año seleccionado
    }
}

async function solicitarCargosApi(vanio) {
    try {
        const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + vanio);
        if (!respuesta.ok) {
            throw new Error("Error en la solicitud");
        }

        const datos = await respuesta.json();
        console.log(datos);


        //buscando la coincidencia con el tipo de elección que estamos consultando
        let eleccion = null;
        for (let i = 0; i < datos.length; i++) {
            console.log(i);
            const registro = datos[i];
            if (registro.IdEleccion === tipoEleccion) {
                eleccion = registro;
                break;
            }
        }

        console.log("Año eleccion:", eleccion.Año, "Tipo eleccion: (1-Paso 2-General)", eleccion.IdEleccion);

        cargarCargos(eleccion.Cargos);

        arregloDeCargos = eleccion.Cargos; // Almaceno los cargos en variable global
    }
    catch (error) {
        console.error("Error en solicitarCargosApi:", error);
    }
}

function cargarCargos(cargos) {
    let elementoSelect = document.getElementById("select-cargo");
    let primerValor = '<option value="0">Cargo</option>';
    let opciones = [primerValor];

    for (let i = 0; i < cargos.length; i++) {
        const cargo = cargos[i];
        const opcion = `<option value="${cargo.IdCargo}">${cargo.Cargo}</option>`;
        opciones.push(opcion);
    }

    elementoSelect.innerHTML = opciones;
}

function cargoElegido(event) {
    const idCargo = event.target.value; // obtengo el cargo seleccionado para mostrar los distritos disponibles

    if (idCargo != 0 && idCargo) {
        const cargoSeleccionado = arregloDeCargos.find(function (cargo) {
            return cargo.IdCargo === idCargo;
        });

        console.log("ID Cargo seleccionado:", cargoSeleccionado);

        arregloDeDistritos = cargoSeleccionado.Distritos;

        mostrarDistritos(arregloDeDistritos);
    }
}

function mostrarDistritos(distritos) {
    let elementoSelect = document.getElementById("select-distrito");
    elementoSelect.innerHTML = null; // Limpio opciones anteriores

    const opcionVacia = document.createElement("option");
    opcionVacia.value = vDistritoVacio;
    opcionVacia.text = "Distrito";
    elementoSelect.appendChild(opcionVacia);

    distritos.forEach((distrito) => {
        const opcionDistrito = document.createElement("option");
        opcionDistrito.value = distrito.IdDistrito;
        opcionDistrito.text = distrito.Distrito;
        elementoSelect.appendChild(opcionDistrito);
    });
}

function distritoElegido(event) {
    const idDistrito = Number(event.target.value);

    if (idDistrito != vDistritoVacio && idDistrito) {
        const distritoSeleccionado = arregloDeDistritos.find((distrito) => {
            return distrito.IdDistrito === idDistrito;
        });

        console.log(
            "ID Distrito seleccionado:",
            distritoSeleccionado.IdDistrito,
            "Nombre distrito seleccionado:",
            distritoSeleccionado.Distrito
        );

        arregloDeSecciones = distritoSeleccionado.SeccionesProvinciales;

        const seccionesAMostrar = arregloDeSecciones.map((seccion) => {
            return seccion.Secciones;
        }).flat();

        mostrarSecciones(seccionesAMostrar);

        // Llamada a la función mostrarMapasSvg con el idDistrito seleccionado
        mostrarMapasSvg(idDistrito);
    }
}


function mostrarSecciones(secciones) {
    let elementoSelect = document.getElementById("select-seccion");
    elementoSelect.innerHTML = null; // Limpio opciones anteriores

    const etiquetaOption = document.createElement("option");
    etiquetaOption.value = "Sección vacia";
    etiquetaOption.text = "Sección";
    elementoSelect.appendChild(etiquetaOption);

    secciones.forEach((seccion) => {
        const opcionSeccion = document.createElement("option");
        opcionSeccion.value = seccion.IdSeccion;
        opcionSeccion.text = seccion.Seccion;
        elementoSelect.appendChild(opcionSeccion);
    }); // Recorro el array y creo options para el select
}



function seccionElegida(event) {
    const idSeccion = Number(event.target.value);

    const seccionSeleccionada = arregloDeSecciones.find(
        (seccion) => seccion.IdSeccion === idSeccion
    );

    if (seccionSeleccionada) {
        const seccionProvincial = document.getElementById("select-seccion");

        const idSeccionProvincial = arregloDeSecciones.find((secProv) => {
            const existeSeccion = secProv.Secciones.some(
                (seccion) => seccion.IdSeccion === idSeccion
            );
            return existeSeccion;
        }).IDSeccionProvincial;


        if (seccionProvincial) {
            seccionProvincial.value = idSeccionProvincial;
        } else {
            console.error("Elemento con id 'hdSeccionProvincial' no encontrado");
        }
    }
    console.log("Sección seleccionada: ", idSeccion);
}


var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";

var datos; //en datos se va a almacenar el JSON
async function filtrarDatos() {



    if (!await validarCamposYMostrarMensaje()) {
        console.log("Por favor complete los campos para filtrar Resultados", "amarillo");
        return;
    }

    // boton que filtra los datos
    var anioEleccion = document.getElementById("select-año").value;
    var categoriaId = 2;
    var distritoId = document.getElementById("select-distrito").value;
    var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
    var seccionId = document.getElementById("select-seccion").value;
    var circuitoId = "";
    var mesaId = "";

    console.log("Año:", anioEleccion, "Categoria:", categoriaId, "Tipo de elección:", tipoEleccion, "Tipo de recuento:", tipoRecuento, "ID Distrito:", distritoId, "ID Sección Provincial:", seccionProvincialId, "ID Sección:", seccionId);

    // reemplazando cada XXXX con el valor recuperado
    var nuevaUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
    try {
        const respuesta = await fetch(nuevaUrl);

        if (!respuesta.ok) {
            throw new Error("Error en la solicitud");
        }

        datos = await respuesta.json();

        mesasEscrutadas = datos.estadoRecuento.mesasTotalizadas;
        electores = datos.estadoRecuento.cantidadElectores;
        participacionSobreEscrutado = datos.estadoRecuento.participacionPorcentaje;

        console.log("Mesas totalizadas:", mesasEscrutadas, "Electores:", electores, "Participacion sobre escrutado:", participacionSobreEscrutado);


        // Agregar validación y mostrar mensaje si alguna variable no es válida
        if (!await validarYMostrarMensaje()) {
            console.log("La operación no se pudo completar", "amarillo");
            return;
        }

        console.log("Resultados obtenidos: ", datos);


        /*Cambia el numero de los cuadros de coleres mesas escrutadas / numero de electores / numero del escrutado */
        let cuadradoMesaEscrutada = document.getElementById("numero-de-escrutadas");
        let cuadradoElectores = document.getElementById("numero-de-electores");
        let cuadradoEscrutados = document.getElementById("numero-de-escrutado");

        cuadradoMesaEscrutada.innerHTML = mesasEscrutadas;
        cuadradoElectores.innerHTML = electores;
        cuadradoEscrutados.innerHTML = participacionSobreEscrutado;


        // recuadroAgrupacionPolitica(nuevaUrl);
        recuadroAgrupacionPolitica(datos.valoresTotalizadosPositivos);
        recuadrosBarras(datos.valoresTotalizadosPositivos);

    } catch (error) {
        // Mostrar un mensaje de error en rojo con el detalle del error
        console.log(`Error: ${error.message}`, "red");
    }
}


async function actualizarTituloYSubtitulo() {
    var tipoEleccion = "PASO";
    var selectAnio = document.getElementById("select-año");
    var selectCargo = document.getElementById("select-cargo");
    var selectDistrito = document.getElementById("select-distrito");
    var selectSeccion = document.getElementById("select-seccion");

    if (selectAnio && selectCargo && selectDistrito && selectSeccion) {
        var selectAnioValue = selectAnio.value;
        var selectCargoValue = selectCargo.options[selectCargo.selectedIndex].text;
        var selectDistritoValue = selectDistrito.options[selectDistrito.selectedIndex].text;
        var selectSeccionValue = selectSeccion.options[selectSeccion.selectedIndex].text;

        // Actualizar los elementos con el título y subtítulo
        document.getElementById("ID-titulo-elecciones").textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
        document.getElementById("ID-subtitulo-eleccion").textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
    } else {
        console.error("Alguno de los elementos select es nulo.");
    }
}

/*No tocar para arriba*/


document.addEventListener("DOMContentLoaded", function () {
    const botonFiltrar = document.querySelector("#botonFiltrar");

    botonFiltrar.addEventListener("click", filtrarDatos);
    botonFiltrar.addEventListener("click", actualizarTituloYSubtitulo);
});


async function validarYMostrarMensaje() {

    const mensajeExclamacion = document.getElementById("mensaje-exclamacion");
    const mensajeCompletado = document.getElementById("mensaje-completado");

    const secContenido = document.getElementById("sec-contenido");


    if (!mesasEscrutadas || !electores || !participacionSobreEscrutado || mesasEscrutadas === 0) {
        mensajeExclamacion.style.display = "block";  // Muestra el mensaje de exclamación
        mensajeCompletado.style.display = "none";  // Oculta el mensaje de éxito

        secContenido.style.display = "none";  // oculta el elemento "sec-contenido"
        sectitulo.style.display = "none";  // oculta el elemento "sec-titulo"


        let cuadradoMesaEscrutada = document.getElementById("numero-de-escrutadas");
        let cuadradoElectores = document.getElementById("numero-de-electores");
        let cuadradoEscrutados = document.getElementById("numero-de-escrutado");

        cuadradoMesaEscrutada.innerHTML = 0;
        cuadradoElectores.innerHTML = 0;
        cuadradoEscrutados.innerHTML = 0;

        return false;  // Puedes retornar false si la validación no pasa
    } else {
        mensajeExclamacion.style.display = "none";  // Oculta el mensaje de exclamación
        mensajeCompletado.style.display = "block";  // Muestra el mensaje de éxito
        mostraTituloySubtitulo()
        mostrarContenido()
    }

    return true;  // Puedes retornar true si la validación pasa
}


async function validarCamposYMostrarMensaje() {
    const mensajeExclamacion = document.getElementById("mensaje-exclamacion");
    const mensajeCompletado = document.getElementById("mensaje-completado");
    const mensajeRellenarCampos = document.getElementById("mensaje-de-Rellenar-campos");

    const anioEleccion = document.getElementById("select-año").value;
    const cargoSeleccionado = document.getElementById("select-cargo").value;
    const distritoSeleccionado = document.getElementById("select-distrito").value;
    const seccionSeleccionada = document.getElementById("select-seccion").value;

    if (anioEleccion === "0" || cargoSeleccionado === "0" || distritoSeleccionado === "Distrito" || seccionSeleccionada === "Sección vacia") {
        mensajeRellenarCampos.style.display = "block";  // Muestra el mensaje de "Rellenar campos"
        mensajeExclamacion.style.display = "none";      // Oculta el mensaje de exclamación
        mensajeCompletado.style.display = "none";       // Oculta el mensaje de éxito
        return false;  // Puedes retornar false si la validación no pasa
    } else {
        mensajeRellenarCampos.style.display = "none";   // Oculta el mensaje de "Rellenar campos"
        mensajeExclamacion.style.display = "none";      // Oculta el mensaje de exclamación
        mensajeCompletado.style.display = "none";       // Oculta el mensaje de éxito
    }

    return true;  // Puedes retornar true si la validación pasa
}

function mostrarContenido() {
    const secContenido = document.getElementById("sec-contenido");
    secContenido.style.display = "block";  // Muestra el elemento "sec-contenido"
}

function mostraTituloySubtitulo() {
    const sectitulo = document.getElementById("ID-subtitulo-eleccion");
    sectitulo.style.display = "block";  // Muestra el elemento "sec-titulo"
}

function mostrarMapasSvg(idDistrito) {
    const mapaSvg = obtenerMapaSvgPorDistrito(idDistrito);

    if (mapaSvg) {
        const elementoMapasSvg = document.getElementById("mapas-svg");
        elementoMapasSvg.innerHTML = mapaSvg;
    }
}

function obtenerMapaSvgPorDistrito(idDistrito) {
    const mapaEncontrado = provincias.find((provincia) => provincia.idDistrito === idDistrito);

    if (mapaEncontrado) {
        return mapaEncontrado.svg;
    }

    return null;
}

/*Esta bien pero no ta bien*/
/*Esta es la barra de progrso...Pero me tiene que mostrar las listas */
/*Esta bien pero no ta bien*/
/*Esta es la barra de progrso...Pero me tiene que mostrar las listas */

function recuadroAgrupacionPolitica(valoresTotalizadosPositivos) {
    const agrupacionesContainer = document.getElementById("Cont-recuadro");

    // Limpiar contenido existente
    agrupacionesContainer.innerHTML = '';

    // Limitar a mostrar solo las primeras 6 agrupaciones
    const numAgrupacionesAMostrar = Math.min(6, valoresTotalizadosPositivos.length);

    // Recorrer solo las primeras 6 agrupaciones
    for (let index = 0; index < numAgrupacionesAMostrar; index++) {
        // Crear elementos para cada agrupación
        const agrupacion = valoresTotalizadosPositivos[index];

        const recuadro = document.createElement("div");
        recuadro.className = "recuadro";

        const tituloAgrupacion = document.createElement("div");
        tituloAgrupacion.className = "titulo-recuadro";
        tituloAgrupacion.textContent = agrupacion.nombreAgrupacion;

        const contenidoRecuadro = document.createElement("div");
        contenidoRecuadro.className = "contenido-recuadro";

        // Recorrer hasta las primeras 3 listas de la agrupación
        const numListasAMostrar = Math.min(2, agrupacion.listas.length);//Cambia el numero maximo de listas que se muestran de los distintos partidos
        for (let i = 0; i < numListasAMostrar; i++) {
            const lista = agrupacion.listas[i];

            const bloqueLista = document.createElement("div");

            const nombreLista = document.createElement("h3");
            nombreLista.textContent = lista.nombre;

            const porcentajeLista = document.createElement("p");
            const votosPorcentaje = (lista.votos * 100 / agrupacion.votos).toFixed(2);
            porcentajeLista.textContent = `${votosPorcentaje}%`;

            const cantVotos = document.createElement("p");
            cantVotos.textContent = `${lista.votos} VOTOS`;

            const progressBarContainer = document.createElement("div");
            progressBarContainer.className = `progress partido${index + 1}`;

            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            progressBar.style.width = `${votosPorcentaje}%`;

            const progressBarText = document.createElement("span");
            progressBarText.className = "progress-bar-text";
            progressBarText.textContent = `${votosPorcentaje}%`;

            // Agregar elementos al bloque de lista
            bloqueLista.appendChild(nombreLista);
            bloqueLista.appendChild(porcentajeLista);
            bloqueLista.appendChild(cantVotos);
            progressBar.appendChild(progressBarText);
            progressBarContainer.appendChild(progressBar);
            bloqueLista.appendChild(progressBarContainer);

            // Agregar bloque de lista al contenido del recuadro
            contenidoRecuadro.appendChild(bloqueLista);
        }

        // Agregar elementos al recuadro principal
        recuadro.appendChild(tituloAgrupacion);
        recuadro.appendChild(contenidoRecuadro);

        // Agregar recuadro al contenedor de agrupaciones
        agrupacionesContainer.appendChild(recuadro);
    }
}

/*COREGIR ESTA FUNCION */
function recuadrosBarras(valoresTotalizadosPositivos) {
    const chartWrap = document.querySelector(".chart-wrap .grid");

    // Limpiar contenido existente
    chartWrap.innerHTML = '';

    // Ordenar las agrupaciones por porcentaje de votos de mayor a menor
    valoresTotalizadosPositivos.sort((a, b) => b.votosPorcentaje - a.votosPorcentaje);

    // Variables para sumar los votos de "Otros"
    let votosOtros = 0;

    // Recorrer las primeras 6 agrupaciones o todas si hay menos de 6
    const numAgrupacionesAMostrar = Math.min(6, valoresTotalizadosPositivos.length);
    for (let index = 0; index < numAgrupacionesAMostrar; index++) {
        const agrupacion = valoresTotalizadosPositivos[index];
        const bar = document.createElement("div");

        if (index === 4 && valoresTotalizadosPositivos.length > 6) {
            // Si es la sexta barra y hay más de 6 partidos, agrupa en "Otros"
            votosOtros += agrupacion.votosPorcentaje;
        } else {
            bar.className = `bar partido${index + 1}`;
            bar.style = `--bar-value: ${agrupacion.votosPorcentaje}%`;
            bar.dataset.name = agrupacion.nombreAgrupacion;
            bar.title = `${agrupacion.nombreAgrupacion}\n${agrupacion.votosPorcentaje}%`;
            chartWrap.appendChild(bar);
        }
    }

    // Agregar la barra "Otros" al final si es necesario
    if (votosOtros > 0) {
        const barOtros = document.createElement("div");
        barOtros.className = "bar partido8";
        barOtros.style = `--bar-value: ${votosOtros}%;`;
        barOtros.dataset.name = "Otros";
        barOtros.title = `Otros\n${votosOtros}%`;
        chartWrap.appendChild(barOtros);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const botonAgregarInformes = document.querySelector("#boton-agregar-informe-button");
    botonAgregarInformes.addEventListener("click", AgregarInformes);
});

async function AgregarInformes() {
    var anioEleccion = document.getElementById("select-año").value;
    var categoriaId = document.getElementById("select-cargo").value;
    var distritoId = document.getElementById("select-distrito").value;
    var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
    var seccionId = document.getElementById("select-seccion").value;
    var circuitoId = "";
    var mesaId = "";


    var selectCargoNombre = document.getElementById("select-cargo");
    var selectDistritoNombre = document.getElementById("select-distrito");
    var selectSeccionNombre = document.getElementById("select-seccion");

    var nombreCargo = selectCargoNombre.options[selectCargoNombre.selectedIndex].text;
    var nombreDistrito = selectDistritoNombre.options[selectDistritoNombre.selectedIndex].text;
    var nombreSeccion = selectSeccionNombre.options[selectSeccionNombre.selectedIndex].text;


    var nuevoInforme = {
        'anioEleccion': anioEleccion,
        'tipoRecuento': tipoRecuento,
        'tipoEleccion': tipoEleccion,
        'categoriaId': categoriaId,
        'distritoId': distritoId,
        'seccionProvincialId': seccionProvincialId,
        'seccionId': seccionId,
        'circuitoId': circuitoId,
        'mesaId': mesaId,
        'nombreCargo':nombreCargo,
        'nombreDistrito':nombreDistrito,
        'nombreSeccion':nombreSeccion,
    };

    console.log(nuevoInforme);

    // Obtener el objeto actual de Informes del localStorage (si existe)
    const informesObjetoJSON = localStorage.getItem("Informes");
    const informesObjeto = informesObjetoJSON ? JSON.parse(informesObjetoJSON) : { 'informes': [] };

    // Agregar el nuevo informe a la lista de informes existentes
    informesObjeto.informes.push(nuevoInforme);

    // Guardar el objeto actualizado en el localStorage
    localStorage.setItem("Informes", JSON.stringify(informesObjeto));
    // Mostrar mensaje verde
    const mensajeExito = document.getElementById("mensaje-completado-informes");
    mensajeExito.style.display = "block";
    setTimeout(() => {
        mensajeExito.style.display = "none";
    }, 5000);
}

/*



async function AgregarInformes() {

    var anioEleccion = document.getElementById("select-año").value;
    var categoriaId = 2;
    var distritoId = document.getElementById("select-distrito").value;
    var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
    var seccionId = document.getElementById("select-seccion").value;
    var circuitoId = "";
    var mesaId = "";

    const mensajeExito = document.getElementById("mensaje-completado-informes");
    const mensajeError = document.getElementById("mensaje-exclamacion-informes");
    
    console.log("Año:", anioEleccion, "Categoria:", categoriaId, "Tipo de elección:", tipoEleccion, "Tipo de recuento:", tipoRecuento, "ID Distrito:", distritoId, "ID Sección Provincial:", seccionProvincialId, "ID Sección:", seccionId);

    var nuevaUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

    try {
        const respuesta = await fetch(nuevaUrl);
    
        if (!respuesta.ok) {
            throw new Error("Error en la solicitud");
        }

        localStorage.setItem("Informes", JSON.stringify(nuevaUrl));
        console.log(localStorage.getItem("Informes"));

        // Mostrar mensaje verde
        mensajeExito.style.display = "block";
        setTimeout(() => {
            mensajeExito.style.display = "none";
        }, 5000);
    } catch (error) {
        // Mostrar mensaje de error en rojo con el detalle del error
        console.log(`Error: ${error.message}`, "red");

        // Mostrar mensaje de exclamación en amarillo
        mensajeError.style.display = "block";
        setTimeout(() => {
            mensajeError.style.display = "none";
        }, 5000);
    }
}






*/