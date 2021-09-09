function Submit() {
    BlockUI();
    if (ValidatemappingModel()) {
        var checkedVals = $("table tbody").find($('.ModelCheckbox:checkbox:checked')).map(function () {
            return $(this).attr("Model");
        }).get();
        var uncheckedVals = $("table tbody").find($('.ModelCheckbox:checkbox:not(:checked)')).map(function () {
            return $(this).attr("Model");
        }).get();
        var formData = new FormData();
        formData.append("Product", $("#mappingModelForm").find($('[name="Product"]')).val());
        formData.append("ProductType", $("#mappingModelForm").find($('[name="ProductType"]')).val());
        formData.append("ModelChecked", checkedVals.join(","));
        formData.append("ModelUnchecked", uncheckedVals.join(","));
        $.ajax({
            type: 'POST',
            url: "/MappingWithBranch/AddmappingModel",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        if (data == "Success") {
                            $.alert({ title: 'Success!', content: 'Mapped successfully!' });
                            FetchTable();
                            Reset();
                        } else if (data == "Exception") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!' });
                        }
                    }
                }
                UnblockUI();
            },
            error: function (result) {
                alert(result);
                UnblockUI();
            }
        });
    }
    else {
        //  $.alert("Validation failed");
        UnblockUI();
    }
}

function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchmappingModel',
        data: JSON.stringify({ Product: $("#mappingModelForm").find($('[name="Product"]')).val(), ProductType: $("#mappingModelForm").find($('[name="ProductType"]')).val(), Make: $("#mappingModelForm").find($('[name="Make"]')).val() }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_mappingModelTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}



function Reset() {

}


function FetchProductTypeByProductGroupBranch() {
    $("#mappingModelForm").find($('[name="ProductType"]')).empty();
    $("#mappingModelForm").find($('[name="ProductType"]')).append("<option value='0'> --search ProductType-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchProductTypeByProductGroupBranch',
        data: JSON.stringify({ Id: $("#mappingModelForm").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingModelForm").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchMakeByProductType() {
    $("#mappingModelForm").find($('[name="Make"]')).empty();
    $("#mappingModelForm").find($('[name="Make"]')).append("<option value='0'> --search Make-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchMakeByProductType',
        data: JSON.stringify({ ProductId: $("#mappingModelForm").find($('[name="Product"]')).val(), ProductTypeId: $("#mappingModelForm").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingModelForm").find($('[name="Make"]')).append("<option value='" + data[i].Id + "'>" + data[i].Make + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}




function ValidatemappingModel() {
    var isValid = true;
    if (!validate_AddmappingModel.form()) {
        isValid = false;
    }
    if (!ValidateSelectByName('Product,ProductType', 'mappingModelForm')) {
        isValid = false;
    }
    return isValid;
}
var validate_AddmappingModel;
validate_AddmappingModel = $("#mappingModelForm").validate({
    rules: {

    },
    messages: {

    }
});
$('select[required]').change(function () {
    if ($(this).hasClass("error")) {
        $(this).removeClass("error");
        var name = $(this).attr('name');
        $("#" + name + "-error").remove();
        $("#" + name + "-error-br").remove();
    }
});
function ValidateSelectByName(names, ContainerId) {
    var isValid = true;
    var name = names.split(",");
    var selects = [];
    for (var i = 0; i < name.length; i++) {
        selects.push($('#' + ContainerId).find('select[name="' + name[i] + '"]'));
    }
    for (var i = 0; i < selects.length; i++) {
        if (($.trim($(selects[i]).val()) == "" || $(selects[i]).val() == null || $(selects[i]).val() == "0") && $(selects[i]) != undefined) {
            if (!$(selects[i]).hasClass("error")) {
                var name1 = $(selects[i]).attr('name');
                $(selects[i]).addClass("error");
                var parentofselect = $(selects[i]).parent();
                $(' <br id="' + name1 + '-error-br"> <label id="' + name1 + '-error" class="error" for="' + name1 + '">This field is required</label>').insertAfter(parentofselect);
            }
            else {
                $(selects[i]).parent().parent().find($('#' + name[i] + '-error')).show();
                $(selects[i]).parent().parent().find($('#' + name[i] + '-error')).html('This field is required');
            }
            isValid = false;
        }
    }
    return isValid;
}

function ChkAll(master) {
    var checkboxes = $("table tbody").find($('.ModelCheckbox:checkbox'));
    if (master.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            //console.log(i)
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
        }
    }
}