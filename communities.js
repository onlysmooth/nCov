$(function () {

    // 显示地图
    var cmap = new AMap.Map("communities", {
        resizeEnable: true,
        center: [121.50, 29.7],
        zoom: 9,
        mapStyle: "amap://styles/whitesmoke"
    });

    var marker = new AMap.Marker({
        offset: new AMap.Pixel(-170, -10),
    });

    var showMarkers = function (data) {
        for (var i = 0; i < data.length; i++) {
            var position = data[i].position;
            var cdata = {
                position: position,
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                title: data[i].detail
            };

            var labelMarker = new AMap.Marker(cdata);
            labelMarker.on('click', function (e) {
                marker.setContent(
                    '<div class="amap-info-window">'
                    + e.target.getTitle() +
                    '<div class="amap-info-sharp"></div>' +
                    '</div>');
                marker.setPosition(e.lnglat);
                cmap.add(marker);
            })
            cmap.add(labelMarker)
        }
    }

    // 
    $.ajax({
        url: 'https://lab.ahusmart.com/nCoV/api/detail',
        type: 'get',
        dataType: 'json',  // 返回的数据格式，常用的有是'json','html',"jsonp"
        data: {
            privince: '浙江省',
            city: '宁波市'
        },
    }).done(function (resp) {     // 请求成功以后的操作
        showMarkers(resp.results)
    }).fail(function (error) {    // 请求失败以后的操作
        console.log(error);
    });
})
