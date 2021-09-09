function Submit() {
    BlockUI();
    if (validate_AddCustomerType.form()) {
        var formData = new FormData();
        formData.append("CustomerType", $("#CustomerTypeForm").find($('[name="CustomerType"]')).val());
        formData.append("Id", $("#hfId").val());
        if ($("#Submit").html() == "Add") {
            formData.append("opt", 1);
        }
        else if ($("#Submit").html() == "Update") {
            formData.append("opt", 2);
        }
        $.ajax({
            type: 'POST',
            url: "/Masters/AddCustomerType",
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
                            $.alert({ title: 'Error!', content: 'This CustomerType already exists. Please try another!', });
                        }
                        else if (data == "UpdateSuccess") {
                            $.alert({ title: 'Success!', content: 'Updated successfully!', });
                            FetchTable();
                            Reset();
                        } else if (data == "UpdateExist") {
                            $.alert({ title: 'Error!', content: 'This CustomerType already exists. Please try another!', });
                        } else if (data == "WrongOpt") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
                        } else if (data == "EmptyValue") {
                            $.alert({ title: 'Error!', content: 'The CustomerType is mandatory!', });
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

var validate_AddCustomerType;

validate_AddCustomerType = $("#CustomerTypeForm").validate({
    rules: {
        CustomerType: "required"
    },
    messages: {
        CustomerType: "CustomerType cannot be left blank"
    }
});

function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/FetchCustomerType',
        //data: formData,
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_CustomerTypeTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function Edit(Id, Value) {
    $('#Submit').html("Update");
    $('#hfId').val(Id);
    $('#CustomerTypeForm').find($('[name="CustomerType"]')).val(Value);
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
                        url: "/Masters/AddCustomerType",
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
    $("#CustomerTypeForm").find($('[name="CustomerType"]')).val("");
}