$(document).ready(function () {
    $('.numeric').forceNumeric();
    $('.numeric1').forceNumeric1();
});
function FetchUser() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: 'Dashboard.aspx/GetUsers1',
        // data: JSON.stringify({ TID: StudId }),
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.d.length > 0) {
                //sessionStorage.setItem("UserName", data.d[0].UserName);
                sessionStorage.setItem("UserId", data.d[0].UserId);
            }
        },
        error: function (result) {
            alert(result.d);
        }
    });
}
var myspinner = '<div class="load"><div class="gear one"><svg id="blue" viewbox="0 0 100 100" fill="#94DDFF"><path d="M97.6,55.7V44.3l-13.6-2.9c-0.8-3.3-2.1-6.4-3.9-9.3l7.6-11.7l-8-8L67.9,20c-2.9-1.7-6-3.1-9.3-3.9L55.7,2.4H44.3l-2.9,13.6c-3.3,0.8-6.4,2.1-9.3,3.9l-11.7-7.6l-8,8L20,32.1c-1.7,2.9-3.1,6-3.9,9.3L2.4,44.3v11.4l13.6,2.9c0.8,3.3,2.1,6.4,3.9,9.3l-7.6,11.7l8,8L32.1,80c2.9,1.7,6,3.1,9.3,3.9l2.9,13.6h11.4l2.9-13.6c3.3-0.8,6.4-2.1,9.3-3.9l11.7,7.6l8-8L80,67.9c1.7-2.9,3.1-6,3.9-9.3L97.6,55.7zM50,65.6c-8.7,0-15.6-7-15.6-15.6s7-15.6,15.6-15.6s15.6,7,15.6,15.6S58.7,65.6,50,65.6z"></path></svg></div><div class="gear two"><svg id="pink" viewbox="0 0 100 100" fill="#FB8BB9"><path d="M97.6,55.7V44.3l-13.6-2.9c-0.8-3.3-2.1-6.4-3.9-9.3l7.6-11.7l-8-8L67.9,20c-2.9-1.7-6-3.1-9.3-3.9L55.7,2.4H44.3l-2.9,13.6c-3.3,0.8-6.4,2.1-9.3,3.9l-11.7-7.6l-8,8L20,32.1c-1.7,2.9-3.1,6-3.9,9.3L2.4,44.3v11.4l13.6,2.9c0.8,3.3,2.1,6.4,3.9,9.3l-7.6,11.7l8,8L32.1,80c2.9,1.7,6,3.1,9.3,3.9l2.9,13.6h11.4l2.9-13.6c3.3-0.8,6.4-2.1,9.3-3.9l11.7,7.6l8-8L80,67.9c1.7-2.9,3.1-6,3.9-9.3L97.6,55.7zM50,65.6c-8.7,0-15.6-7-15.6-15.6s7-15.6,15.6-15.6s15.6,7,15.6,15.6S58.7,65.6,50,65.6z"></path></svg></div><div class="gear three"><svg id="yellow" viewbox="0 0 100 100" fill="#FFCD5C"><path d="M97.6,55.7V44.3l-13.6-2.9c-0.8-3.3-2.1-6.4-3.9-9.3l7.6-11.7l-8-8L67.9,20c-2.9-1.7-6-3.1-9.3-3.9L55.7,2.4H44.3l-2.9,13.6c-3.3,0.8-6.4,2.1-9.3,3.9l-11.7-7.6l-8,8L20,32.1c-1.7,2.9-3.1,6-3.9,9.3L2.4,44.3v11.4l13.6,2.9c0.8,3.3,2.1,6.4,3.9,9.3l-7.6,11.7l8,8L32.1,80c2.9,1.7,6,3.1,9.3,3.9l2.9,13.6h11.4l2.9-13.6c3.3-0.8,6.4-2.1,9.3-3.9l11.7,7.6l8-8L80,67.9c1.7-2.9,3.1-6,3.9-9.3L97.6,55.7zM50,65.6c-8.7,0-15.6-7-15.6-15.6s7-15.6,15.6-15.6s15.6,7,15.6,15.6S58.7,65.6,50,65.6z"></path></svg></div></div>';
var myspinner1 = '<div class="spinner-border" style="width: 15rem; height: 15rem; font-size: 40px; color: #49274a"></div>';
//$.blockUI({ message: myspinner1 });
// $.unblockUI();
function BlockUI() {
    $.blockUI({ message: myspinner1 });
}
function UnblockUI() {
    $.unblockUI();
}
function ClearSession() {
    sessionStorage.removeItem("GroupID");
    sessionStorage.removeItem("WantToCopy")    //1 for yes and 2 for no
    sessionStorage.removeItem("GroupName");
    sessionStorage.removeItem("Operation"); //Update,Insert
}

