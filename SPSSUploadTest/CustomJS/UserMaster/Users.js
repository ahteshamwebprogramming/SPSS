function Submit() {
    BlockUI();
    if (ValidateUsers()) {
        var formData = GetFormServerControlsById("UsersForm");
        //var formData = new FormData();
        //formData.append("Product", $("#UsersForm").find($('[name="Product"]')).val());
        //formData.append("Users", $("#UsersForm").find($('[name="Users"]')).val());
        formData.append("Id", $("#hfId").val());
        if ($("#Submit").html() == "Add") {
            formData.append("opt", 1);
        }
        else if ($("#Submit").html() == "Update") {
            formData.append("opt", 2);
        }
        $.ajax({
            type: 'POST',
            url: "/UserMaster/AddUsers",
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
                            $.alert({ title: 'Error!', content: 'This Users already exists. Please try another!', });
                        }
                        else if (data == "UpdateSuccess") {
                            $.alert({ title: 'Success!', content: 'Updated successfully!', });
                            FetchTable();
                            Reset();
                        } else if (data == "UpdateExist") {
                            $.alert({ title: 'Error!', content: 'This Users already exists. Please try another!', });
                        } else if (data == "WrongOpt") {
                            $.alert({ title: 'Error!', content: 'There is problem in performing the current operation right now. Please try again or contact administrator!', });
                        } else if (data == "EmptyValue") {
                            $.alert({ title: 'Error!', content: 'The Users is mandatory!', });
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


function ValidateUsers() {
    var isValid = true;
    if (!validate_AddUsers.form()) {
        isValid = false;
    }
    if (!ValidateSelectByName('UserType,Manager,Group,Branch,Country,City', 'UsersForm')) {
        isValid = false;
    }
    return isValid;
}
var validate_AddUsers;
validate_AddUsers = $("#UsersForm").validate({
    rules: {
        Name: "required",
        UserName: "required",
        Password: { required: true, minlength: 5 },
        ConfirmPassword: { required: true, minlength: 5, equalTo: "#Password" }
    },
    messages: {
        Users: "Users cannot be left blank",
        UserName: "UserName cannot be left blank",
        Password: {
            required: "Password is required",
            minlength: "Your Password should be min of 5 characters"
        },
        ConfirmPassword: {
            required: "Password is required",
            minlength: "Your Password should be min of 5 characters",
            equalTo: "Please enter the same password as above"
        }
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


function FetchTable() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/UserMaster/FetchUsers',
        //data: formData,
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_UsersTable").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function Edit(Id) {
    $('#Submit').html("Update");
    $('#hfId').val(Id);
    //$('#UsersForm').find($('[name="Users"]')).val(Value);
    //$('#UsersForm').find($('[name="Product"]')).dropdown("set selected", Value1);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/UserMaster/FetchUsersById',
        data: JSON.stringify({ UserId: Id }),
        cache: false,
        dataType: "json",
        success: function (udata) {
            if (udata != null) {
                if (udata.length > 0) {
                    $('#UsersForm').find($('[name="Name"]')).val(udata[0].Name);
                    $('#UsersForm').find($('[name="FatherName"]')).val(udata[0].FatherName);
                    $('#UsersForm').find($('[name="EmployeeId"]')).val(udata[0].EmployeeId);
                    $('#UsersForm').find($('[name="EmailId"]')).val(udata[0].EmailId);
                    $('#UsersForm').find($('[name="PhoneNumber"]')).val(udata[0].PhoneNumber);
                    $('#UsersForm').find($('[name="UserType"]')).dropdown("set selected", udata[0].UserTypeId);
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: '/UserMaster/FetchManagers',
                        data: JSON.stringify({ UserType: udata[0].UserTypeId }),
                        cache: false,
                        dataType: "json",
                        success: function (data1) {
                            $("#UsersForm").find($('[name="Manager"]')).empty();
                            $("#UsersForm").find($('[name="Manager"]')).append("<option value='0'> --search Manager-- </option>");
                            if (data1 != null) {
                                if (data1.length > 0) {
                                    for (var i = 0; i < data1.length; i++) {
                                        var managerselected = udata[0].Manager == data1[i].Id ? "selected" : "";
                                        $("#UsersForm").find($('[name="Manager"]')).append("<option " + managerselected + " value='" + data1[i].Id + "'>" + data1[i].Name + "</option>");
                                    }
                                }
                            }
                            //$('#UsersForm').find($('[name="Manager"]')).dropdown("set selected", udata[0].Manager);
                        },
                        error: function (result) {
                            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
                        }
                    });
                    $('#UsersForm').find($('[name="Group"]')).dropdown("set selected", udata[0].GroupId);

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: '/UserMaster/FetchBranchForDropdown',
                        data: JSON.stringify({ Id: udata[0].GroupId }),
                        cache: false,
                        dataType: "json",
                        success: function (data2) {
                            $("#UsersForm").find($('[name="Branch"]')).empty();
                            $("#UsersForm").find($('[name="Branch"]')).append("<option value='0'> --search Branch-- </option>");
                            if (data2 != null) {
                                if (data2.length > 0) {
                                    for (var i = 0; i < data2.length; i++) {
                                        var branchselected = udata[0].BranchId == data2[i].Id ? "selected" : "";
                                        $("#UsersForm").find($('[name="Branch"]')).append("<option " + branchselected + " value='" + data2[i].Id + "'>" + data2[i].Branch1 + "</option>");
                                    }
                                }
                            }
                        },
                        error: function (result) {
                            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
                        }
                    });
                    $('#UsersForm').find($('[name="UserName"]')).val(udata[0].UserName);
                    $('#UsersForm').find($('[name="Password"]')).val(udata[0].Password);
                    $('#UsersForm').find($('[name="ConfirmPassword"]')).val(udata[0].Password);
                    $('#UsersForm').find($('[name="Country"]')).dropdown("set selected", udata[0].CountryId);

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: '/UserMaster/FetchCities',
                        data: JSON.stringify({ Id: udata[0].CountryId }),
                        cache: false,
                        dataType: "json",
                        success: function (data3) {
                            $("#UsersForm").find($('[name="City"]')).empty();
                            $("#UsersForm").find($('[name="City"]')).append("<option value='0'> --search City-- </option>");
                            if (data3 != null) {
                                if (data3.length > 0) {
                                    for (var i = 0; i < data3.length; i++) {
                                        var cityselected = udata[0].CityId == data3[i].Id ? "selected" : "";
                                        $("#UsersForm").find($('[name="City"]')).append("<option " + cityselected + " value='" + data3[i].Id + "'>" + data3[i].City1 + "</option>");
                                    }
                                }
                            }

                        },
                        error: function (result) {
                            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
                        }
                    });
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
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
                        url: "/UserMaster/AddUsers",
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
    $("#UsersForm").find($('[name="Name"]')).val("");
    $("#UsersForm").find($('[name="FatherName"]')).dropdown("set selected", 0);

    var allCtrl = $('#UsersForm').find(jQuery('[name]'));
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].tagName == 'SELECT') {
            curCtrl.dropdown("set selected", "0");
        }
        else if (curCtrl[0].tagName == 'INPUT') {
            curCtrl.val("");
        }
    });
}

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





