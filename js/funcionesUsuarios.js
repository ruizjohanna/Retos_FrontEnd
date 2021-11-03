var actualizarVar = 0;

function consultarAdministradorTodo() {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Admin/all',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#TablaResultadoAdministradores").empty();
            $("#TablaResultadoAdministradores").append("<tr>");
            $("#TablaResultadoAdministradores").append("<th>NOMBRE</th>");
            $("#TablaResultadoAdministradores").append("<th>EMAIL</th>");
            $("#TablaResultadoAdministradores").append("<th>EDITAR</th>");
            $("#TablaResultadoAdministradores").append("<th>ELIMINAR</th>");
            $("#TablaResultadoAdministradores").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoAdministradores").append("<tr>");
                $("#TablaResultadoAdministradores").append("<td>" + respuesta[i].name + "</td>");
                $("#TablaResultadoAdministradores").append("<td>" + respuesta[i].email + "</td>");
                $("#TablaResultadoAdministradores").append("<td>" + "<input type='button' value='EDITAR' onclick='traeEditarAdministrador(" + respuesta[i].id + ")'>" + "</td>");
                $("#TablaResultadoAdministradores").append("<td>" + "<input type='button' value='ELIMINAR' onclick='eliminarAdministrador(" + respuesta[i].id + "," + respuesta.length + ")'>" + "</td>");
                $("#TablaResultadoAdministradores").append("</tr>");
            }
        }
    });
}

function guardarAdministrador() {
    if ($('#nombreU').val().trim() == "" || $('#correoU').val().trim() == "" || $('#contrasenaU').val().trim() == "") {
        alert('Campos vacíos, por favor verifique');
    } else {
        var datos = {
            name: $('#nombreU').val(),
            email: $("#correoU").val(),
            password: $("#contrasenaU").val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Admin/save',
            data: datosaEnviar,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Usuario Guardado');
                limpiarFormulario();
            }
        });
    }

}

function traeEditarAdministrador(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Admin/' + ide,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            actualizarVar = respuesta.id;
            $("#nombreU").val(respuesta.name);
            $("#correoU").val(respuesta.email);
            $("#contrasenaU").val(respuesta.password);
            $("#guardaAdm").prop('disabled', true);
            $("#actualizaAdm").prop('disabled', false);
        }
    });
}

function editarAdministrador() {
    if ($('#nombreU').val().trim() == "" || $('#correoU').val().trim() == "" || $('#contrasenaU').val().trim() == "") {
        alert('Campos vacíos, por favor verifique');
    } else {
        var datos = {
            id: actualizarVar,
            name: $('#nombreU').val(),
            email: $("#correoU").val(),
            password: $("#contrasenaU").val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Admin/update',
            data: datosaEnviar,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Administrador Actualizado');
                consultarAdministradorTodo();
                limpiarFormulario();
            }
        });
    }
}

function eliminarAdministrador(ide, cant) {
    if (cant = 1) {
        var opcion = confirm("Es el último administrador, seguro que quieres borrar el administrador?");
        if (opcion == true) {
            $.ajax({
                url: 'http://168.138.144.46:8080/api/Admin/' + ide,
                type: 'DELETE',
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                },
                complete: function (xhr, status) {
                    alert('Administrador Eliminado');
                    consultarAdministradorTodo();
                    limpiarFormulario();
                }
            });
            alert('Administrador eliminado, Sin usuarios de administración!');
        } else {
            alert('Eliminación cancelada');
            consultarAdministradorTodo();
        }
    } else {
        $.ajax({
            url: 'http://168.138.144.46:8080/api/Admin/' + ide,
            type: 'DELETE',
            dataType: 'json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Administrador Eliminado');
                consultarAdministradorTodo();
                limpiarFormulario();
            }
        });
    }
}

function limpiarFormulario() {
    $("#nombreU").val("");
    $("#correoU").val("");
    $("#contrasenaU").val("");
    $("#guardaAdm").prop('disabled', false);
    $("#actualizaAdm").prop('disabled', true);
    ingresoGitHub();
}

function ingresoGitHub() {
    $.ajax({
        url: 'http://168.138.144.46:8080/user',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            alert('Usuario ' + respuesta.name+ 'ingresó correctamente ');
        }
    });
}



