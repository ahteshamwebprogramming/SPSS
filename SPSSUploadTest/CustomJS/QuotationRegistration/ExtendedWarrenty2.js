function Initialise() {
    $('.table').DataTable();
    $('.dropdown').dropdown();
    $('.dateformat').datepicker({ dateFormat: "dd/mm/yy", changeYear: true, changeMonth: true });
    $('.numeric').forceNumeric();

    InitAllDropdowns();
    InitChangeDropdowns();

    PopulateGeneralDetails().then(() => {
        FetchProductPremiumMappingDetails();
        ConvertTextBoxToInfo();
    });



}



$("#Registration").click(function () {

    if (ValidateAddNew()) {
        BlockUI();
        var formData = GetFormControlsByMultipleIds("ProductSelection,GeneralInformation,CustomerInformation,ProductAndCoverageDetails,VehicleAndUnitDetails,PremiumAndRepairerDetails,AdditionalInfo");
        formData.append("CIN_CustomerInformation", $('#hfCIN').val());

        $.ajax({
            type: 'POST',
            url: "/QuotationRegistration/AddQuotation_BrownAndWhiteGoods",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        var res = data.split("_");
                        if (res[2] == 'success') {
                            $.alert({ title: 'Success!', content: 'Saved successfully!', });
                            window.location.href = "/ListPolicy/PolicyList";
                        }
                        else if (res[2] == 'error') {
                            if (res[0] == "CIN" && res[1] == "required") {
                                $.alert("Customer Information Number cannot be empty");
                            }
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

});


function InitChangeDropdowns() {
    PopulateCreationDate();
    $("#GeneralInformation").find($('[name="PolicyType"]')).change(function () {
        if ($(this).val() == "1") {
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).closest('.form-group').show();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).closest('.form-group').show();

            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyValidity"]')).closest(".form-group").hide();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).attr("max", "12");
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).attr("maxlength", "2");
            populateManufacturerWarrantyExpiryDate();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).change(function () {
                PopulatePolicyEffectiveDate();
                PopulatePolicyExpiryDate();
            });

        }
        else if ($(this).val() == "2") {
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyValidity"]')).closest(".form-group").show();
        }
    });
    $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyValidity"]')).change(function () {
        if ($(this).val() == "1") {
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).closest('.form-group').show();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).closest('.form-group').show();

            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).removeAttr("max");
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).attr("max", "60");
            populateManufacturerWarrantyExpiryDate();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).change(function () {
                PopulatePolicyEffectiveDate();
                PopulatePolicyExpiryDate();
            });

        }
        else if ($(this).val() == "2") {
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyPeriod"]')).closest('.form-group').hide();
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).closest('.form-group').hide();
            PopulatePolicyEffectiveDate();
            PopulatePolicyExpiryDate();
        }

    });

    $('#ProductAndCoverageDetails').find($('[name="Tenor"]')).change(function () {
        PopulatePolicyEffectiveDate();
        PopulatePolicyExpiryDate();
    });

}

function InitAllDropdowns() {
    FetchCities();
    FetchCustomerType();
    FetchSaleMethod();
    FetchPolicyType();
    FetchCoverageType();
    FetchMake();
    $("#VehicleAndUnitDetails").find($('[name="Make"]')).change(function () {
        FetchModel();
    });
    $("#VehicleAndUnitDetails").find($('[name="Model"]')).change(function () {
        FetchVariant();
    });
    FetchExcessDeductible();
    FetchRepairer();
    FetchManufacturerValidity();
}

function populateManufacturerWarrantyExpiryDate() {
    if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 1) {
        $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).datepicker("destroy");
        $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).datepicker({
            minDate: 0,
            maxDate: "+1y",
            dateFormat: "dd/mm/yy",
            changeYear: true,
            changeMonth: true
        });
    }
    else if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 2) {
        if ($("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).val() == 1) {
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).datepicker("destroy");
            $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).datepicker({
                minDate: 0,
                maxDate: "+5y",
                dateFormat: "dd/mm/yy",
                changeYear: true,
                changeMonth: true
            });
        }

    }
}

