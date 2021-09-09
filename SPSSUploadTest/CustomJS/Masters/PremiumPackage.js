function initPage() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/GetMasterPremium',
        data: JSON.stringify({
            ID: 0
        }),
        dataType: 'json',
        cache: false,
        success: function (id) {
            var tbody1 = "";
            if (id.length > 0) {
                for (var i = 0; i < id.length; i++) {
                    tbody1 += '<tr><td><input type="hidden" value=' + id[i].Id + ' id="PremiumID" /></td><td>' + id[i].PremiumFactors + '</td><td><input type="text" value="0" id="txtAmt" class="form-control full-wth" /></td><td><select id="SelVariablesType"  class="ClsCommissionType"></select></td><td style="text-align:right"> <select id="SelVariables" multiple  class="ClsPremium"> </select></td><td></td></tr>';
                }
                $("#tblPrem tbody").html(tbody1);
                $("#tblPrem").DataTable({
                    responsive: true,
                    "paging": false
                });
            }

            $(".ClsCommissionType").html('');
            $(".ClsCommissionType").append('<option value="1">In Percent</option>')
            $(".ClsCommissionType").append('<option value="2">Fixed</option>')
            $(".ClsCommissionType").append('<option value="3">SUM</option>')

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/Masters/GetMasterPremium',
                data: JSON.stringify({
                    ID: 0
                }),
                dataType: 'json',
                cache: false,
                success: function (id) {

                    if (id.length > 0) {

                        $(".ClsPremium").html('');
                        $(".ClsPremium").append('<option value="-1" true >--Select-- </option>')
                        $(".ClsPremium").append('<option value="0">Sum Insured </option>')
                        for (var i = 0; i < id.length; i++) {
                            $(".ClsPremium").append("<option value=\"" + id[i].Id + "\">" + $.trim(id[i].PremiumFactors) + "</option>");
                            //$(".ClsPremium").append('<option value="1">In Percent</option>')
                            //$(".ClsPremium").append('<option value="2">Fixed</option>')
                            //$(".ClsPremium").append('<option value="3">SUM Of Variables</option>')
                        }
                        $('.ClsPremium option[value="-1"]').attr("selected", true);
                    }
                },
                error: function (result) {
                    alert(result.d);
                }
            });


        },
        error: function (result) {
            alert(result.d);
        }
    });


    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/GetPremiums',
        data: JSON.stringify({
            PName: ''
        }),
        dataType: 'json',
        cache: false,
        success: function (id) {
            // alert('bbbb');
            var tbody1 = "";
            if (id.length > 0) {

                // $("#divRateList").show();
                //$("#lblr").hide();

                for (var i = 0; i < id.length; i++) {

                    //  alert(id.d[i].Premium.replace(/\s/g, ""));
                    tbody1 += '<tr><td>' + id[i].Premium + '</td><td><button type="button" class="btn btn-primary"><i class="fa fa-edit" aria-hidden="true" onclick=Edit("' + id[i].Premium.replace(/\s/g, "") + '") ></i></button></td><td><button type="button" class="btn btn-primary"><i class="fa fa-trash" aria-hidden="true" onclick=Delete("' + id[i].Premium.replace(/\s/g, "") + '") ></i></button></td><td><button type="button" class="btn btn-primary"><i class="fa fa-eye" aria-hidden="true" onclick=View("' + id[i].Premium.replace(/\s/g, "") + '")></i></button></td></tr>';
                }
                $("#tblPremium tbody").html(tbody1);
                $("#tblPremium").DataTable({
                    responsive: true
                });
            } else {
            }
        },
        error: function (result) {
            alert(result.d);
        }
    });
    function myTrim(x) {
        return x.replace(/^\s+|\s+$/gm, '');
    }

    $("#tblPrem").on("change", "#SelVariablesType", function () {





        if ($(this).val() == "1") {


            $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", false);
            $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", false);

        }

        else if ($(this).val() == "2") {


            $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", true);
            $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", false);

        }
        else if ($(this).val() == "3") {

            $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", false);
            $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').val(0);
            $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", true);
        }

    });


    $("#tblPrem").on("change", "#SelVariables", function () {


        var VType = '';

        // alert($(this).val());

        var VID = $('#tblPrem').DataTable().cell($('#Indx').val(), 3).nodes().to$().find('#SelVariablesType').val();

        //   alert(VID);
        if (VID == "1") {

            VType = VType + $(this).val() + ',';

            // alert(VType);
            if ((VType.split(",").length - 1) > 1) {
                $(this).val([]);
                alert('Please select any one variable only');
                return;
            }
            //  $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", false);
            // $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", false);

        }

        //else if ($(this).val() == "2") {


        //    $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", true);
        //    $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", false);

        //}
        //else if ($(this).val() == "3") {

        //    $('#tblPrem').DataTable().cell($('#Indx').val(), 4).nodes().to$().find('#SelVariables').attr("disabled", false);
        //    $('#tblPrem').DataTable().cell($('#Indx').val(), 2).nodes().to$().find('#txtAmt').attr("disabled", true);
        //}

    });



    $("#tblPrem").on("change", "#txtAmt", function () {


        var VType = '';

        //   alert($(this).val());

        var VID = $('#tblPrem').DataTable().cell($('#Indx').val(), 3).nodes().to$().find('#SelVariablesType').val();

        //   alert(VID);
        if (VID == "1") {

            //VType = VType + $(this).val() + ',';

            //// alert(VType);
            if ($(this).val() > 100) {
                $(this).val(0);
                alert('Not more than 100, in case of percent');
                return;
            }


        }



    });



    $('#tblPrem tbody').on('click', 'tr', function () {


        $('#Indx').val($('#tblPrem').DataTable().row(this).index());
        //  alert('Row index: ' + $('#tblVariant').DataTable().row(this).index());
    });




    $("#btnsavePackage").click(function () {


        var Premium = '';
        var PTypes = '0';
        var PID = 0;
        var PAMT = 0.0;
        var PVariable = '-1';

        if ($('#txtpackage').val() == '') {
            alert('Please add Premium name');
            $('#txtpackage').focus();
            return;

        }
        var table = $('#tblPrem').DataTable();

        table.rows().eq(0).each(function (index) {
            PID = table.cell(index, 0).nodes().to$().find('input').val();
            Premium = table.cell(index, 1).data();
            PAMT = table.cell(index, 2).nodes().to$().find('input').val();
            PTypes = table.cell(index, 3).nodes().to$().find('select').val();
            PVariable = table.cell(index, 4).nodes().to$().find('select').val();

            //   PVariable='-1';

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/Masters/AddPackageRate',
                data: JSON.stringify({
                    ID: 0,
                    PID: PID,
                    Premium: $('#txtpackage').val(),
                    Amount: PAMT,
                    PType: PTypes,
                    VariableID: String(PVariable),
                    PremID: $('#txtpackage').val().replace(/\s/g, ""),
                    Action: "ADD"

                }),

                dataType: 'json',
                cache: false,
                success: function (id) {

                    if (id > 0) {
                        $("#preAdd").hide();
                        $("#tblpremium").show();
                        window.location.href = '/Masters/PremiumPackage';
                    }
                    //else if (id.d == '-1') {
                    //    alert('Premium already exists');
                    //    return;
                    //}
                    //else {
                    //    alert('Failed');
                    //    return;
                    //}

                },
                error: function (result) {
                    //  alert(result.d);
                }

            });

        });

        //alert(removeLastComma(Premium));
        //alert(PType);

        //$("#tblVariant").DataTable({
        //    responsive: false,
        //});

        //var PID = table.cell(J, 0).nodes().to$().find('input').val();
        //var Premium = table.cell(J, 1).data();
        //var PAMT = table.cell(J, 2).nodes().to$().find('input').val();
        //var PType = table.cell(J, 3).nodes().to$().find('select').val();
        //var PVariable = table.cell(J, 4).nodes().to$().find('select').val();

        //alert(Premium);

    });


    $("#btnAdd").click(function () {
        $("#preAdd").show();
        $("#tblpremium").hide();
        $("#btnUpdatePackage").hide();
        //$("#btnCanclePackage").hide();
        $("#btnsavePackage").show();
    });

    $("#btnCanclePackage").click(function () {
        window.location.href = '/Masters/PremiumPackage';
    });


    $("#btnUpdatePackage").click(function () {


        var Premium = '';
        var PTypes = '0';
        var PID = 0;
        var PAMT = 0.0;
        var PVariable = '-1';

        if ($('#txtpackage').val() == '') {
            alert('Please add Premium name');
            $('#txtpackage').focus();
            return;

        }
        var table = $('#tblPrem').DataTable();

        table.rows().eq(0).each(function (index) {
            PID = table.cell(index, 0).nodes().to$().find('input').val();
            Premium = table.cell(index, 1).data();
            PAMT = table.cell(index, 2).nodes().to$().find('input').val();
            PTypes = table.cell(index, 3).nodes().to$().find('select').val();
            PVariable = table.cell(index, 4).nodes().to$().find('select').val();

            //   PVariable='-1';

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/Masters/AddPackageRate',
                data: JSON.stringify({
                    ID: 0,
                    PID: PID,
                    Premium: $('#txtpackage').val(),
                    Amount: PAMT,
                    PType: PTypes,
                    VariableID: String(PVariable),
                    PremID: $('#txtpackage').val().replace(/\s/g, ""),
                    Action: "UPD"

                }),

                dataType: 'json',
                cache: false,
                success: function (id) {

                    if (id > 0) {
                        $("#preAdd").hide();
                        $("#tblpremium").show();
                        window.location.href = '/Masters/PremiumPackage';
                    }
                    //else if (id.d == '-1') {
                    //    alert('Premium already exists');
                    //    return;
                    //}
                    //else {
                    //    alert('Failed');
                    //    return;
                    //}

                },
                error: function (result) {
                    //  alert(result.d);
                }

            });

        });

        //alert(removeLastComma(Premium));
        //alert(PType);

        //$("#tblVariant").DataTable({
        //    responsive: false,
        //});

        //var PID = table.cell(J, 0).nodes().to$().find('input').val();
        //var Premium = table.cell(J, 1).data();
        //var PAMT = table.cell(J, 2).nodes().to$().find('input').val();
        //var PType = table.cell(J, 3).nodes().to$().find('select').val();
        //var PVariable = table.cell(J, 4).nodes().to$().find('select').val();

        //alert(Premium);

    });

}

