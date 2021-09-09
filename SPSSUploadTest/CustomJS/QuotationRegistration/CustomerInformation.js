function CustomerInformationInitialise() {
    $('.table').DataTable();
    $('.dropdown').dropdown();
    $('.dateformat').datepicker({ dateFormat: "dd/mm/yy", changeYear: true, changeMonth: true });
    $('.numeric').forceNumeric();

    InitialiseCIN();
    WrapCustomerInformationControls();
    DisableCustomerInformation();
    $('#btnCreateCIN').click(function () {
        CreateCIN();
        InitialiseTitle();
    });
    $('#btnCheckCIN').click(function () {
        CheckCIN();
    });
    $("#CustomerInformation").find($("[name='IDType']")).change(function () {
        MaskEmiarteID($(this));
    });
    $("#CustomerInformation").find($("[name='Title']")).change(function () {
        InitialiseTitle();
    });

    $('#Master_CIN_Search').change(function () {
        BlockUI();
        var CIN = $(this).val();
        $('#hfCIN').val(CIN);
        FetchCINRecord(CIN);
    });

    InitializeMobileNumber();

    FetchTitle();
    FetchGender();
    FetchIDType();
    FetchEmirate();
    FetchNationality();
}

function MaskEmiarteID(currctrl) {
    if (currctrl.val() == 0) {
        //$('#IDNumber').removeClass("emirateid");
        $("#CustomerInformation").find($("[name='IDNumber']")).mask('00000000000000000');
    }
    else if (currctrl.val() == 1) {
        //$('#IDNumber').addClass("emirateid");
        //$('#IDNumber').removeClass("emirateid");
        $("#CustomerInformation").find($("[name='IDNumber']")).mask('000-0000-0000000-0');
    }
    else if (currctrl.val() == 2) {
        $("#CustomerInformation").find($("[name='IDNumber']")).mask('0000000');
    }
    else if (currctrl.val() == 3) {
        $("#CustomerInformation").find($("[name='IDNumber']")).mask('AAAAAAAAA');
    }
}

function InitialiseCIN() {
    var ctrl = $('#CustomerInformation').find($('.titel-back1'));
    $('<div class="row"><div class="col-md-3"></div><div style="" class="col-md-6 form-group">            <div style="width: fit-content; margin: auto">                <div style="float: left; padding: 6px;"><i class="fa fa-search"></i></div>                <div style="float: left">                    <select class="dropdown col-md-12 search form-control" id="Master_CIN_Search" style="">                        <option value="0">Search CIN</option>                        <option value="1">9997442725</option>                        <option value="2">9997442725</option>                    </select>                </div>                <div style="float: left">                    <input type="button" id="btnCreateCIN" class="btn btn-primary" value="Create New CIN" />                </div>                <div style="float: left; display: none">                    <input type="button" id="btnCheckCIN" class="btn btn-primary" value="Check CIN" />                </div>                <div style="float: left; padding: 6px; display: none">                    <p>CIN:999744</p>                </div>                <div style="clear: both"></div>            </div>            <input type="hidden" id="hfCIN" value="" />        </div>                                    </div>               </div>').insertAfter(ctrl);
    var CIN = ["A", "B", "C"];
    var value = [1, 2, 3];
    $("#Master_CIN_Search").select2({
        data: CIN
    });





    FetchCIN();
}

function WrapCustomerInformationControls() {


    $('#CustomerInformation').find($("[name='Title'],[name='Gender'],[name='IDType'],[name='Emirate'],[name='Nationality']")).parent().parent().parent().addClass('wrapcustomerinformation');
    $('#CustomerInformation').find($("[name='FirstName'],[name='MiddleName'],[name='LastName'],[name='FullName'],[name='EmailId'],[name='CompanyName'],[name='IDNumber'],[name='IDExpiry'],[name='DateOfBirth'],[name='MobileNumber'],[name='AlternateMobileNumber'],[name='POBox'],[name='Address']")).parent().parent().addClass('wrapcustomerinformation');

    $(".wrapcustomerinformation").wrapAll('<div id="div_Master_CustomerInformation" />');
}

