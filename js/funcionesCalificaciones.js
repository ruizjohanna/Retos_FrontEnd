var actualizarVar = 0;

function getDataReserva() {
    $.ajax({
        type: 'GET',
        url: 'http://168.138.144.46:8080/api/Reservation/all',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#reservaC").empty();
            let miLista = "";
            for (i = 0; i < respuesta.length; i++) {
                miLista += "<option value=" + respuesta[i].idReservation + ">" + respuesta[i].idReservation + "</option>";
            }
            $("#reservaC").append(miLista);
        }
    });
}

function consultarCalificacionTodo() {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Score/all',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#TablaResultadoCalificaciones").empty();
            $("#TablaResultadoCalificaciones").append("<tr>");
            $("#TablaResultadoCalificaciones").append("<th>N°</th>");
            $("#TablaResultadoCalificaciones").append("<th>RESERVA</th>");
            $("#TablaResultadoCalificaciones").append("<th>MENSAJE</th>");
            $("#TablaResultadoCalificaciones").append("<th>PUNTUACIÓN</th>");
            $("#TablaResultadoCalificaciones").append("<th>EDITAR</th>");
            $("#TablaResultadoCalificaciones").append("<th>ELIMINAR</th>");
            $("#TablaResultadoCalificaciones").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoCalificaciones").append("<tr>");
                $("#TablaResultadoCalificaciones").append("<td>" + respuesta[i].id + "</td>");
                $("#TablaResultadoCalificaciones").append("<td>" + respuesta[i].vr_reserva + "</td>");
                $("#TablaResultadoCalificaciones").append("<td>" + respuesta[i].vr_mensaje + "</td>");
                $("#TablaResultadoCalificaciones").append("<td>" + respuesta[i].puntuacion + "</td>");
                $("#TablaResultadoCalificaciones").append("<td>" + "<input type='button' value='EDITAR' onclick='traeEditarCalificacion(" + respuesta[i].id + ")'>" + "</td>");
                $("#TablaResultadoCalificaciones").append("<td>" + "<input type='button' value='ELIMINAR' onclick='eliminarCalificacion(" + respuesta[i].id + ")'>" + "</td>");
                $("#TablaResultadoCalificaciones").append("</tr>");
            }
        }
    });
}

function guardarCalificacion() {
    if ($('#mensajeC').val().trim() == "") {
        alert('No hay mensaje, por favor verifique');
    } else {
        var datos = {
            puntuacion: $('#puntuacion').val(),
            vr_mensaje: $('#mensajeC').val(),
            vr_reserva: $('#reservaC').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Score/save',
            data: datosaEnviar,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Puntaje Guardado');
                limpiarFormulario();
            }
        });
    }
}

function traeEditarCalificacion(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Score/' + ide,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            actualizarVar = respuesta.id;
            $("#puntuacion").val(respuesta.puntuacion);
            $("#mensajeC").val(respuesta.vr_mensaje);
            $("#reservaC").val(respuesta.vr_reserva);
            $("#guardaCal").prop('disabled', true);
            $("#actualizaCal").prop('disabled', false);
        }
    });
}

function editarCalificacion() {
    if ($('#mensajeC').val().trim() == "") {
        alert('No hay mensaje, por favor verifique');
    } else {
        var datos = {
            id: actualizarVar,
            puntuacion: $('#puntuacion').val(),
            vr_mensaje: $('#mensajeC').val(),
            vr_reserva: $('#reservaC').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Score/update',
            data: datosaEnviar,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Calificacion Actualizada');
                consultarCalificacionTodo();
                limpiarFormulario();
            }
        });
    }
}

function eliminarCalificacion(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Score/' + ide,
        type: 'DELETE',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            alert('Calificación Eliminada');
            consultarCalificacionTodo();
        }
    });
}

function limpiarFormulario() {
    $("#puntuacion").val(1);
    $("#mensajeC").val("");
    $("#reservaC").val();
    $("#guardaCal").prop('disabled', false);
    $("#actualizaCal").prop('disabled', true);
}


