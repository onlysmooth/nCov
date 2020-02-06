$(function(){

    var china ={};

    var getColor = function(count){
        if (count > 5000)
            return '#420001'
        else if (count >2000)
            return '#590000'
        else if (count > 1000)
            return '#710000'
        else if (count > 500)
            return '#880000'
        else if (count > 200)
            return '#A00000'
        else if (count > 100)
            return '#B80000'
        else if (count > 90)
            return '#CF0000'
        else if (count > 80)
            return '#E70000'
        else if (count > 70)
            return '#FF0000'
        else if (count > 60)
            return '#FF1F1F'
        else if (count > 50)
            return '#FF3F3F'
        else if (count > 40)
            return '#FF5F5F'
        else if (count > 30)
            return '#FF7F7F'
        else if (count > 20)
            return '#FF9F9F'
        else if (count >= 10)
            return '#FFBFBF'
        else if (count > 0)
            return '#FFDFDF'
        return '#FFFFFF'
    }

    var getColorByProvince = function(name_chn) {
        var pros = china.children
        for (var i = pros.length - 1; i >= 0; i--) {
            if (name_chn.indexOf(pros[i].name) != -1) {
                return getColor(pros[i]['total']['confirm'])
            }
        }
    }


    var getColorByCity = function(city, cities) {
        for (var i = cities.length - 1; i >= 0; i--) {
            var name = cities[i].name == "恩施州" ? "恩施" : cities[i].name
            name = cities[i].name == "湘西自治州" ? "湘西" : cities[i].name
            name = cities[i].name == "黔南州" ? "黔南" : cities[i].name
            name = cities[i].name == "黔东南州" ? "黔东南" : cities[i].name
            name = cities[i].name == "黔西南州" ? "黔西南" : cities[i].name
            name = cities[i].name == "阿坝州" ? "阿坝" : cities[i].name
            name = cities[i].name == "海北州" ? "海北" : cities[i].name
            name = cities[i].name == "甘南州" ? "甘南" : cities[i].name
            name = cities[i].name == "伊犁州" ? "伊犁" : cities[i].name
            name = cities[i].name == "兴安盟乌兰浩特" ? "兴安盟" : cities[i].name
            name = cities[i].name == "德宏州" ? "德宏" : cities[i].name
            name = cities[i].name == "文山州" ? "文山" : cities[i].name
            name = cities[i].name == "楚雄州" ? "楚雄" : cities[i].name
            name = cities[i].name == "西双版纳州" ? "西双版纳" : cities[i].name
            name = cities[i].name == "昌江县" ? "昌江" : cities[i].name
            name = cities[i].name == "琼中县" ? "琼中" : cities[i].name
            name = cities[i].name == "保亭县" ? "保亭" : cities[i].name
            name = cities[i].name == "陵水县" ? "陵水" : cities[i].name
            if (city.indexOf(name) != -1) {
                return getColor(cities[i]['total']['confirm'])
            }
        }
        return '#FFFFFF'
    }

    var showProvince = function(adcode, province) {
        var pros = china.children
        var cities
        for (var i = pros.length - 1; i >= 0; i--) {
            if (province.indexOf(pros[i].name) != -1) {
                cities = pros[i].children
                break;
            }
        }

        updateProvince && updateProvince.setMap(null);
        updateProvince = new AMap.DistrictLayer.Province({
            zIndex: 12,
            adcode: [adcode],
            depth: 1,
            styles: {
                'fill': function (props) {
                    return getColorByCity(props.NAME_CHN, cities);
                },
                'province-stroke': 'white',
                'city-stroke': 'blue', // 中国地级市边界
                'county-stroke': 'rgba(227,227,227,0.5)' // 中国区县边界
            }
        });
        updateProvince.setMap(map)
    }

    var initCountry = new AMap.DistrictLayer.Country({
        zIndex:10,
        SOC:'CHN',
        depth:1,
        styles:{
            'nation-stroke':'#22ffff',
            'coastline-stroke':[0.85, 0.63, 0.94, 1],
            'province-stroke':'white',
            'city-stroke': 'rgba(255,255,255,0.5)',//中国特有字段
            'fill':function(props){//中国特有字段
               return 'rgb(227, 227, 227)'
            }
        }
    })

    var updateCountry = new AMap.DistrictLayer.Country({
        zIndex:10,
        SOC:'CHN',
        depth:1,
        styles:{
            'nation-stroke':'#22ffff',
            'coastline-stroke':[0.85, 0.63, 0.94, 1],
            'province-stroke':'white',
            'city-stroke': 'rgba(255,255,255,0.5)',//中国特有字段
            'fill':function(props){//中国特有字段
               return getColorByProvince(props.NAME_CHN) //getColorByDGP(props.adcode_pro)
            }
        }
    })
    var updateProvince;


    // 显示地图
    var map = new AMap.Map("container",{
            zooms: [3, 10],
            showIndoorMap:false,
            zoom: 3,
            isHotspot:false,
            touchZoomCenter:1,
            pitch: 0,
            layers:[
                initCountry,
                new AMap.TileLayer.Satellite()
            ],
            viewMode:'2D',
            resizeEnable: true,
            center: [105.00,32.0]
    })
    map.addControl(new AMap.Scale());
    map.on('click',function(e){
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(e.lnglat, function(status, result) {
            if (status === 'complete'&&result.regeocode) {
                map.setZoomAndCenter(5, e.lnglat);
                var adcode = parseInt(result.regeocode.addressComponent.adcode.slice(0,2))*10000
                var province = result.regeocode.addressComponent.province
                showProvince(adcode, province)
            }else{
                console.error('根据经纬度查询地址失败')
            }
        });
    })

    // 从腾讯平台获取数据
    $.ajax({
        url: 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5',
        type: 'get',
        dataType: 'jsonp',  // 返回的数据格式，常用的有是'json','html',"jsonp"
    }).done(function(resp) {     // 请求成功以后的操作
        var whole = $.parseJSON(resp.data)
        china = whole["areaTree"][0]
        updateCountry.setMap(map)
        $("#lastUpdateTime").text(whole["lastUpdateTime"]);
        $("#nConfirmAdd").text((whole["chinaAdd"]["confirm"]>0?"+":"")+whole["chinaAdd"]["confirm"]);
        $("#nConfirm").text(whole["chinaTotal"]["confirm"]);
        $("#nSuspectAdd").text((whole["chinaAdd"]["suspect"]>0?"+":"")+whole["chinaAdd"]["suspect"]);
        $("#nSuspect").text(whole["chinaTotal"]["suspect"]);
        $("#nHealAdd").text((whole["chinaAdd"]["heal"]>0?"+":"")+whole["chinaAdd"]["heal"]);
        $("#nHeal").text(whole["chinaTotal"]["heal"]);
        $("#nDeadAdd").text((whole["chinaAdd"]["dead"]>0?"+":"")+whole["chinaAdd"]["heal"]);
        $("#nDead").text(whole["chinaTotal"]["dead"]);
    }).fail(function(error) {    // 请求失败以后的操作
        console.log(error);
    });
})