function FetchCIN() {
    $('#Master_CIN_Search').empty();
    $('#Master_CIN_Search').append('<option value="0">Search CIN</option>');
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchCIN',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $('#Master_CIN_Search').append('<option value="' + data[i].CIN + '">' + data[i].CIN + '</option>');
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function CreateCIN() {
    EnableCustomerInformation();
    DisableCINSearch();
    $('#btnCheckCIN').parent().show();
    $('#btnCreateCIN').parent().hide();
}



function EnableCustomerInformation() {
    $('#div_Master_CustomerInformation').css("opacity", "1");
    var allinptctrls = $('#div_Master_CustomerInformation').find('[type="text"]');
    var alldrpdwnctrls = $('#div_Master_CustomerInformation').find('select');
    var allradioctrls = $('#div_Master_CustomerInformation').find('[type="radio"]');

    allinptctrls.each(function () {
        var currctrl = $(this);
        currctrl.removeAttr("disabled");
    });
    alldrpdwnctrls.each(function () {
        var currctrl = $(this);
        currctrl.parent().find("input").removeAttr("disabled");
        //currctrl.parent().find("input").attr("disabled", "disabled");
    });
    allradioctrls.each(function () {
        var currctrl = $(this);
        currctrl.removeAttr("disabled");
    });
}
function DisableCINSearch() {
    $('#Master_CIN_Search').parent().css("opacity", "0.5");
    $('#Master_CIN_Search').parent().css("pointer-events", "none");
    $('#Master_CIN_Search').parent().find('input').attr("disabled", "disabled");
}

function EnableCINSearch() {
    $('#Master_CIN_Search').parent().css("opacity", "1");
    $('#Master_CIN_Search').parent().css("pointer-events", "all");
    $('#Master_CIN_Search').parent().find('input').removeAttr("disabled");
}


function CheckCIN() {

    if (ValidateForCIN()) {
        //var name = $('#fullname').val().trim();
        var phone = $("#CustomerInformation").find($('[name="MobileNumber"]')).val().trim()
        //var idnumber = $('#IDNumber').val().trim();
        //if (name.length > 4)
        //    name = name.substring(0, 4);
        //else
        //    name = name.substring(0, name.length - 1);
        //if (idnumber.length > 4)
        //    idnumber = idnumber.substring(idnumber.length - 5, idnumber.length - 1);
        var countrycode = "UAE"; //sessionStorage.getItem("CountryISOCode1");
        var date = new Date();
        var intmonth = (parseInt(date.getMonth().toString()) + 1);
        var month = intmonth < 10 ? "0" + intmonth.toString() : intmonth.toString();
        var year = date.getFullYear().toString();
        year = year.substr(2, 2);
        var CIN = countrycode + year + month + phone;
        //$('#Master_CIN_Search').parent().find('input').empty();
        //$('#Master_CIN_Search').parent().find('[class="text"]').html(CIN);
        $('#Master_CIN_Search').parent().parent().find('[class="select2-selection__rendered"]').html(CIN);
        $('#hfCIN').val(CIN);
    }

}


function ValidateForCIN() {
    if ($("#CustomerInformation").find($('[name="MobileNumber"]')).val().trim() == "" || $("#CustomerInformation").find($('[name="IDNumber"]')).val().trim() == "") {
        alertt("Error", "Please fill all the customer information", "error");
        return false;
    }
    return true;
}




function DisableCustomerInformation() {
    $('#div_Master_CustomerInformation').css("opacity", "0.5");
    var allinptctrls = $('#div_Master_CustomerInformation').find('[type="text"]');
    var alldrpdwnctrls = $('#div_Master_CustomerInformation').find('select');
    var allradioctrls = $('#div_Master_CustomerInformation').find('[type="radio"]');

    allinptctrls.each(function () {
        var currctrl = $(this);
        currctrl.attr("disabled", "disabled");
    });
    alldrpdwnctrls.each(function () {
        var currctrl = $(this);
        //currctrl.attr("disabled", "disabled");
        currctrl.parent().find("input").attr("disabled", "disabled");

    });
    allradioctrls.each(function () {
        var currctrl = $(this);
        currctrl.attr("disabled", "disabled");
    });

    //EnableCINSearch();
}


function InitializeMobileNumber() {
    //var input = document.querySelector("#MobileNumber");
    var input = $("#CustomerInformation").find("[name='MobileNumber']")[0];
    window.intlTelInput(input, {
        // allowDropdown: false,
        // autoHideDialCode: false,
        // autoPlaceholder: "off",
        // dropdownContainer: document.body,
        // excludeCountries: ["us"],
        //formatOnDisplay: true,
        initialCountry: "AE",
        geoIpLookup: function (callback) {
            $.get("http://ipinfo.io/", function () { }, "jsonp").always(function (resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                alert(countryCode);
                callback(countryCode);
            });
        },
        // hiddenInput: "full_number",

        // localizedCountries: { 'de': 'Deutschland' },
        // nationalMode: false,
        // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
        placeholderNumberType: "MOBILE",
        // preferredCountries: ['cn', 'jp'],
        // separateDialCode: true,
        utilsScript: "../CustomComponents/TelephoneInput/build/js/utils.js"
    });
    $("#CustomerInformation").find("[name='MobileNumber']").parent().css("width", "inherit");

    var input1 = $("#CustomerInformation").find("[name='AlternateMobileNumber']")[0];
    window.intlTelInput(input1, {
        initialCountry: "AE",
        geoIpLookup: function (callback) {
            $.get("http://ipinfo.io/", function () { }, "jsonp").always(function (resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                alert(countryCode);
                callback(countryCode);
            });
        },
        placeholderNumberType: "MOBILE",
        utilsScript: "../CustomComponents/TelephoneInput/build/js/utils.js"
    });
    $("#CustomerInformation").find("[name='AlternateMobileNumber']").parent().css("width", "inherit");
}



function FetchCINRecord(CIN) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchCINRecord',
        data: JSON.stringify({ CIN: CIN }),
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(moment(new Date(parseInt(data[0].DateOfBirth.replace(/[^0-9 +]/g, '')))).format('DD/MM/YYYY'));
            if (data != null) {
                if (data.length > 0) {
                    PopulateFormControlByParentId(data, 'CustomerInformation');
                }
            }
            UnblockUI();
        },
        error: function (result) {
            UnblockUI();
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}