function ChangeStatus(Id, Stat) {
    $.confirm({
        title: 'Are you sure you want to ' + (Stat == 1 ? "Activate" : "Deactivate") + ' this User?',
        content: 'This dialog will automatically trigger \'cancel\' in 8 seconds if you don\'t respond.',
        autoClose: 'cancelAction|8000',
        buttons: {
            delete: {
                text: 'YES',
                action: function () {
                    var formData = new FormData();
                    formData.append("Id", Id);
                    formData.append("stat", Stat);
                    formData.append("opt", 4);
                    $.ajax({
                        type: 'POST',
                        url: "/UserMaster/AddUsers",
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (data != null) {
                                if (data.length > 0) {
                                    if (data == "StatusChangeSuccess") {
                                        $.alert({ title: 'Success!', content: 'Status Changed successfully!', });
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






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






function FetchManagers() {
    $("#UsersForm").find($('[name="Manager"]')).empty();
    $("#UsersForm").find($('[name="Manager"]')).append("<option value='0'> --search Manager-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/UserMaster/FetchManagers',
        data: JSON.stringify({ UserType: $("#UsersForm").find($('[name="UserType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#UsersForm").find($('[name="Manager"]')).append("<option value='" + data[i].Id + "'>" + data[i].Name + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchBranch() {
    $("#UsersForm").find($('[name="Branch"]')).empty();
    $("#UsersForm").find($('[name="Branch"]')).append("<option value='0'> --search Branch-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/UserMaster/FetchBranchForDropdown',
        data: JSON.stringify({ Id: $("#UsersForm").find($('[name="Group"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#UsersForm").find($('[name="Branch"]')).append("<option value='" + data[i].Id + "'>" + data[i].Branch1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchCities() {
    $("#UsersForm").find($('[name="City"]')).empty();
    $("#UsersForm").find($('[name="City"]')).append("<option value='0'> --search City-- </option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/UserMaster/FetchCities',
        data: JSON.stringify({ Id: $("#UsersForm").find($('[name="Country"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#UsersForm").find($('[name="City"]')).append("<option value='" + data[i].Id + "'>" + data[i].City1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}