function Delete(Package) {

    //  alert(Package);

    if (confirm("Are you sure want to delete?")) {


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Masters/AddPackageRate',
            data: JSON.stringify({
                ID: 0,
                PID: 0,
                Premium: Package,
                Amount: 0,
                PType: 0,
                VariableID: 0,
                PremID: "",
                Action: "DEL"

            }),

            dataType: 'json',
            success: function (id) {

                if (id > 0) {
                    $("#preAdd").hide();
                    $("#tblpremium").show();
                    window.location.href = '/Masters/PremiumPackage';
                }
                //else if (id.d == '-1') {
                //    alert('Premium already exists');
                //    return;
                //}
                //else {
                //    alert('Failed');
                //    return;
                //}

            },
            error: function (result) {
                alert(result.d);
            }

        });
    }



    // alert('In progress');
}

function Edit(Package) {

    //alert(Package);
    $("#btnUpdatePackage").show();
    //  $("#btnCanclePackage").show();
    $("#btnsavePackage").hide();

    $("#preAdd").show();
    $("#tblpremium").hide();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/GetPremiumView',
        data: JSON.stringify({
            PName: Package
        }),
        dataType: 'json',
        cache: false,
        success: function (id) {

            var tbody1 = "";
            if (id.length > 0) {


                // alert('Asif');
                $('#txtpackage').val(id[0].Package);
                $('#txtpackage').attr("disabled", true);
                var table = $('#tblPrem').DataTable();

                //table.rows().eq(0).each(function (index) {

                //  //  table.cell(index, 2).nodes().to$().find('input').val(140);
                //    //PID = table.cell(index, 0).nodes().to$().find('input').val();
                //    //Premium = table.cell(index, 1).data();
                //    //PAMT = table.cell(index, 2).nodes().to$().find('input').val();
                //    //PTypes = table.cell(index, 3).nodes().to$().find('select').val();
                //    //PVariable = table.cell(index, 4).nodes().to$().find('select').val();
                //});

                //for (j = 0; j < 5; j++) {
                //   // $('.ClsPremium option[value="' + j + '"]').attr("selected", true);

                //    table.cell(1, 4).nodes().to$().find('.ClsPremium option[value="' + j + '"]').attr("selected", true);
                //   // table.cell(1, 4).nodes().to$().find('.ClsPremium').val(3).attr("selected", true);
                //}



                for (var i = 0; i < id.length; i++) {


                    table.rows().eq(0).each(function (index) {


                        //  table.cell(index, 2).nodes().to$().find('input').val(140);
                        PID = table.cell(index, 0).nodes().to$().find('input').val();
                        //Premium = table.cell(index, 1).data();
                        //PAMT = table.cell(index, 2).nodes().to$().find('input').val();
                        //  PTypes = table.cell(index, 3).nodes().to$().find('select').val();
                        //PVariable = table.cell(index, 4).nodes().to$().find('select').val();
                        //   alert(PTypes);VariableID

                        if (id[i].PremiumID == PID) {

                            // $('#searchKeywords').val().split(",");
                            var VariableIDArr = id[i].VariableID.split(',');



                            table.cell(index, 2).nodes().to$().find('input').val(id[i].Rate);
                            table.cell(index, 3).nodes().to$().find('select').val(id[i].RateTypeID);
                            if (id[i].RateTypeID == 2)
                                table.cell(index, 4).nodes().to$().find('.ClsPremium option[value="-1"]').attr("selected", true);
                            else
                                table.cell(index, 4).nodes().to$().find('.ClsPremium option[value="-1"]').attr("selected", false);

                            for (j = 0; j < VariableIDArr.length; j++) {

                                table.cell(index, 4).nodes().to$().find('.ClsPremium option[value="' + VariableIDArr[j] + '"]').attr("selected", true);
                                //  $('.ClsPremium option[value="' + j + '"]').attr("selected", true);
                                //    alert(id.d[i].PremiumID);
                                //    alert(VariableIDArr[j]);
                                //   table.cell(index, 4).nodes().to$().find('.ClsPremium').val(2).attr("selected", true);
                                //  table.cell(index, 4).nodes().to$().find('.ClsPremium').val(3).attr("selected", true);
                                //table.cell(index, 4).nodes().to$().find('select').each(function (i, sel) {
                                //   $(sel).val().attr("selected", true);


                                //});
                                //table.cell(index, 4).nodes().to$().find('select').val(2).attr("selected", true);
                                //table.cell(index, 4).nodes().to$().find('select').val(4).attr("selected", true);
                                //table.cell(index, 4).nodes().to$().find('select').val(3).attr("selected", true);
                                // $('.ClsPremium option[value="3"]').attr("selected", true);
                            }


                            if (id[i].RateTypeID == "1") {


                                table.cell(index, 4).nodes().to$().find('select').attr("disabled", false);
                                table.cell(index, 2).nodes().to$().find('input').attr("disabled", false);

                            }

                            else if (id[i].RateTypeID == "2") {


                                table.cell(index, 4).nodes().to$().find('select').attr("disabled", true);
                                table.cell(index, 2).nodes().to$().find('input').attr("disabled", false);

                            }
                            else if (id[i].RateTypeID == "3") {

                                table.cell(index, 4).nodes().to$().find('select').attr("disabled", false);
                                //   table.cell(index, 2).nodes().to$().find('#txtAmt').val(0);
                                table.cell(index, 2).nodes().to$().find('input').attr("disabled", true);
                            }
                        }



                        //if (id.d[i].RateTypeID == "1") {


                        //    table.cell(index, 4).nodes().to$().find('select').attr("disabled", false);
                        //    table.cell(index, 2).nodes().to$().find('input').attr("disabled", false);

                        //}

                        //else if (id.d[i].RateTypeID == "2") {


                        //    table.cell(index, 4).nodes().to$().find('select').attr("disabled", true);
                        //    table.cell(index, 2).nodes().to$().find('input').attr("disabled", false);

                        //}
                        //else if (id.d[i].RateTypeID == "3") {

                        //    table.cell(index, 4).nodes().to$().find('select').attr("disabled", false);
                        // //   table.cell(index, 2).nodes().to$().find('#txtAmt').val(0);
                        //    table.cell(index, 2).nodes().to$().find('input').attr("disabled", true);
                        //}
                    });


                    //  alert(id.d[i].CustType);
                    //  tbody1 += '<tr><td>' + id.d[i].Premium + '</td><td>' + id.d[i].Rate + '</td><td>' + id.d[i].RateType + '</td><td>' + id.d[i].Variables + '</td></tr>';

                }

                //$("#tblPremView tbody").html(tbody1);
                //$("#tblPremView").DataTable({
                //    responsive: true,
                //    "bDestroy": true

                //});
            }
        },
        error: function (result) {
            alert(result.d);
        }
    });
    // alert('In Progress');
}

function View(Package) {
    //$('#ABC').click();
    $('#myModalPreview').bsModal('show');
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Masters/GetPremiumView',
        data: JSON.stringify({ PName: Package }),
        dataType: 'json',
        cache: false,
        success: function (id) {
            var tbody1 = "";
            if (id.length > 0) {
                for (var i = 0; i < id.length; i++) {
                    tbody1 += '<tr><td>' + id[i].Premium + '</td><td>' + id[i].Rate + '</td><td>' + id[i].RateType + '</td><td>' + id[i].Variables + '</td></tr>';
                }
                $("#tblPremView tbody").html(tbody1);
            }
        },
        error: function (result) {
            alert(result.d);
        }
    });
}

function removeLastComma(strng) {
    var n = strng.lastIndexOf(",");
    var a = strng.substring(0, n);
    return a;
}