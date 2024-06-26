(function($) {
    //Agrega la seleccion a una tabla. Por defecto viene con seleccion completa
    //y se le puede pasar type:"simple" para seleccion normal
    $.fn.addSelection = function(options) {
        var that = this;

        var settings = $.extend({
                type: "all",
                firstTRSelected: true,
            },
            options
        );

        if (settings.firstTRSelected) {
            that.find("tr").first().addClass("active");
        }

        $(document).keydown(function(event) {
            //if ($("#modal_help").is(":hidden") || $(that).parent("table").attr('id').includes("modal_table")) {
            if ($(that).is(":visible")) {
                if (shiftIsPressed && settings.type !== "simple") {
                    if (event.which === 38) {
                        if (that.find("tr.active").prev("tr:visible").length > 0) {
                            that.find("tr.active").prev("tr:visible").addClass("active");
                        }
                    }

                    if (event.which === 40) {
                        if (that.find("tr.active").next("tr:visible").length > 0) {
                            that.find("tr.active").next("tr:visible").addClass("active");
                        }
                    }
                } else {
                    if (event.which === 38) {
                        let currTR = that.find("tr.active").first().prev("tr");
                        let flag = true;
                        while (currTR.length > 0 && flag) {
                            if (currTR.is(":visible")) {
                                that.find("tr").removeClass("active");
                                currTR.addClass("active");
                                flag = false;
                            } else {
                                currTR = currTR.prev("tr");
                            }
                        }
                    }

                    if (event.which === 40) {
                        let currTR = that.find("tr.active").first().next("tr");
                        let flag = true;
                        while (currTR.length > 0 && flag) {
                            if (currTR.is(":visible")) {
                                that.find("tr").removeClass("active");
                                currTR.addClass("active");
                                flag = false;
                            } else {
                                currTR = currTR.next("tr");
                            }
                        }
                    }
                }
            }
        });

        that.on("click", "tr", function(event) {
            if (settings.type === "simple") {
                if ($(this).hasClass("active")) {
                    //$(this).removeClass('active');
                } else {
                    that.find("tr").removeClass("active");
                    $(this).addClass("active");
                    //$(this).css('background-color', '#08C');
                }
            } else {
                if (cntrlIsPressed) {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        //$(this).css('background-color', 'white');
                    } else {
                        $(this).addClass("active");
                        //$(this).css('background-color', '#08C');
                    }
                } else {
                    if (shiftIsPressed) {
                        $(this).addClass("active");
                        var firstrecord = that.find("tr.active").first().index();
                        var lastrecord = that.find("tr.active").last().index();
                        var marcar = false;
                        that.find("tr").each(function(index, el) {
                            if ($(this).index() === firstrecord) {
                                marcar = true;
                            }
                            if ($(this).index() === lastrecord) {
                                marcar = false;
                            }
                            if (marcar === true) {
                                $(this).addClass("active");
                                //$(this).css('background-color', '#08C');
                            }
                        });
                    } else {
                        if ($(this).hasClass("active")) {
                            that.find("tr").removeClass("active");
                            $(this).addClass("active");
                            //$(this).css('background-color', '#08C');
                        } else {
                            that.find("tr").removeClass("active");
                            $(this).addClass("active");
                            //$(this).css('background-color', '#08C');
                        }
                    }
                }
            }
        });
    };
})(jQuery);