function PopulatePolicyEffectiveDate() {
    var manufacurerWarrantyExpiryDate = $('#ProductAndCoverageDetails').find($('[name="ManufacturerWarrantyExpiryDate"]')).val();
    if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 1) {
        var date = moment(manufacurerWarrantyExpiryDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
        date = addDays(date, 1);
        $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).val(moment(date).format('DD/MM/YYYY'));
        $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker("destroy");
        $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker({
            minDate: moment(date).format('DD/MM/YYYY'),
            maxDate: moment(date).format('DD/MM/YYYY'),
            dateFormat: "dd/mm/yy",
            changeYear: true,
            changeMonth: true
        });
    }
    if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 2) {
        if ($("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).val() == 1) {
            var date = moment(manufacurerWarrantyExpiryDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
            date = addDays(date, 1);
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).val(moment(date).format('DD/MM/YYYY'));
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker("destroy");
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker({
                minDate: moment(date).format('DD/MM/YYYY'),
                maxDate: moment(date).format('DD/MM/YYYY'),
                dateFormat: "dd/mm/yy",
                changeYear: true,
                changeMonth: true
            });
        }
        else if ($("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).val() == 2) {
            var currentDate = new Date();
            currentDate = moment(currentDate).format('DD/MM/YYYY');
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).val(currentDate);
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker("destroy");
            $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).datepicker({
                minDate: currentDate,
                maxDate: currentDate,
                dateFormat: "dd/mm/yy",
                changeYear: true,
                changeMonth: true
            });
        }
    }
}
function PopulatePolicyExpiryDate() {
    var policyEffectiveDate = $('#ProductAndCoverageDetails').find($('[name="PolicyEffectiveDate"]')).val();
    if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 1) {
        var date = moment(policyEffectiveDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
        var Tenor = $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val() == "" ? 0 : $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val();
        date = addMonths(date, Tenor);
        $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).val(moment(date).format('DD/MM/YYYY'));
        $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker("destroy");
        $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker({
            minDate: moment(date).format('DD/MM/YYYY'),
            maxDate: moment(date).format('DD/MM/YYYY'),
            dateFormat: "dd/mm/yy",
            changeYear: true,
            changeMonth: true
        });
    }
    if ($("#GeneralInformation").find($('[name="PolicyType"]')).val() == 2) {
        if ($("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).val() == 2) {
            var date = moment(policyEffectiveDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
            var Tenor = $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val() == "" ? 0 : $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val();
            date = addMonths(date, Tenor);
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker("destroy");
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).val(moment(date).format('DD/MM/YYYY'));
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker({
                minDate: moment(date).format('DD/MM/YYYY'),
                maxDate: moment(date).format('DD/MM/YYYY'),
                dateFormat: "dd/mm/yy",
                changeYear: true,
                changeMonth: true
            });
        }
        else if ($("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).val() == 1) {
            var date = moment(policyEffectiveDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
            var Tenor = $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val() == "" ? 0 : $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val();
            date = addMonths(date, Tenor);
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker("destroy");
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).val(moment(date).format('DD/MM/YYYY'));
            $('#ProductAndCoverageDetails').find($('[name="PolicyExpiryDate"]')).datepicker({
                minDate: moment(date).format('DD/MM/YYYY'),
                maxDate: moment(date).format('DD/MM/YYYY'),
                dateFormat: "dd/mm/yy",
                changeYear: true,
                changeMonth: true
            });
        }
    }
}
function PopulateCreationDate() {
    var currentDate = new Date();
    currentDate = moment(currentDate).format('DD/MM/YYYY');
    $('#ProductAndCoverageDetails').find($('[name="CreationDate"]')).val(currentDate);
}


function FetchCities() {
    $("#GeneralInformation").find($('[name="City"]')).empty();
    $("#GeneralInformation").find($('[name="City"]')).append("<option value='0'>--select Emirate--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchEmirate',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#GeneralInformation").find($('[name="City"]')).append("<option value='" + data[i].Id + "'>" + data[i].City1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchCustomerType() {
    $("#GeneralInformation").find($('[name="CustomerType"]')).empty();
    $("#GeneralInformation").find($('[name="CustomerType"]')).append("<option value='0'>--select CustomerType--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchCustomerType',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#GeneralInformation").find($('[name="CustomerType"]')).append("<option value='" + data[i].Id + "'>" + data[i].CustomerType + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchSaleMethod() {
    $("#GeneralInformation").find($('[name="SaleMethod"]')).empty();
    $("#GeneralInformation").find($('[name="SaleMethod"]')).append("<option value='0'>--select SaleMethod--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchSaleMethod',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#GeneralInformation").find($('[name="SaleMethod"]')).append("<option value='" + data[i].Id + "'>" + data[i].SaleMethod + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchPolicyType() {
    $("#GeneralInformation").find($('[name="PolicyType"]')).empty();
    $("#GeneralInformation").find($('[name="PolicyType"]')).append("<option value='0'>--select PolicyType--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchPolicyType',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#GeneralInformation").find($('[name="PolicyType"]')).append("<option value='" + data[i].Id + "'>" + data[i].PolicyType + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchCoverageType() {
    $("#ProductAndCoverageDetails").find($('[name="CoverageType"]')).empty();
    $("#ProductAndCoverageDetails").find($('[name="CoverageType"]')).append("<option value='0'>--select CoverageType--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchCoverageType',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#ProductAndCoverageDetails").find($('[name="CoverageType"]')).append("<option value='" + data[i].Id + "'>" + data[i].CoverageType + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchMake() {
    $("#VehicleAndUnitDetails").find($('[name="Make"]')).empty();
    $("#VehicleAndUnitDetails").find($('[name="Make"]')).append("<option value='0'>--select Make--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchMake',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#VehicleAndUnitDetails").find($('[name="Make"]')).append("<option value='" + data[i].Id + "'>" + data[i].Make + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchModel() {
    $("#VehicleAndUnitDetails").find($('[name="Model"]')).empty();
    $("#VehicleAndUnitDetails").find($('[name="Model"]')).append("<option value='0'>--select Model--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchModel',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val(), MakeId: $("#VehicleAndUnitDetails").find($('[name="Make"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#VehicleAndUnitDetails").find($('[name="Model"]')).append("<option value='" + data[i].Id + "'>" + data[i].Model + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchVariant() {
    $("#VehicleAndUnitDetails").find($('[name="Variant"]')).empty();
    $("#VehicleAndUnitDetails").find($('[name="Variant"]')).append("<option value='0'>--select Variant--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchVariant',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val(), MakeId: $("#VehicleAndUnitDetails").find($('[name="Make"]')).val(), ModelId: $("#VehicleAndUnitDetails").find($('[name="Model"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#VehicleAndUnitDetails").find($('[name="Variant"]')).append("<option value='" + data[i].Id + "'>" + data[i].Variant + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function FetchExcessDeductible() {
    $("#PremiumAndRepairerDetails").find($('[name="ExcessDeductible"]')).empty();
    $("#PremiumAndRepairerDetails").find($('[name="ExcessDeductible"]')).append("<option value='0'>--select Excess/Deductible--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchExcessDeductible',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#PremiumAndRepairerDetails").find($('[name="ExcessDeductible"]')).append("<option value='" + data[i].Id + "'>" + data[i].ExcessDeductible + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchRepairer() {
    $("#PremiumAndRepairerDetails").find($('[name="Repairer"]')).empty();
    $("#PremiumAndRepairerDetails").find($('[name="Repairer"]')).append("<option value='0'>--select Repairer--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchRepairer',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#PremiumAndRepairerDetails").find($('[name="Repairer"]')).append("<option value='" + data[i].Id + "'>" + data[i].Repairer + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function PopulateGeneralDetails() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/QuotationRegistration/FetchGeneralDetails',
            data: JSON.stringify({ JS: 'ExtendedWarrenty', ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val() }),
            cache: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        $("#GeneralInformation").find($('[name="PolicyNumber"]')).val(data[0].QuotationNumber);
                        $("#GeneralInformation").find($('[name="Group"]')).val(data[0].Group);
                        $("#GeneralInformation").find($('[name="IssuedBy"]')).val(data[0].Branch);
                        $("#GeneralInformation").find($('[name="Location"]')).val(data[0].Location);
                        $("#GeneralInformation").find($('[name="PolicyNumber"]')).attr("readonly", "readonly");
                        $("#GeneralInformation").find($('[name="Group"]')).attr("readonly", "readonly");
                        $("#GeneralInformation").find($('[name="IssuedBy"]')).attr("readonly", "readonly");
                        $("#GeneralInformation").find($('[name="Location"]')).attr("readonly", "readonly");
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
function FetchManufacturerValidity() {
    $("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).empty();
    $("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).append("<option value='0'>--select--</option>");
    $("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).append("<option value='1'>Yes</option>");
    $("#ProductAndCoverageDetails").find($('[name="ManufacturerWarrantyValidity"]')).append("<option value='2'>No</option>");
}

function FetchProductPremiumMappingDetails() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchProductPremiumMappingDetails',
        data: JSON.stringify({ ProductId: $("#ProductSelection").find($('[name="Product"]')).val(), ProductTypeId: $("#ProductSelection").find($('[name="ProductType"]')).val(), Premium: 0, RefId: $("#GeneralInformation").find($('[name="PolicyNumber"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.Duration == 'Y') {
                    $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val(parseInt(data.Duration) * parseInt(12));
                }
                else {
                    $("#ProductAndCoverageDetails").find($('[name="Tenor"]')).val(data.Duration);
                }
                $("#PremiumAndRepairerDetails").find($('[name="GrossPremium"]')).val(data.GrossPremium);
                $("#PremiumAndRepairerDetails").find($('[name="TotalPremium"]')).val(data.GrossPremiumWVat);
                $("#PremiumAndRepairerDetails").find($('[name="ExcessDeductible"]')).dropdown("set selected", data.DeductibleType);

            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

function ConvertTextBoxToInfo() {
    $("#PremiumAndRepairerDetails").find($('[name="GrossPremium"]')).wrap("<div class='input-icons'>");
    $('<i class="fa fa-info-circle" onclick="showPremiumBreakUp()" style="position:absolute;padding:6px;color:#a57b7b;min-width:40px;text-align:center;font-size:15px;cursor:pointer;"></i>').insertBefore($("#PremiumAndRepairerDetails").find($('[name="GrossPremium"]')));
}

function showPremiumBreakUp() {
    $('#PremiumBreakUp').bsModal('show');
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchPremiumBreakUp',
        data: JSON.stringify({ RefId: $("#GeneralInformation").find($('[name="PolicyNumber"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $('#PremiumCalculator_show').append("<li>" + data[i].Premium + "  :  " + data[i].Comm + "</li>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}