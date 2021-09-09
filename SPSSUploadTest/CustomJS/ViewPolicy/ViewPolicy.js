function FetchData() {
    BlockUI();
    var Id = $('#hfPolicyId').val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ViewPolicy/GetPolicyDetails',
        data: JSON.stringify({ PolicyId: Id }),
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                PopulateData(data);
                $('#CustomerInformation').find('[name="POBox"]').val(data['CPOBox']);

            }
            UnblockUI();
        },
        error: function (result) {
            UnblockUI();
            alert('Status ' + result.status + ' : ' + result.statusText + ' error :' + result.responseText);
        }
    });
}
function PopulateData(srcData) {
    var formData = {};
    var allCtrl = $('#AddNewForm').find(jQuery('[name]'));
    allCtrl.each(function (i) {
        var curCtrl = jQuery(this);
        if (curCtrl[0].tagName == 'LABEL')
            curCtrl.text(srcData[curCtrl.attr('name')]);
        else if (curCtrl[0].tagName == 'SELECT') {
            curCtrl.dropdown("set selected", srcData[curCtrl.attr('name')]);
        }
        else if (curCtrl[0].classList.contains('dateformat')) {
            //curCtrl.val(srcData[0][curCtrl.attr('name')]);
            if (srcData[curCtrl.attr('name')] != null)
                curCtrl.val(moment(new Date(parseInt(srcData[curCtrl.attr('name')].replace(/[^0-9 +]/g, '')))).format('DD/MM/YYYY'));
        }
        else
            curCtrl.val(srcData[curCtrl.attr('name')]);
    });
    return formData;
}