(function($) {
    //Se le tiene que asociar a una tabla. Nada mas hay que pasarle el controller,
    //y es preferible que el body de la tabla tenga el mismo ID que la tabla_tbody,
    //pero no es obligatorio para el plugin. En caso de que sea necesario,
    //se le puede pasar un parametro mas para query en 4d
    //Se le pueden pasar los parametros para sacarle botones, la busqueda, y
    //cambiarle el tipo de seleccion.
    $.fn.loadOutput = function(options) {
        var yo = this;

        var settings = $.extend({
                controller: yo.attr("controller"),
                pantalla: yo.attr("id"),
                pantallaDialog: "",
                search: true,
                selection: "all",
                refreshButton: true,
                editButton: true,
                newButton: true,
                deleteButton: true,
                printButton: false,
                youTubeButton: true,
                infoButton: true,
                emailButton: false,
                saveButton: true,
                contador: true,
                paginator: true,
                outputType: "normal",
                extraParam: null,
                specialFindby: "getAll",
                specialValue: "",
                numeroPantalla: "0",
                numeroModulo: "0",
                numeroTabla: "0",
                color: "#006394",
                filtro: null,
                filtroDefault: [],
                defaultOrder: "id",
                defaultSentido: "desc",
                dialog: "",
                dialogWidth: 600,
                changeID: true,
                multiSelect: false,
                cantRegistros: 30,
                addObj: {},
                dialogNewRecordServerCall: false,
                onOperationMod: function(tr) {},
                onTableReady: function(json) {},
                onDialogSave: function(json) {},
                onQuickSave: function(json) {},
                onDelete: function(json) {},
                onRefresh: function(json) {},
            },
            options || {}
        );

        var table;
        var page = 1;
        var finalpage;
        var field = settings.specialFindby;
        var valor = settings.specialValue;
        var sentido = settings.defaultSentido;
        var campo = settings.defaultOrder;
        var filtrado = new Object();

        for (var key in settings.filtro) {
            filtrado[key] = false;
        }

        if (settings.filtroDefault.length > 0) {
            filtrado["todos_filtro"] = false;
            for (var i = 0; i < settings.filtroDefault.length; i++) {
                let valFiltro = settings.filtroDefault[i];
                filtrado[valFiltro] = true;
            }
        } else {
            filtrado["todos_filtro"] = true;
        }

        cargarDivs();

        if (settings.outputType.toLowerCase() == "operation" || settings.multiSelect || settings.filtro != null) {
            createMultiSelect(settings.filtro, settings.pantalla, settings.controller + "_buscador_" + settings.pantalla);
        }

        cargar_tabla(page, settings.specialFindby, settings.specialValue);

        traductor.TraducirScope(yo);

        function cargar_tabla(currentpage, type, value) {
            var obj = new Object();
            var paginator = object_paginator(currentpage, 0, settings.cantRegistros);
            obj = mergeObject(obj, filtrado);
            obj = mergeObject(obj, settings.addObj);
            obj["orden_sentido"] = sentido;
            obj["orden_campo"] = campo;
            if (settings.extraParam != null) {
                obj["extraParam"] = settings.extraParam;
            }
            if (type == "getAll" || value == "") {
                var server = new $4D.Server(settings.controller, settings.specialFindby, obj, paginator);
            } else {
                obj[type] = value;
                var server = new $4D.Server(settings.controller, "findby" + type, obj, paginator);
            }
            server.Success = function(json, pags, columns) {
                var trHtml = "";
                finalpage = pags.totalPage;
                paginate(settings.controller, settings.controller + "_paginador_" + settings.pantalla, pags, type, value);
                contador_de_registros(settings.controller + "_contador_" + settings.pantalla, json, pags);
                var filasSeleccionadas = "";
                $(yo)
                    .find("tr.active")
                    .each(function(index, el) {
                        if (index > 0) {
                            filasSeleccionadas += ",";
                        }
                        filasSeleccionadas += $(this).attr("id");
                    });
                $(yo).children("tbody").empty();
                // for (var i = json.length - 1; i > -1; i--) {
                for (var i = 0; i < json.length; i++) {
                    var row = json[i];
                    let annulled = false;
                    if (json[i].Annulled != undefined) {
                        if (json[i].Annulled.toLowerCase() == "true") {
                            annulled = true;
                        }
                    }

                    if (annulled) {
                        trHtml += '<tr id="' + json[i].ID + '" class="anulled">';
                    } else {
                        trHtml += '<tr id="' + json[i].ID + '">';
                    }

                    let color = "white";

                    if (json[i].Color != undefined) {
                        color = json[i].Color;
                    }

                    var j = 1;

                    for (var key in row) {
                        style = "background-color:" + color + ";";
                        tdVal = "";

                        if (
                            $(yo)
                            .find("thead > tr > th:nth-child(" + j + ")")
                            .css("display") == "none"
                        ) {
                            style += "display:none;";
                        }

                        if (settings.outputType.toLowerCase() != "normal") {
                            style += "white-space:nowrap;";
                        }

                        if (
                            $(yo)
                            .find("thead > tr > th:nth-child(" + j + ")")
                            .hasAttr("num")
                        ) {
                            style += "text-align:right;";
                        }

                        trHtml += '<td key="' + key + '" style="' + style + '">';

                        if (row[key] == "True") {
                            tdVal = "\u2714";
                        }

                        if (row[key] == "False") {
                            tdVal = " "; // Era X antes 31/5/21
                        }

                        if (
                            $(yo)
                            .find("thead > tr > th:nth-child(" + j + ")")
                            .hasAttr("num")
                        ) {
                            let quantity = 2;
                            if (
                                $(yo)
                                .find("thead > tr > th:nth-child(" + j + ")")
                                .hasAttr("decimales")
                            ) {
                                quantity = $(yo)
                                    .find("thead > tr > th:nth-child(" + j + ")")
                                    .attr("decimales");
                            }
                            tdVal = separate_number(format_number(row[key], CurrentUser.serverFormat, quantity), CurrentUser.serverFormat);
                        }

                        if (tdVal == "") {
                            tdVal = row[key];
                            if (tdVal.length > 120) {
                                tdVal = tdVal.substring(0, 120) + "...";
                            }
                        }

                        trHtml += tdVal + "</td>";
                        j++;
                    }
                    trHtml += "</tr>";
                }

                $(yo).append(trHtml);

                var i = 1;
                for (var key in json[0]) {
                    $(yo)
                        .find("thead > tr > th:nth-child(" + i + ")")
                        .attr("value", key);
                    i++;
                }

                //if (table == undefined) {
                if ($("#" + settings.controller + "_buscador_" + settings.pantalla + "_Search").length == 0) {
                    createSearch(columns, settings.controller + "_buscador_" + settings.pantalla);
                }

                if (settings.outputType.toLowerCase() == "operation") {
                    $(yo).find("tbody").find("tr").children("td:first-child").css("position", "absolute");
                    let firstTdWidth = $(yo).find("tbody").find("tr").first().find("td").first().css("width");
                    $(yo).find("th").first().css("min-width", firstTdWidth);
                }

                if (filasSeleccionadas.length > 0) {
                    let selecFilas = filasSeleccionadas.split(",");
                    for (let i = 0; i < selecFilas.length; i++) {
                        $(yo)
                            .find("#" + selecFilas[i])
                            .addClass("active");
                    }
                }

                settings.onRefresh.call(json);
            };
            server.Error = function(json) {
                $(yo).children("tbody").empty();
            };
            server.Complete = function(json) {
                if (table == undefined) {
                    $(yo).attr("modulo", settings.numeroModulo);
                    $(yo).attr("funcion", settings.numeroPantalla);
                    $(yo).attr("tabla", settings.numeroTabla);

                    $(yo).find("thead").find("tr").children("th").addClass("task");
                    $(yo).find("thead").find("tr").children("th").attr("sentido", "asc");
                    $(document).ready(function() {
                        if (settings.outputType.toLowerCase() != "operation") {
                            table = yo.DataTable({
                                responsive: false,
                                bPaginate: false,
                                compact: true,
                                ordering: false,
                                bFilter: false,
                                info: false,
                            });
                            $(yo).find("th").css("background-color", settings.color);
                            $(yo).css("border-color", settings.color);
                            $(yo).children("thead").css("background-color", settings.color);
                            $(yo).css("overflow", "hidden");
                        } else {
                            table = yo;
                            if (settings.outputType.toLowerCase() == "operation") {
                                var ancho = $("#GeneralNavTabs").width();
                                $(yo).css("width", ancho);
                                // $(yo).children('thead').children('tr').children('th').css('width', '4cm');
                                $(yo).children("thead").children("tr").children("th:first-child").css({ position: "sticky", left: "0", "background-color": settings.color });
                            }
                            $(yo).css("clear", "both");
                            $(yo).children("thead").css("background-color", settings.color);
                            $(yo).children("thead").children("tr").children("th").css("color", "white");
                            $(yo).css("border-color", settings.color);
                            $(yo).css("border-radius", "6px");
                            $(yo).css("margin-top:", "6px");
                            $(yo).css("margin-bottom", "6px");
                            $(yo).css("max-width", "none");
                        }
                    });
                    $("#spinner_" + settings.pantalla).hide();
                    $(yo).show();
                    $("#" + settings.controller + "_buscador_" + settings.pantalla + "_Search > :input").keyup(function(event) {
                        var input = this;
                        keyUpDelay(function() {
                            valor = $(input).val();
                            field = $("#" + settings.controller + "_buscador_" + settings.pantalla + "_Search > select option:selected").attr("key");
                            page = 1;
                            if (valor == "") {
                                valor = settings.specialValue;
                            }
                            cargar_tabla(page, field, valor);
                        });
                    });
                    // $("#" + settings.controller + '_buscador_' + settings.pantalla).change(function(event) {
                    //     cargar_tabla(page, field, valor);
                    // });
                    // POR AHORA
                    if (settings.outputType.toLowerCase() != "dialog") {
                        search_order(settings.pantalla);
                    }
                    settings.onTableReady.call(json);
                }

                if (settings.outputType.toLowerCase() == "operation") {
                    // $(yo).find("tbody").find('tr').children('td:first-child').css('position', 'absolute');
                    $(yo).find("tbody").find("tr").children("td:first-child").css({ position: "sticky", left: "0", width: "fit-content" });
                    // let firstTdWidth = 0;
                    // $(yo).find("tbody").find('tr').find('td:eq(0)').each(function(index, el) {
                    //     let largoTD = $(this).css('width');
                    //     largoTD = largoTD.replaceAll('px', '');
                    //     pLargoTD = parseFloat(largoTD);
                    //     if (pLargoTD > firstTdWidth) {
                    //         firstTdWidth = pLargoTD;
                    //     }
                    // });
                    // $(yo).find("tbody").find('tr').find('td:eq(0)').css('width', firstTdWidth + "px");
                    // $(yo).find('th').first().css('min-width', firstTdWidth + "px");
                }
            };
            server.Execute();
        }

        if (settings.outputType.toLowerCase() == "operation") {
            $("#filtro_de_ope_" + settings.pantalla).click(function(event) {
                //Pase el switch aca para mostrar y esconder los campos segun el tipo de operacion
                //dejo seteado lo de terrestre y OPE pero en el HTML hay que agregarlos
                let op_type = settings.numeroPantalla;

                switch (op_type) {
                    case "0037":
                        op_type = "1";
                        $(".tipoOpeAir").show();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").hide();
                        break;
                    case "0050":
                        op_type = "2";
                        $(".tipoOpeAir").show();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").hide();
                        break;
                    case "0042":
                        op_type = "3";
                        $(".tipoOpeAir").hide();
                        $(".tipoOpeMaritime").show();
                        $(".tipoOpeTerrestre").hide();
                        break;
                    case "0046":
                        op_type = "4";
                        $(".tipoOpeAir").hide();
                        $(".tipoOpeMaritime").show();
                        $(".tipoOpeTerrestre").hide();
                        break;
                    case "0096":
                        op_type = "5";
                        $(".tipoOpeAir").hide();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").show();
                        break;
                    case "0097":
                        op_type = "6";
                        $(".tipoOpeAir").hide();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").show();
                        break;
                    case "0112":
                        op_type = "7";
                        $(".tipoOpeAir").hide();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").show();
                        break;
                    case "0305":
                    case "0305_2":
                        op_type = "14";
                        $(".tipoOpeAir").show();
                        $(".tipoOpeMaritime").hide();
                        $(".tipoOpeTerrestre").hide();
                        break;
                }

                $("#dialog_filtro_operaciones")
                    .dialog({
                        width: 800,
                        title: "Filtro de Operaciones",
                        buttons: {
                            buscar: {
                                text: "Buscar",
                                class: "btn btn-success",
                                id: "save_item_dialog_filtro_operaciones",
                            },
                        },
                        close: function(event) {
                            $("#dialog_filtro_operaciones").emptyFields();
                            $(document.body).find("[aria-describedby='dialog_filtro_operaciones']").destroyElement();
                        },
                    })
                    .prev(".ui-dialog-titlebar")
                    .css("background", "#337ab7");

                $("#save_item_dialog_filtro_operaciones")
                    .unbind()
                    .click(function(event) {
                        let obj_ope = $("#dialog_filtro_operaciones").createObject({
                            pantalla: "filtro_operaciones",
                            registro: "",
                            controller: "Operaciones",
                            save: false,
                        });

                        // let op_type = settings.numeroPantalla;

                        // switch (op_type) {
                        //     case "0037":
                        //         op_type = "1";
                        //         break;
                        //     case "0050":
                        //         op_type = "2";
                        //         break;
                        //     case "0042":
                        //         op_type = "3";
                        //         break;
                        //     case "0046":
                        //         op_type = "4";
                        //         break;
                        // }

                        obj_ope["OP_Type"] = op_type;

                        let temp_controller = settings.controller;
                        let temp_action = settings.action;
                        let temp_specialFindby = settings.specialFindby;
                        settings.controller = "Operaciones";
                        settings.action = "FILTRO_OPERACIONES";
                        settings.addObj = obj_ope;
                        settings.specialFindby = "FILTRO_OPERACIONES";

                        cargar_tabla(1, "getAll", "");

                        settings.controller = temp_controller;
                        settings.action = temp_action;
                        settings.specialFindby = temp_specialFindby;

                        $("#dialog_filtro_operaciones").dialog("close");
                        $("#save_item_dialog_" + settings.pantalla).unbind("click");
                    });
            });
        }

        $("#" + settings.controller + "_paginador_" + settings.pantalla).on("click", "a", function() {
            var this_page = $(this).text();
            if (this_page == "Previous" && page != 1) {
                page--;
                cargar_tabla(page, field, valor);
            }
            if (this_page == "Next" && page != finalpage) {
                page++;
                cargar_tabla(page, field, valor);
            }
            if (this_page != "Next" && this_page != "Previous") {
                page = parseInt(this_page);
                cargar_tabla(page, field, valor);
            }
        });

        $(".tooltip-demo").tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body",
        });

        $(yo).children("tbody").addSelection({ type: settings.selection });

        $("#" + settings.pantalla + " > thead > tr > th").click(function() {
            campo = $(this).attr("value");
            sentido = $(this).attr("sentido");
            if (sentido == "asc") {
                $(this).attr("sentido", "desc");
            } else {
                $(this).attr("sentido", "asc");
            }
            page = 0;
            if (campo != "" && sentido != "") {
                cargar_tabla(page, field, valor);
            }
        });

        $("#refresh_table_" + settings.pantalla).click(function(event) {
            if (settings.search) {
                valor = $("#" + settings.controller + "_buscador_" + settings.pantalla + "_Search")
                    .find("input")
                    .val();
                field = $("#" + settings.controller + "_buscador_" + settings.pantalla + "_Search > select option:selected").attr("key");
            } else {
                valor = "";
                field = settings.specialFindby;
            }
            page = 1;
            if (valor == "" || valor == undefined) {
                valor = settings.specialValue;
                field = settings.specialFindby;
            }
            cargar_tabla(1, field, valor);
        });

        $("#export_" + settings.pantalla).click(function(event) {
            $("#modal_export_principal").modal("show");
            $("#name_export_modal").val("doc");

            var this_text = $(yo).html();

            click_event_export(this_text);

            function click_event_export(this_text) {
                $("#modal_export_save").click(function(event) {
                    var nombre = $("#name_export_modal").val();
                    var blob = new Blob([this_text], { type: "text/plain;charset=utf-8" });
                    var extension = $("#export_extension").val();
                    saveAs(blob, nombre + extension);
                    $("#modal_export_principal").modal("hide");
                    $("#modal_export_save").unbind("click");
                    event.stopImmediatePropagation();
                });
            }

            $("#modal_export_close").click(function(event) {
                $("#modal_export_principal").modal("hide");
            });
        });

        if (settings.outputType.toLowerCase() == "operation" || settings.multiSelect) {
            //$("#checkboxes_" + settings.pantalla).children().first().children().first().prop('checked', true);
            for (var key in filtrado) {
                $("#checkboxes_" + settings.pantalla)
                    .find("[filtro='" + key + "']")
                    .prop("checked", filtrado[key]);
            }

            $("#checkboxes_" + settings.pantalla)
                .children()
                .click(function(event) {
                    if ($(this).children().first().is(":checked")) {
                        $(this).children().first().prop("checked", false);
                        filtrado[$(this).children().first().attr("filtro")] = false;
                    } else {
                        $(this).children().first().prop("checked", true);
                        if ($(this).children().first().attr("filtro") != "todos_filtro") {
                            $("#checkboxes_" + settings.pantalla)
                                .children()
                                .first()
                                .children()
                                .first()
                                .prop("checked", false);
                            filtrado["todos_filtro"] = false;
                        } else {
                            $("#checkboxes_" + settings.pantalla)
                                .children()
                                .each(function(index, el) {
                                    $(this).children().first().prop("checked", false);
                                    filtrado[$(this).children().first().attr("filtro")] = false;
                                });
                            $(this).children().first().prop("checked", true);
                            filtrado["todos_filtro"] = true;
                        }
                        filtrado[$(this).children().first().attr("filtro")] = true;
                    }
                    page = 1;
                    cargar_tabla(page, field, valor);
                });
        }

        if (settings.outputType.toLowerCase() == "operation") {
            $("#edit_ope_record_" + settings.pantalla).click(function(event) {
                if ($(yo).find("input").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "MOD")).done(function(res) {
                        var tr = $(yo).find("tr.active");
                        var regId = tr.find("td:eq( 0 )").text();
                        $.when(checkear(regId, settings.numeroTabla, settings.numeroPantalla)).fail(function(res) {
                            $(tr).createInputRow({ pantalla: settings.pantalla });
                            settings.onOperationMod.call(tr);
                            $(tr).find("td:eq(3)").find("input:first-child").focus();
                            $("#save_ope_record_" + settings.pantalla).click(function(event) {
                                var error = $(tr).checkFields();
                                if (error == false) {
                                    var obj = $(tr).createObject({
                                        pantalla: settings.pantalla,
                                        registro: regId,
                                        controller: settings.controller,
                                        save: true,
                                        saveAction: "save_output",
                                        onSuccess: function() {
                                            $(tr).createInputRow({ mode: "disable" });
                                            liberar(regId, settings.numeroTabla);
                                            $("#save_ope_record_" + settings.pantalla).unbind("click");
                                        },
                                    });
                                }
                            });
                        });
                    });
                    $(window).keypress(function(event) {
                        if (event.which == 27) {
                            console.log("esc");
                            // var delobj = new Object();
                            // delobj['id'] = $(new_tr).attr('id');
                            // var delserver = new $4D.Server(settings.controller, "delete", delobj);
                            // delserver.Success = function() {
                            //     $(new_tr).remove();
                            // };
                            // delserver.Execute();
                            // $(this).unbind(event);
                        }
                    });
                } else {
                    Swal.fire("Cuidado", "Ya esta modificando un registro", "warning");
                }
            });

            $("#new_ope_record_" + settings.pantalla).click(function(event) {
                if ($(yo).find("input").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ING")).done(function(res) {
                        var datenow = new Date();
                        datenow = datenow.toLocaleDateString();
                        datenow = date_to_html(datenow);
                        var new_tr = $(yo).children("tbody").find("tr").first().clone();
                        new_tr.children("td").text("");
                        $(yo).prepend(new_tr);
                        $(new_tr).createInputRow({ pantalla: settings.pantalla });
                        var obj = new Object();
                        var serverid = new $4D.Server(settings.controller, "create_id", obj);
                        $.when(serverid.Execute()).done(function(respuesta) {
                            $(new_tr).find("td").first().text(respuesta.ID);
                            $(new_tr).find("td:eq(2)").find("input").val(currentDay());
                            $(new_tr).attr("id", respuesta.ID);
                        });
                        new_tr.find("td:eq(2)").children("input").val(datenow);
                        new_tr.find("td:eq(3)").children("input").focus();
                        settings.onOperationMod.call(new_tr);
                        $("#save_ope_record_" + settings.pantalla).click(function(event) {
                            var error = $(new_tr).checkFields();
                            if (error == false) {
                                var obj = $(new_tr).createObject({
                                    pantalla: settings.pantalla,
                                    registro: "vacio",
                                    controller: settings.controller,
                                    save: true,
                                    saveAction: "save_output",
                                    onSuccess: function(newId) {
                                        $(new_tr).find("td:eq(0)").text(newId.ID);
                                        $(new_tr).find("td:eq(1)").text(newId.status);
                                        $(new_tr).createInputRow({ mode: "disable" });
                                        $("#save_ope_record_" + settings.pantalla).unbind("click");
                                    },
                                });
                            }
                        });
                        $(window).keypress(function(event) {
                            if (event.key == "Escape") {
                                console.log("esc");
                                // var delobj = new Object();
                                // delobj['id'] = $(new_tr).attr('id');
                                // var delserver = new $4D.Server(settings.controller, "delete", delobj);
                                // delserver.Success = function() {
                                //     $(new_tr).remove();
                                // };
                                // delserver.Execute();
                                // $(this).unbind(event);
                            }
                        });
                    });
                } else {
                    Swal.fire("Cuidado", "No puede crear un registro mientras modifica otro", "warning");
                }
            });

            $(yo)
                .find("tbody")
                .on("dblclick", "tr", function() {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ENT")).done(function() {
                        var id_reg = $("#" + settings.pantalla)
                            .find("tbody")
                            .find("tr.active")
                            .attr("id");
                        abrir_input(id_reg, settings.numeroTabla, settings.numeroPantalla + "_in", "open");
                        $("#btnX" + settings.numeroPantalla + "_in" + id_reg).click(function(event) {
                            $("#refresh_table_" + settings.pantalla).trigger("click");
                        });
                    });
                });
        }

        if (settings.outputType.toLowerCase() == "quick") {
            $("#edit_record_" + settings.pantalla).click(function(event) {
                if ($(yo).find("input").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "MOD")).done(function(res) {
                        var tr = $(yo).find("tr.active");
                        var regId = tr.find("td:eq( 0 )").text();
                        $.when(checkear(regId, settings.numeroTabla, settings.numeroPantalla)).fail(function(res) {
                            $.serverValidation({
                                controller: settings.controller,
                                action: "getInput",
                                obj: { id: regId },
                                showSuccessMsg: false,
                                showErrorMsg: false,
                                onComplete: function(json) {
                                    let regObjQuick = this.ResultSet[0];
                                    console.log(regObjQuick);
                                    $(tr).createInputRow({ pantalla: settings.pantalla });
                                    settings.onOperationMod.call(tr);
                                    $(tr).find("td:eq(1)").find("input:first-child").focus();
                                    $("#save_record_" + settings.pantalla).click(function(event) {
                                        var error = $(tr).checkFields();
                                        if (error == false) {
                                            var obj = $(tr).createObject({
                                                pantalla: settings.pantalla,
                                                registro: regId,
                                                controller: settings.controller,
                                                save: true,
                                                extraParam: settings.extraParam,
                                                regObj: regObjQuick,
                                                onSuccess: function(json) {
                                                    $(tr).createInputRow({ mode: "disable" });
                                                    settings.onQuickSave.call(this);
                                                    liberar(regId, settings.numeroTabla);
                                                    console.log("save");
                                                    $("#refresh_table_" + settings.pantalla).trigger("click");
                                                    $("#save_record_" + settings.pantalla).unbind();
                                                },
                                            });
                                        }
                                    });
                                },
                            });
                        });
                    });
                } else {
                    Swal.fire("Cuidado", "Ya esta modificando un registro", "warning");
                }
            });

            $("#new_record_" + settings.pantalla).click(function(event) {
                if ($(yo).find("input").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ING")).done(function(res) {
                        var new_tr = "<tr id='tr_vacio'>";
                        $(yo)
                            .find("th")
                            .each(function(index, el) {
                                if ($(this).css("display") == "none") {
                                    new_tr += "<td style='display:none' key='" + $(this).attr("key") + "'></td>";
                                } else {
                                    new_tr += "<td key='" + $(this).attr("key") + "'></td>";
                                }
                            });
                        new_tr += "</tr>";
                        $(yo).prepend(new_tr);
                        new_tr = $(yo).children("tbody").find("tr").first();
                        $(new_tr).createInputRow({ pantalla: settings.pantalla });
                        settings.onOperationMod.call(new_tr);
                        $("#save_record_" + settings.pantalla).click(function(event) {
                            var error = $(new_tr).checkFields();
                            if (error == false) {
                                var obj = $(new_tr).createObject({
                                    pantalla: settings.pantalla,
                                    registro: "vacio",
                                    controller: settings.controller,
                                    extraParam: settings.extraParam,
                                    save: true,
                                    onSuccess: function(newId) {
                                        // $(new_tr).find('td:eq(0)').text(newId.ID);
                                        // $(new_tr).createInputRow({ mode: 'disable' });
                                        console.log("save");
                                        settings.onQuickSave.call(this);
                                        $("#save_record_" + settings.pantalla).unbind();
                                        $("#refresh_table_" + settings.pantalla).trigger("click");
                                    },
                                });
                            }
                        });
                    });
                } else {
                    Swal.fire("Cuidado", "No puede crear un registro mientras modifica otro", "warning");
                }
            });

            // $('#delete_record_' + settings.pantalla).click(function(event) {
            //     if ($(yo).find('input').length == 0) {
            //         $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'DEL')).done(function(res) {
            //             $(yo).find('tr.active').each(function(index, el) {
            //                 var delobj = new Object();
            //                 delobj['ID'] = $(this).attr('id');
            //                 var delserver = new $4D.Server(settings.controller, "delete", delobj);
            //                 delserver.Success = function() {
            //                     $(this).remove();
            //                     $('#refresh_table_' + settings.pantalla).trigger('click');
            //                 };
            //                 delserver.Execute();
            //             });
            //         });
            //     } else {
            //         Swal.fire('Cuidado', 'No puede eliminar un registro mientras modifica otro', 'warning');
            //     }
            // });
        }

        if (settings.pantallaDialog == "") {
            settings.pantallaDialog = settings.pantalla;
        }

        if (settings.outputType.toLowerCase() == "dialog") {
            let extraParamDialog = "";
            if (settings.changeID) {
                $("#" + settings.dialog).modifyAllIDs({ value: settings.extraParam }); //Le pongo el ID del padre para que no haya que eliminar los eventos y crearlos todas las veces
                extraParamDialog = settings.extraParam;
            }

            $("#edit_record_" + settings.pantalla).click(function(event) {
                if (!$(yo).find("tbody").find("tr.active").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "MOD")).done(function(res) {
                        if (!$(yo).find("tbody").find("tr.active").hasClass("anulled")) {
                            var regId = $(yo).find("tbody").find("tr.active").attr("id");
                            $.when(checkear(regId, settings.numeroTabla, settings.numeroPantalla)).fail(function(res) {
                                $("#" + settings.dialog + extraParamDialog).loadDialog({
                                    esDependiente: true,
                                    idExterno: settings.extraParam,
                                    idreg: regId,
                                    action: "edit",
                                    controller: settings.controller,
                                    pantalla: settings.pantallaDialog,
                                    width: settings.dialogWidth,
                                    onOpen: function(json) {
                                        settings.onOperationMod.call($("#" + settings.dialog + extraParamDialog), json);
                                    },
                                    onSave: function(json) {
                                        settings.onDialogSave.call(this);
                                        $("#refresh_table_" + settings.pantalla).trigger("click");
                                    },
                                });
                            });
                        } else {
                            Swal.fire("Cuidado", "No se puede modficar un registro anulado", "warning");
                        }
                    });
                } else {
                    Swal.fire("Cuidado", "Debe seleccionar un registro para editar", "warning");
                }
            });

            $("#new_record_" + settings.pantalla).click(function(event) {
                $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ING")).done(function(res) {
                    let idNuevoDialog = "vacio";
                    if (!settings.dialogNewRecordServerCall) {
                        idNuevoDialog = "nuevo";
                    }
                    $("#" + settings.dialog + extraParamDialog).loadDialog({
                        esDependiente: true,
                        idExterno: settings.extraParam,
                        idreg: idNuevoDialog,
                        action: "new",
                        controller: settings.controller,
                        pantalla: settings.pantallaDialog,
                        width: settings.dialogWidth,
                        onOpen: function(json) {
                            settings.onOperationMod.call($("#" + settings.dialog + extraParamDialog), json);
                        },
                        onSave: function(json) {
                            settings.onDialogSave.call(this);
                            $("#refresh_table_" + settings.pantalla).trigger("click");
                        },
                    });
                });
            });

            // $('#delete_record_' + settings.pantalla).click(function(event) {
            //     $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'DEL')).done(function(res) {
            //         var delobj = new Object();
            //         $(yo).find('tr.active').each(function(index, el) {
            //             delobj['ID'] = $(this).attr('id');
            //             var delserver = new $4D.Server(settings.controller, "delete", delobj);
            //             delserver.Success = function() {
            //                 $('#refresh_table_' + settings.pantalla).trigger('click');
            //             };
            //             delserver.Execute();
            //         });
            //     });
            // });

            $(yo)
                .find("tbody")
                .on("dblclick", "tr", function() {
                    if ($(yo).hasAttr("auto-edit") && settings.editButton == true) {
                        $("#edit_record_" + settings.pantalla).trigger("click");
                    } else {
                        $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ENT")).done(function() {
                            var regId = $(yo).find("tbody").find("tr.active").attr("id");
                            $("#" + settings.dialog + extraParamDialog).loadDialog({
                                esDependiente: true,
                                idExterno: settings.extraParam,
                                idreg: regId,
                                action: "open",
                                controller: settings.controller,
                                pantalla: settings.pantallaDialog,
                                width: settings.dialogWidth,
                                onOpen: function(json) {
                                    settings.onOperationMod.call($("#" + settings.dialog + extraParamDialog), json);
                                },
                            });
                        });
                    }
                });
        }

        if ((settings.outputType.toLowerCase() == "normal" || settings.outputType.toLowerCase() == "operation") && settings.numeroTabla != "0") {
            $(yo)
                .find("tbody")
                .on("dblclick", "tr", function() {
                    if ($(yo).hasAttr("auto-edit") && settings.editButton == true) {
                        $("#edit_record_" + settings.pantalla).trigger("click");
                    } else {
                        $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ENT")).done(function() {
                            var id_reg = $("#" + settings.pantalla)
                                .find("tbody")
                                .find("tr.active")
                                .attr("id");
                            abrir_input(id_reg, settings.numeroTabla, settings.numeroPantalla + "_in", "open");
                            if (settings.outputType.toLowerCase() != "operation") {
                                settings.onOperationMod.call(id_reg);
                            }
                            $("#btnX" + settings.numeroPantalla + "_in" + id_reg).click(function(event) {
                                $("#refresh_table_" + settings.pantalla).trigger("click");
                            });
                        });
                    }
                });

            $("#edit_record_" + settings.pantalla).click(function() {
                if (!$(yo).find("tbody").find("tr.active").length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "MOD")).done(function() {
                        if (!$("#" + settings.pantalla)
                            .find("tbody")
                            .find("tr.active")
                            .hasClass("anulled")
                        ) {
                            var id_reg = $("#" + settings.pantalla)
                                .find("tbody")
                                .find("tr.active")
                                .attr("id");
                            abrir_input(id_reg, settings.numeroTabla, settings.numeroPantalla + "_in", "edit");
                            setTimeout(function() {
                                if (settings.outputType.toLowerCase() != "operation") {
                                    settings.onOperationMod.call(id_reg);
                                }
                                $("#btnX" + settings.numeroPantalla + "_in" + id_reg).click(function(event) {
                                    $("#refresh_table_" + settings.pantalla).trigger("click");
                                });
                            }, 1000);
                        } else {
                            Swal.fire("Cuidado", "No se puede modficar un registro anulado", "warning");
                        }
                    });
                } else {
                    Swal.fire("Cuidado", "Debe seleccionar un registro para editar", "warning");
                }
            });

            $("#new_record_" + settings.pantalla).click(function() {
                $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "ING")).done(function() {
                    AgregarTabIn(settings.numeroPantalla + "_in", "vacio");
                    setTimeout(function() {
                        if (settings.outputType.toLowerCase() != "operation") {
                            settings.onOperationMod.call("vacio");
                        }
                        $("#btnX" + settings.numeroPantalla + "_invacio").click(function(event) {
                            setTimeout(function() {
                                $("#refresh_table_" + settings.pantalla).trigger("click");
                            }, 500);
                        });
                    }, 1000);
                });
            });
        }

        // HAY QUE BUSCAR UNOS COMANDOS QUE NO INTERFIERAN CON NADA
        $(window).keypress(function(event) {
            if ($(yo).is(":visible") && $(yo).isInViewport()) {
                if (shiftIsPressed) {
                    switch (event.code) {
                        case "KeyM":
                            $("#edit_record_" + settings.pantalla).trigger("click");
                            break;
                        case "KeyS":
                            $("#save_record_" + settings.pantalla).trigger("click");
                            break;
                        case "KeyN":
                            $("#new_record_" + settings.pantalla).trigger("click");
                            break;
                        case "KeyD":
                            $("#delete_record_" + settings.pantalla).trigger("click");
                            break;
                        case "KeyR":
                            $("#refresh_table_" + settings.pantalla).trigger("click");
                            break;
                        case "KeyP":
                            $("#print_record_" + settings.pantalla).trigger("click");
                            break;
                    }
                }
            }
        });

        $("#delete_record_" + settings.pantalla).click(function(event) {
            let rec_id = $(yo).find("tbody").find("tr.active").first().attr("id");
            let rec_id_last = $(yo).find("tbody").find("tr.active").last().attr("id");
            let textDel = "Estas seguro que quieres eliminar el resgistro " + rec_id + "?";
            if (rec_id != rec_id_last) {
                textDel = "Estas seguro que quieres eliminar desde el resgistro " + rec_id + " al registro " + rec_id_last + "?";
            }
            let pantalla = $("#GeneralNavTabs").find("li.active").children("a").text();
            $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, "DEL")).done(function() {
                Swal.fire({
                    title: "Cuidado!",
                    text: textDel,
                    type: "warning",
                    confirmButtonText: "Si",
                    showCancelButton: true,
                }).then((confirmado) => {
                    if (confirmado.isConfirmed) {
                        cargarHistorial(pantalla, "DEL", rec_id);
                        settings.onDelete.call();
                    }
                });
            });
        });

        function cargarDivs() {
            var div_buttons;

            if (settings.search == true) {
                var div_buscador = '<div id="' + settings.controller + "_buscador_" + settings.pantalla + '" style="float:left;"></div>';
                $(div_buscador).insertBefore(yo);
            }

            if (settings.contador == true) {
                var div_contador = '<div id="' + settings.controller + "_contador_" + settings.pantalla + '" style="float: left;width: 30%"></div>';
                $(yo).after(div_contador);
            }

            if (settings.paginator == true) {
                var div_paginador = '<div id="' + settings.controller + "_paginador_" + settings.pantalla + '" style="float: right;width: 50%"></div>';
                $(yo).after(div_paginador);
            }

            var div_video = '    <div class="footer navbar-fixed-bottom" style="display: none;" id="div_video_' + settings.pantalla + '"></div>';

            var div_spinner = '<div id="spinner_' + settings.pantalla + '" align="center"><br><br><br><br><br><img src="../dist/Images/spin.gif"></div>';

            div_buttons = '<div id="buttons_' + settings.pantalla + '" class="tooltip-demo" style="margin-top: 2mm;float: right;margin-bottom:1px;">';

            if (settings.deleteButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="DEL" class="btn btn-outline btn-danger btn-xs" id="delete_record_' + settings.pantalla + '" data-toggle="tooltip" title="Delete(Shift+D)"><i class="fa fa-minus"></i></button></span>';
            }

            if (settings.outputType.toLowerCase() == "quick" && settings.saveButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="save_record_' + settings.pantalla + '" data-toggle="tooltip" title="Save(Shift+Enter)"><i class="fa fa-check"></i></button></span>';
            }

            if (settings.editButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="MOD" class="btn btn-outline btn-warning btn-xs" id="edit_record_' + settings.pantalla + '" data-toggle="tooltip" title="Modify(Shift+M)"><i class="fa fa-pencil"></i></button></span>';
            }

            if (settings.newButton) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="new_record_' + settings.pantalla + '" data-toggle="tooltip" title="New(Shift+N)"><i class="fa fa-plus"></i></button></span>';
            }

            if (settings.infoButton) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" id="info_' + settings.pantalla + '" data-toggle="tooltip" href="https://www.latam-soft.com/es/soporte/" title="Help"><i class="fa fa-info-circle"></i></button></span>';
            }

            if (settings.youTubeButton) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" id="video_' + settings.pantalla + '" data-toggle="tooltip" title="View Video"><i class="fa fa-youtube-play"></i></button></span>';
            }

            if (settings.refreshButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-primary btn-xs refresh-button" id="refresh_table_' + settings.pantalla + '" data-toggle="tooltip" title="Refresh(Shift+R)"><i class="fa fa-refresh"></i></button></span>';
            }

            if (settings.printButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" id="print_record_' + settings.pantalla + '" data-toggle="tooltip" title="Print(Shift+P)"><i class="fa fa-print"></i></button></span>';
            }

            if (settings.emailButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" id="email_record_' + settings.pantalla + '" data-toggle="tooltip" title="Send Email"><i class="fa fa-envelope"></i></button></span>';
            }

            if (CurrentUser.puedeExportar == "True") {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-warning btn-xs" id="export_' + settings.pantalla + '" data-toggle="tooltip" title="Export"><i class="fa fa-download"></i></button></span>';
            }

            if (settings.outputType.toLowerCase() == "operation") {
                div_buttons += '<hr style="margin-left: 2mm;float: right;border: 1px solid #006394;height:20px;margin-top: 0px;margin-bottom: 0px;">';
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="save_ope_record_' + settings.pantalla + '" data-toggle="tooltip" title="Save(Shift+Enter)"><i class="fa fa-check"></i></button></span>';
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="MOD" class="btn btn-outline btn-warning btn-xs" id="edit_ope_record_' + settings.pantalla + '" data-toggle="tooltip" title="Modify(Shift+M)"><i class="fa fa-pencil"></i></button></span>';
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="new_ope_record_' + settings.pantalla + '" data-toggle="tooltip" title="New(Shift+N)"><i class="fa fa-plus"></i></button></span>';
                // div_buttons += '<hr style="margin-left: 2mm;float: right;border: 1px solid #006394;height:20px;margin-top: 0px;margin-bottom: 0px;">'
                div_buttons += '<span style="margin-left: 2mm;float: right;"><p style="color: #006394;font-weight:bold;font-size:13px;margin-top:2px;margin-bottom:0px;">Acceso Rapido</p></span>';
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-primary btn-xs" id="filtro_de_ope_' + settings.pantalla + '">Filtro de Operaciones</button></span>';
            }

            div_buttons += "</div>";
            $(div_buttons).insertBefore(yo);
            $(div_spinner).insertBefore(yo);
            $(div_video).insertBefore(yo);
            $("#info_" + settings.pantalla).click(function(event) {
                $(this).attr("target", "_blank");
                window.open($(this).attr("href"));
            });
            $("#video_" + settings.pantalla).click(function(event) {
                $("#div_video_" + settings.pantalla).toggle();
            });
        }
    };
})(jQuery);

