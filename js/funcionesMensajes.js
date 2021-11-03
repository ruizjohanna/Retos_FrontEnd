var actualizarVar = 0;

function getDataCabana() {
    $.ajax({
        type: 'GET',
        url: 'http://168.138.144.46:8080/api/Cabin/all',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#cabanaM").empty();
            let miLista = "";
            for (i = 0; i < respuesta.length; i++) {
                miLista += "<option value=" + respuesta[i].id + ">" + respuesta[i].name + "</option>";
            }
            $("#cabanaM").append(miLista);
        }
    });
}

function getDataCliente() {
    $.ajax({
        type: 'GET',
        url: 'http://168.138.144.46:8080/api/Client/all',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#clienteM").empty();
            let miLista = "";
            for (i = 0; i < respuesta.length; i++) {
                miLista += "<option value=" + respuesta[i].idClient + ">" + respuesta[i].name + "</option>";
            }
            $("#clienteM").append(miLista);
        }
    });
}

function consultarMensajeTodo() {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Message/all',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#TablaResultadoMensajes").empty();
            $("#TablaResultadoMensajes").append("<tr>");
            $("#TablaResultadoMensajes").append("<th>MENSAJE</th>");
            $("#TablaResultadoMensajes").append("<th>CABAÑA</th>");
            $("#TablaResultadoMensajes").append("<th>CLIENTE</th>");
            $("#TablaResultadoMensajes").append("<th>EDITAR</th>");
            $("#TablaResultadoMensajes").append("<th>ELIMINAR</th>");
            $("#TablaResultadoMensajes").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoMensajes").append("<tr>");
                $("#TablaResultadoMensajes").append("<td>" + respuesta[i].messageText + "</td>");
                $("#TablaResultadoMensajes").append("<td>" + respuesta[i].cabin.name + "</td>");
                $("#TablaResultadoMensajes").append("<td>" + respuesta[i].client.name + "</td>");
                $("#TablaResultadoMensajes").append("<td>" + "<input type='button' value='EDITAR' onclick='traeEditarMensaje(" + respuesta[i].idMessage + ")'>" + "</td>");
                $("#TablaResultadoMensajes").append("<td>" + "<input type='button' value='ELIMINAR' onclick='eliminarMensaje(" + respuesta[i].idMessage + ")'>" + "</td>");
                $("#TablaResultadoMensajes").append("</tr>");
            }

        }
    });
}

function traeEditarMensaje(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Message/' + ide,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            actualizarVar = respuesta.idMessage;
            $("#cabanaM").val(respuesta.cabin.id);
            $("#clienteM").val(respuesta.client.idClient);
            $("#mensajeM").val(respuesta.messageText);
            $("#guardaMen").prop('disabled', true);
            $("#actualizaMen").prop('disabled', false);
        }
    });
}

function editarMensaje() {
    if ($('#mensajeM').val().trim() == "") {
        alert('No escribió mensaje, por favor verifique');
    } else {
        var datos = {
            idMessage: actualizarVar,
            cabin: { id: $('#cabanaM').val() },
            client: { idClient: $('#clienteM').val() },
            messageText: $("#mensajeM").val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Message/update',
            data: datosaEnviar,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Mensaje Actualizado');
                consultarMensajeTodo(); //editar
                limpiarFormulario();
            }
        });
    }
}

function eliminarMensaje(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Message/' + ide,
        type: 'DELETE',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            alert('Mensaje  Eliminado');
            consultarMensajeTodo();
        }
    });
}

function guardarMensaje() {
    if ($('#mensajeM').val().trim() == "") {
        alert('No escribió mensaje, por favor verifique');
    } else {
        var datos = {
            messageText: $("#mensajeM").val(),
            client: { idClient: $('#clienteM').val() },
            cabin: { id: $('#cabanaM').val() }
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Message/save',
            data: datosaEnviar,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Mensaje Guardado');
                limpiarFormulario();
            }
        });
    }

}

function limpiarFormulario() {
    $("#cabanaM").val();
    $("#clienteM").val();
    $("#mensajeM").val("");
    $("#guardaMen").prop('disabled', false);
    $("#actualizaMen").prop('disabled', true);
}