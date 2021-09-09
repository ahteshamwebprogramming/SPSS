function Initialise() {


    $('#AddProjectForm').find('[name="CreateProject"]').click((e) => {
        BlockUI();
        e.preventDefault();
        CreateProject().then(() => {
            UnblockUI();
            window.location.href = "/Home/Home";
        }).catch(() => {
            UnblockUI();
        });
    });

}


function CreateProject() {
    return new Promise((resolve, reject) => {
        var formData = GetFormServerControlsById("AddProjectForm");
        //var fileUpload = $("#AddProjectForm").find($('[name="File"]')).get(0);
        //var files = fileUpload.files;
        //formData.append("File", files[0]);
        $.ajax({
            type: 'POST',
            url: '/Project/CreateProject',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != null) {
                    data = response.split("_");
                    if (data[0] === "error") {
                        $.alert(data[1]);
                        reject();
                    }
                    else if (data[0] === "success") {
                        $.alert("Project Created Successfully");
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            },
            error: function (error) {
                reject();
            }
        });
    });
}