(function($) {
    //Carga todos los valores de un input y les cambia los id sumandole el id del registro.
    //Se le tiene que pasar el controller y el nombre de la pantalla, y por defecto trae los datos del servidor.
    //Para que funcione, los campos del input se deben llamar igual que el campo de la tabla mas
    // el nombre de la pantalla ej: key +'_pantalla'. Tambien se le puede pasar un json a mano y realiza lo mismo.
    $.fn.fillInputs = function(options) {
        var div = this;

        var settings = $.extend({
                values: null,
                controller: $(div).attr("controller"),
                pantalla: null,
                registro: "vacio",
                action: "getInput",
                serverCall: true,
                cambiarID: true,
                usarIDParaSelector: false,
                extraParam: "",
                onDataReady: function(json) {},
            },
            options
        );

        var obj = new Object();
        obj["id"] = settings.registro;
        obj["extraParam"] = settings.extraParam;

        var inputs = $(div).find(":input");
        var buttons = $(div).find(":button");
        var paragraphs = $(div).find("p");
        var tds = $(div).find("td");

        if (settings.cambiarID == true) {
            $(div).modifyAllIDs({ value: settings.registro });
        }

        if (settings.serverCall == true) {
            var server = new $4D.Server(settings.controller, settings.action, obj);

            server.Success = function(json) {
                if (settings.cambiarID == false) {
                    if (settings.usarIDParaSelector == false) {
                        settings.registro = "";
                    }
                }

                var data = json[0];

                for (var key in data) {
                    var this_el = $("[id='" + key + "_" + settings.pantalla + settings.registro + "']");
                    if (data[key].length != undefined) {
                        var value = data[key];
                        if (!Array.isArray(value)) {
                            if (value.toLowerCase() == "true") {
                                value = true;
                                $(this_el).prop("checked", true);
                            } else {
                                if (value.toLowerCase() == "false") {
                                    value = false;
                                    $(this_el).prop("checked", false);
                                } else {
                                    if ($(this_el).is("INPUT") || $(this_el).is("SELECT") || $(this_el).is("TEXTAREA")) {
                                        if ($(this_el).attr("type") == "date") {
                                            $(this_el).val(date_to_html(value));
                                        } else {
                                            if ($(this_el).is("TEXTAREA")) {
                                                $(this_el).val(value.replaceAll("/n", "\n"));
                                            } else {
                                                $(this_el).val(value);
                                            }
                                        }
                                    } else {
                                        // $(this_el).text(value);
                                        $(this_el).html(value);
                                    }
                                }
                            }
                        }
                    }
                }

                if (settings.cambiarID == true) {
                    var aux_id = $(div).attr("id");
                    $(div).attr("id", aux_id + settings.registro);
                }

                settings.onDataReady.call(json);
            };
            server.Error = function(json) {
                if (settings.cambiarID == true) {
                    var aux_id = $(div).attr("id");
                    $(div).attr("id", aux_id + settings.registro);
                }

                settings.onDataReady.call(json);
            };

            return server.Execute();
        } else {
            var data = settings.values;

            // for (var key in data) {
            //     var value = data[key];

            //     if (value == 'True') {
            //         value = true;
            //         $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", true);
            //     } else {
            //         if (value == 'False') {
            //             value = false;
            //             $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", false);
            //         } else {
            //             if ($('#' + key + '_' + settings.pantalla + settings.registro).is('INPUT') || $('#' + key + '_' + settings.pantalla + settings.registro).is('SELECT')) {
            //                 if ($('#' + key + '_' + settings.pantalla + settings.registro).attr('type') == "number") {
            //                     $('#' + key + '_' + settings.pantalla + settings.registro).numberFormat();
            //                 }
            //                 $('#' + key + '_' + settings.pantalla + settings.registro).changeVal(value);
            //             } else {
            //                 $('#' + key + '_' + settings.pantalla + settings.registro).text(value);
            //             }
            //         }
            //     }
            // }

            for (var key in data) {
                var this_el = $("[id='" + key + "_" + settings.pantalla + settings.registro + "']");
                if (data[key].length != undefined) {
                    var value = data[key];
                    if (!Array.isArray(value)) {
                        if (value.toLowerCase() == "true") {
                            value = true;
                            $(this_el).prop("checked", true);
                        } else {
                            if (value.toLowerCase() == "false") {
                                value = false;
                                $(this_el).prop("checked", false);
                            } else {
                                if ($(this_el).is("INPUT") || $(this_el).is("SELECT") || $(this_el).is("TEXTAREA")) {
                                    if ($(this_el).attr("type") == "date") {
                                        $(this_el).val(date_to_html(value));
                                    } else {
                                        if ($(this_el).is("TEXTAREA")) {
                                            $(this_el).val(value.replaceAll("/n", "\n"));
                                        } else {
                                            $(this_el).val(value);
                                        }
                                    }
                                } else {
                                    // $(this_el).text(value);
                                    $(this_el).html(value);
                                }
                            }
                        }
                    }
                }
            }

            if (settings.cambiarID == true) {
                var aux_id = $(div).attr("id");
                $(div).attr("id", aux_id + settings.registro);
            }

            settings.onDataReady.call(data);
        }
    };
})(jQuery);

(function($) {
    /**Se le tiene que pasar el controller y la pantalla.
      Recorre todos los campos del input y crea un objeto. 
      Se le puede decir que guarde directamente, pero se debe tener cuidado que los campos se llamen
      igual que las keys con el nombre de la pantalla y se le debe pasar el parametro
      save:'true'.*/
    $.fn.createObject = function(options) {
        var settings = $.extend({
                controller: $(this).attr("controller"),
                pantalla: null,
                registro: "vacio",
                save: false,
                extraParam: null,
                esInforme: false,
                saveAction: "save",
                onSuccess: function(json) {},
                onError: function() {},
                regObj: {},
            },
            options || {}
        );

        var obj = settings.regObj;
        obj["ID"] = settings.registro;

        var inputs = $(this).find(":input:not(:button)");

        inputs.each(function(index, el) {
            if (!$(this)[0].hasAttribute("no-guardar")) {
                var auxId = $(this).attr("ID");
                if (auxId == undefined) {
                    console.log("ID Undefined: ");
                    console.log(el);
                }
                auxId = auxId.split("_" + settings.pantalla);
                var key = auxId[0];
                var value = "";

                if ($(this).is(":checkbox")) {
                    if ($(this).prop("checked") == true) {
                        value = "true";
                    } else {
                        value = "false";
                    }
                }

                if (value === "") {
                    if ($(this).attr("type") == "date") {
                        // if (settings.esInforme) {
                        value = fix_date_html($(this).val());
                        // } else {
                        // value = fix_date_html($(this).val(), true);
                        // }
                    }
                }

                if (value === "") {
                    if ($(this).attr("type") == "time") {
                        value = fix_time_html($(this).val());
                    }
                }

                if (value === "") {
                    if ($(this).attr("type") == "number" || $(this)[0].hasAttribute("num")) {
                        // value = fixNumberFormat($(this).val());
                        value = $(this).val();
                    }
                }

                if (value === "") {
                    value = $(this).val();
                }

                if ($(this).hasAttr("boolean")) {
                    if (value == "\u2714") {
                        value = "true";
                    } else {
                        if (value == "X") {
                            value = "false";
                        }
                    }
                }

                obj[key] = value;
            }
        });

        if (settings.save == true) {
            if (settings.extraParam != null) {
                obj["extraParam"] = settings.extraParam;
            }
            var server = new $4D.Server(settings.controller, settings.saveAction, obj);
            $.when(server.Execute())
                .done(function(a1) {
                    //settings.onSuccess.call(this, a1);+
                    settings.onSuccess.call(a1.ResultSet);
                    Swal.fire("", "El registro se guardo correctamente", "success");
                    let pantalla = $("#GeneralNavTabs").find("li.active").children("a").text();
                    cargarHistorial(pantalla, "save", a1.ID);
                    return a1;
                })
                .fail(function(error) {
                    settings.onError.call(this);
                    Swal.fire("Error", "Parece que ha ocurrido un error y no se ha podido guardar correctamente", "error");
                });
        }
        return obj;
    };
})(jQuery);

(function($) {
    //Inhabilita o deshabilita todos los campos de un input.
    //Se le tiene que asociar un div con todos los campos dentro,
    //y se le puede pasar si se quieren deshabilitar los botones.
    //Para habilitar se le tiene que pasar el mode:'enable'
    $.fn.disableFields = function(options) {
        let self = this;

        var settings = $.extend({
                mode: "disable",
                buttons: false,
            },
            options
        );

        if (settings.buttons) {
            var inputs = $(self).find(":input");
            var textareas = $(self).find("textarea");
        } else {
            var inputs = $(self).find(":input:not(:button)");
            var textareas = $(self).find("textarea");
        }

        inputs.each(function(index, el) {
            if (!$(this)[0].hasAttribute("no-modificar")) {
                if (settings.mode == "disable") {
                    $(this).attr("disabled", "disabled");
                } else {
                    $(this).removeAttr("disabled");
                }
            }
        });

        textareas.each(function(index, el) {
            if (!$(this)[0].hasAttribute("no-modificar")) {
                if (settings.mode == "disable") {
                    $(this).attr("disabled", "disabled");
                } else {
                    $(this).removeAttr("disabled");
                }
            }
        });
    };
})(jQuery);

(function($) {
    //Revisa que esten llenos
    //todos los campos que tengan el atributo "obligatorio".
    //si encuentra un campo incompleto, lo marca en rojo y envia una alerta.
    //Devuelve un booleano, si encuentra un error devuelve true.
    $.fn.checkFields = function(options) {
        var settings = $.extend({}, options);

        var inputs = $(this).find(":input:not(:button)");

        var selects = $(this).find("select");

        var error = false;

        inputs.each(function(index, el) {
            let fail = false;
            if ($(this)[0].hasAttribute("obligatorio") || $(this)[0].hasAttribute("obligatorio-dialog")) {
                if ($(this).val() == "") {
                    $(this).addClass("tiene-error");
                    error = true;
                    fail = true;
                }

                if ($(this)[0].hasAttribute("min")) {
                    let valmin = $(this).attr("min");
                    if ($(this).numVal() < parseFloat(valmin)) {
                        $(this).addClass("tiene-error");
                        error = true;
                        fail = true;
                    }
                }

                if ($(this)[0].hasAttribute("num")) {
                    if ($(this).numVal() == 0) {
                        $(this).addClass("tiene-error");
                        error = true;
                        fail = true;
                    }
                }

                if ($(this)[0].hasAttribute("date") && $(this).val() == "00/00/00") {
                    $(this).addClass("tiene-error");
                    error = true;
                    fail = true;
                }

                if (!fail) {
                    $(this).removeClass("tiene-error");
                }
            }
        });

        selects.each(function(index, el) {
            let fail = false;
            if ($(this)[0].hasAttribute("obligatorio") || $(this)[0].hasAttribute("obligatorio-dialog")) {
                if ($(this).val() == "" || $(this).val() == null) {
                    $(this).addClass("tiene-error");
                    error = true;
                    fail = true;
                }

                if ($(this)[0].hasAttribute("min")) {
                    let valmin = $(this).attr("min");
                    if ($(this).val() < valmin) {
                        $(this).addClass("tiene-error");
                        error = true;
                        fail = true;
                    }
                }

                if ($(this)[0].hasAttribute("date") && $(this).val() == "00/00/00") {
                    $(this).addClass("tiene-error");
                    error = true;
                    fail = true;
                }

                if (!fail) {
                    $(this).removeClass("tiene-error");
                }
            }
        });

        if (error == true) {
            Swal.fire("Atencion", "Debe completar todos los campos obligatorios", "warning");
        }

        return error;
    };
})(jQuery);

(function($) {
    //Genera una linea de inputs sobre un tr, cambiando cada td
    //y poniendole a cada input como id la key del td.
    //Si se le pasa disable, vuelve para atras.
    //Si al header se le pone el atributo no-modificar, ese campo no se modifica.
    //Si se necesita un tipo de campo especial, se le pasa en el atributo input-type
    $.fn.createInputRow = function(options) {
        var row = this;

        var settings = $.extend({
                mode: "enable",
                pantalla: null,
            },
            options
        );

        var tds = $(row).children("td");

        tds.each(function(index, el) {
            if (index != 0) {
                var head = $(this)
                    .closest("table")
                    .find("th:nth-child(" + (index + 1) + ")");

                if (settings.mode == "enable") {
                    var type = "text";
                    var width = $(this).width();
                    if ($(head)[0].hasAttribute("input-type")) {
                        type = $(head).attr("input-type");
                    }
                    var key = $(this).attr("key");
                    var valor = $(this).text();
                    if ($(head).attr("input-type") == "number") {
                        valor = CorrectParseFloat(valor);
                    }

                    if ($(head).attr("input-type") == "date") {
                        valor = date_to_html(valor);
                    }

                    let size = $(this).width();
                    if (type == "button") {
                        var input = '<button id="' + key + "_" + settings.pantalla + '" class="form-control btn btn-default btn-xs"';
                    } else {
                        if (type == "select") {
                            var input = '<select id="' + key + "_" + settings.pantalla + '" class="form-control"';
                        } else {
                            if ($(head)[0].hasAttribute("obligatorio")) {
                                var input = '<input id="' + key + "_" + settings.pantalla + '" type="' + type + '" value="' + valor + '" obligatorio';
                            } else {
                                var input = '<input id="' + key + "_" + settings.pantalla + '" type="' + type + '" value="' + valor + '"';
                            }
                        }
                    }

                    input += ' style="width:' + size + 'px;"';

                    if ($(head)[0].hasAttribute("no-modificar")) {
                        input += " disabled";
                    }

                    if ($(head)[0].hasAttribute("max")) {
                        input += ' max="' + $(head).attr("max") + '"';
                    }

                    if ($(head)[0].hasAttribute("min")) {
                        input += ' min="' + $(head).attr("min") + '"';
                    }

                    input += ' class="form-control"';

                    if ($(head)[0].hasAttribute("no-guardar")) {
                        input += " no-guardar";
                    }

                    if ($(head)[0].hasAttribute("findby")) {
                        input += ' findby="' + $(head).attr("findby") + '"';
                    }

                    input += ">";

                    if ($(head)[0].hasAttribute("options")) {
                        let options = $(head).attr("options");
                        options = options.split(",");
                        for (i = 0; i < options.length; i++) {
                            input += "<option value='" + i + "'>" + options[i] + "</option>";
                        }
                    }

                    if (type == "button") {
                        input += key + "</button>";
                    }

                    if (type == "select") {
                        input += "</select>";
                    }

                    $(this).html(input);

                    if (type == "select") {
                        $(this).children("select").val(valor);
                    }

                    if ($(this).width() < 30) {
                        $(this).children("input").css("width", "30px");
                    }

                    if ($(this).width() < width) {
                        $(this)
                            .children("input")
                            .css("width", width + 10 + "px");
                    }
                } else {
                    if ($(this).children("input").length > 0) {
                        var valor = $(this).children("input").val();
                    } else {
                        var valor = $(this).children("select").val();
                    }
                    $(this).children("input").remove();
                    $(this).children("select").remove();
                    $(this).children("button").remove();
                    $(this).text(valor);
                }
            }
        });
    };
})(jQuery);

(function($) {
    //Destruye definitivamente el elemento, con todos sus hijos y eventos
    $.fn.destroyElement = function(options) {
        var settings = $.extend({}, options);

        $(this).unbind();
        $(this).empty();
        $(this).val("");
        if ($(this).children().length > 0) {
            $(this)
                .children()
                .each(function(index, el) {
                    $(this).destroyElement();
                });
        }
        $(this).html("");
        $(this).remove();
    };
})(jQuery);

(function($) {
    //La funcion .val() no triggerea el .change()
    //pero este metodo si
    $.fn.changeVal = function(v) {
        return $(this).val(v).trigger("change");
    };
})(jQuery);

(function($) {
    //Hace el formateo del numero, tirandolo a la derecha, y arreglando el formato de numeros
    $.fn.numberFormat = function(options) {
        var settings = $.extend({
                min: null,
                max: null,
                decimales: 2,
            },
            options
        );

        if (settings.min != null) {
            if ($(this).numVal() < settings.min) {
                $(this).val(settings.min);
            }
        }

        if (settings.max != null) {
            if ($(this).numVal() > settings.max) {
                $(this).val(settings.max);
            }
        }

        let negativo = false;
        if ($(this).numVal() < 0) {
            negativo = true;
        }

        if (negativo) {
            $(this).css("color", "red");
        } else {
            $(this).css("color", "#555");
        }

        if ($(this).is("input")) {
            var num = $(this).val();
            // $(this).val(separate_number(format_number(num, CurrentUser.serverFormat), CurrentUser.serverFormat));
            $(this).val(format_num(num, settings.decimales));
        } else {
            var num = $(this).text();
            // $(this).text(separate_number(format_number(num, CurrentUser.serverFormat), CurrentUser.serverFormat));
            $(this).text(format_num(num, settings.decimales));
        }

        $(this).css("text-align", "right");

        return this;
    };
})(jQuery);

(function($) {
    //Agrega el conteo de registros que se refresca automaticamente cuando se refresca la cantidad de registros
    $.fn.contadorDeRegistros = function(options) {
        var cantidad = $(this).children("tbody").find("tr").length;

        $(this).after('<p id="contador_' + $(this).attr("id") + '">Showing 1 to ' + cantidad + " of " + cantidad + "</p>");

        $(this).change(function(event) {
            var cantidad = $(this).children("tbody").find("tr").length;

            $("#contador_" + $(this).attr("id")).text(" " + cantidad + " of " + cantidad);
        });
    };
})(jQuery);

