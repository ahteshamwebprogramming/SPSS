function Submit() {
    BlockUI();
    if (ValidatemappingVariant()) {
        var checkedVals = $("table tbody").find($('.VariantCheckbox:checkbox:checked')).map(function () {
            return $(this).attr("Variant");
        }).get();
        var uncheckedVals = $("table tbody").find($('.VariantCheckbox:checkbox:not(:checked)')).map(function () {
            return $(this).attr("Variant");
        }).get();
        var formData = new FormData();
        formData.append("Product", $("#mappingVariantForm").find($('[name="Product"]')).val());
        formData.append("ProductType", $("#mappingVariantForm").find($('[name="ProductType"]')).val());
        formData.append("VariantChecked", checkedVals.join(","));
        formData.append("VariantUnchecked", uncheckedVals.join(","));
        $.ajax({
            type: 'POST',
            url: "/MappingWithBranch/AddmappingVariant",
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
        url: '/MappingWithBranch/FetchmappingVariant',
        data: JSON.stringify({ Product: $("#mappingVariantForm").find($('[name="Product"]')).val(), ProductType: $("#mappingVariantForm").find($('[name="ProductType"]')).val(), Make: $("#mappingVariantForm").find($('[name="Make"]')).val(), Model: $("#mappingVariantForm").find($('[name="Model"]')).val() }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_mappingVariantTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}



function Reset() {

}


function FetchProductTypeByProductGroupBranch() {
    $("#mappingVariantForm").find($('[name="ProductType"]')).empty();
    $("#mappingVariantForm").find($('[name="ProductType"]')).append("<option value='0'> --search ProductType-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchProductTypeByProductGroupBranch',
        data: JSON.stringify({ Id: $("#mappingVariantForm").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingVariantForm").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
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
    $("#mappingVariantForm").find($('[name="Make"]')).empty();
    $("#mappingVariantForm").find($('[name="Make"]')).append("<option value='0'> --search Make-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchMakeByProductType',
        data: JSON.stringify({ ProductId: $("#mappingVariantForm").find($('[name="Product"]')).val(), ProductTypeId: $("#mappingVariantForm").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingVariantForm").find($('[name="Make"]')).append("<option value='" + data[i].Id + "'>" + data[i].Make + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchModelByMake() {
    $("#mappingVariantForm").find($('[name="Model"]')).empty();
    $("#mappingVariantForm").find($('[name="Model"]')).append("<option value='0'> --search Model-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/MappingWithBranch/FetchModelByMake',
        data: JSON.stringify({ ProductId: $("#mappingVariantForm").find($('[name="Product"]')).val(), ProductTypeId: $("#mappingVariantForm").find($('[name="ProductType"]')).val(), MakeId: $("#mappingVariantForm").find($('[name="Make"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingVariantForm").find($('[name="Model"]')).append("<option value='" + data[i].Id + "'>" + data[i].Model + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}



function ValidatemappingVariant() {
    var isValid = true;
    if (!validate_AddmappingVariant.form()) {
        isValid = false;
    }
    if (!ValidateSelectByName('Product,ProductType', 'mappingVariantForm')) {
        isValid = false;
    }
    return isValid;
}
var validate_AddmappingVariant;
validate_AddmappingVariant = $("#mappingVariantForm").validate({
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
    var checkboxes = $("table tbody").find($('.VariantCheckbox:checkbox'));
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