function Initialise() {
    $('[name="AddProject"]').click(() => {
        window.location.href = "/Project/AddProject";
    });
    $('#SearchProject').keyup(() => {
        searchProject();
    });
}


var searchProject = () => {
    var projectName = $('#SearchProject').val();
    var formData = new FormData();
    formData.append("projectName", projectName);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Home/SearchProject',
        data: JSON.stringify({ ProjectName: projectName }),
        cache: false,
        dataType: "html",
        success: function (data, textStatus, jqXHR) {
            $("#div_ProjectGrids").html(data);
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}