function FetchTitle() {
    $("#CustomerInformation").find($('[name="Title"]')).empty();
    $("#CustomerInformation").find($('[name="Title"]')).append("<option value='0'>--select Title--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchTitle',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#CustomerInformation").find($('[name="Title"]')).append("<option value='" + data[i].Id + "'>" + data[i].Title1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
    InitialiseTitle();
}


function InitialiseTitle() {

    if ($("#CustomerInformation").find($('[name="Title"]')).val() == 4) {
        $("#CustomerInformation").find($('[name="CompanyName"]')).removeAttr("disabled");
        $("#CustomerInformation").find($('[name="FirstName"]')).attr("disabled", true);
        $("#CustomerInformation").find($('[name="Middle"]')).attr("disabled", true);
        $("#CustomerInformation").find($("[name='LastName']")).attr("disabled", true);
        $("#CustomerInformation").find($("[name='FullName']")).attr("disabled", true);
    }
    else {
        $("#CustomerInformation").find($("[name='CompanyName']")).attr("disabled", true);
        $("#CustomerInformation").find($("[name='FirstName']")).removeAttr("disabled");
        $("#CustomerInformation").find($("[name='MiddleName']")).removeAttr("disabled");
        $("#CustomerInformation").find($("[name='LastName']")).removeAttr("disabled");
        $("#CustomerInformation").find($("[name='FullName']")).removeAttr("disabled");
    }

    $("#CustomerInformation").find($("[name='Title']")).change(function () {
        if ($("#CustomerInformation").find($("[name='Title']")).val() == 4) {
            $("#CustomerInformation").find($("[name='CompanyName']")).removeAttr("disabled");
            $("#CustomerInformation").find($("[name='FirstName']")).attr("disabled", true);
            $("#CustomerInformation").find($("[name='MiddleName']")).attr("disabled", true);
            $("#CustomerInformation").find($("[name='LastName']")).attr("disabled", true);
            $("#CustomerInformation").find($("[name='FullName']")).attr("disabled", true);
        }
        else {
            $("#CustomerInformation").find($("[name='CompanyName']")).attr("disabled", true);
            $("#CustomerInformation").find($("[name='FirstName']")).removeAttr("disabled");
            $("#CustomerInformation").find($("[name='MiddleName']")).removeAttr("disabled");
            $("#CustomerInformation").find($("[name='LastName']")).removeAttr("disabled");
            $("#CustomerInformation").find($("[name='FullName']")).removeAttr("disabled");
        }
    });

}

function FetchGender() {
    $("#CustomerInformation").find($('[name="Gender"]')).empty();
    $("#CustomerInformation").find($('[name="Gender"]')).append("<option value='0'>--select Title--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchGender',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#CustomerInformation").find($('[name="Gender"]')).append("<option value='" + data[i].Id + "'>" + data[i].Gender1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchIDType() {
    $("#CustomerInformation").find($('[name="IDType"]')).empty();
    $("#CustomerInformation").find($('[name="IDType"]')).append("<option value='0'>--select Title--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchIDType',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#CustomerInformation").find($('[name="IDType"]')).append("<option value='" + data[i].Id + "'>" + data[i].IDType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchEmirate() {
    $("#CustomerInformation").find($('[name="Emirate"]')).empty();
    $("#CustomerInformation").find($('[name="Emirate"]')).append("<option value='0'>--select Emirate--</option>");
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
                        $("#CustomerInformation").find($('[name="Emirate"]')).append("<option value='" + data[i].Id + "'>" + data[i].City1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function FetchNationality() {
    $("#CustomerInformation").find($('[name="Nationality"]')).empty();
    $("#CustomerInformation").find($('[name="Nationality"]')).append("<option value='0'>--select Nationality--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchNationality',
        //data: JSON.stringify({ Id: $("#GeneralInformation").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#CustomerInformation").find($('[name="Nationality"]')).append("<option value='" + data[i].Id + "'>" + data[i].Nationality1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