(function($) {
    //Agrega todo el formato a las pantallas de inputs largos, ver cotizacion para ejemplo.
    //Se le debe pasar el id del registro y el controller. En el flexbox title se le debe pasar
    //la variable del titulo para que la pueda traducir -> Hay que hacer esto
    $.fn.flexboxTransform = function(options) {
        let self = this;

        var settings = $.extend({
                regId: "",
                controller: null,
                scrollMenu: true,
                hideOnScrollMenu: false,
                showAll: false,
                helpMenu: [],
            },
            options
        );

        $(self).attr("id", $(self).attr("id") + settings.regId);

        $(self).addClass("panel panel-default big-flexbox");

        $(self).wrap('<div style="overflow: auto;max-height: 90vh;max-width: 95vw;"></div>');

        if (settings.scrollMenu) {
            $(self).css({
                float: "left",
                width: "92%",
                "margin-right": "5px",
                "boder-top-color": "white",
            });
        } else {
            $(self).css({
                float: "left",
                width: "100%",
                "boder-top-color": "white",
            });
        }

        let mycode = settings.controller + "_" + settings.regId;

        let buttons = "";

        let scrollHTML = '<div id="index_' + mycode + '" class="" style="overflow: hidden;position:sticky;top:29px;">';
        scrollHTML += "</div>";
        $(self).after(scrollHTML);

        if (!isMobile.any()) {
            if (!settings.scrollMenu) {
                $("#index_" + mycode).hide();
            }
        }

        $(self).before('<div id="buttons' + mycode + '" class="tooltip-demo" style="overflow: hidden;position: sticky;background-color:white;top:0;padding:3px;z-index:50;border-bottom: 1px solid lightgray;"></div>');

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" id="close_record' + mycode + '" data-toggle="tooltip" title="Close"><i class="fa fa-times"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-warning btn-xs" id="edit_record' + mycode + '" data-toggle="tooltip" title="Edit"><i class="fa fa-pencil"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-success btn-xs" id="save_record' + mycode + '" data-toggle="tooltip" title="Save"><i class="fa fa-check"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" data-toggle="tooltip" id="help' + mycode + '"" title="Help"><i class="fa fa-info-circle"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" data-toggle="tooltip" id="youtube' + mycode + '" title="View Video"><i class="fa fa-youtube-play"></i></button></span>';

        $("#buttons" + mycode).append(buttons);

        if (!isMobile.any() && settings.hideOnScrollMenu) {
            $("#index_" + mycode).append('<div class="selected-scroll-menu-option" id="titulo_all' + mycode + '"><p>All</p></div>');
            $("#titulo_all" + mycode).click(function(event) {
                $(self).children("div").show();
                $("#index_" + mycode)
                    .find("div")
                    .removeClass("selected-scroll-menu-option");
                $("#index_" + mycode)
                    .find("div")
                    .addClass("not-selected-scroll-menu-option");
                $(this).removeClass("not-selected-scroll-menu-option");
                $(this).addClass("selected-scroll-menu-option");
            });
        }

        $(self)
            .parent()
            .on("scroll", function(event) {
                if ($(this).is(":visible")) {
                    $(self)
                        .children("div")
                        .each(function(index, el) {
                            let idScrollButton = $(this).attr("scroll-button");
                            if ($(this).isInCenterViewport() && $(this).is(":visible")) {
                                $("#" + idScrollButton).addClass("selected-scroll-menu-option");
                                $("#" + idScrollButton).removeClass("not-selected-scroll-menu-option");
                            } else {
                                $("#" + idScrollButton).removeClass("selected-scroll-menu-option");
                                $("#" + idScrollButton).addClass("not-selected-scroll-menu-option");
                            }
                        });
                }
            });

        $(self)
            .children("div")
            .each(function(index, el) {
                $(this).addClass("panel panel-default title-flexbox-container");

                let titulo = $(this).attr("flexbox-title");

                let mouseSobreBoton = false;

                if (!isMobile.any() && settings.scrollMenu) {
                    $(this).attr("scroll-button", "titulo_" + index + mycode);

                    let classScroll = "not-selected-scroll-menu-option";

                    if (index == 0 && !settings.hideOnScrollMenu) {
                        classScroll = "selected-scroll-menu-option";
                    }

                    $("#index_" + mycode).append('<div class="' + classScroll + '" id="titulo_' + index + mycode + '"><p>' + titulo + "</p></div>");

                    if (titulo.length > 20) {
                        $("#titulo_" + index + mycode).css("padding-top", "2px");
                    }

                    $("#titulo_" + index + mycode).click(function(event) {
                        $("#hide_" + index + mycode).focus();
                        $("#index_" + mycode)
                            .find("div")
                            .removeClass("selected-scroll-menu-option");
                        $("#index_" + mycode)
                            .find("div")
                            .addClass("not-selected-scroll-menu-option");
                        $(this).removeClass("not-selected-scroll-menu-option");
                        $(this).addClass("selected-scroll-menu-option");

                        let idScrollMenuopt = $(this).attr("id");

                        if (settings.hideOnScrollMenu) {
                            $(self)
                                .children("div")
                                .each(function(index, el) {
                                    if ($(this).attr("scroll-button") == idScrollMenuopt) {
                                        $(this).show();
                                    } else {
                                        $(this).hide();
                                    }
                                });
                        }
                    });
                }

                let contenido = $(this).html();

                $(this).empty();

                if (!isMobile.any()) {
                    $(this).prepend('<div id="titulo' + index + mycode + '" class="panel-heading"><button class="btn btn-danger btn-xs hideButton" id="hide_' + index + mycode + '" hideButton><i class="fa fa-minus"></i></button> ' + titulo + '</div><div class="panel-body"><div class="medium-flexbox">' + contenido + "</div></div>");
                } else {
                    $(this).prepend('<div id="titulo' + index + mycode + '" class="panel-heading"><button class="btn btn-danger btn-xs hideButton" id="hide_' + index + mycode + '" hideButton><i class="fa fa-minus"></i></button> ' + titulo + '</div><div class="panel-body"><div class="medium-flexbox-phone">' + contenido + "</div></div>");
                }

                $("#hide_" + index + mycode).click(function(event) {
                    $(this).children("i").remove();
                    if ($(this).parent().parent().children("div").last().is(":visible")) {
                        $(this).removeClass("btn-danger");
                        $(this).addClass("btn-success");
                        $(this).prepend('<i class="fa fa-plus"></i>');
                    } else {
                        $(this).removeClass("btn-success");
                        $(this).addClass("btn-danger");
                        $(this).prepend('<i class="fa fa-minus"></i>');
                    }
                    $(this).parent().parent().children("div").last().toggle("slow");
                });

                $("#hide_" + index + mycode).focus(function(event) {
                    //$(this).trigger('click');
                    if (!$(this).parent().parent().children("div").last().is(":visible") && !mouseSobreBoton) {
                        $(this).children("i").remove();
                        $(this).removeClass("btn-success");
                        $(this).addClass("btn-danger");
                        $(this).prepend('<i class="fa fa-minus"></i>');
                        $(this).parent().parent().children("div").last().show("slow");
                    }
                });

                $("#hide_" + index + mycode).mouseenter(function(event) {
                    mouseSobreBoton = true;
                });

                $("#hide_" + index + mycode).mouseleave(function(event) {
                    mouseSobreBoton = false;
                });

                if (index > 0 && !settings.showAll && !$(this).hasAttr("show")) {
                    $("#hide_" + index + mycode).trigger("click");
                }

                $(this)
                    .children("div")
                    .last()
                    .children("div")
                    .children("div")
                    .each(function(index, el) {
                        $(this).addClass("panel panel-default small-flexbox");
                        $(this).css("border-color", "#006394");
                        $(this)
                            .find("input:not(:checkbox)")
                            .each(function(index, el) {
                                $(this).addClass("form-control");
                            });
                        $(this).find("select").addClass("form-control");
                        $(this).find(":checkbox").css("vertical-align", "sub");
                        $(this).modifyAllIDs({ value: settings.regId });
                        if ($(this).hasAttr("flexbox-size")) {
                            $(this).css("flex-basis", $(this).attr("flexbox-size"));
                        }
                    });

                if ($(this).hasAttr("permiso-funcion") && $(this).hasAttr("permiso-modulo")) {
                    let thisDiv = $(this);
                    let permisoFunc = $(this).attr("permiso-funcion");
                    let permisoMod = $(this).attr("permiso-modulo");
                    $.when(verificar_permiso(permisoMod, permisoFunc, "ENT", false)).fail(function() {
                        thisDiv.hide();
                        let scrollButtonID = thisDiv.attr("scroll-button");
                        $("#" + scrollButtonID).hide();
                    });
                }
            });

        if (settings.helpMenu.length > 0) {
            let selectHtml = "<span id='tutorials_info_" + settings.controller + "_" + settings.regId + "' style='display:none;height:100%;'>";

            let arrHelp = settings.helpMenu;

            for (var i = 0; i < arrHelp.length; i++) {
                let sett = $.extend({
                        title: "",
                        id: "",
                        color: "#46b8da",
                        textColor: "#333",
                    },
                    arrHelp[i]
                );
                selectHtml += "<span style='margin-right:2mm;'>";
                selectHtml += "<h6 style='display: inline;color:" + sett.textColor + ";'>" + arrHelp[i].title + "</h6>";
                selectHtml += "<button class='btn btn-outline btn-info btn-xs' style='display: inline;margin-left:2mm;color:" + sett.color + ";border-color:" + sett.color + ";' id='info_" + arrHelp[i].id + "_" + settings.controller + "_" + settings.regId + "'>";
                selectHtml += "<i class='fa fa-play'></i></button>";
                selectHtml += "</span>";
            }

            selectHtml += "</span>";

            $("#buttons" + settings.controller + "_" + settings.regId).append(selectHtml);

            $("#help" + settings.controller + "_" + settings.regId).click(function(event) {
                $("#tutorials_info_" + settings.controller + "_" + settings.regId).toggle("slow", function() {
                    if ($(this).is(":visible")) {
                        $(this).css("display", "block");
                    }
                });
            });

            //$("#selectBox_" + pantalla).showCheckboxes();
        }
    };
})(jQuery);

(function($) {
    //Modifica todos los ids dentro del contenedor, les agrega un valor para que sean unicos.
    //Tambien verifica los que sean obligatorios y les pone un asterisco
    $.fn.modifyAllIDs = function(options) {
        let self = this;

        var settings = $.extend({
                value: undefined,
                remove: null,
                buttons: true,
                inputs: true,
                tables: true,
                dontModify: null,
            },
            options
        );
        if (settings.remove != null) {
            $(self).attr("id", $(self).attr("id").replace(settings.remove, ""));
        }
        $(self).attr("id", $(self).attr("id") + settings.value);
        $(self)
            .find("*")
            .each(function(index, el) {
                let thingId = $(this).attr("id");
                if (thingId != undefined && !$(this).hasAttr("hideButton")) {
                    if (settings.remove != null) {
                        thingId = thingId.replace(settings.remove, "");
                        //$(this).attr('id', thingId.replace(settings.remove, ""));
                    }
                    $(this).attr("id", thingId + settings.value);
                    if (settings.remove == null) {
                        if ($(this).hasAttr("obligatorio")) {
                            let varWrap = '<div class="form-group input-group" style="float:right;';
                            let estilo = Math.round((100 * parseFloat($(this).css("width"))) / parseFloat($(this).parent().css("width"))) + "%";
                            if ($(this).css("width").includes("%")) {
                                varWrap += "width:" + $(this).css("width") + ";";
                            } else {
                                varWrap += "width:" + estilo + ";";
                            }
                            varWrap += '"></div>';
                            $(this).wrap(varWrap);
                            $(this).after('<span class="input-group-addon" style="color: red;">*</span>');
                        }
                    }
                }
            });
    };
})(jQuery);

(function($) {
    //Agrega el formato a las tablas para que se vean lindas
    $.fn.tableFormat = function(options) {
        let self = this;

        var settings = $.extend({
                contador: false,
                seleccion: null,
                titulosFixed: false,
                firstColFixed: false,
                search: false,
                order: false,
                orderIgnoreTotal: false,
            },
            options
        );

        $(self).css("width", "100%");
        $(self).css("clear", "both");
        $(self).children("thead").css("background-color", "#006394");
        $(self).children("thead").children("tr").children("th").css("color", "white");
        $(self).children("thead").children("tr").children("th").css({
            height: "5px",
            // "line-height": "5px",
            "white-space": "nowrap",
            "text-align": "center",
        });
        $(self).css("border-color", "#006394");
        $(self).css("border-radius", "6px");
        $(self).css("margin-top:", "6px");
        $(self).css("margin-bottom", "6px");
        $(self).css("max-width", "none");
        $(self).css("border-collapse", "separate");

        if (settings.contador) {
            $(self).contadorDeRegistros();
        }

        if (settings.seleccion != null) {
            if (settings.seleccion == "simple") {
                $(self).find("tbody").addSelection({ type: "simple" });
            } else {
                $(self).find("tbody").addSelection();
            }
        }

        $(self)
            .find("thead")
            .find("tr")
            .last()
            .find("th")
            .each(function(index, el) {
                if ($(this).hasAttr("num")) {
                    let decs = 2;
                    if ($(this).hasAttr("decimales")) {
                        decs = parseInt($(this).attr("decimales"));
                    }
                    $(self).columnNumberFormat({ column: index, decimales: decs });
                }
            });

        if (settings.search) {
            $(self).addAutomaticSearch();
        }

        if (settings.order) {
            $(self).autoOrder({
                hasTotal: settings.orderIgnoreTotal,
            });
        }

        if (settings.titulosFixed) {
            self.wrap("<div></div>");

            self.find("thead").find("th").css({
                position: "sticky",
                top: "0",
                "background-color": "rgb(0, 99, 148)",
                "z-index": "50",
            });

            self.parent().css({
                overflow: "auto",
                height: "fit-content",
                "max-height": "20cm",
                "min-height": "5cm",
                display: "block",
                "border-radius": "6px",
                width: AnchoTotalPantallaMaximo,
            });
        }

        if (settings.firstColFixed) {
            self
                .find("tbody")
                .find("tr")
                .each(function(index, el) {
                    let backColor = $(this).css("background-color");
                    if (backColor == "rgba(0, 0, 0, 0)") {
                        backColor = "white";
                    }
                    $(this).find("td:first-child").css("position", "sticky");
                    $(this).find("td:first-child").css("left", "0");
                    $(this).find("td:first-child").css("background-color", backColor);
                });
        }
    };
})(jQuery);

(function($) {
    //Copia una linea de una tabla sin los ID ni los valores
    $.fn.cleanCopy = function(options) {
        let self = this;

        var settings = $.extend({
                newID: null,
            },
            options
        );

        let newTr = "<tr";

        if (settings.newID != null) {
            newTr += " id='" + settings.newID + "'";
        }

        newTr += ">";

        if ($(self).find("td").length === 0) {
            var mytds = $(self).find("th");
        } else {
            var mytds = $(self).find("td");
        }

        mytds.each(function(index, el) {
            if ($(this).css("display") === "none") {
                newTr += '<td style="display:none;"></td>';
            } else {
                newTr += "<td></td>";
            }
        });

        newTr += "</tr>";

        return newTr;
    };
})(jQuery);

(function($) {
    //Hace el formateo de los numeros de una columna, tirandolo a la derecha, y arreglando el formato de numeros
    $.fn.columnNumberFormat = function(options) {
        var settings = $.extend({
                column: null,
                columns: [],
                decimales: 2,
                columnCurrency: null,
            },
            options
        );

        var table = this;

        if (table.is("TBODY")) {
            var selector = $(table).find("tr");
        } else {
            var selector = $(table).find("tbody").find("tr");
        }

        if (settings.column != null) {
            settings.columns.push(settings.column);
        }

        for (var i = 0; i < settings.columns.length; i++) {
            selector.each(function(index, el) {
                var td = $(this).find("td:eq(" + settings.columns[i] + ")");
                let decs = settings.decimales;
                if (settings.columnCurrency != null) {
                    let currency = $(this)
                        .find("td:eq(" + settings.columnCurrency + ")")
                        .text();
                    switch (localStorage.getItem("Country_ID")) {
                        case "CL":
                        case "PY":
                            if (currency == localStorage.getItem("Moneda2")) {
                                decs = 0;
                            }
                            break;
                    }
                }

                if ($(td).is("input")) {
                    var num = $(td).val();
                    if (num != "") {
                        //$(td).val(separate_number(format_number(num, CurrentUser.serverFormat), CurrentUser.serverFormat));
                        $(td).val(format_num(num, decs));
                    }
                } else {
                    var num = $(td).text();
                    if (num != "") {
                        //$(td).text(separate_number(format_number(num, CurrentUser.serverFormat), CurrentUser.serverFormat));
                        $(td).text(format_num(num, decs));
                        if (td.numVal() < 0) {
                            td.css("color", "red");
                        }
                    }
                }
                $(td).css("text-align", "right");
            });
        }
    };
})(jQuery);

(function($) {
    //Agrega la suma tipo excel a una tabla
    $.fn.addExcelSum = function(options) {
        var settings = $.extend({}, options);

        var table = this;

        var cuenta = 0;

        var this_table_id = $(table).attr("id");

        $(table).addClass("noselect");

        $(table).after("<p style='background-color:rgba(244, 155, 66, 1);position:absolute;display:none;margin-left:1cm;border: 1px solid black;border-radius: 4px;' id='" + this_table_id + "_excel_sum'></p>");

        var last = null;

        $(table).css("cursor", "cell");

        $(table)
            .find("tbody")
            .click(function(event) {
                if (cntrlIsPressed) {
                    if ($(event.target).hasClass("excel-sum")) {
                        cuenta -= $(event.target).numVal();
                        $(event.target).removeClass("excel-sum");
                        $(event.target).off("mouseenter");
                        $(event.target).off("mouseleave");
                    } else {
                        if (!Number.isNaN($(event.target).numVal()) && $(event.target).text() != "") {
                            cuenta += $(event.target).numVal();
                            $(event.target).addClass("excel-sum");
                            last = $(event.target);
                        }
                    }
                } else {
                    if (shiftIsPressed) {
                        cuenta = 0;
                        $(table).find(".excel-sum").off("mouseenter");
                        $(table).find(".excel-sum").off("mouseleave");
                        $(table).find(".excel-sum").removeClass("excel-sum");
                        let firstx = Math.min(last.index(), $(event.target).index());
                        let firsty = Math.min(last.closest("tr").index(), $(event.target).closest("tr").index());
                        let lastx = Math.max(last.index(), $(event.target).index());
                        let lasty = Math.max(last.closest("tr").index(), $(event.target).closest("tr").index());
                        for (var i = firsty; i <= lasty; i++) {
                            let tr = $(this).find("tr:eq(" + i + ")");
                            for (var j = firstx; j <= lastx; j++) {
                                let td = tr.find("td:eq(" + j + ")");
                                if (!Number.isNaN(td.numVal()) && td.text() != "") {
                                    cuenta += td.numVal();
                                    td.addClass("excel-sum");
                                }
                            }
                        }
                    } else {
                        if (!Number.isNaN($(event.target).numVal()) && $(event.target).text() != "") {
                            cuenta = $(event.target).numVal();
                            $(table).find(".excel-sum").off("mouseenter");
                            $(table).find(".excel-sum").off("mouseleave");
                            $(table).find(".excel-sum").removeClass("excel-sum");
                            $(event.target).addClass("excel-sum");
                            last = $(event.target);
                        }
                    }
                }

                if (!Number.isNaN($(event.target).numVal()) && $(event.target).text() != "") {
                    $("#" + this_table_id + "_excel_sum").text("Sum = " + separate_number(format_number(String(cuenta), "true"), "true"));

                    $("#" + this_table_id + "_excel_sum").css({
                        top: event.pageY,
                        left: event.pageX,
                    });

                    $("#" + this_table_id + "_excel_sum").show();

                    if ($(event.target).hasClass("excel-sum")) {
                        $(event.target).on("mouseenter", function() {
                            $("#" + this_table_id + "_excel_sum").css({
                                top: event.pageY,
                                left: event.pageX,
                            });
                            $("#" + this_table_id + "_excel_sum").show();
                        });

                        $(event.target).on("mouseleave", function() {
                            $("#" + this_table_id + "_excel_sum").hide();
                        });
                    }
                }
            });
    };
})(jQuery);

(function($) {
    //Muestra las checkbox del multiselect
    $.fn.showCheckboxes = function(options) {
        var settings = $.extend({
                autoFilter: false,
            },
            options
        );

        var select = this;

        var inCheckboxes = false;

        $(select).mouseenter(function(event) {
            inCheckboxes = true;
            $(select).parent().find(".checkboxesMultiselect").css("display", "block");
            $(select).parent().find(".checkboxesMultiselect").css("position", "absolute");
            if (!settings.autoFilter) {
                $(select).parent().find(".checkboxesMultiselect").css("top", "30px");
            }
            $(select).parent().find(".checkboxesMultiselect").css("z-index", "1000");
            $(select)
                .parent()
                .find(".checkboxesMultiselect")
                .mouseleave(function(event) {
                    inCheckboxes = false;
                    $(select).parent().find(".checkboxesMultiselect").css("display", "none");
                    $(this).unbind(event);
                });
            $(select)
                .parent()
                .find(".checkboxesMultiselect")
                .mouseenter(function(event) {
                    inCheckboxes = false;
                });
        });

        $(select).mouseleave(function(event) {
            setTimeout(function() {
                if (inCheckboxes) {
                    inCheckboxes = false;
                    $(select).parent().find(".checkboxesMultiselect").css("display", "none");
                    $(select).parent().find(".checkboxesMultiselect").unbind();
                }
            }, 250);
        });
    };
})(jQuery);

