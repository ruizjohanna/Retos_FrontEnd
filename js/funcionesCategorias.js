var actualizarVar = 0;

function consultarCategoriaTodo() {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Category/all',
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            $("#TablaResultadoCategorias").empty();
            $("#TablaResultadoCategorias").append("<tr>");
            $("#TablaResultadoCategorias").append("<th>NOMBRE</th>");
            $("#TablaResultadoCategorias").append("<th>DESCRIPCIÓN</th>");
            $("#TablaResultadoCategorias").append("<th>CABAÑAS</th>");
            $("#TablaResultadoCategorias").append("<th>EDITAR</th>");
            $("#TablaResultadoCategorias").append("<th>ELIMINAR</th>");
            $("#TablaResultadoCategorias").append("</tr>");
            for (i = 0; i < respuesta.length; i++) {
                $("#TablaResultadoCategorias").append("<tr>");
                $("#TablaResultadoCategorias").append("<td>" + respuesta[i].name + "</td>");
                $("#TablaResultadoCategorias").append("<td>" + respuesta[i].description + "</td>");
                let caba = " ";
                for (j = 0; j < respuesta[i].cabins.length; j++) {
                    caba += j + 1 + ". " + respuesta[i].cabins[j].name + "<br>"
                }
                $("#TablaResultadoCategorias").append("<td>" + caba + "</td>");
                $("#TablaResultadoCategorias").append("<td>" + "<input type='button' value='EDITAR' onclick='traeEditarCategoria(" + respuesta[i].id + ")'>" + "</td>");
                $("#TablaResultadoCategorias").append("<td>" + "<input type='button' value='ELIMINAR' onclick='eliminarCategoria(" + respuesta[i].id + ", " + respuesta[i].cabins.length + ")'>" + "</td>");
                $("#TablaResultadoCategorias").append("</tr>");
            }

        }
    });
}

function guardarCategoria() {
    if ($('#nombre').val().trim() == "" || $('#descripcion').val().trim() == "") {
        alert('Hay campos vacíos, por favor verifique');
    } else {
        var datos = {
            name: $('#nombre').val(),
            description: $('#descripcion').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Category/save',
            data: datosaEnviar,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Categoría Guardada');
                limpiarFormulario();
            }
        });
    }
}

function traeEditarCategoria(ide) {
    $.ajax({
        url: 'http://168.138.144.46:8080/api/Category/' + ide,
        type: 'GET',
        dataType: 'json',
        success: function (respuesta) {
            console.log(respuesta)
            actualizarVar = respuesta.id;
            $("#nombre").val(respuesta.name);
            $("#descripcion").val(respuesta.description);
            $("#guardaCat").prop('disabled', true);
            $("#actualizaCat").prop('disabled', false);
        }
    });
}

function editarCategoria() {
    if ($('#nombre').val().trim() == "" || $('#descripcion').val().trim() == "") {
        alert('Hay campos vacíos, por favor verifique');
    } else {
        var datos = {
            id: actualizarVar,
            name: $('#nombre').val(),
            description: $('#descripcion').val()
        }

        var datosaEnviar = JSON.stringify(datos);

        $.ajax({
            url: 'http://168.138.144.46:8080/api/Category/update',
            data: datosaEnviar,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Categoría Actualizada');
                consultarCategoriaTodo();
                limpiarFormulario();
            }
        });
    }
}

function eliminarCategoria(ide, val) {

    if (val == 0) {
        $.ajax({
            url: 'http://168.138.144.46:8080/api/Category/' + ide,
            type: 'DELETE',
            dataType: 'json',
            success: function (response) {
                console.log(response);
            },
            complete: function (xhr, status) {
                alert('Categoría Eliminada');
                consultarCategoriaTodo();
                limpiarFormulario();
            }
        });

    } else {
        alert('Hay cabañas asociadas, no se puede eliminar categoría');
    }

}

function limpiarFormulario() {
    $("#nombre").val("");
    $("#marca").val("");
    $("#cuartos").val("");
    $("#descripcion").val("");
    $("#categoria").val(1);
    $("#guardaCat").prop('disabled', false);
    $("#actualizaCat").prop('disabled', true);
}

