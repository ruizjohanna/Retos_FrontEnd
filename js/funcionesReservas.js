var actualizarVar = 0;

function getDataCabana() {
    $.ajax({
        type: 'GET',
        url: 'http://168.138.144.46:8080/api/Cabin/all',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#cabanaR").empty();
            let miLista = "";
            for (i = 0; i < respuesta.length; i++) {
                miLista += "<option value=" + respuesta[i].id + ">" + respuesta[i].name + "</option>";
            }
            $("#cabanaR").append(miLista);
        }
    });
}

function getDataCliente() {
    $.ajax({
        type: 'GET',
        url: 'http://168.138.144.46:8080/api/Client/all',
        dataType: 'json',
        success: function (respuestaC) {
            console.log(respuestaC)
            $("#clienteR").empty();
            let miLista = "";
            for (i = 0; i < respuestaC.length; i++) {
                miLista += "<option value=" + respuestaC[i].idClient + ">" + respuestaC[i].name + "</option>";
            }
            $("#clienteR").append(miLista);
        }
    });
}

function consultarReservaTodo() {
    let fechaI = "";
    let fechaE = "";
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Reservation/all',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#TablaResultadoReservas").empty();
            $("#TablaResultadoReservas").append("<tr>");
            $("#TablaResultadoReservas").append("<th>N° RESERVA</th>");
            $("#TablaResultadoReservas").append("<th>CABAÑA</th>");
            $("#TablaResultadoReservas").append("<th>CLIENTE</th>");
            $("#TablaResultadoReservas").append("<th>EMAIL</th>");
            $("#TablaResultadoReservas").append("<th>FECHA INICIO</th>");
            $("#TablaResultadoReservas").append("<th>FECHA ENTREGA</th>");
            $("#TablaResultadoReservas").append("<th>ESTADO</th>");
            $("#TablaResultadoReservas").append("<th>EDITAR</th>");
            $("#TablaResultadoReservas").append("<th>ELIMINAR</th>");
            $("#TablaResultadoReservas").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoReservas").append("<tr>");
                $("#TablaResultadoReservas").append("<td>" + respuesta[i].idReservation + "</td>");
                $("#TablaResultadoReservas").append("<td>" + respuesta[i].cabin.name + "</td>");
                $("#TablaResultadoReservas").append("<td>" + respuesta[i].client.name + "</td>");
                $("#TablaResultadoReservas").append("<td>" + respuesta[i].client.email + "</td>");
                for (let index = 0; index < 10; index++) {
                    fechaI += respuesta[i].startDate[index];
                    fechaE += respuesta[i].devolutionDate[index];
                }
                $("#TablaResultadoReservas").append("<td>" + fechaI + "</td>");
                $("#TablaResultadoReservas").append("<td>" + fechaE + "</td>");
                $("#TablaResultadoReservas").append("<td>" + respuesta[i].status + "</td>");
                $("#TablaResultadoReservas").append("<td>" + "<input type='button' value='EDITAR' onclick='traeEditarReserva(" + respuesta[i].idReservation + ")'>" + "</td>");
                $("#TablaResultadoReservas").append("<td>" + "<input type='button' value='ELIMINAR' onclick='eliminarReserva(" + respuesta[i].idReservation + ")'>" + "</td>");
                $("#TablaResultadoReservas").append("</tr>");
                fechaI = "";
                fechaE = "";
            }
        }
    });
}

function guardarReserva() {
    if ($('#fecha_i').val().trim() == "" || $('#fecha_e').val().trim() == "" || $('#fecha_i').val() > $('#fecha_e').val()) {
        alert('Rango de fechas de reserva incorrecto, por favor verifique');
    } else {
        var datos = {
            startDate: $('#fecha_i').val(),
            devolutionDate: $("#fecha_e").val(),
            cabin: { id: $('#cabanaR').val() },
            client: { idClient: $('#clienteR').val() },
            status: $('#estadoReservaS').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Reservation/save',
            data: datosaEnviar,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Reserva guardada');
                limpiarFormulario();
                location.reload();
            }
        });
    }
}

function traeEditarReserva(ide) {
    let fechaI = "";
    let fechaE = "";
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Reservation/' + ide,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            actualizarVar = respuesta.idReservation;
            $("#cabanaR").val(respuesta.cabin.id);
            $("#clienteR").val(respuesta.client.idClient);
            for (let index = 0; index < 10; index++) {
                fechaI += respuesta.startDate[index];
                fechaE += respuesta.devolutionDate[index];
            }
            $("#fecha_i").val(fechaI);
            $("#fecha_e").val(fechaE);
            $("#estadoReservaS").val(respuesta.status);
            $("#guardaRes").prop('disabled', true);
            $("#actualizaRes").prop('disabled', false);
        }
    });

}


