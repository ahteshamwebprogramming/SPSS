function PopulateProjectVariables(data) {
    var tbody = "";
    $("#ProjectVariablesList").find($('[name="ProjectVariables"] tbody')).empty();
    for (var i = 0; i < data.length; i++) {
        tbody += '<tr><th scope="row" class="first"><input type="checkbox"></th><td>' + data[i].Variables + '</td><td>' + data[i].Typs + '</td><td>' + data[i].Labels + '</td><td>' + data[i].Measure + '</td></tr>';
    }
    $("#ProjectVariablesList").find($('[name="ProjectVariables"] tbody')).append(tbody);
}
function PopulateProjectValues(data) {
    var tbody = "";
    $("#ProjectValuesList").find($('[name="ProjectValues"] tbody')).empty();
    for (var i = 0; i < data.length; i++) {
        tbody += '<tr><th scope="row" class="first"><input type="checkbox"></th><td>' + data[i].Variables + '</td><td>' + data[i].Value + '</td><td>' + data[i].Labels + '</td></tr>';
    }
    $("#ProjectValuesList").find($('[name="ProjectValues"] tbody')).append(tbody);
}
function PopulateRespondentData(data, columns) {
    $("#RespondentsList").find($('[name="Respondents"]')).empty();
    var thead = "<thead><tr>";
    for (var i = 0; i < columns.length; i++) {
        thead += '<th>' + columns[i][i] + '</th>';
    }
    thead += "</tr></thead>";
    var tbody = "";
    for (var x = 0; x < data.length; x++) {
        tbody += '<tr>';
        for (var z = 0; z < columns.length; z++) {
            tbody += '<td>' + data[x][columns[z][z]] + '</td>';
        }
        tbody += '</tr>';
        //tbody += '<tr><td>' + data[i].Variables + '</td><td>' + data[i].Value + '</td><td>' + data[i].Labels + '</td></tr>';
    }
    $("#RespondentsList").find($('[name="Respondents"]')).append(thead + tbody);
}

function getProjectValues() {
    BlockUI();
    var formData = new FormData();
    formData.append("Id", $('#hfProjectId').val());
    $.ajax({
        type: 'POST',
        url: "/Project/GetProjectValues",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.status === 200) {
                var body = data.body;
                PopulateProjectValues(body);
                $(".next")[1].click();
            }
            else {
                $.alert(data.message);
            }
            UnblockUI();
        },
        error: function (result) {
            alert(result);
            UnblockUI();
        }
    });
}

function getRespondentData() {
    BlockUI();
    var formData = new FormData();
    formData.append("Id", $('#hfProjectId').val());
    $.ajax({
        type: 'POST',
        url: "/Project/GetRespondentData",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.status == 200) {
                var body = JSON.parse(data.body);
                var columns = JSON.parse(data.Columns);
                PopulateRespondentData(body, columns);
                $(".next")[2].click();
            }
            else {
                $.alert(data.message);
            }
            UnblockUI();
        },
        error: function (result) {
            alert(result);
            UnblockUI();
        }
    });
}