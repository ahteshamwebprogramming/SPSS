function FetchProductType() {
    $("#Section_1").find($('[name="ProductType"]')).empty();
    $("#Section_1").find($('[name="ProductType"]')).append("<option value='0'>--search Product Type--</option>");
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/QuotationRegistration/FetchProductType',
        data: JSON.stringify({ Id: $("#Section_1").find($('[name="Product"]')).val() }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $("#Section_1").find($('[name="ProductType"]')).append("<option value='" + data[i].Id + "'>" + data[i].ProductType1 + "</option>");
                    }
                }
            }
        },
        error: function (result) {
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}