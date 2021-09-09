function Submit() {
    BlockUI();
    if (validate_AddmappingPageSectionControl.form()) {
        var formData = new FormData();
        formData.append("Page", $("#mappingPageSectionControlForm").find($('[name="Page"]')).val());
        formData.append("Product", $("#mappingPageSectionControlForm").find($('[name="Product"]')).val());
        formData.append("ProductType", $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).val());
        formData.append("Section", $("#mappingPageSectionControlForm").find($('[name="Section"]')).val());
        formData.append("Control", $("#mappingPageSectionControlForm").find($('[name="Control"]')).val());
        formData.append("ControlDisplayName", $("#mappingPageSectionControlForm").find($('[name="ControlDisplayName"]')).val());
        formData.append("OrderNo", $("#mappingPageSectionControlForm").find($('[name="OrderNo"]')).val());
        formData.append("Column", $("#mappingPageSectionControlForm").find($('[name="Column"]')).val());
        formData.append("Id", $("#hfId").val());
        if ($("#Submit").html() == "Add") {
            formData.append("opt", 1);
        }
        else if ($("#Submit").html() == "Update") {
            formData.append("opt", 2);
        }
        $.ajax({
            type: 'POST',
            url: "/BuildingForms/AddmappingPageSectionControl",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        if (data == "InsertSuccess") {
                            $.alert({ title: 'Success!', content: 'Saved successfully!', });
                            FetchTable();
                            Reset();
                        }
                        else if (data == "InsertExist") {
                            $.alert({ title: 'Error!', content: 'This mappingPageSectionControl already exists. Please try another!', });
                        }
                        else if (data == "UpdateSuccess") {
                            $.alert({ title: 'Success!', content: 'Updated successfully!', });
                            FetchTable();
                            Reset();
                        } else if (data == "UpdateExist") {
                            $.alert({ title: 'Error!', content: 'This mappingPageSectionControl already exists. Please try another!', });
                        } else if (data == "WrongOpt") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
                        } else if (data == "EmptyValue") {
                            $.alert({ title: 'Error!', content: 'The mappingPageSectionControl is mandatory!', });
                        } else if (data == "Exception") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
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

var validate_AddmappingPageSectionControl;

validate_AddmappingPageSectionControl = $("#mappingPageSectionControlForm").validate({
    rules: {
        ControlDisplayName: "required",
        OrderNo: "required",
        Column: "required"
    },
    messages: {
        ControlDisplayName: "ControlDisplay Name cannot be left blank",
        OrderNo: "Order No cannot be left blank",
        Column: "Column cannot be left blank"
    }
});

function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/BuildingForms/FetchmappingPageSectionControl',
        data: JSON.stringify({ PageId: $("#mappingPageSectionControlForm").find($('[name="Page"]')).val(), ProductId: $("#mappingPageSectionControlForm").find($('[name="Product"]')).val(), ProductTypeId: $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).val(), SectionId: $("#mappingPageSectionControlForm").find($('[name="Section"]')).val() }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_mappingPageSectionControlTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function Edit(Id, PageId, Product, ProductType, SectionId, ControlId, ControlDisplayName, OrderNo, Column) {
    $('#Submit').html("Update");
    $('#hfId').val(Id);
    $('#mappingPageSectionControlForm').find($('[name="Page"]')).dropdown("set selected", PageId);
    $('#mappingPageSectionControlForm').find($('[name="Product"]')).dropdown("set selected", Product);
    $('#mappingPageSectionControlForm').find($('[name="Section"]')).dropdown("set selected", SectionId);
    $('#mappingPageSectionControlForm').find($('[name="Control"]')).dropdown("set selected", ControlId);
    $('#mappingPageSectionControlForm').find($('[name="ControlDisplayName"]')).val(ControlDisplayName);
    $('#mappingPageSectionControlForm').find($('[name="OrderNo"]')).val(OrderNo);
    $('#mappingPageSectionControlForm').find($('[name="Column"]')).val(Column);

    $('#mappingPageSectionControlForm').find($('[name="ProductType"]')).dropdown("set selected", ProductType);
}


function Delete(Id) {
    $.confirm({
        title: 'Are you sure you want to delete?',
        content: 'This dialog will automatically trigger \'cancel\' in 8 seconds if you don\'t respond.',
        autoClose: 'cancelAction|8000',
        buttons: {
            delete: {
                text: 'Delete',
                action: function () {
                    var formData = new FormData();
                    formData.append("Id", Id);
                    formData.append("opt", 3);
                    $.ajax({
                        type: 'POST',
                        url: "/BuildingForms/AddmappingPageSectionControl",
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (data != null) {
                                if (data.length > 0) {
                                    if (data == "DeleteSuccess") {
                                        $.alert({ title: 'Success!', content: 'Deleted successfully!', });
                                        FetchTable();
                                        Reset();
                                    }
                                    else {
                                        $.alert({ title: 'Error!', content: 'Some error has occurred. Please try again!', });
                                    }
                                }
                            }
                            //UnblockUI();
                        },
                        error: function (result) {
                            alert(result);
                            //UnblockUI();
                        }
                    });
                }
            },
            cancelAction: {
                text: 'Cancel',
                action: function () {
                    //$.alert('Action is canceled');
                }
            }
        }
    });
}

function Reset() {
    $('#Submit').html("Add");
    $('#hfId').val(0);
    $("#mappingPageSectionControlForm").find($('[name="OrderNo"]')).val("");
    $("#mappingPageSectionControlForm").find($('[name="Column"]')).val("6");
    $("#mappingPageSectionControlForm").find($('[name="ControlDisplayName"]')).val("");
    //$("#mappingPageSectionControlForm").find($('[name="Page"]')).dropdown("set selected", "0");
    //$("#mappingPageSectionControlForm").find($('[name="Section"]')).dropdown("set selected", "0");
    $("#mappingPageSectionControlForm").find($('[name="Control"]')).dropdown("set selected", "0");
}

function FetchSectionByPageProductProductType() {
    $("#mappingPageSectionControlForm").find($('[name="Section"]')).empty();
    $("#mappingPageSectionControlForm").find($('[name="Section"]')).append("<option value='0'> --search Section-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/BuildingForms/FetchSectionByPageProductProductType',
        data: JSON.stringify({ PageId: $("#mappingPageSectionControlForm").find($('[name="Page"]')).val(), Product: $("#mappingPageSectionControlForm").find($('[name="Product"]')).val(), ProductType: $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingPageSectionControlForm").find($('[name="Section"]')).append("<option value='" + data[i].Id + "'>" + data[i].Section + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function FetchProductTypeByProduct() {
    $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).empty();
    $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).append("<option value='0'> --search ProductType-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/BuildingForms/FetchProductTypeByProduct',
        data: JSON.stringify({ Id: $("#mappingPageSectionControlForm").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingPageSectionControlForm").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}