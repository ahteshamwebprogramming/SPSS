function InitialiseAddNew() {
    $('.table').DataTable();
    $('.dropdown').dropdown();
    $('.dateformat').datepicker({ dateFormat: "dd/mm/yy", changeYear: true, changeMonth: true });
    $('.numeric').forceNumeric();
}

function loadJS(path, callback, productid) {
    var d = document, h = d.getElementById('AddScripts'), newScript;
    var done = false;
    newScript = d.createElement('script');
    newScript.onload = handleLoad;
    newScript.id = productid;
    newScript.type = 'text/javascript';
    newScript.src = path;   // change your path here
    h.appendChild(newScript);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }
    function handleReadyStateChange() {
        var state;
        if (!done) {
            state = newScript.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }
    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}
function productloaded(path, status) {
    //alert(status + " _ " + path);
    FetchaddNewHTML();
}

function FetchProductType() {
    $("#ProductSelection").find($('[name="ProductType"]')).empty();
    $("#ProductSelection").find($('[name="ProductType"]')).append("<option value='0'>--search Product Type--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchProductType',
        data: JSON.stringify({ Id: $("#ProductSelection").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#ProductSelection").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}


function FetchaddNewHTML() {
    var formData = {};
    //formData["StudyType"] = StudyType;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchaddNewHTML',
        //data: ' ProductId :  $("#ProductSelection").find($("[name = "Product"]")).val(), ',
        data: JSON.stringify({ Product: $("#ProductSelection").find($('[name="Product"]')).val(), ProductType: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_addNew").html(data);

            CustomerInformationInitialise();
            Initialise();
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}