(function($) {
    //Checkea si tiene un atributo
    $.fn.hasAttr = function(option) {
        if (typeof $(this)[0] === "undefined") {
            return false;
        } else {
            return $(this)[0].hasAttribute(option) === true;
        }
    };
})(jQuery);

(function($) {
    //Selecciona solo los que tenga cierto atributo
    $.fn.findAttr = function(option) {
        var seleccionActual = this;

        var seleccionFinal = $("#invalidTextObject");

        $(seleccionActual)
            .find("*")
            .each(function(index, el) {
                if ($(this).hasAttr(option)) {
                    let miObjeto = $(this);
                    if (seleccionFinal === $("#invalidTextObject")) {
                        seleccionFinal = miObjeto;
                    } else {
                        seleccionFinal = seleccionFinal.add(miObjeto);
                    }
                }
            });

        return seleccionFinal;
    };
})(jQuery);

(function($) {
    //Carga todo el input con el flexbox tranform
    $.fn.loadInput = function(options) {
        var input = this;

        var settings = $.extend({
                controller: $(this).attr("controller"),
                pantalla: null,
                registro: "vacio",
                action: "new",
                modulo: null,
                tableNum: null,
                funcion: null,
                save: true,
                extraParam: "",
                esInforme: false,
                scrollMenu: true,
                showAll: false,
                helpMenu: [],
                onSave: function() {},
                onDataLoad: function(json) {},
                onDataMod: function(json) {},
                onEventsAndDataLoad: function(json) {},
            },
            options
        );

        var recordID = settings.registro;

        var recordObj = {};

        $(input).filterByCountry();

        $(input).flexboxTransform({
            regId: settings.registro,
            controller: settings.controller,
            scrollMenu: settings.scrollMenu,
            showAll: settings.showAll,
            helpMenu: settings.helpMenu,
        });

        $(input).fillInputs({
            controller: settings.controller,
            pantalla: settings.pantalla,
            registro: settings.registro,
            cambiarID: false,
            extraParam: settings.extraParam,
            usarIDParaSelector: true,
            onDataReady: function(json) {
                recordObj = this[0];

                let tabName = "";
                let annulled = false;

                if ($(this).findKey({ find: "ID" }) !== "undefined") {
                    recordID = this[0].ID;
                    tabName = recordID;
                    if (settings.registro == "vacio" && recordID != settings.registro) {
                        $(input).modifyAllIDs({ value: recordID, remove: settings.registro });
                        $("#buttons" + settings.controller + "_" + settings.registro).modifyAllIDs({ value: recordID, remove: settings.registro });
                        settings.registro = recordID;
                    }
                }

                if ($(this).findKey({ find: "Code" }) !== "undefined") {
                    tabName = this[0].Code;
                }

                if ($(this).findKey({ find: "Name" }) !== "undefined") {
                    tabName = this[0].Name;
                }

                if ($(this).findKey({ find: "CodNum" }) !== "undefined") {
                    tabName = this[0].CodNum;
                }

                if ($(this).findKey({ find: "Annulled" }) !== "undefined") {
                    if (this[0].Annulled == "true" || this[0].Annulled == "True") {
                        annulled = true;
                        Swal.fire("Cuidado", "Este registro se encuentra anulado y no puede ser modificado", "warning");
                        $("#save_record" + settings.controller + "_" + settings.registro).attr("disabled", true);
                        $("#edit_record" + settings.controller + "_" + settings.registro).attr("disabled", true);
                    }
                }

                if (tabName != "") {
                    tabName = tabName.substring(0, 20);
                    tabName = TGeneral(settings.funcion + "_in", "") + " " + tabName;
                    if (settings.action == "new") {
                        $("#GeneralNavTabs")
                            .find("a[href*='#tabN" + settings.funcion + "_invacio']")
                            .find("p")
                            .text(tabName);
                    } else {
                        $("#GeneralNavTabs")
                            .find("a[href*='#tabN" + settings.funcion + "_in" + settings.registro + "']")
                            .find("p")
                            .text(tabName);
                    }
                }

                $(input)
                    .find("input:not(:checkbox)")
                    .each(function(index, el) {
                        if ($(this).hasAttr("date")) {
                            $(this).datepicker({ dateFormat: "dd/mm/yy" });
                        } else {
                            if ($(this).attr("type") === "number" || $(this).hasAttr("num")) {
                                //let finalValue = format_number($(this).val(), true);
                                if ($(this).val() == "") {
                                    $(this).val("0");
                                }
                                //$(this).val(format_number($(this).val(), CurrentUser.format));
                                let in_min = null;
                                let in_max = null;
                                let decs = 2;

                                if ($(this).hasAttr("min")) {
                                    in_min = parseFloat($(this).attr("min"));
                                }

                                if ($(this).hasAttr("max")) {
                                    in_max = parseFloat($(this).attr("max"));
                                }

                                if ($(this).hasAttr("decimales")) {
                                    decs = parseInt($(this).attr("decimales"));
                                }

                                $(this).autoNumberFormat({
                                    min: in_min,
                                    max: in_max,
                                    decimales: decs,
                                });
                            }
                        }
                    });
                settings.onDataLoad.call(recordID);
                if (settings.action === "open") {
                    $(input).disableFields({
                        mode: "disable",
                        buttons: true,
                    });

                    //$(input).findAttr("hideButton").removeAttr("disabled");
                    $(input).find(".hideButton").removeAttr("disabled");
                }

                if ((settings.action === "edit" || settings.action === "new") && !annulled) {
                    if (settings.action === "edit") {
                        $(input)
                            .findAttr("onlyNew")
                            .each(function(index, el) {
                                $(this).attr("disabled", "disabled");
                            });
                    }

                    settings.onDataMod.call(recordID);

                    $("#edit_record" + settings.controller + "_" + settings.registro).attr("disabled", true);
                }

                $(input)
                    .findAttr("help")
                    .each(function(index, el) {
                        let helpController = $(this).attr("help");
                        let mas_parametros = new Array();

                        if ($(this).hasAttr("depends")) {
                            let depends = $(this).attr("depends");
                            mas_parametros[0] = $("#" + depends + "_" + settings.pantalla + settings.registro).val();
                            $("#" + depends).change(function(event) {
                                mas_parametros[0] = $(this).val();
                            });
                        }

                        if ($(this).hasAttr("extraParam")) {
                            let depends = $(this).attr("extraParam");
                            mas_parametros[0] = depends;
                        }

                        if ($(this).hasAttr("extraParam2")) {
                            let depends = $(this).attr("extraParam2");
                            mas_parametros[1] = depends;
                        }

                        $(this).addHelpEvent({ controller: helpController, pantalla: settings.pantalla, parametrosAdicionales: mas_parametros });
                    });

                if (settings.action === "new" && $(this).findKey({ find: "ID" }) !== "undefined") {
                    $("#btnX" + settings.funcion + "_invacio").click(function(event) {
                        if (settings.action === "new") {
                            var obj = {};
                            obj.ID = recordID;
                            var server = new $4D.Server(settings.controller, "Delete", obj);
                            server.Execute();
                        }
                    });

                    $("#close_record" + settings.funcion + "_vacio").click(function(event) {
                        if (settings.action === "new") {
                            var obj = {};
                            obj.ID = recordID;
                            var server = new $4D.Server(settings.controller, "Delete", obj);
                            server.Execute();
                        }
                    });
                }

                // $(input).find("textarea").each(function(index, el) {
                //     $(this).clearPaste();
                // });

                settings.onEventsAndDataLoad.call(recordID);
            },
        });

        traductor.TraducirScope(input);

        if (settings.action == "edit" || settings.action == "new") {
            $(input)
                .find("table")
                .each(function(index, el) {
                    if ($(this).hasAttr("id")) {
                        $(this).attr("auto-edit", "true");
                    }
                });
        }

        if (settings.action === "open") {
            $("#save_record" + settings.controller + "_" + settings.registro).attr("disabled", true);
        }

        if (settings.save) {
            $("#save_record" + settings.controller + "_" + settings.registro).click(function(event) {
                $("#index_" + settings.controller + "_" + settings.registro)
                    .children("div")
                    .removeClass("tiene-error");
                var error = $(input).checkFields();
                if (!error) {
                    $(input).createObject({
                        pantalla: settings.pantalla,
                        registro: recordID,
                        controller: settings.controller,
                        save: true,
                        regObj: recordObj,
                        onSuccess: function() {
                            settings.onSave.call(this);
                        },
                    });

                    $(input).disableFields({
                        mode: "disable",
                    });

                    if (settings.action == "new") {
                        settings.action = "edit";
                        $("#btnX" + settings.funcion + "_invacio").trigger("click");
                    } else {
                        $("#btnX" + settings.funcion + "_in" + settings.registro).trigger("click");
                    }

                    //$('#edit_record' + settings.controller + "_" + settings.registro).removeAttr('disabled');

                    //if (settings.registro == "vacio") {
                    //}
                } else {
                    $(input)
                        .find(".tiene-error")
                        .each(function(index, el) {
                            let scrollButt = $(this).closest("[scroll-button]").attr("scroll-button");
                            $("#" + scrollButt).addClass("tiene-error");
                        });
                }
            });
        }

        $("#edit_record" + settings.controller + "_" + settings.registro).click(function(event) {
            $.when(verificar_permiso(settings.modulo, settings.funcion, "MOD")).done(function() {
                $.when(checkear(settings.registro, settings.tableNum, settings.funcion + "_in")).fail(function(a1) {
                    $(input).disableFields({
                        mode: "enable",
                        buttons: true,
                    });

                    $(input)
                        .find("table")
                        .each(function(index, el) {
                            if ($(this).hasAttr("id")) {
                                $(this).attr("auto-edit", "true");
                            }
                        });

                    $("#edit_record" + settings.controller + "_" + settings.registro).attr("disabled", true);
                    $("#save_record" + settings.controller + "_" + settings.registro).removeAttr("disabled");
                    $(input)
                        .findAttr("onlyNew")
                        .each(function(index, el) {
                            $(this).attr("disabled", "disabled");
                        });
                    settings.onDataMod.call(recordID);
                });
            });
        });

        $("#close_record" + settings.controller + "_" + settings.registro).click(function(event) {
            if (settings.action == "edit") {
                Swal.fire({
                    title: "Esta seguro?",
                    text: "Esta seguro que desea cerrar el registro? se perderan los datos cargados",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                }).then(function() {
                    if (settings.action == "new") {
                        $("#btnX" + settings.funcion + "_invacio").trigger("click");
                    } else {
                        $("#btnX" + settings.funcion + "_in" + settings.registro).trigger("click");
                    }
                });
            } else {
                if (settings.action == "new") {
                    $("#btnX" + settings.funcion + "_invacio").trigger("click");
                } else {
                    $("#btnX" + settings.funcion + "_in" + settings.registro).trigger("click");
                }
            }
        });
    };
})(jQuery);

(function($) {
    //Crea la seleccion de roles, esconde y muestra campos según lo que este seleccionado
    $.fn.seleccionarRoles = function(options) {
        var scope = this;

        var settings = $.extend({
                select: null,
                mode: "checkbox",
            },
            options
        );

        var selectedOptions;

        var availableOptions = [];

        $(settings.select)
            .find("[rol]")
            .each(function(index, el) {
                availableOptions.push($(this).attr("rol"));
            });

        $(scope)
            .find("[rol]")
            .each(function(index, el) {
                let thisRol = $(this).attr("rol");
                if ($(settings.select).find(this).length === 0 && availableOptions.includes(thisRol)) {
                    $(this).hide();
                }
            });

        if (settings.mode === "checkbox") {
            $(settings.select)
                .find(":checkbox")
                .each(function(index, el) {
                    if ($(this).is(":checked")) {
                        var rol = $(this).attr("rol");
                        $(scope)
                            .findAttr("rol")
                            .each(function(index, el) {
                                if ($(this).attr("rol").includes(rol)) {
                                    $(this).show();
                                }
                            });
                    }

                    $(this).click(function(event) {
                        var rol = $(this).attr("rol");
                        var isChecked = $(this).is(":checked");
                        $(scope)
                            .findAttr("rol")
                            .each(function(index, el) {
                                if ($(this).attr("rol").includes(rol)) {
                                    if ($(settings.select).find(this).length === 0) {
                                        if (isChecked) {
                                            $(this).show();
                                        } else {
                                            $(this).hide();
                                        }
                                    }
                                }
                            });

                        $(settings.select)
                            .find(":checkbox")
                            .each(function(index, el) {
                                if ($(this).is(":checked")) {
                                    var rol = $(this).attr("rol");
                                    $(scope)
                                        .findAttr("rol")
                                        .each(function(index, el) {
                                            if ($(this).attr("rol").includes(rol)) {
                                                $(this).show();
                                            }
                                        });
                                }
                            });
                    });
                });
        } else {
            $(settings.select).change(function(event) {
                var rol = $(this).find("option:selected").attr("rol");
                $(scope)
                    .findAttr("rol")
                    .each(function(index, el) {
                        if ($(this).attr("rol").includes(rol)) {
                            // if ($(settings.select).find(this).length === 0) {
                            $(this).show();
                            // }
                        } else {
                            let thisRol = $(this).attr("rol");
                            if ($(settings.select).find(this).length === 0 && availableOptions.includes(thisRol)) {
                                $(this).hide();
                            }
                        }
                    });
            });

            $(settings.select).trigger("change");
        }
    };
})(jQuery);

(function($) {
    //Vacia todos los campos dentro de un scope
    $.fn.emptyFields = function(options) {
        let field = this;

        var settings = $.extend({}, options);

        var inputs = $(field).find(":input:not(:button)");
        var textareas = $(field).find("textarea");

        inputs.each(function(index, el) {
            if ($(this).attr("type") === "number" || $(this).hasAttr("num")) {
                $(this).val("0");
            } else {
                if ($(this).attr("type") === "checkbox") {
                    $(this).prop("checked", false);
                } else {
                    $(this).val("");
                }
            }
        });

        textareas.each(function(index, el) {
            $(this).val("");
        });
    };
})(jQuery);

(function($) {
    //Añade el asterisco a uncampo obligatorio
    $.fn.addObligatorio = function(options) {
        var scope = this;

        var settings = $.extend({}, options);

        if ($(scope).hasAttr("obligatorio")) {
            let varWrap = '<div class="form-group input-group" style="float:right;';
            //let estilo = (Math.round(100 * parseFloat($(scope).css('width')) / parseFloat($(scope).parent().css('width')))) + '%';
            //varWrap += 'width:' + estilo + ';'
            varWrap += "width:100%;";
            varWrap += '"></div>';
            $(scope).wrap(varWrap);
            $(scope).after('<span class="input-group-addon" style="color: red;" title="Campo Obligatorio">*</span>');
        }
    };
})(jQuery);

(function($) {
    //Agrega el formato y funcionalidad a un dialog
    $.fn.loadDialog = function(options) {
        let self = this;

        var settings = $.extend({
                esDependiente: false,
                idExterno: "",
                idreg: "vacio",
                action: "open",
                controller: self.attr("controller"),
                pantalla: self.attr("id"),
                title: self.attr("title"),
                width: 600,
                onClose: function() {},
                onOpen: function(json) {},
                onSave: function(json) {},
            },
            options
        );

        var recordObjDialog = {};

        $(self).disableFields({ mode: "disable" });

        traductor.TraducirScope(self);

        if (settings.action === "new" && settings.idreg == "nuevo") {
            $(self).disableFields({ mode: "enable" });
            $(self).emptyFields();
            $(self)
                .find("input:not(:checkbox)")
                .each(function(index, el) {
                    if ($(this).hasAttr("date")) {
                        $(this).datepicker({ dateFormat: "dd/mm/yy" });
                    } else {
                        if ($(this).attr("type") === "number" || $(this).hasAttr("num")) {
                            if ($(this).val() == "") {
                                $(this).val("0");
                            }

                            let in_min = null;
                            let in_max = null;
                            let decs = 2;

                            if ($(this).hasAttr("min")) {
                                in_min = parseFloat($(this).attr("min"));
                            }

                            if ($(this).hasAttr("max")) {
                                in_max = parseFloat($(this).attr("max"));
                            }

                            if ($(this).hasAttr("decimales")) {
                                decs = parseInt($(this).attr("decimales"));
                            }

                            $(this).autoNumberFormat({
                                min: in_min,
                                max: in_max,
                                decimales: decs,
                            });
                        }
                    }
                });

            openDialogPlugin();
            settings.onOpen.call();
        } else {
            $(self).fillInputs({
                controller: settings.controller,
                // pantalla: settings.pantalla.replace(settings.idExterno, ""),
                pantalla: settings.pantalla,
                cambiarID: false,
                registro: settings.idreg,
                onDataReady: function() {
                    recordObjDialog = this[0];

                    if (settings.idreg == "vacio") {
                        $(self).disableFields({ mode: "enable" });
                    }

                    $(self)
                        .find("input:not(:checkbox)")
                        .each(function(index, el) {
                            if ($(this).hasAttr("date")) {
                                $(this).datepicker({ dateFormat: "dd/mm/yy" });
                            } else {
                                if ($(this).attr("type") === "number" || $(this).hasAttr("num")) {
                                    if ($(this).val() == "") {
                                        $(this).val("0");
                                    }

                                    let in_min = null;
                                    let in_max = null;
                                    let decs = 2;
                                    if ($(this).hasAttr("min")) {
                                        in_min = parseFloat($(this).attr("min"));
                                    }

                                    if ($(this).hasAttr("max")) {
                                        in_max = parseFloat($(this).attr("max"));
                                    }

                                    if ($(this).hasAttr("decimales")) {
                                        decs = parseInt($(this).attr("decimales"));
                                    }

                                    $(this).autoNumberFormat({
                                        min: in_min,
                                        max: in_max,
                                        decimales: decs,
                                    });
                                }
                            }
                        });
                    openDialogPlugin();
                    settings.onOpen.call(self, recordObjDialog);
                },
            });
        }

        if (settings.action === "edit") {
            $(self).disableFields({ mode: "enable" });
            $(self)
                .findAttr("onlyNew")
                .each(function(index, el) {
                    $(this).attr("disabled", "disabled");
                });
        }

        function openDialogPlugin() {
            $(self)
                .dialog({
                    width: settings.width,
                    title: settings.title,
                    buttons: {
                        Save: {
                            text: "Save",
                            class: "btn btn-success",
                            id: "save_item_dialog_" + settings.pantalla + settings.idExterno + settings.idreg,
                        },
                    },
                    close: function(event) {
                        $(self).disableFields({ mode: "disable" });
                        $(self).emptyFields();
                        settings.onClose.call();
                        $(document.body)
                            .find("[aria-describedby='" + self.attr("id") + "']")
                            .destroyElement();
                    },
                })
                .prev(".ui-dialog-titlebar")
                .css("background", "#337ab7");

            $("#save_item_dialog_" + settings.pantalla + settings.idExterno + settings.idreg)
                .removeClass("ui-button")
                .unbind("click")
                .click(function(event) {
                    var error = $(self).checkFields();
                    if (!error) {
                        $(this).attr("disabled", "true");
                        var obj = $(self).createObject({
                            pantalla: settings.pantalla.replace(settings.idExterno, ""),
                            registro: settings.idreg,
                            extraParam: settings.idExterno,
                            controller: settings.controller,
                            regObj: recordObjDialog,
                            save: true,
                            onSuccess: function(json) {
                                settings.onSave.call(this);
                                $(self).dialog("close");
                                $("#save_item_dialog_" + settings.pantalla + settings.idExterno + settings.idreg).removeAttr("disabled");
                            },
                        });
                        // if (settings.esDependiente) {
                        //     localStorage.setItem(settings.idExterno + "_" + settings.controller, JSON.stringify(obj));
                        // }
                    }
                });

            if (settings.action === "open") {
                $("#save_item_dialog_" + settings.pantalla + settings.idExterno + settings.idreg).attr("disabled", true);
            }
        }
    };
})(jQuery);