function GetFormData() {
    var formData = {};
    var allCtrl = jQuery("[id^=ctrl_]");
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        formData[curCtrl.attr('dbcol')] = curCtrl.val();
    });
    return formData;
}
function GetFormControls() {
    var formData = {};
    var allCtrl = jQuery('[name]');
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        formData[curCtrl.attr('name')] = curCtrl.val();

    })
    return formData;
}
function GetFormControlsById(Id) {
    var formData = {};
    var allCtrl = $('#' + Id).find(jQuery('[name]'));
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].tagName == 'TEXTAREA')
            formData[curCtrl.attr('name')] = curCtrl[0].value;
        else
            formData[curCtrl.attr('name')] = curCtrl.val();

    })
    return formData;
}

function GetFormServerControlsById(Id) {
    var formData = new FormData();
    var allCtrl = $('#' + Id).find(jQuery('[name]'));
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].type == 'checkbox') {
            if ($(curCtrl).is(":checked")) {
                formData.append(curCtrl.attr('name'), "1");
            }
            else {
                formData.append(curCtrl.attr('name'), "0");
            }
        }
        else if (curCtrl[0].tagName == 'SPAN') {
            formData.append(curCtrl.attr('name'), curCtrl.html());
        }
        else if (curCtrl[0].tagName == 'H2') {
            formData.append(curCtrl.attr('name'), curCtrl.html());
        }
        else {
            formData.append(curCtrl.attr('name'), curCtrl.val());
        }
    });
    return formData;
}
function GetFormControlsByMultipleIds(Ids) {

    var arrId = Ids.split(",");
    var formData = new FormData();
    for (var j = 0; j < arrId.length; j++) {
        var allCtrl = $('#' + arrId[j]).find(jQuery('[name]'));
        allCtrl.each(function (i) {
            var curCtrl = jQuery(this);
            if (curCtrl[0].type == 'checkbox') {
                if ($(curCtrl).is(":checked")) {
                    formData.append(curCtrl.attr('name') + "_" + arrId[j], "1");
                }
                else {
                    formData.append(curCtrl.attr('name') + "_" + arrId[j], "0");
                }
            }
            else if (curCtrl[0].tagName == 'SPAN') {
                formData.append(curCtrl.attr('name') + "_" + arrId[j], curCtrl.html());
            }
            else if (curCtrl[0].tagName == 'H2') {
                formData.append(curCtrl.attr('name') + "_" + arrId[j], curCtrl.html());
            }
            else if (curCtrl[0].tagName == 'SELECT') {
                formData.append(curCtrl.attr('name') + "_" + arrId[j], curCtrl.val() == null ? 0 : curCtrl.val());
            }
            else {
                formData.append(curCtrl.attr('name') + "_" + arrId[j], curCtrl.val());
            }
        });
    }






    return formData;
}

function GetFormDataForRadio() {
    var formData = {};
    var allCtrl = jQuery("[id^=ctrl_]");
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        formData[curCtrl.attr('dbcol')] = curCtrl.val();
    });
    //  radiobuttonvalue();
    return formData;
}

