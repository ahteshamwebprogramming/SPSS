function PageInit() {
    $('.table').DataTable();
    $('.dropdown').dropdown();
    FetchTable();
    $('#Submit').click(function (e) {
        e.preventDefault();
        Submit();
    });
    $("#ProductPremiumMappingForm").find($('[name="Product"]')).change(function () {
        BlockUI();
        FetchProductType().then(() => {
            UnblockUI();
        });
    });
}
function FetchProductType() {
    return new Promise((resolve, reject) => {
        $("#ProductPremiumMappingForm").find($('[name="ProductType"]')).empty();
        $("#ProductPremiumMappingForm").find($('[name="ProductType"]')).append("<option value='0'>--search Product Type--</option>");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Masters/FetchProductTypeById',
            data: JSON.stringify({ ProductId: $("#ProductPremiumMappingForm").find($('[name="Product"]')).val() }),
            cache: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            $("#ProductPremiumMappingForm").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType + "</option>");
                        }
                    }
                    resolve();
                }
                else {
                    reject();
                }
            },
            error: function (result) {
                alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
                reject();
            }
        });
    });
}


function Submit() {
    if (ValidateAddProductPremiumMapping()) {
        BlockUI();
        var formData = GetFormServerControlsById('ProductPremiumMappingForm');
        formData.append("PremiumName", $('#ProductPremiumMappingForm').find($('[name="Premium"]')).dropdown('get text'));
        formData.append("Id", $("#hfId").val());
        if ($("#Submit").html() == "Add") {
            formData.append("opt", 1);
        }
        else if ($("#Submit").html() == "Update") {
            formData.append("opt", 2);
        }
        //formData.append("CIN_CustomerInformation", $('#hfCIN').val());
        $.ajax({
            type: 'POST',
            url: "/Masters/AddProductPremiumMapping",
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
                            $.alert({ title: 'Error!', content: 'This Repairer already exists. Please try another!', });
                        }
                        else if (data == "UpdateSuccess") {
                            $.alert({ title: 'Success!', content: 'Updated successfully!', });
                            FetchTable();
                            Reset();
                        } else if (data == "UpdateExist") {
                            $.alert({ title: 'Error!', content: 'This Repairer already exists. Please try another!', });
                        } else if (data == "WrongOpt") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
                        } else if (data == "EmptyValue") {
                            $.alert({ title: 'Error!', content: 'The Repairer is mandatory!', });
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
}






function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/FetchProductPremiumMapping',
        //data: formData,
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_ProductPremiumMappingTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function Edit(Id, ProductId, ProductTypeId, PremiumId, Catogery, Duration, CancelTypeId, PolicyExcessDeductible, DeductibleTypeId) {
    BlockUI();
    $('#Submit').html("Update");
    $('#hfId').val(Id);
    $('#ProductPremiumMappingForm').find($('[name="Product"]')).dropdown('set selected', ProductId);
    FetchProductType().then(() => {
        $('#ProductPremiumMappingForm').find($('[name="ProductType"]')).dropdown('set selected', ProductTypeId);
    });
    $('#ProductPremiumMappingForm').find($('[name="PeriodIn"]')).dropdown('set selected', Catogery);
    $('#ProductPremiumMappingForm').find($('[name="Duration"]')).val(Duration);
    $('#ProductPremiumMappingForm').find($('[name="Premium"]')).dropdown('set selected', PremiumId);
    $('#ProductPremiumMappingForm').find($('[name="CancelType"]')).dropdown('set selected', CancelTypeId);
    $('#ProductPremiumMappingForm').find($('[name="DeductibleType"]')).dropdown('set selected', DeductibleTypeId);
    $('#ProductPremiumMappingForm').find($('[name="DeductibleValue"]')).val(PolicyExcessDeductible);
    UnblockUI();
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
                        url: "/Masters/AddProductPremiumMapping",
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
    $("#ProductPremiumMappingForm").find($('[name="Product"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="ProductType"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="PeriodIn"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="Premium"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="CancelType"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="DeductibleType"]')).dropdown("set selected", "0");
    $("#ProductPremiumMappingForm").find($('[name="Duration"]')).val("");
    $("#ProductPremiumMappingForm").find($('[name="DeductibleValue"]')).val("");
}












function ValidateAddProductPremiumMapping() {
    var isValid = true;
    if (!validate_AddProductPremiumMapping.form()) {
        isValid = false;
    }
    if (!ValidateSelectByName('Product,ProductType,PeriodIn,Premium,CancelType,DeductibleType', 'ProductPremiumMappingForm')) {
        isValid = false;
    }
    return isValid;
}
var validate_AddProductPremiumMapping;
validate_AddProductPremiumMapping = $("#ProductPremiumMappingForm").validate({
    rules: {
        Duration: "required",
        DeductibleValue: "required"
    },
    messages: {
        Duration: "Duration cannot be left blank",
        DeductibleValue: "Value cannot be left blank"
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