(function($) {
    //Busca una key en un JSON y te da el valor si existe
    $.fn.findKey = function(options) {
        var scope = this[0];

        var settings = $.extend({
                find: "ID",
            },
            options
        );

        var result = "undefined";

        for (var key in scope) {
            var value = scope[key];
            if (key == settings.find) {
                result = value;
                break;
            } else {
                if (typeof scope[key] == "object") {
                    result = $(value).findKey({ find: settings.find });
                }
            }
        }

        return result;
    };
})(jQuery);

(function($) {
    //Filtra los campos por pais
    $.fn.filterByCountry = function(options) {
        var scope = this;

        var settings = $.extend({
                country: "AR",
                getFromMemory: true,
            },
            options
        );

        if (settings.getFromMemory) {
            settings.country = localStorage.getItem("Country_ID");
        }

        $(scope)
            .findAttr("pais")
            .each(function(index, el) {
                if ($(this).attr("pais").includes(settings.country)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
    };
})(jQuery);

(function($) {
    //Obtiene la paridad para una moneda
    $.fn.getExchange = function(options) {
        var scope = this;

        var settings = $.extend({
                campoMonPri: null,
                campoMonLeg: null,
                date: "00/00/00",
                onReceived: function(json) {},
            },
            options
        );

        $(scope).change(function(event) {
            var obj = {};
            obj["Moneda"] = $(this).val();
            obj["Date"] = settings.date;
            var server = new $4D.Server("EXCHANGES", "getExchange", obj);
            server.Success = function(json) {
                settings.campoMonPri.changeVal(json[0].Ex_MonPri);
                settings.campoMonLeg.changeVal(json[0].Ex_MonLeg);
                settings.onReceived.call(json);
            };
            server.Execute();
        });
    };
})(jQuery);

(function($) {
    //Hace una accion y valida con un swal
    $.serverValidation = function(options) {
        var settings = $.extend({
                action: null,
                controller: null,
                obj: null,
                successMsg: "La accion se ha realizado correctamente",
                errorMsg: "La accion no se ha podido realizar",
                showErrorMsg: true,
                showSuccessMsg: true,
                onSuccess: function(json) {},
                onError: function(json) {},
                onComplete: function(json, status) {},
            },
            options
        );

        var server = new $4D.Server(settings.controller, settings.action, settings.obj);
        server.Success = function(json) {
            if (settings.showSuccessMsg) {
                Swal.fire("", settings.successMsg, "success");
            }
            settings.onSuccess.call(json);
        };
        server.Error = function(json) {
            if (settings.showErrorMsg) {
                Swal.fire("Error", settings.errorMsg, "error");
            }
            settings.onError.call(json);
        };
        server.Complete = function(json, status) {
            settings.onComplete.call(json, status);
        };
        server.Execute();
    };
})(jQuery);

(function($) {
    //Se le da una key de json con sublementos en forma de array y popula una tabla
    $.fn.fillTable = function(options) {
        var scope = this;

        var settings = $.extend({
                data: null,
                hideColumns: [],
                numColumns: [],
                emptyMessage: false,
                onDataLoad: function(json) {},
            },
            options
        );

        if (settings.data.length > 0) {
            let content = create_tr_var(settings.data);
            $(scope).find("tbody").append(content);
        } else {
            if (settings.emptyMessage) {
                $(scope).addMessageLine({ Message: "Nothing to report" });
            }
        }
        $(scope).tableFormat();

        for (let i = 0, length1 = settings.numColumns.length; i < length1; i++) {
            $(scope).columnNumberFormat({ column: settings.numColumns[i] });
        }

        $(scope).hideColumn({ columns: settings.hideColumns });

        $(scope)
            .find("th")
            .each(function(index, el) {
                if (!$(this).is(":visible")) {
                    $(scope).hideColumn({ columns: [index] });
                }
            });

        settings.onDataLoad.call();
    };
})(jQuery);

(function($) {
    //Esconde una columna de una tabla
    $.fn.hideColumn = function(options) {
        var settings = $.extend({
                columns: [],
                hide: true,
            },
            options
        );

        var table = this;

        if (settings.hide) {
            for (var i = 0; i < settings.columns.length; i++) {
                $(table)
                    .find("thead")
                    .find("th:eq(" + settings.columns[i] + ")")
                    .hide();

                $(table)
                    .find("tbody")
                    .find("tr")
                    .each(function(index, el) {
                        var td = $(this).find("td:eq(" + settings.columns[i] + ")");
                        $(td).hide();
                    });
            }
        } else {
            for (var i = 0; i < settings.columns.length; i++) {
                $(table)
                    .find("thead")
                    .find("th:eq(" + settings.columns[i] + ")")
                    .show();

                $(table)
                    .find("tbody")
                    .find("tr")
                    .each(function(index, el) {
                        var td = $(this).find("td:eq(" + settings.columns[i] + ")");
                        $(td).show();
                    });
            }
        }
    };
})(jQuery);

(function($) {
    //Añade una linea a una tabla con un texto
    $.fn.addMessageLine = function(options) {
        var settings = $.extend({
                Message: "",
                value: "",
                style: "",
                completeLine: false,
            },
            options
        );
        var table = this;
        let emptyLine = "<tr>";
        let cols = 0;

        if ($(table).find("thead").find("th").length > $(table).find("tbody").find("tr").first().children("td").length) {
            cols = $(table).find("thead").find("th").length;
        } else {
            cols = $(table).find("tbody").find("tr").first().children("td").length;
        }

        if (settings.completeLine) {
            emptyLine += "<td colspan='" + cols + "' style='" + settings.style + "'>" + settings.Message + "</td>";
        } else {
            for (index = 0; index < cols; index++) {
                emptyLine += "<td style='" + settings.style + "'>";
                if (index == 0) {
                    emptyLine += settings.Message;
                }

                if ($(table).find("thead").find("th").length == index + 1) {
                    emptyLine += settings.value;
                }

                emptyLine += "</td>";
            }
        }

        emptyLine += "</tr>";

        $(table).find("tbody").append(emptyLine);
    };
})(jQuery);

(function($) {
    //Agrega el grafico a una tabla
    $.fn.loadGraph = function(options) {
        var settings = $.extend({
                type: "doughnut",
                legend: true,
                label: "Info",
            },
            options
        );

        var table = this;

        let values = new Array();
        let names = new Array();

        $(table)
            .find("th")
            .each(function(index, el) {
                if ($(this).hasAttr("labels")) {
                    $(table)
                        .find("tbody")
                        .find("tr")
                        .each(function(trindex, el) {
                            names[trindex] = $(this)
                                .find("td:eq(" + index + ")")
                                .text();
                        });
                }

                if ($(this).hasAttr("values")) {
                    $(table)
                        .find("tbody")
                        .find("tr")
                        .each(function(trindex, el) {
                            values[trindex] = parseInt(
                                $(this)
                                .find("td:eq(" + index + ")")
                                .text()
                            );
                        });
                }
            });

        $(table).after('<canvas id="' + table.attr("id") + '_grafico" style="style:display:none;max-width:600px;" width="770" height="385"></canvas>');

        $(table).parent().find("label").remove();

        $(table).before('<label class="switch"><input id="' + table.attr("id") + '_slider" type="checkbox"><span class="slider round"></span></label>');

        $("#" + table.attr("id") + "_slider").click(function(event) {
            $("#" + table.attr("id") + "_grafico").toggle();
            table.toggle();
        });

        let ctxCargos = document.getElementById(table.attr("id") + "_grafico").getContext("2d");

        let CargosChart = new Chart(ctxCargos, {
            type: settings.type,
            data: {
                labels: names,
                datasets: [{
                    label: settings.label,
                    data: values,
                    backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)", "rgba(165, 99, 33, 1)", "rgba(215, 95, 199, 1)", "rgba(37, 171, 37, 1)", "rgba(107, 255, 230, 1)", "rgba(211, 211, 211, 1)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)", "rgba(165, 99, 33, 1)", "rgba(215, 95, 199, 1)", "rgba(37, 171, 37, 1)", "rgba(107, 255, 230, 1)", "rgba(211, 211, 211, 1)"],
                    borderWidth: 1,
                }, ],
            },
            options: {
                legend: {
                    display: settings.legend,
                },
            },
        });

        $("#" + table.attr("id") + "_grafico").css("max-height", "600px");
        $("#" + table.attr("id") + "_grafico").css("margin", "auto");

        $("#" + table.attr("id") + "_grafico").hide();
    };
})(jQuery);

(function($) {
    //Permite obtener un valor en float de un campo, o cargar un valor float en un campo con el formateo correcto
    $.fn.numVal = function(v) {
        let value = "";

        var P1; // enteros
        var P2; // decimales
        Stringformat = CurrentUser.format;
        //if ((0.1).toLocaleString().charAt(1) == ".") {
        if (CurrentUser.serverFormat == "true") {
            P1 = ",";
            P2 = ".";
        } else {
            P1 = ".";
            P2 = ",";
        }

        let nums = new Array();
        if (v === undefined) {
            let valor = "";
            if ($(this).is("INPUT") || $(this).is("SELECT") || $(this).is("TEXTAREA")) {
                valor = $(this).val();
            } else {
                valor = $(this).text();
            }

            if (valor == "") {
                valor = "0";
            }

            nums = valor.split("");
            for (let i = 0, length1 = nums.length; i < length1; i++) {
                if (nums[i] != P1) {
                    if (nums[i] == P2) {
                        value = value + P1;
                    } else {
                        value = value + nums[i];
                    }
                }
            }
            value = value.replaceAll(",", ".");
        } else {
            value = String(v);
            $(this).val(value.replaceAll(P1, P2)).trigger("change");
        }

        return parseFloat(value);
    };
})(jQuery);

(function($) {
    //Transforma unos checkbox a radio button
    $.fn.radio = function(options) {
        var scope = this;

        let isRadioChecked = false;
        let firstChecked = 0;

        $(scope)
            .find(":checkbox")
            .each(function(index, el) {
                $(this).click(function(event) {
                    $(scope)
                        .find(":checkbox")
                        .each(function(index, el) {
                            $(this).prop("checked", false);
                        });
                    $(this).prop("checked", true);
                });

                if (!isRadioChecked) {
                    isRadioChecked = $(this).prop("checked");
                    firstChecked = index;
                }
            });

        if (!isRadioChecked) {
            $(scope).find(":checkbox").first().trigger("click");
        } else {
            $(scope)
                .find(":checkbox:eq(" + firstChecked + ")")
                .trigger("click");
        }
    };
})(jQuery);

(function($) {
    //Busca en una tabla en memoria
    $.fn.addAutomaticSearch = function(options) {
        var settings = $.extend({
                onSearch: function() {},
            },
            options
        );

        var table = this;
        let searchID = $(table).attr("id") + "_Search";

        $(table).before("<div style='width:7cm;float:right;text-align:right;'><p style='width:2cm;display:inline;'>Search: </p><input id='" + searchID + "' type='search' style='width:5cm;margin-bottom:0.2cm;display:inline;' class='form-control input-sm' no-guardar></div>");

        $("#" + searchID).keyup(function(event) {
            let val = $(this).val();
            $(table)
                .find("tbody")
                .find("tr")
                .each(function(index, el) {
                    let tr = $(this);
                    let encontrado = false;
                    tr.find("td").each(function(index, el) {
                        if (!encontrado) {
                            if ($(this).text().toLowerCase().includes(val.toLowerCase())) {
                                encontrado = true;
                            }
                        }
                    });
                    if (encontrado) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });

            settings.onSearch.call();
        });
    };
})(jQuery);

(function($) {
    //Elimina todos los caracteres que le pases dentro del array de un campo, lo hace en tiempo real
    $.fn.normalizeField = function(options) {
        var settings = $.extend({
                caracteres: [" ", "/", "\\", "@", "{", "}"],
            },
            options
        );

        var field = this;

        $(field).keyup(function(event) {
            let value = $(this).val().split("");
            let final = "";
            for (i = 0; i < value.length; i++) {
                let valid = true;
                for (j = 0; j < settings.caracteres.length; j++) {
                    if (value[i] == settings.caracteres[j]) {
                        valid = false;
                    }
                }
                if (valid) {
                    final = final + value[i];
                }
            }
            $(this).val(final);
        });
    };
})(jQuery);

(function($, undefined) {
    //Obtiene la posicion del cursor dentro de un objeto
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ("selectionStart" in el) {
            pos = el.selectionStart;
        } else if ("selection" in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart("character", -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };
})(jQuery);

(function($) {
    //Agrega el autofiltro a una tabla
    $.fn.autoFilter = function(options) {
        var settings = $.extend({
                columns: [],
                thRow: 0,
            },
            options
        );

        let table = this;

        let idTable = table.attr("id");

        table.find(".multiselect").destroyElement();

        let objFilter = {};

        table
            .find("thead").find("tr:eq(" + settings.thRow + ")").find("th").each(function(index, el) {
                let enter = false;
                if (settings.columns.length > 0) {
                    if (settings.columns.indexOf(index) > -1) {
                        enter = true;
                    }
                } else {
                    enter = true;
                }
                if (enter) {
                    let options = [];
                    let indexPadre = index;
                    let selectHtml = "<div class='multiselect' style='width:100%;text-align:center;margin-top: 2px;position:relative;'><div id='selectBox_" + idTable + "_" + index + "' class='selectBox'>";
                    selectHtml += "<i class='fa fa-angle-down'></i><div class='overSelect'></div></div>";
                    selectHtml += "<div style='z-index:2;position: absolute;height:fit-content;max-heigth:10cm;overflow:auto;padding: 0px!important;left:0px;' id='checkboxes_" + idTable + "_" + index + "' class='checkboxesMultiselect'>";
                    table
                        .find("tbody")
                        .children("tr")
                        .find("td:eq(" + index + ")")
                        .each(function(index, el) {
                            let txt = $(this).text();
                            let x = options.indexOf(txt);
                            if (x < 0) {
                                options.push(txt);
                            }
                            objFilter[index] = [];
                        });

                    options.sort();

                    for (var i = 0; i < options.length; i++) {
                        selectHtml += "<label for='" + options[i] + "' style='color:black;width:100%;'>";
                        selectHtml += "<input type='checkbox' disabled filtro='" + options.length + "' id='filtro_opcion_" + options.length + "_" + idTable + "_" + indexPadre + "'>" + options[i];
                        selectHtml += "</label>";
                    }

                    selectHtml += "</div></div>";
                    $(this).append(selectHtml);
                    $("#selectBox_" + idTable + "_" + index).showCheckboxes({ autoFilter: true });

                    $("#checkboxes_" + idTable + "_" + index)
                        .children()
                        .click(function(event) {
                            //Modified by Irettam - 2024-06-26[10:31:07]
                            let val = $(this).attr("for");
                            if ($(this).find("input").prop("checked") == false) {
                                // $("#checkboxes_" + idTable + "_" + index).children().find('input').prop('checked', false);
                                objFilter[index].push(val);
                                $(this).find("input").prop("checked", true);
                            } else {
                                let ops = objFilter[index];
                                let iops = ops.indexOf(val);
                                if (iops > -1) {
                                    ops.splice(iops, 1);
                                }
                                objFilter[index] = ops;
                                $(this).find("input").prop("checked", false);
                            }

                            table.find("tbody").children("tr").hide();
                            let primerFiltro = true;
                            for (key in objFilter) {
                                let aobj = objFilter[key];
                                for (var i = 0; i < aobj.length; i++) {
                                    table
                                        .find("tbody")
                                        .children("tr")
                                        .find("td:eq(" + key + ")")
                                        .each(function(index, el) {
                                            if (primerFiltro) {
                                                if (aobj[i] == $(this).text()) {
                                                    $(this).parent("tr").show();
                                                }
                                            } else {
                                                if (aobj[i] != $(this).text()) {
                                                    $(this).parent("tr").hide();
                                                }
                                            }
                                        });
                                }
                                if (aobj.length > 0) {
                                    primerFiltro = false;
                                }
                            }

                            if (primerFiltro) {
                                table.find("tbody").children("tr").show();
                            }
                        });
                }
            });
    };
})(jQuery);

(function($) {
    //Transforma la tabla en un formato que acepte excel
    $.fn.transformToExcelFormat = function(options) {
        var table = this;

        let res = "<table border='1' cellspacing='0' cellpadding='1' align='center'>";

        $(table)
            .find("tr:visible")
            .each(function(index, el) {
                res += "<tr>";
                let findme = "td";
                if (index == 0) {
                    findme = "th";
                }
                $(this)
                    .find(findme + ":visible")
                    .each(function(index, el) {
                        if (findme == "th") {
                            $(this).find(".multiselect").remove();
                        }
                        res += "<td ";
                        let color = rgb2hex($(this).css("background-color"));
                        if (color == "#000000") {
                            // Cuando es transparente te lo pone como negro, asi que lo hacemos blanco, si queres usar negro, F por vos
                            color = "#ffffff";
                        }
                        res += "bgcolor='" + color + "' ";
                        res += "width='" + parseInt($(this).width()) + "' ";
                        let align = $(this).css("text-align");
                        if (align == "start" || align == "left") {
                            align = "left";
                        } else {
                            align = "right";
                        }
                        res += "align='" + align + "'>";
                        res += $(this).text();
                        res += "</td>";
                    });
                res += "</tr>";
            });

        res += "</table>";

        return res;
    };
})(jQuery);

(function($) {
    //Exporta como archivo el selector que le pases
    $.fn.exportFile = function(options) {
        var settings = $.extend({
                extensions: ["xls", "html"],
            },
            options
        );

        var cont = this;

        $("#export_extension").empty();

        for (var i = 0; i < settings.extensions.length; i++) {
            let option = "<option value='" + settings.extensions[i] + "' >" + settings.extensions[i] + "</option>";
            $("#export_extension").append(option);
        }

        $("#modal_export_principal").modal("show");
        $("#name_export_modal").val("doc");

        var this_text = "";
        if ($("#export_extension").val() == "xls") {
            this_text = cont.transformToExcelFormat();
        } else {
            this_text = cont[0].outerHtml;
        }

        $("#modal_export_save").click(function(event) {
            var nombre = $("#name_export_modal").val();
            var blob = new Blob([this_text], { type: "text/plain;charset=Windows-1252" });
            var extension = $("#export_extension").val();
            saveAs(blob, nombre + "." + extension);
            $("#modal_export_principal").modal("hide");
            $("#modal_export_save").unbind("click");
            event.stopImmediatePropagation();
        });

        $("#modal_export_close").click(function(event) {
            $("#modal_export_principal").modal("hide");
        });
    };
})(jQuery);

(function($) {
    //Agrega la seleccion de X para las columnas seleccionadas de una tabla
    $.fn.columnSelect = function(options) {
        var settings = $.extend({
                columns: [],
                multipleSelection: true,
                horizontalMultipleSelection: true,
                horizontalColumns: [],
            },
            options
        );

        let table = this;

        table
            .find("tbody")
            .find("tr")
            .each(function(index, el) {
                for (var i = 0; i < settings.columns.length; i++) {
                    let col = settings.columns[i];
                    $(this)
                        .find("td:eq(" + settings.columns[i] + ")")
                        .click(function(event) {
                            if ($(this).text() == "") {
                                if (!settings.multipleSelection) {
                                    table
                                        .find("tbody")
                                        .find("tr")
                                        .each(function(index, el) {
                                            $(this)
                                                .find("td:eq(" + col + ")")
                                                .text("");
                                        });
                                }
                                if (!settings.horizontalMultipleSelection) {
                                    for (var j = 0; j < settings.horizontalColumns.length; j++) {
                                        let hcol = settings.horizontalColumns[j];
                                        table
                                            .find("tbody")
                                            .find("tr:eq(" + index + ")")
                                            .find("td:eq(" + hcol + ")")
                                            .text("");
                                    }
                                }
                                $(this).text("X");
                            } else {
                                $(this).text("");
                            }
                        });
                }
            });
    };
})(jQuery);

(function($) {
    //Agrega el formateo de numero al estilo banco
    $.fn.autoNumberFormat = function(options) {
        var settings = $.extend({
                decimales: 2,
                decChar: (0.1).toLocaleString().charAt(1),
                min: null,
                max: null,
            },
            options
        );

        let field = this;
        let EntSep = ".";

        settings.decChar = ",";
        if (CurrentUser.serverFormat == "true") {
            settings.decChar = ".";
        }

        if (settings.decChar == ".") {
            EntSep = ",";
        }

        $(this).numberFormat({ decimales: settings.decimales });

        field.focus(function(event) {
            if ($(this).numVal() == 0) {
                $(this).val("");
            }
            let flend = $(this).val().length;
            $(this)[0].setSelectionRange(flend, flend);
        });

        field.blur(function(event) {
            if (settings.min != null) {
                if ($(this).numVal() < settings.min) {
                    $(this).val("");
                }
            }

            if (settings.max != null) {
                if ($(this).numVal() > settings.max) {
                    $(this).val("");
                }
            }

            let negativo = false;
            if ($(this).numVal() < 0) {
                negativo = true;
            }

            if (negativo) {
                $(this).css("color", "red");
            } else {
                $(this).css("color", "#555");
            }

            let numero = $(this).val();

            numero = $(this).val().replaceAll(",", "");
            numero = numero.replaceAll(".", "");

            numero = numero.split("");

            let numFiltrado = "";

            for (var i = 0; i < numero.length; i++) {
                if (!isNaN(numero[i]) || numero[i] == "-") {
                    numFiltrado += numero[i];
                }
            }

            let numeroFinal = formatearNumero(numFiltrado);

            $(this).val(numeroFinal);
        });

        field.change(function(event) {
            if (!field.val().includes(settings.decChar) && settings.decimales > 0) {
                let valor = $(this).val() + settings.decChar;
                for (var i = 0; i < settings.decimales; i++) {
                    valor += "0";
                }
                $(this).val(valor);
            } else {
                let valor = $(this).val().split(settings.decChar);
                if (!(valor[1].length == settings.decimales)) {
                    if (valor[1].length > settings.decimales) {
                        let decs = valor[1];
                        valor[1] = decs.substring(0, settings.decimales);
                    } else {
                        for (var i = valor[1].length; i < settings.decimales; i++) {
                            valor[1] += "0";
                        }
                    }
                    $(this).val(valor[0] + settings.decChar + valor[1]);
                }
            }

            field.trigger("blur");
        });

        field.keyup(function(event) {
            if ((event.code == "NumpadDecimal" || event.code == "Period") && event.key !== settings.decChar) {
                let position = $(this)[0].selectionStart;
                let numero = $(this).val();
                let parteInicial = numero.substring(0, position - 1);
                let parteFinal = numero.substring(position);
                $(this).val(parteInicial + settings.decChar + parteFinal);
            }
        });

        function formatearNumero(valor) {
            numero = valor.split("");
            let numeroFinal = "";
            let contadorEnt = 0;

            let lenNum = numero.length;
            for (var i = 0; i < settings.decimales; i++) {
                if (i <= lenNum - 1) {
                    numeroFinal = numero[lenNum - 1 - i] + numeroFinal;
                } else {
                    numeroFinal = "0" + numeroFinal;
                }
            }

            if (numeroFinal.length < lenNum) {
                let len = numeroFinal.length;
                if (settings.decimales > 0) {
                    numeroFinal = settings.decChar + numeroFinal;
                }
                for (var i = lenNum - len - 1; i >= 0; i--) {
                    if (contadorEnt == 3) {
                        if (i == 0 && numero[0] == "-") {
                            numeroFinal = numeroFinal;
                        } else {
                            numeroFinal = EntSep + numeroFinal;
                        }
                        contadorEnt = 0;
                    }

                    numeroFinal = numero[i] + numeroFinal;

                    contadorEnt++;
                }
            } else {
                numeroFinal = "0" + settings.decChar + numeroFinal;
            }

            return numeroFinal;
        }
    };
})(jQuery);

(function($) {
    //Agrega el ordenado de las columnas cuando haces click en el titulo
    $.fn.autoOrder = function(options) {
        var settings = $.extend({
                columns: [],
                hasTotal: false,
            },
            options
        );

        let table = this;

        let idTable = table.attr("id");

        table
            .find("thead")
            .find("th")
            .each(function(index, el) {
                let enter = false;
                if (settings.columns.length > 0) {
                    if (settings.columns.indexOf(index) > -1) {
                        enter = true;
                    }
                } else {
                    enter = true;
                }
                if (enter) {
                    $(this).attr("orden", "asc");
                    $(this).click(function(event) {
                        let tipo = "text";

                        if ($(this).hasAttr("date")) {
                            tipo = "date";
                        }

                        if ($(this).hasAttr("num")) {
                            tipo = "num";
                        }

                        let total = {};

                        if (settings.hasTotal) {
                            total = table.find("tbody").children("tr").last();
                            table.find("tbody").children("tr").last().remove();
                        }

                        let valores = [];
                        table
                            .find("tbody")
                            .children("tr")
                            .find("td:eq(" + index + ")")
                            .each(function(index, el) {
                                let obj = {};
                                obj.tr = $(this).parent();
                                if (tipo == "num") {
                                    obj.val = $(this).numVal();
                                } else {
                                    obj.val = $(this).text();
                                }
                                valores.push(obj);
                            });
                        valores.sort((a, b) => {
                            let fa = a.val,
                                fb = b.val;

                            switch (tipo) {
                                case "date":
                                    if (fa == "" || fa == "00/00/00") {
                                        fa = "01/01/3000";
                                    }
                                    if (fb == "" || fb == "00/00/00") {
                                        fb = "01/01/3000";
                                    }
                                    fa = string_to_date(fa);
                                    fb = string_to_date(fb);
                                    break;
                                case "text":
                                    fa = a.val.toLowerCase();
                                    fb = b.val.toLowerCase();
                                    break;
                            }

                            if (fa < fb) {
                                return -1;
                            }
                            if (fa > fb) {
                                return 1;
                            }
                            return 0;
                        });

                        let ord = $(this).attr("orden");
                        if (ord == "asc") {
                            $(this).attr("orden", "desc");
                        } else {
                            $(this).attr("orden", "asc");
                            valores.reverse();
                        }

                        table.find("tbody").find("tr").remove();

                        for (var i = 0; i < valores.length; i++) {
                            table.find("tbody").append(valores[i].tr);
                        }

                        if (settings.hasTotal) {
                            table.find("tbody").append(total);
                        }
                    });
                }
            });
    };
})(jQuery);

(function($) {
    //
    $.fn.fileManager = function(options) {
        var settings = $.extend({
                operation: null,
                opType: null,
            },
            options
        );

        let table = this;

        let tableID = table.attr("id");

        table.wrap('<div id="' + tableID + '_wrapper"></div>');

        let wrapper = table.parent();

        wrapper.on("drop", function(event) {
            event.preventDefault();
            dropHandler(event);
        });

        wrapper.on("dragover", function(event) {
            event.preventDefault();
            //dropHandler(event);
        });

        $("#delete_record_" + tableID).click(function(event) {
            let trID = $(table).find("tr.active").attr("id");
            $.serverValidation({
                controller: "Files",
                action: "delete",
                obj: { ID: trID },
                onSuccess: function() {
                    $("#refresh_table_" + tableID).trigger("click");
                },
            });
        });

        $(table)
            .find("tbody")
            .on("dblclick", "tr", function(event) {
                event.preventDefault();
                let link = $(this).find("td:eq(2)").text();
                let fileName = $(this).find("td:eq(1)").text();
                //window.open(link, '_blank');
                fetch(link, { method: "get", mode: "no-cors", referrerPolicy: "no-referrer" })
                    .then((res) => res.blob())
                    .then((res) => {
                        const aElement = document.createElement("a");
                        aElement.setAttribute("download", fileName);
                        const href = URL.createObjectURL(res);
                        aElement.href = href;
                        aElement.setAttribute("target", "_blank");
                        aElement.click();
                        URL.revokeObjectURL(href);
                    });
            });

        function dropHandler(event) {
            let items = event.originalEvent.dataTransfer.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == "file") {
                    let file = items[i].getAsFile();
                    console.log(file);
                    if (file.size < 8000000) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function() {
                            let base64String = reader.result;
                            let temp = file.name.split(".");
                            let type = temp[1];
                            let partes = [];
                            let fileID = "vacio";
                            temp = base64String.split(",");
                            base64String = temp[1];
                            while (base64String.length > 0) {
                                let aEnviar = "";
                                if (base64String.length >= 4000) {
                                    aEnviar = base64String.substring(0, 4000);
                                    base64String = base64String.substring(4000);
                                } else {
                                    aEnviar = base64String.substring(0, base64String.length);
                                    base64String = "";
                                }

                                let obj = { ID: fileID, ID_Operation: settings.operation, Base64String: aEnviar, Name: file.name, Tipo: type };
                                partes.push(obj);
                            }

                            let ArchivoPublico = true;

                            Swal.fire({
                                title: "Publico o Privado?",
                                text: "Desea que el archivo sea privado, unicamente visible para personas de la empresa, o publico y que los clientes puedan acceder a El mediante el Tracking?",
                                type: "question",
                                showDenyButton: true,
                                showCancelButton: false,
                                confirmButtonText: "Publico",
                                denyButtonText: "Privado",
                            }).then(function(result) {
                                ArchivoPublico = result.isConfirmed;
                                $.serverValidation({
                                    controller: "Files",
                                    action: "Save",
                                    showErrorMsg: false,
                                    showSuccessMsg: false,
                                    obj: { ID: fileID, ID_Operation: settings.operation, Base64String: "", Name: file.name, Tipo: type, Public: ArchivoPublico },
                                    onComplete: function(json) {
                                        fileID = this.ID;
                                        sendToServer(0);
                                    },
                                });
                            });

                            function sendToServer(arrPos) {
                                $.when(sendServerCall(partes[arrPos])).done(function(a1) {
                                    if (arrPos < partes.length - 1) {
                                        sendToServer(arrPos + 1);
                                    } else {
                                        $.serverValidation({
                                            controller: "Files",
                                            action: "StoreFile",
                                            showErrorMsg: false,
                                            showSuccessMsg: false,
                                            obj: { ID: fileID, Type: settings.opType, OP: settings.operation },
                                            onComplete: function(json) {
                                                $("#refresh_table_" + tableID).trigger("click");
                                            },
                                        });
                                    }
                                });
                            }

                            function sendServerCall(callobj) {
                                let thisobj = callobj;
                                thisobj["ID"] = fileID;
                                let server = new $4D.Server("Files", "SaveFile", thisobj);
                                return server.Execute();
                            }
                        };
                        reader.onerror = function(error) {
                            console.log("Error: ", error);
                        };
                    } else {
                        Swal.fire("Error", "No se pueden subir archivos superiores a 8MB", "error");
                    }
                }
            }
        }
    };
})(jQuery);

