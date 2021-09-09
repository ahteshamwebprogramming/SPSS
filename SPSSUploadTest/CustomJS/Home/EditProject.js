function getEditProject(id) {
    // $('#editProjectModal').modal('show');
    return new Promise((resolve, reject) => {
        var formData = {};
        formData["Id"] = 1;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Project/GetProject',
            data: JSON.stringify({ Id: id }),
            cache: false,
            dataType: "html",
            success: function (data, textStatus, jqXHR) {
                $("#div_EditProject").html(data);
                $('#openEditProject').click();
            },
            error: function (result) {
                alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
            }
        });
    });
}
function UpdateProject() {
    var formData = GetFormControlsById("ProjectUpdateForm");
    $.ajax({
        type: 'POST',
        url: "/Project/UpdateProject",
        data: JSON.stringify({ formData }),
        cache: false,
        contentType: "application/json; charset=utf-8",
        processData: false,
        success: function (data) {
            if (data.status == 200) {
                $.alert("Project Updated Successfully");
                $("#closeEditProject").click();
                searchProject();
            }
            else {
                $.alert(data.message);
            }
        },
        error: function (result) {
            $.alert("There is some error while updating the project");
        }
    });

}