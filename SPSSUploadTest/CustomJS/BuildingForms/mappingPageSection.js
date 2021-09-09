function Submit() {
    BlockUI();
    if (validate_AddmappingPageSection.form()) {
        var formData = new FormData();
        formData.append("Page", $("#mappingPageSectionForm").find($('[name="Page"]')).val());
        formData.append("Product", $("#mappingPageSectionForm").find($('[name="Product"]')).val());
        formData.append("ProductType", $("#mappingPageSectionForm").find($('[name="ProductType"]')).val());
        formData.append("Section", $("#mappingPageSectionForm").find($('[name="Section"]')).val());
        formData.append("SectionDisplayName", $("#mappingPageSectionForm").find($('[name="SectionDisplayName"]')).val());
        formData.append("OrderNo", $("#mappingPageSectionForm").find($('[name="OrderNo"]')).val());
        formData.append("Id", $("#hfId").val());
        if ($("#Submit").html() == "Add") {
            formData.append("opt", 1);
        }
        else if ($("#Submit").html() == "Update") {
            formData.append("opt", 2);
        }
        $.ajax({
            type: 'POST',
            url: "/BuildingForms/AddmappingPageSection",
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
                            $.alert({ title: 'Error!', content: 'This mappingPageSection already exists. Please try another!', });
                        }
                        else if (data == "UpdateSuccess") {
                            $.alert({ title: 'Success!', content: 'Updated successfully!', });
                            FetchTable();
                            Reset();
                        } else if (data == "UpdateExist") {
                            $.alert({ title: 'Error!', content: 'This mappingPageSection already exists. Please try another!', });
                        } else if (data == "WrongOpt") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
                        } else if (data == "EmptyValue") {
                            $.alert({ title: 'Error!', content: 'The mappingPageSection is mandatory!', });
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

var validate_AddmappingPageSection;

validate_AddmappingPageSection = $("#mappingPageSectionForm").validate({
    rules: {
        SectionDisplayName: "required",
        OrderNo: "required"
    },
    messages: {
        SectionDisplayName: "SectionDisplay Name cannot be left blank",
        OrderNo: "Order No cannot be left blank"
    }
});

function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/BuildingForms/FetchmappingPageSection',
        data: JSON.stringify({ PageId: $("#mappingPageSectionForm").find($('[name="Page"]')).val(), ProductId: $("#mappingPageSectionForm").find($('[name="Product"]')).val(), ProductTypeId: $("#mappingPageSectionForm").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_mappingPageSectionTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function Edit(Id, PageId, Product, ProductType, SectionId, SectionDisplayName, OrderNo) {
    $('#Submit').html("Update");
    $('#hfId').val(Id);
    $('#mappingPageSectionForm').find($('[name="Page"]')).dropdown("set selected", PageId);
    $('#mappingPageSectionForm').find($('[name="Product"]')).dropdown("set selected", Product);

    $('#mappingPageSectionForm').find($('[name="Section"]')).dropdown("set selected", SectionId);
    $('#mappingPageSectionForm').find($('[name="SectionDisplayName"]')).val(SectionDisplayName);
    $('#mappingPageSectionForm').find($('[name="OrderNo"]')).val(OrderNo);

    $('#mappingPageSectionForm').find($('[name="ProductType"]')).dropdown("set selected", ProductType);
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
                        url: "/BuildingForms/AddmappingPageSection",
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
    $("#mappingPageSectionForm").find($('[name="OrderNo"]')).val("");
    $("#mappingPageSectionForm").find($('[name="SectionDisplayName"]')).val("");
    //$("#mappingPageSectionForm").find($('[name="Page"]')).dropdown("set selected", "0");
    //$("#mappingPageSectionForm").find($('[name="Product"]')).dropdown("set selected", "0");
    //$("#mappingPageSectionForm").find($('[name="ProductType"]')).dropdown("set selected", "0");
    $("#mappingPageSectionForm").find($('[name="Section"]')).dropdown("set selected", "0");
}


function FetchProductTypeByProduct() {
    $("#mappingPageSectionForm").find($('[name="ProductType"]')).empty();
    $("#mappingPageSectionForm").find($('[name="ProductType"]')).append("<option value='0'> --search ProductType-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/BuildingForms/FetchProductTypeByProduct',
        data: JSON.stringify({ Id: $("#mappingPageSectionForm").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#mappingPageSectionForm").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}