(function($) {
    //Agrega la seleccion de X para las columnas seleccionadas de una tabla
    $.fn.cuitFormat = function(options) {
        let campo = this;

        var settings = $.extend({
                onVerify: function() {},
            },
            options
        );

        campo.change(function(event) {
            switch (localStorage.getItem("Country_ID")) {
                case "CL":
                    let rutCompleto = campo.val().replace("‐", "-");
                    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) {
                        $(this).addClass("tiene-error");
                        Swal.fire("Cuidado", "Formato de RUT no válido (xxxxxxxx-x)", "warning");
                    } else {
                        var tmp = rutCompleto.split("-");
                        var digv = tmp[1];
                        var rut = tmp[0];
                        if (digv == "K") digv = "k";

                        if (validaVerficadorCL(rut) == digv) {
                            $(this).removeClass("tiene-error");
                        } else {
                            $(this).val("");
                            $(this).addClass("tiene-error");
                            Swal.fire("Cuidado", "Formato de RUT no valido (xxxxxxxx-x)", "warning");
                        }

                        function validaVerficadorCL(T) {
                            var M = 0,
                                S = 1;
                            for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
                            return S ? S - 1 : "k";
                        }
                    }

                    break;
                case "AR":
                    let sCUIT = campo.val();
                    var cuit = sCUIT.toString().replace(/[-_]/g, "");
                    var sub2_3 = sCUIT.substring(2, 3);
                    var sub11_12 = sCUIT.substring(11, 12);
                    if (sub2_3 == "-" && sub11_12 == "-") {
                        //Primero valio que tenga la separacion de "-"
                        if (validarCuit(cuit)) {
                            //Verifico el tamaño y cuit valido
                            $(this).removeClass("tiene-error");
                        } else {
                            $(this).val("");
                            $(this).addClass("tiene-error");
                            Swal.fire("Cuidado", "CUIT no valido (xx-xxxxxxxx-x)", "warning");
                        }
                    } else {
                        $(this).val("");
                        $(this).addClass("tiene-error");
                        Swal.fire("Cuidado", "Formato de CUIT no valido (xx-xxxxxxxx-x)", "warning");
                    }

                    function validarCuit(cuit) {
                        if (cuit.length != 11) {
                            return false;
                        }
                        var acumulado = 0;
                        var digitos = cuit.split("");
                        var digito = digitos.pop();
                        for (var i = 0; i < digitos.length; i++) {
                            acumulado += digitos[9 - i] * (2 + (i % 6));
                        }
                        var verif = 11 - (acumulado % 11);
                        if (verif == 11) {
                            verif = 0;
                        } else if (verif == 10) {
                            verif = 9;
                        }
                        return digito == verif;
                    }
                    break;
                default:
                    $(this).removeClass("tiene-error");
                    break;
            }

            settings.onVerify.call();
        });
    };
})(jQuery);

(function($) {
    //Busca todos los estilos que estan en el head y se los pone inline a todos los objetos
    $.fn.headerStylesInline = function(options) {
        let self = this;

        var settings = $.extend({}, options);

        $("style").each(function(index, el) {
            let objcss = parseCSSText($(this).html());
            console.log(objcss);
            for (var clase in objcss) {
                if (!clase.includes("}") && !clase.includes("..") && !clase.includes("[") && !clase.includes("@") && clase.length < 40) {
                    $(self)
                        .find(clase)
                        .each(function(index, el) {
                            let estilo = "";
                            if ($(this).hasAttr("style")) {
                                estilo = $(this).attr("style");
                            }
                            estilo += objcss[clase];
                            $(this).attr("style", estilo);
                        });
                }
            }
        });

        function parseCSSText(cssText) {
            let cssTxtCompleto = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
            let arrStyles = cssTxtCompleto.split(" .");
            let objFinal = {};
            for (var i = 0; i < arrStyles.length; i++) {
                if (arrStyles[i] != "") {
                    let cssTxt = "." + arrStyles[i];
                    var style = {},
                        [, ruleName, rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];
                    var cssToJs = (s) => s.replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase());
                    var properties = rule.split(";").map((o) => o.split(":").map((x) => x && x.trim()));
                    for (var [property, value] of properties) style[cssToJs(property)] = value;

                    // objFinal[ruleName] = style;
                    objFinal[ruleName] = rule;
                }
            }

            //return { cssText, ruleName, style };
            return objFinal;
        }
    };
})(jQuery);

(function($) {
    //Carga el output
    $.fn.loadEmailOutput = function(options) {
        var settings = $.extend({
                recordID: "",
                pantalla: "emails_relations",
                tipo: "",
            },
            options
        );

        let specialfind = "getAll";
        if (settings.recordID != "") {
            specialfind = "findByOperation";
        }

        let table = this;

        let idTable = table.attr("id");

        table.loadOutput({
            controller: "Emails_Relations",
            pantalla: settings.pantalla,
            outputType: "dialog",
            numeroPantalla: "0328",
            numeroModulo: "1000",
            numeroTabla: "233",
            specialFindby: specialfind,
            extraParam: settings.recordID,
            dialog: "dialog_emails_relations",
            deleteButton: false,
            dialogWidth: 1000,
            changeID: false,
            onOperationMod: function(new_tr) {
                console.log(new_tr);

                if (settings.recordID != "") {
                    $("#OP_ID_emails_relations").val(settings.recordID);
                }

                $("#tabla_archivos_emails_relations").find("tbody").empty();
                $("#OP_Type_2_emails_relations").css("display", "inline");
                $("#OP_Type_2_emails_relations").css("width", "19%");
                $("#OP_ID_emails_relations").css("display", "inline");
                $("#OP_ID_emails_relations").css("width", "80%");
                $("#div_display_emails_relations").html($("#SentData_emails_relations").val());
                $("#OP_Type_2_emails_relations").val(settings.tipo);
                $("#OP_Type_emails_relations").val($("#OP_Type_2_emails_relations").find("option:selected").index() + 1);

                if ($("#OP_ID_emails_relations").val() != "") {
                    // $("#OP_ID_emails_relations").val(settings.recordID);
                    $("#OP_ID_emails_relations").attr("disabled", "disabled");
                    $("#OP_Type_2_emails_relations").hide();
                    $("#OP_ID_emails_relations").css("width", "100%");
                } else {
                    $("#OP_Type_2_emails_relations").show();
                    $("#OP_ID_emails_relations").css("width", "80%");
                    $("#OP_ID_emails_relations").removeAttr("disabled");
                }

                // EL CODIGO DE ABAJO ES DE SHUNPO ↓ ↓ ↓
                let savebutton = $("[id*='save_item_dialog_emails_relations']");
                let extrabutton = '<button type="button" class="btn btn-primary ui-corner-all ui-widget" id="Preview_dialog_emails_relations' + settings.recordID + '">Previsualizar</button>';
                savebutton.before(extrabutton);

                // PREVISUALIZAR ↓ ↓ ↓
                $("#Preview_dialog_emails_relations" + settings.recordID).click(function(event) {
                    AgregarTabIn("0317_Preview", "");
                });
            },
            onDialogSave: function() {},
        });
    };
})(jQuery);

(function($) {
    //Hace un trigger al help como si le hubieras escrito
    $.fn.triggerHelp = function(options) {
        var scope = this;

        let e = $.Event("keydown");

        scope.focus();
        e.which = 81;
        scope.trigger(e);
        e.which = 9;
        scope.trigger(e);
    };
})(jQuery);

(function($) {
    //Obtiene la paridad para una moneda
    $.fn.getParidad = function(options) {
        var scope = this;

        var settings = $.extend({
                deMoneda: null,
                aMoneda: null,
                date: "00/00/00",
                onReceived: function(json) {},
            },
            options
        );

        var obj = {};
        obj["MonedaDesde"] = settings.deMoneda;
        obj["MonedaHasta"] = settings.aMoneda;
        obj["Date"] = settings.date;
        var server = new $4D.Server("EXCHANGES", "ObtenerParidad", obj);
        server.Complete = function(json) {
            let fecha = date_string_to_date(date_to_html(json.Fecha));
            let hoy = date_string_to_date(currentDay());
            if (fecha < hoy || json.Fecha == "00/00/00") {
                cargarDialogTC(json.Moneda);
            } else {
                scope.changeVal(json.Cambio);
                settings.onReceived.call(json);
            }
        };
        server.Execute();

        function cargarDialogTC(moneda) {
            $("#dialog_Tcambio").loadDialog({
                esDependiente: false,
                idExterno: "",
                idreg: "vacio",
                action: "new",
                controller: "EXCHANGES",
                pantalla: "Tcambio",
                title: "Ingrese el tipo de cambio actualizado",
                width: 1000,
                onClose: function() {
                    console.log("close");
                },
                onOpen: function() {
                    let moneda1 = localStorage.getItem("Moneda1");
                    let moneda2 = localStorage.getItem("Moneda2");

                    $("#Currency_ID_Tcambio").changeVal(moneda);

                    $(".th-cambio-MP").html("Cambio<b> " + moneda1 + " </b><i class='fa fa-long-arrow-right'></i><b> " + moneda + " </b>");
                    $(".th-cambio-ML").html("Cambio<b> " + moneda + " </b><i class='fa fa-long-arrow-right'></i><b> " + moneda2 + " </b>");
                    $("#Date__Tcambio").val(currentDay());
                    $("#User_ID_Tcambio").val(CurrentUser.id);
                    $("#User_Name_Tcambio").val(CurrentUser.name);
                },
                onSave: function(json) {
                    var obj = {};
                    obj["MonedaDesde"] = settings.deMoneda;
                    obj["MonedaHasta"] = settings.aMoneda;
                    obj["Date"] = settings.date;
                    var server = new $4D.Server("EXCHANGES", "ObtenerParidad", obj);
                    server.Complete = function(json) {
                        scope.changeVal(json.Cambio);
                        settings.onReceived.call(json);
                    };
                    server.Execute();
                },
            });
        }
    };
})(jQuery);