function radiobuttonvalueId(name) {
    var formData = {};
    if ($('input:radio[name=' + name + ']').eq(0).is(':checked') === true) {
        return 1;
    }
    else
        return 0;
}


function radiobuttonvalue() {
    var formData = {};
    if ($('input:radio[name=ctrl_Completed]').eq(0).is(':checked') === true) {
        formData["Completed"] = 'Yes';
    }
    else
        formData["Completed"] = 'No';
    if ($('input:radio[name=ctrl_Filed]').eq(0).is(':checked') === true) {
        formData["Filed"] = 'Yes';
    }
    else
        formData["Filed"] = 'No';
    if ($('input:radio[name=ctrl_Printed]').eq(0).is(':checked') === true) {
        formData["Printed"] = 'Yes';
    }
    else
        formData["Printed"] = 'No';
    if ($('input:radio[name=ctrl_ClientSigned]').eq(0).is(':checked') === true) {
        formData["ClientSigned"] = 'Yes';
    }
    else
        formData["ClientSigned"] = 'No';


}
function PopulateFormControl(srcData) {
    var formData = {};
    var allCtrl = jQuery("[id^=ctrl_]")
    // populateradiolegalbond(srcData);

    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].tagName == 'LABEL')
            curCtrl.text(srcData[0][curCtrl.attr('dbcol')]);
        else
            curCtrl.val(srcData[0][curCtrl.attr('dbcol')]);
    });
    //if (srcData[0].DepartmentName == 'Others') {
    //    $('#ctrl_DepartmentName').text(srcData[0].DepartmentName + '(' + srcData[0].txtDepartment + ')');
    //}
    return formData;
}
function PopulateFormControlByParentId(srcData, ParentId) {
    var formData = {};
    //var allCtrl = jQuery("[id^=ctrl_]");
    var allCtrl = $('#' + ParentId).find(jQuery('[name]'));
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].tagName == 'LABEL')
            curCtrl.text(srcData[0][curCtrl.attr('name')]);
        else if (curCtrl[0].tagName == 'SELECT') {
            curCtrl.dropdown("set selected", srcData[0][curCtrl.attr('name')]);
        }
        else if (curCtrl[0].classList.contains('dateformat')) {
            //curCtrl.val(srcData[0][curCtrl.attr('name')]);
            curCtrl.val(moment(new Date(parseInt(srcData[0][curCtrl.attr('name')].replace(/[^0-9 +]/g, '')))).format('DD/MM/YYYY'));
        }
        else
            curCtrl.val(srcData[0][curCtrl.attr('name')]);
    });
    return formData;
}
function ClearFormData() {
    var allCtrl = jQuery("[id^=ctrl_]")
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl.attr('dbcol') != "")
            curCtrl.val('');
    });
}
function SetMaxLengthMsg(ctrl, maxLenght) {
    ctrlName = jQuery("#" + ctrl);
    var maxLength = ctrlName.attr("maxlength");
    ctrlName.after("<div><span id='remainingLengthTempId'>"
        + maxLength + "</span> remaining</div>");

    ctrlName.bind("keyup change", function () { checkMaxLength(this.id, maxLength); })
}

function alertt(message1, message2, message3) {
    //swal(
    //    message1,
    //    message2,
    //    message3
    //);

    new PNotify({
        title: message1,
        text: message2,
        type: message3,
        styling: 'bootstrap3'
    });

}
function success(message, typee) {

    new PNotify({
        title: 'Alert!!!',
        text: message,
        type: typee,
        styling: 'bootstrap3'
    });
    //swal({
    //    position: 'top-center',
    //    type: typee,
    //    title: message,
    //    showConfirmButton: false,
    //    timer: 1000
    //});
}

