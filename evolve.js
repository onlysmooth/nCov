$(function () {

    var whole
    var confirmed = {}
    var getLevel = function(count){
        if (count > 5000)
            return 16
        else if (count >2000)
            return 15
        else if (count > 1000)
            return 14
        else if (count > 500)
            return 13
        else if (count > 200)
            return 12
        else if (count > 100)
            return 11
        else if (count > 90)
            return 10
        else if (count > 80)
            return 9
        else if (count > 70)
            return 8
        else if (count > 60)
            return 7
        else if (count > 50)
            return 6
        else if (count > 40)
            return 5
        else if (count > 30)
            return 4
        else if (count > 20)
            return 3
        else if (count >= 5)
            return 2
        else if (count > 0)
            return 1
        return 0
    }

    // 显示地图
    var emap = new AMap.Map("evolve", {
        resizeEnable: true,
        center: [104.00, 37.0],
        zoom: 3.5
    });

    var heatmap
    emap.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(emap, {
            radius: 30, //给定半径
            opacity: [0, 0.8],
            // gradient:{
            //     0.5: '#AAAAAA',
            //     0.65:'#777777',
            //     0.7: '#444444',
            //     0.9: '#111111',
            //     1.0: 'black'
            // }
            gradient: {
                0.0625: '#FFBFBF',
                0.125: '#FF9F9F',
                0.1875: '#FF7F7F',
                0.25: '#FF5F5F',
                0.3125: '#FF3F3F',
                0.375: '#FF1F1F',
                0.4375: '#FF0000',
                0.5: '#E70000',
                0.5625: '#CF0000',
                0.625: '#B80000',
                0.6875: '#A00000',
                0.8125: '#880000',
                0.875: '#710000',
                0.9375: '#590000',
                1.0: '#420000'
            }
        });
    });

    var getCitiesCountByDate = function (area, year, month, day) {
        var points = []
        for (let index = 0; index < area.length; index++) {
            const element = area[index];
            if (element.country == '中国' && ('cities' in element)) {
                var d = new Date(parseInt(element.updateTime))
                if (d.getFullYear() == year && d.getMonth() + 1 == month && d.getDate() == day) {
                    var pCities = element.cities
                    for (let i = 0; i < pCities.length; i++) {
                        if (pCities[i].cityName in cities) {
                            let city = cities[pCities[i].cityName]
                            confirmed[pCities[i].cityName] = { lng: city.lng, lat: city.lat, count: getLevel(pCities[i].confirmedCount) }
                        }
                    }
                }
            }
        }
        for(var city in confirmed) {
            points.push(confirmed[city])
        }
        //console.log(points)
        heatmap.setDataSet({
            data: points,
            max: 16
        })
        //console.log(cities)
    }

    // var getCitiesLngLat = function (area) {
    //     var cities = []
    //     for (let index = 0; index < area.length; index++) {
    //         const element = area[index];
    //         if (element.country == '中国' && ('cities' in element)) {
    //             var d = new Date(parseInt(element.updateTime))
    //             var now = new Date()
    //             if (d.getFullYear() == now.getFullYear() && d.getMonth() == now.getMonth() && d.getDate() == now.getDate()) {
    //                 var pCities = element.cities
    //                 for (let i = 0; i < pCities.length; i++) {
    //                     if (cities.indexOf(pCities[i].cityName) == -1)
    //                         cities.push(pCities[i].cityName)
    //                 }
    //             }
    //         }
    //     }
    // }
    //console.log(cities)


    // var geocoder = new AMap.Geocoder();
    // var getLocation = function(idx) {
    //     geocoder.getLocation(cities.slice(idx, idx+10), function (status, result) {
    //         if (status === 'complete' && result.geocodes.length) {
    //             //console.log(result.geocodes)
    //             for (let index = 0; index < result.geocodes.length; index++) {
    //                 const element = result.geocodes[index];
    //                 if(element!=null)
    //                     citieslnglat[cities[idx+index]] = { lng: element.location.lng, lat: element.location.lat, adcode: parseInt(element.adcode) }
    //             }
    //             console.log(JSON.stringify(citieslnglat))
    //         }
    //     });
    // }
    // for (let index = 0; index < cities.length; index+=10) {
    //     getLocation(index)
    // }

    var evolveDate = new Date('2020-01-24')
    $("#evolveDate").text("正在加载疫情数据...");

    // 从腾讯平台获取数据
    $.ajax({
        url: 'https://lab.isaaclin.cn/nCoV/api/area',
        type: 'get',
        dataType: 'json',  // 返回的数据格式，常用的有是'json','html',"jsonp"
        data: {
            latest: 0
        },
    }).done(function (resp) {     // 请求成功以后的操作
        //console.log(resp.results)
        $("#evolveDate").text(evolveDate.toLocaleDateString());
        $("#prev").on("click", function() {
            evolveDate.setFullYear(2020,0,24)
            confirmed = {}
            //console.log(evolveDate.toLocaleDateString())
            $("#evolveDate").text(evolveDate.toLocaleDateString());
            getCitiesCountByDate(whole, evolveDate.getFullYear(), evolveDate.getMonth()+1, evolveDate.getDate())
        })
    
        $("#next").on("click", function() {
            evolveDate.setDate(evolveDate.getDate()+1)
            //console.log(evolveDate.toLocaleDateString())
            $("#evolveDate").text(evolveDate.toLocaleDateString());
            getCitiesCountByDate(whole, evolveDate.getFullYear(), evolveDate.getMonth()+1, evolveDate.getDate())
        })

        whole = resp.results
        getCitiesCountByDate(whole, 2020, 1, 24)
        //getCitiesLngLat(resp.results)
    }).fail(function (error) {    // 请求失败以后的操作
        console.log(error);
    });
})