(function($) {
    //Crea el selector de fecha de los informes al estilo IGA, se le marca un div, el nombre de la pantalla y crea los campos estandarizados
    $.fn.createDateSelector = function(options) {
        var settings = $.extend({
                pantalla: "",
                prepend: true,
            },
            options
        );

        let div = this;

        let periodoField = '<p style="width:10%;display: inline;margin-right: 1px;">Periodo: </p>';
        periodoField += '<select class="form-control" id="periodo_' + settings.pantalla + '" style="width:5cm;display: inline;">';
        periodoField += '<option value="7">7 dias</option>';
        periodoField += '<option value="30">30 dias</option>';
        periodoField += '<option value="90">3 Meses</option>';
        periodoField += '<option value="180">6 Meses</option>';
        periodoField += '<option value="365">12 Meses</option>';
        periodoField += '<option value="Semana">Esta Semana</option>';
        periodoField += '<option value="Mes">Este Mes</option>';
        periodoField += '<option value="Anio">Este A&#241;o</option>';
        periodoField += '<option value="SemanaDiff">Semana +/-</option>';
        periodoField += '<option value="MesDiff">Mes +/-</option>';
        periodoField += '<option value="AnioDiff">A&#241;o +/-</option>';
        periodoField += "</select>";
        periodoField += '<input id="diff_' + settings.pantalla + '" style="display: inline;width: 1cm;display: none;" type="number" class="form-control" name="">';

        let desdeField = '<p style="width:10%;margin-left: 0.5cm;display: inline;">Desde: </p><input style="width:5cm;display: inline;" id="desde_' + settings.pantalla + '" type="date" class="form-control">';
        let hastaField = '<p style="width:10%;margin-left: 0.5cm;display: inline;">Hasta: </p><input style="width:5cm;display: inline;" id="hasta_' + settings.pantalla + '" type="date" class="form-control">';

        if (settings.prepend) {
            div.prepend(periodoField + desdeField + hastaField);
        } else {
            div.append(periodoField + desdeField + hastaField);
        }

        $("#periodo_" + settings.pantalla).change(function(event) {
            let option = $(this).val();
            let desde = "";
            let hasta = "";
            if (isNaN(parseInt(option))) {
                let diff = 0;
                if (option.includes("Diff")) {
                    $("#diff_" + settings.pantalla).show();
                    $("#diff_" + settings.pantalla).css("display", "inline");
                    diff = parseInt($("#diff_" + settings.pantalla).val());
                    option = option.split("Diff");
                    option = option[0];
                } else {
                    $("#diff_" + settings.pantalla).hide();
                }
                let objDate = currentPeriod(option, diff);
                desde = objDate.inicio;
                hasta = objDate.fin;
            } else {
                $("#diff_" + settings.pantalla).hide();
                desde = currentDayDiff(parseInt(option) * -1);
                hasta = currentDay();
            }
            $("#hasta_" + settings.pantalla).val(hasta);
            $("#desde_" + settings.pantalla).val(desde);
        });

        $("#diff_" + settings.pantalla).change(function(event) {
            $("#periodo_" + settings.pantalla).trigger("change");
        });

        $("#periodo_" + settings.pantalla).val("30");

        desde = currentDayDiff(-30);
        hasta = currentDay();
        $("#hasta_" + settings.pantalla).val(hasta);
        $("#desde_" + settings.pantalla).val(desde);
    };
})(jQuery);

(function($) {
    //Carga un informe adaptable del Overview, se le pasan los parametros y labura
    $.fn.loadInformeGerencial = function(options) {
        var settings = $.extend({
                desde: "00/00/00",
                hasta: "00/00/00",
                informe: "",
                corte: "",
                cero: false,
                extra: "",
                grafico: "",
                tipoGrafico: "line",
                showLimit: false,
                paintLine: 100,
                showTotal: true,
            },
            options
        );

        let table = this;

        var objg = new Object();
        objg["DesdeG"] = date_to_string(settings.desde);
        objg["HastaG"] = date_to_string(settings.hasta);
        objg["Informe"] = settings.informe;
        objg["Corte"] = settings.corte;
        objg["Cero"] = settings.cero;
        objg["Extra"] = settings.extra;

        table.find("tbody").empty();
        table.hide();

        if (table.parent().find("input[type='search']").length == 0) {
            table.addAutomaticSearch({
                onSearch: function() {
                    loadGraficoGerencial();
                },
            });

            table.parent().css("max-height", "387px");
            table.after('<object type="image/svg+xml" data="../dist/Images/loading.svg" style="width: 100%;height: 100%;"></object>');
        }

        table.parent().find("object").show();

        $.serverValidation({
            controller: "Gerencial",
            action: "General",
            obj: objg,
            showErrorMsg: false,
            showSuccessMsg: false,
            onSuccess: function(json) {
                json = this[0];
                let x = 0;
                let objHtml = {};
                table.find("thead").html("");
                table.find("thead").append("<th>Operador</th>");

                let divWidth = table.parent().width();

                for (var key in json) {
                    var row = json[key];
                    table.find("thead").append("<th>" + key + "</th>");
                    for (var key2 in row) {
                        var trHtml = "";
                        if (x == 0) {
                            let nameKey = key2.split("#");
                            trHtml += "<tr>";
                            trHtml += '<td style="width:10cm;background-color:white;">' + nameKey[0] + "</td>";
                        }
                        trHtml += "<td>" + row[key2] + "</td>";
                        objHtml[key2] += trHtml;
                    }
                    x++;
                }

                for (var key in objHtml) {
                    table.find("tbody").append(objHtml[key] + "</tr>");
                }

                if (objg["Cero"] == true) {
                    table
                        .find("tbody")
                        .find("tr")
                        .each(function(index, el) {
                            let suma = 0;
                            $(this)
                                .find("td")
                                .each(function(index, el) {
                                    if (index > 0) {
                                        suma += $(this).numVal();
                                    }
                                });
                            if (suma == 0) {
                                $(this).remove();
                            }
                        });
                }

                if (!settings.showTotal) {
                    table.find("tr").last().remove();
                }

                table.parent().find("object").hide();
                table.show();

                loadGraficoGerencial();

                table.tableFormat();

                table.find("th").css({
                    position: "sticky",
                    top: "0",
                    "white-space": "nowrap",
                    "background-color": "rgb(0, 99, 148)",
                    "z-index": "20",
                });

                table.find("tbody").find("tr").find("td:eq(0)").css({
                    position: "sticky",
                    left: "0",
                    "background-color": "white",
                });

                if (settings.showTotal) {
                    table
                        .find("tbody")
                        .find("tr")
                        .last()
                        .children("td")
                        .each(function(index, el) {
                            $(this).css("background-color", "rgba(244, 155, 66, 1)");
                        });
                }

                table.find("th").css({
                    color: "white",
                    "text-align": "center",
                });

                table.addExcelSum();
            },
        });

        function loadGraficoGerencial() {
            if (settings.grafico != "") {
                let names = [];

                table
                    .find("thead")
                    .find("th")
                    .each(function(index, el) {
                        if (index > 0) {
                            table.columnNumberFormat({ column: index });
                            names[index - 1] = $(this).text();
                        }
                    });

                let values = [];

                table
                    .find("tbody")
                    .find("tr:visible")
                    .each(function(Bigindex, el) {
                        let value = [];
                        $(this)
                            .find("td")
                            .each(function(index, el) {
                                if (index == 0) {
                                    let valColor = randomColor();
                                    values[Bigindex] = {
                                        label: $(this).text(),
                                        data: [],
                                        //backgroundColor: "transparent",
                                        backgroundColor: valColor,
                                        borderColor: valColor,
                                        borderWidth: 2,
                                        lineTension: 0,
                                    };
                                } else {
                                    value[index - 1] = $(this).numVal();
                                }
                            });
                        values[Bigindex].data = value;
                    });

                ctx = document.getElementById(settings.grafico).getContext("2d");

                let myChart = Chart.getChart(settings.grafico);
                if (myChart != undefined) {
                    myChart.destroy();
                }

                let objOptions = {
                    interaction: {
                        intersect: false,
                        mode: "index",
                    },
                };

                if (settings.showLimit) {
                    objOptions["scales"] = {
                        x: {
                            border: {
                                display: true,
                            },
                            grid: {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                            },
                        },
                        y: {
                            border: {
                                display: true,
                            },
                            grid: {
                                color: function(context) {
                                    if (context.tick.value == settings.paintLine) {
                                        return "#02ad1e";
                                    }

                                    return "#e5e5e5";
                                },
                            },
                        },
                    };
                }

                myChart = new Chart(ctx, {
                    type: settings.tipoGrafico,
                    data: {
                        labels: names,
                        datasets: values,
                    },
                    options: objOptions,
                });

                myChart.update();
            }
        }
    };
})(jQuery);

$.fn.isInViewport = function() {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$.fn.isInCenterViewport = function() {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = (viewportTop + $(window).height()) * 0.7;

    viewportTop += 300;

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

(function($) {
    //Crea una row de la tabla en cuestion, respeta los ths escondidos

    $.fn.createTableRow = function(options) {
        var scope = this;

        var settings = $.extend({
                insert: "after",
                obj: {},
            },
            options
        );

        let new_tr = "<tr id='tr_vacio'>";
        $(scope)
            .find("th")
            .each(function(index, el) {
                new_tr += "<td ";
                if ($(this).css("display") == "none") {
                    new_tr += "style='display:none' ";
                }

                let key = $(this).attr("key");

                new_tr += "key='" + key + "'>";
                if (key != undefined) {
                    if (settings.obj[key] != undefined) {
                        new_tr += settings.obj[key];
                    }
                }
                new_tr += "</td>";
            });
        new_tr += "</tr>";

        if (settings.insert == "before") {
            $(scope).find("tbody").prepend(new_tr);
        } else {
            $(scope).find("tbody").append(new_tr);
        }
    };
})(jQuery);

(function($) {
    //Verifica que ciertas columnas de una tabla tengan x permiso

    $.fn.verifyTablePermission = function(options) {
        var scope = this;

        var settings = $.extend({
                columns: [],
                funcion: "",
                modulo: "",
            },
            options
        );

        $.when(verificar_permiso(settings.modulo, settings.funcion, "ENT", false)).fail(function() {
            scope.hideColumn({ columns: settings.columns });
        });
    };
})(jQuery);

(function($) {
    //Este metodo solo se triggerea si esta la fecha completa
    $.fn.onDateChange = function(options) {
        var settings = $.extend({
                onChange: function(fecha) {},
            },
            options
        );

        var field = this;

        field.change(function(event) {
            let fecha = date_string_to_date($(this).val());
            let anio = fecha.getFullYear();
            if (anio > 2000) {
                settings.onChange.call(this, fecha);
            }
        });
    };
})(jQuery);

(function($) {
    //Este metodo hace que cuando copies y pegues lo haga sin estilos, funciona solo en los divs editables por ahora
    $.fn.clearPaste = function(options) {
        var settings = $.extend({
                // onChange: function(fecha) {}
            },
            options
        );

        var field = this;

        field[0].addEventListener("paste", (event) => {
            event.preventDefault();

            let paste = (event.clipboardData || window.clipboardData).getData("text/plain");

            let selection = window.getSelection();
            if (!selection.rangeCount) return;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));
            selection.collapseToEnd();
        });
    };
})(jQuery);

(function($) {
    //Replica el valor de un campo en todos los de una clase
    $.fn.mirrorValue = function(options) {
        var settings = $.extend({
                campo: null,
                clase: "",
                events: "change",
                idaYVuelta: false,
                onDataReady: function(valor) {},
            },
            options
        );

        var scope = this;

        let value = $(settings.campo).val();

        $(scope)
            .find("." + settings.clase)
            .val(value);

        if (settings.events != "") {
            $(settings.campo).on(settings.events, function(event) {
                asignarValorCampos();
            });

            if (settings.idaYVuelta) {
                $(scope)
                    .find("." + settings.clase)
                    .on(settings.events, function(event) {
                        let value = "";
                        if ($(this).is("div")) {
                            value = $(this).html();
                        } else {
                            value = $(this).val();
                        }

                        if ($(settings.campo).is("div")) {
                            $(settings.campo).html(value);
                        } else {
                            $(settings.campo).val(value);
                        }
                    });
            }
        }

        function asignarValorCampos() {
            let value = "";
            if ($(settings.campo).is("div")) {
                value = $(settings.campo).html();
            } else {
                value = $(settings.campo).val();
            }
            $(scope)
                .find("." + settings.clase)
                .each(function(index, el) {
                    if ($(this).is("div")) {
                        $(this).html(value);
                    } else {
                        $(this).val(value);
                    }
                });
            settings.onDataReady.call(settings.campo, value);
        }
    };
})(jQuery);

(function($) {
    //Carga las cartitas de los tipos de transporte con los transbordos y eso
    $.fn.loadDestinationCards = function(options) {
        var settings = $.extend({
                fechas: null,
                tipo: "aereo",
                pantalla: "",
                reg_id: "",
                onCardClick: function(numero) {},
            },
            options
        );

        var scope = this;

        var contenedor = $(settings.fechas);

        var idUnicoCards = "_" + settings.pantalla + "_" + settings.reg_id;

        var cantidadDeCartas = contenedor.find("[transbordo]").length;

        var transporteEncurso = 0;

        crearHtmlCartas();

        refreshCartasContent();

        function refreshCartasContent() {
            transporteEncurso = 0;

            $(scope).find(".top_line_timeline").hide();
            $(scope).find(".bottom_line_timeline").hide();

            contenedor.find("[transbordo]").each(function(index, el) {
                let numero = $(this).attr("transbordo");

                let destino = $(this).find("[transbordo-destino]").val();

                let origen = "";

                if ($(this).find("[transbordo-origen]").val() != "") {
                    origen = $(this).find("[transbordo-origen]").val();
                }

                if (destino != "" && origen != "") {
                    destino = origen + " - " + destino;
                }

                let transporte = "";
                if ($(this).find("[transbordo-transporte]").length > 0) {
                    transporte = $(this).find("[transbordo-transporte]").val();
                }

                let fecha = $(this).find("[transbordo-fecha]").val();

                let codigo_transporte = "";
                if ($(this).find("[transbordo-codigo]").length > 0) {
                    codigo_transporte = $(this).find("[transbordo-codigo]").val();
                }

                let hora = "";

                let fechaFormateada = "";

                let hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                if (fecha != "") {
                    flight_date = date_string_to_date(fecha);
                    day = flight_date.getDate();
                    month = capitalizeFirstLetter(flight_date.toLocaleString("default", { month: "short" }));
                    year = flight_date.getFullYear();
                    sufijo = sufixCalc(day);

                    fechaFormateada = day + sufijo + " " + month + " " + year;

                    if (settings.tipo != "maritimo") {
                        hora = $(this).find("[transbordo-hora]").val();
                        fechaFormateada += " - " + hora;
                    }

                    if (hoy > flight_date && parseInt(numero) > transporteEncurso) {
                        transporteEncurso = parseInt(numero);
                        $("#transbordo_" + transporteEncurso + idUnicoCards)
                            .find(".top_line_timeline")
                            .show();
                        $("#transbordo_" + transporteEncurso + idUnicoCards)
                            .find(".bottom_line_timeline")
                            .show();
                    }
                }

                let tipo_transporte = "";

                switch (settings.tipo) {
                    case "maritimo":
                        tipo_transporte = "Ship Travel N\u00B0";
                        break;
                    case "terrestre":
                        tipo_transporte = "Truck N\u00B0";
                        break;
                    case "aereo":
                        tipo_transporte = "Flight N\u00B0";
                        break;
                }

                let tipoTransporte = "";

                if (codigo_transporte != "") {
                    tipoTransporte = transporte + "<br>" + tipo_transporte + " " + codigo_transporte;
                }

                let carta = $("#transbordo_" + numero + idUnicoCards);

                if (destino == "") {
                    carta.hide();
                } else {
                    carta.show();
                    $("#timestamp_transbordo_" + numero + idUnicoCards).text(fechaFormateada);
                    $("#timeline_destino_transbordo_" + numero + idUnicoCards).text(destino);
                    $("#timeline_transporte_transbordo_" + numero + idUnicoCards).html(tipoTransporte);
                }
            });

            $(scope).find(".image_transporte_cartas").hide();

            $("#imagen_transporte_" + transporteEncurso + idUnicoCards).show();
        }

        function crearHtmlCartas() {
            var cartasHtml = "<div class='dc_transbordos_container'><ul class='dc_transbordos'>";

            contenedor.find("[transbordo]").each(function(index, el) {
                let numero = $(this).attr("transbordo");

                let destino = $(this).find("[transbordo-destino]").val();

                let origen = "";
                if ($(this).find("[transbordo-origen]").val() != "") {
                    origen = $(this).find("[transbordo-origen]").val();
                }

                if (destino != "" && origen != "") {
                    destino = origen + " - " + destino;
                }

                let transporte = "";
                if ($(this).find("[transbordo-transporte]").length > 0) {
                    transporte = $(this).find("[transbordo-transporte]").val();
                }

                let fecha = $(this).find("[transbordo-fecha]").val();
                let codigo_transporte = $(this).find("[transbordo-codigo]").val();

                let hora = "";

                let fechaFormateada = "";

                if (fecha != "") {
                    flight_date = date_string_to_date(fecha);
                    day = flight_date.getDate();
                    month = capitalizeFirstLetter(flight_date.toLocaleString("default", { month: "short" }));
                    year = flight_date.getFullYear();
                    sufijo = sufixCalc(day);

                    fechaFormateada = day + sufijo + " " + month + " " + year;

                    if (settings.tipo != "maritimo") {
                        hora = $(this).find("[transbordo-hora]").val();
                        fechaFormateada += " - " + hora;
                    }
                }

                cartasHtml += createTarjetaHtml(numero, destino, transporte, fecha, codigo_transporte, fechaFormateada);

                $(this)
                    .find("input")
                    .on("input keypress change", function(event) {
                        refreshCartasContent();
                    });
            });

            // cartasHtml += createTarjetaHtml("", "", "4", "", "", "");

            cartasHtml += "</ul></div>";

            $(scope).append(cartasHtml);
        }

        function createTarjetaHtml(numero, destino, transporte, fecha, codigo_transporte, fechaFormateada) {
            let cartasHtml = "";

            let tipo_transporte = "";

            switch (settings.tipo) {
                case "maritimo":
                    tipo_transporte = "Ship Travel N\u00B0";
                    break;
                case "terrestre":
                    tipo_transporte = "Truck N\u00B0";
                    break;
                case "aereo":
                    tipo_transporte = "Flight N\u00B0";
                    break;
            }

            cartasHtml += "<li class='dc_transbordos_card' id='transbordo_" + numero + idUnicoCards + "'>";
            cartasHtml += "<div class='dc_transbordos_card_div dc_transbordos_card_div_effects' id='dates_transbordo_" + numero + idUnicoCards + "' transbordo='" + numero + "' data-toggle='tooltip' title='Click para confirmar fecha y hora.'>";

            cartasHtml += "<div class='dc_transbordos_timestamp'>";
            cartasHtml += "<b id='timestamp_transbordo_" + numero + idUnicoCards + "'>" + fechaFormateada + "</b>";
            cartasHtml += "</div>";

            cartasHtml += "<div class='dc_transbordos_item_title' id='timeline_destino_transbordo_" + numero + idUnicoCards + "'>" + destino;
            cartasHtml += "</div>";

            cartasHtml += "<div class='dc_transbordos_item_title' id='timeline_transporte_transbordo_" + numero + idUnicoCards + "'>" + transporte + "<br>" + tipo_transporte + " " + codigo_transporte;
            cartasHtml += "</div>";
            //aca iria la burbuja
            cartasHtml += "</div>";

            if (numero != "1") {
                cartasHtml += "<div class='top_line_timeline' flightPosition='top' numeroVuelo='" + numero + "'></div>";
            }

            if (parseInt(numero) < cantidadDeCartas) {
                cartasHtml += "<div class='bottom_line_timeline' flightPosition='bottom' numeroVuelo='" + numero + "'></div>";
            }

            if (parseInt(numero) == cantidadDeCartas) {
                cartasHtml += "<div style='position: absolute;bottom: 31px;right: -80px;width: 30pt;height: 22pt;'>";
            } else {
                cartasHtml += "<div style='position: absolute;bottom: 3px;right: -80px;width: 30pt;height: 22pt;'>";
            }

            let ruta = getSVGcarga();
            cartasHtml += "<object type='image/svg+xml' data='" + ruta + "' style='width: 50px;height: 50px; display: none;' class='image_transporte_cartas' id='imagen_transporte_" + numero + idUnicoCards + "'></object></div>";
            cartasHtml += "</li>";
            return cartasHtml;
        }

        function getSVGcarga() {
            var svgRes = "";
            switch (settings.tipo) {
                case "maritimo":
                    svgRes = "../dist/Images/ship.svg";
                    break;
                case "terrestre":
                case "aereo":
                    svgRes = "../dist/Images/plane_land.svg";
                    break;
            }
            return svgRes;
        }

        function sufixCalc(day) {
            if (day >= 11 && day <= 13) {
                return "th";
            }
            switch (day % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        }
    };
})(jQuery);