var uploadFile1 = function (ID, DType, filePath, elementID) {
    //var fileToUpload = filePath;
    var fileToUpload = getNameFromPath(filePath);
    //var filename = fileToUpload.substr(0, (fileToUpload.lastIndexOf('.')));
    var filename = fileToUpload.substr((fileToUpload.lastIndexOf('.') + 1));
    if (checkFileExtension(fileToUpload)) {
        var flag = true;
        var counter = 1 // $('#hdnCountFiles').val();
        if (filename != "" && filename != null) {
            //Check duplicate file entry
            for (var i = 1; i <= counter; i++) {
                var hdnDocId = "#hdnDocId_" + i;
                if ($(hdnDocId).length > 0) {
                    var mFileName = "#lblfilename_" + i;
                    if ($(mFileName).html() == filename) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag == true) {
                $("#loading").ajaxStart(function () {
                    $(this).show();
                }).ajaxComplete(function () {
                    $(this).hide();
                    return false;
                });
                var urls = 'FileUpload.ashx?id=' + ID + '&dtype=' + DType /// <reference path="../PhotoUpload.ashx" />
                $.ajaxFileUpload({
                    url: urls,
                    secureuri: false,
                    fileElementId: elementID,
                    dataType: 'json',
                    success: function (data, status) {

                    },
                    error: function (data, status, e) {

                    }
                });
            }
            else {
                alert('file ' + filename + ' already exist')

                return false;
            }
        }
    }
    else {
        // alert('You can upload only pdf,doc,docx,txt,zip,xls extensions files.');
        alert('incorrect format');
    }
    return false;
}

function checkFileExtension(file) {
    var flag = true;
    var extension = file.substr((file.lastIndexOf('.') + 1));
    extension = extension.toUpperCase();
    switch (extension) {
        case 'JPG':
        case 'JPEG':
        case 'PNG':
        case 'GIF':

            flag = true;
            break;
        default:
            flag = false;
    }

    return flag;
}
function getNameFromPath(strFilepath) {
    // alert(strFilepath);
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);

    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }
}
function logout() {
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "Login.aspx/clearsession",
        cache: false,
        datatype: "json",

        success: function () {
            //alert("success");
            window.location.replace("../Login.aspx");
        },
        error: function () {
            //  alert("error while logging out")
        }
    });
    //  $.session.remove("Username");
    //  window.location.href = "Login.aspx";
}

function ClearValidatorAlertMessages() {
    var allCtrl = jQuery("[id^=ctrl_]");
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if ($('#' + curCtrl[0].id).parent().parent()[0].lastChild.className == 'alert') {
            $('#' + curCtrl[0].id).parent().parent()[0].lastChild.remove()
        }
        //alert($('#' + curCtrl[0].id).parent().parent()[0].lastChild);
    });
}

function PostData(alldata, URL) {
    return $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: URL,
        data: JSON.stringify({ formData: alldata }),
        async: false,
        cache: false,
        dataType: "json",
        async: false,
        success: function (data) {
            callback = data;
        },
        error: function (result) {
            if (result.status == 200)
                alert('Please check your internet connection');
            else
                success('errorrrrrrrrr' + URL, 'error');
        }
    });
}
function PostRequest(loadUrl, InputData, callback, method) {
    jQuery.ajax({
        type: method,
        contentType: "application/json; charset=utf-8",
        url: loadUrl,
        // url:"QuestionnaireForm/DropDownPopulate",
        data: InputData,
        cache: false,
        dataType: "json",
        success: function (response) {
            callback(response);
        },
        error: function (result) {
            if (result.status == 200) {
                alert(loadUrl + ': Please check your internet connection');
            }
            else {
                alert(loadUrl + '//////////' + InputData);
                alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
            }
        }
    });

}

function GetData(URL) {
    return $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: URL,
        // data: JSON.stringify({ FormData: alldata }),
        async: false,
        cache: false,
        dataType: "json",
        async: false,
        success: function (data) {
            callback = data;
        },
        error: function (result) {
            success('error', 'error')
        }
    });
}
function SetDropDown(id, value) {
    $('#' + id).dropdown('set selected', value);
}
function GetCurrentDateTime() {
    var d = new Date();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    //15 - NOV - 2018 23: 35
    var hrs = d.getHours().toString();
    var mns = d.getMinutes().toString();
    if (d.getHours().toString().length < 2) {
        hrs = '0' + d.getHours().toString();
    }
    if (d.getMinutes().toString().length < 2) {
        mns = '0' + d.getMinutes().toString();
    }
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear().toString().substr(-2);
}