function editarReserva() {
    if ($('#fecha_i').val().trim() == "" || $('#fecha_e').val().trim() == "" || $('#fecha_i').val() > $('#fecha_e').val()) {
        alert('Rango de fechas de reserva incorrecto, por favor verifique');
    } else {
        var datos = {
            idReservation: actualizarVar,
            startDate: $('#fecha_i').val(),
            devolutionDate: $("#fecha_e").val(),
            cabin: { id: $('#cabanaR').val() },
            client: { idClient: $('#clienteR').val() },
            status: $('#estadoReservaS').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Reservation/update',
            data: datosaEnviar,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Cabaña Actualizada');
                consultarReservaTodo();
                limpiarFormulario();
            }
        });
    }
}

function eliminarReserva(ide) {

    $.ajax({
        url: 'http://168.138.144.46:8080/api/Reservation/' + ide,
        type: 'DELETE',
        dataType: 'json',
        success: function (response) {
            console.log(response);
        },
        complete: function (xhr, status) {
            alert('Reserva eliminada');
            consultarReservaTodo();
            limpiarFormulario();
        }
    });
}

function consultarCantidadReserva() {
    let variable = document.getElementById("TotalCantidad");
    let contador = 0;
    let fechaI = "";
    let fechaE = "";

    for (let index = 0; index < 10; index++) {
        fechaI += $("#fecha_iR").val()[index];
        fechaE += $("#fecha_fR").val()[index];
    }
    if ($('#fecha_iR').val().trim() == "" || $('#fecha_fR').val().trim() == "" || $('#fecha_iR').val() > $('#fecha_fR').val()) {
        alert('Rango de fechas de consulta incorrecto, por favor verifique');
    } else {
        $.ajax({
            url: 'http://168.138.144.46:8080/api/Reservation/report-dates/' + fechaI + "/" + fechaE,
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                console.log(respuesta);
                contador = respuesta.length;
                console.log(contador);
                variable.innerHTML = "Cantidad = " + contador;
            }
        });
    }
}

function consultarCantidadEstados() {
    let variable = document.getElementById("TotalCantidadReservas");
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Reservation/report-status',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            let completadas = respuesta.completed
            let canceladas = respuesta.cancelled
            variable.innerHTML = "Completadas = " + completadas + "<br> Canceladas = " + canceladas;
        }
    });
}

function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        return a[p_key] > b[p_key];
    });
}
function ordenarDesc(p_array_json, p_key) {
    ordenarAsc(p_array_json, p_key); p_array_json.reverse();
}
function sortTable(table_id, sortColumn) {
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            if (Number(rowData.item(j).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, "")) < Number(rowData.item(j + 1).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, ""))) {
                tableData.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
}
function consultarClienteReserva() {

    $.ajax({
        url: 'http://168.138.144.46:8080/api/Reservation/report-clients',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {            
            $("#TablaResultadoResClien").empty();
            $("#TablaResultadoResClien").append("<tr>");
            $("#TablaResultadoResClien").append("<th>NOMBRE</th>");
            $("#TablaResultadoResClien").append("<th>CORREO</th>");
            $("#TablaResultadoResClien").append("<th>RESERVAS COMPLETAS</th>");
            $("#TablaResultadoResClien").append("<th>RESERVAS CANCELADAS</th>");
            $("#TablaResultadoResClien").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoResClien").append("<tr>");
                $("#TablaResultadoResClien").append("<td>" + respuesta[i].client.name + "</td>");
                $("#TablaResultadoResClien").append("<td>" + respuesta[i].client.email + "</td>");
                let completo = 0;
                let cancelado = 0;
                for (j = 0; j < respuesta[i].client.reservations.length; j++) {
                    if (respuesta[i].client.reservations[j].status == "cancelled") {
                        cancelado += 1;
                    } else if (respuesta[i].client.reservations[j].status == "completed") {
                        completo += 1;
                    }
                }
                $("#TablaResultadoResClien").append("<td>" + completo + "</td>");
                $("#TablaResultadoResClien").append("<td>" + cancelado + "</td>");                
            }
            $("#TablaResultadoResClien").append(sortTable('TablaResultadoResClien', 3));
        }        
    });
}

function limpiarFormulario() {
    $("#fecha_i").val("");
    $("#fecha_e").val("");
    $("#cabanaR").val();
    $("#clienteR").val();
    $("#estadoReservaS").val();
    $("#guardaRes").prop('disabled', false);
    $("#actualizaRes").prop('disabled', true);
}


