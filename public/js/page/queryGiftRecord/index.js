require('jquery');


$('#query').click(function () {
    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    query(startTime, endTime);
});
function query(startTime, endTime) {
    $('.pure-table').show();
    $.ajax('http://221.228.86.207:8200/stastic/query_gift_record', {
        'dataType': "jsonp",
        'data': {
            data: JSON.stringify({"start_time": startTime, "end_time": endTime})
        }
    }).then(function (res) {
        console.log(res.data);

        $('thead tr,tbody tr').remove();


        var totalData = res.data.TotalRecord;
        var dailyData = res.data.DailyRecord;
        var theadStr = '';
        var totalStr = '';
        var totalNum = [];

        for (var i = 0; i < totalData.length; i++) {
            theadStr += '<th>' + totalData[i].pack_id + '</th>';
            totalNum.push(totalData[i].total_num)
        }
        for (var i = 0; i < totalNum.length; i++) {
            totalStr += '<td>' + totalNum[i] + '</td>';
        }
        $('.pure-table tbody').append(
            '<tr><td>总计</td>' + totalStr + '</tr>'
        )
        $('.pure-table thead').html('<tr><td>礼物ID</td>' + theadStr + '</tr>');
        dailyData.forEach(function (val) {

            var time = val.Date;
            var dailyStr = '';
            if (val.OneDayRecord != null) {
                for (var i = 0; i < val.OneDayRecord.length; i++) {
                    dailyStr += '<td>' + val.OneDayRecord[i].total_num + '</td>'
                }
                $('.pure-table tbody').append(
                    '<tr><td>' + time + '</td>' + dailyStr + '</tr>'
                )

            }

        })

    })
}