function JSONToExcelWithDelete(JSONData, ReportTitle, ShowLabel, sColToDelete, header) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = "<html><head>" + header + "</head><table border='1'>";

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "<thead><tr style='background-color:Green'>";

        //This loop will extract the label from 1st index of on array

        for (var index in arrData[0]) {
            if (sColToDelete.indexOf(',' + index + ',') >= 0)
                delete arrData[0][index]
            else
                row += "<th>" + index + "</th>";
        }

        //        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "</tr></thead>";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {

            if (sColToDelete.indexOf(',' + index + ',') >= 0)
                delete arrData[i][index]
            else
                row += "<td>" + arrData[i][index] + "</td>";
        }

        //        row.slice(0, row.length - 1);      
        CSV += row + "</tr>"
    }
    CSV += "</table></html>";
    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    var fileName = ReportTitle;
    var uri = "data:application/vnd.ms-excel," + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function JSONToExcelWithSelected(JSONData, ReportTitle, ShowLabel, sColToShow) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = "<html><head></head><table>";

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "<thead><tr>";

        //This loop will extract the label from 1st index of on array

        for (var index in arrData[0]) {
            if (sColToShow.indexOf(',' + index + ',') >= 0)
                row += "<th>" + index + "</th>";


        }

        //        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "</tr></thead>";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {

            if (sColToShow.indexOf(',' + index + ',') >= 0)
                row += "<td>" + arrData[i][index] + "</td>";
        }

        //        row.slice(0, row.length - 1);      
        CSV += row + "</tr>"
    }
    CSV += "</table></html>";
    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    var fileName = ReportTitle;
    var uri = "data:application/vnd.ms-excel," + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




//////////////////////////////for fetching menu items


function GetData(URL) {
    return $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: URL,
        // data: JSON.stringify({ FormData: alldata }),
        async: false,
        cache: false,
        dataType: "json",
        async: false,
        success: function (data) {
            callback = data;
        },
        error: function (result) {
            success('error', 'error')
        }
    });
}

function MastInput(input) {
    if ($.trim(input) != "")
        return "  <i>(" + input + ") </i>";
    else
        return "";
}

function FetchMenuItemsFromSession(parentid, menuid) {
    // debugger;
    jQuery('#spanUserName').text(sessionStorage.getItem("EmployeeName"));
    // alert('Location Page');
    var data = sessionStorage.getItem('Menuitems');
    var data1 = sessionStorage.getItem('Menuitems');
    var data2 = sessionStorage.getItem('Menuitems');
    //alert(data);
    for (var x = 0; x < jQuery.parseJSON(data).length; x++) {
        //   debugger;
        if (jQuery.parseJSON(data)[x].ParentMenuID == '0') {
            if (parentid == jQuery.parseJSON(data)[x].MenuID) {
                jQuery("#ulMain").append('<li><a href=' + jQuery.parseJSON(data)[x].PageLink + '><i class="fa ' + jQuery.parseJSON(data)[x].imagePath + '"></i><span class="title">' + jQuery.parseJSON(data)[x].MenuName + ' <span class="arrow"></span></a><ul class="sub-menu" id=MenuHeader' + x + '></ul></li>');
            }
            else {
                // jQuery("#ulMain").append('<li class="start active"><a href=' + jQuery.parseJSON(data)[x].PageLink + '><i class="fa fa-chevron-down"></i><span class="title">' + jQuery.parseJSON(data)[x].MenuName + ' </span>  <span class="selected"></span>  </a><ul class="sub-menu" style="display: block;" id=MenuHeader' + x + '></ul></li>');


                jQuery("#ulMain").append('<li class=""><a href="#"><i class="fa fa-edit"></i>' + jQuery.parseJSON(data)[x].MenuName + '<span class="' + jQuery.parseJSON(data)[x].imagePath + '"></span></a><ul class="nav child_menu" id=MenuHeader' + x + '></ul> </li >');
            }
            for (var y = 0; y < jQuery.parseJSON(data1).length; y++) {
                //  debugger;
                if (jQuery.parseJSON(data)[x].MenuID == jQuery.parseJSON(data1)[y].ParentMenuID) {

                    if (menuid == jQuery.parseJSON(data1)[y].MenuID) {
                        jQuery("#MenuHeader" + y).append('<li><a href="' + jQuery.parseJSON(data1)[y].PageLink + '">' + jQuery.parseJSON(data1)[y].MenuName + ' </a></li>');
                    }
                    else {
                        //   jQuery("#MenuHeader" + x).append('<li><a href=' + jQuery.parseJSON(data1)[y].PageLink + '>' + jQuery.parseJSON(data1)[y].MenuName + '<span class="fa fa-chevron-down"></span></a><ul class="sub-menu " id=SubMenuHeader' + y + '></ul></li>');

                        jQuery("#MenuHeader" + x).append('<li><a href=' + jQuery.parseJSON(data1)[y].PageLink + '>' + jQuery.parseJSON(data1)[y].MenuName + '<span class="' + jQuery.parseJSON(data1)[y].imagePath + '"></span></a> <ul class="nav child_menu" id=SubMenuHeader' + y + '></ul></li>');
                    }
                    for (var z = 0; z < jQuery.parseJSON(data2).length; z++) {
                        //   debugger;
                        if (jQuery.parseJSON(data)[y].MenuID == jQuery.parseJSON(data)[z].ParentMenuID) {
                            if (menuid == jQuery.parseJSON(data2)[z].MenuID) {
                                jQuery("#SubMenuHeader" + y).append('<li><a href="' + jQuery.parseJSON(data2)[z].LinkURL + '">' + jQuery.parseJSON(data2)[z].MenuName + ' </a></li>');
                            }
                            else {
                                //  jQuery("#SubMenuHeader" + y).append('<li><a href=' + jQuery.parseJSON(data2)[z].PageLink + '><i class="fa ' + jQuery.parseJSON(data2)[z].imagePath + '"></i>&nbsp;<span class="title ">' + jQuery.parseJSON(data2)[z].MenuName + ' </span> </a></li>');
                                jQuery("#SubMenuHeader" + y).append('<li><a href="' + jQuery.parseJSON(data2)[z].PageLink + '">' + jQuery.parseJSON(data2)[z].MenuName + '</a></li>');
                            }
                        }
                    }
                }
            }
        }
    }
}

function getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (i = 0; i < array.length; i++) {
        if (uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}


jQuery.fn.forceNumeric = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                key >= 48 && key <= 57 ||
                //Numeric keypad
                key >= 96 && key <= 105 ||
                // comma, period and minus, . on keypad
                //key == 190 || key == 188 || key == 109 || key == 110 ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Home and End
                key == 35 || key == 36 ||
                // left and right arrows
                key == 37 || key == 39 //||
                // Del and Ins
                //key == 45
            )
                return true;

            return false;
        });
    });
}
jQuery.fn.forceNumeric1 = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                key >= 48 && key <= 57 ||
                //Numeric keypad
                key >= 96 && key <= 105 ||
                // comma 
                //key == 188 || 
                //period 
                key == 190 ||
                //minus, .on keypad
                //key == 109 || key == 110 ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Home and End
                key == 35 || key == 36 ||
                // left and right arrows
                key == 37 || key == 39 //||
                // Del and Ins
                //key == 45
            )
                return true;

            return false;
        });
    });
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addMonths(date, months) {
    var result = new Date(date);
    result.setMonth(result.getMonth() + parseInt(months));
    return result;
}