$(function () {

    var whole
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
        else if (count >= 10)
            return 2
        else if (count > 0)
            return 1
        return 0
    }

    // 显示地图
    var emap = new AMap.Map("evolve", {
        resizeEnable: true,
        center: [105.00, 37.0],
        zoom: 4
    });

    var heatmap
    emap.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(emap, {
            radius: 40, //给定半径
            opacity: [0, 0.8],
            // gradient:{
            //     0.5: 'blue',
            //     0.65: 'rgb(117,211,248)',
            //     0.7: 'rgb(0, 255, 0)',
            //     0.9: '#ffea00',
            //     1.0: 'red'
            // }
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
                            points.push({ "lng": city.lng, "lat": city.lat, "count": pCities[i].confirmedCount })
                        }
                    }
                }
            }
        }
        heatmap.setDataSet({
            data: points,
            max: 1000
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



    // 从腾讯平台获取数据
    $.ajax({
        url: 'https://lab.isaaclin.cn/nCoV/api/area',
        type: 'get',
        dataType: 'json',  // 返回的数据格式，常用的有是'json','html',"jsonp"
        data: {
            latest: 0
        },
    }).done(function (resp) {     // 请求成功以后的操作
        console.log("completed.")
        whole = resp.results
        getCitiesCountByDate(whole, 2020, 1, 24)
        //getCitiesLngLat(resp.results)
    }).fail(function (error) {    // 请求失败以后的操作
        console.log(error);
    });

    var evolveDate = new Date('2020-01-24')
    //evolveDate.setDate(evolveDate.getDate()-1)
    $("#evolveDate").text(evolveDate.toLocaleDateString());

    $("#prev").on("click", function() {
        evolveDate.setDate(evolveDate.getDate()-1)
        console.log(evolveDate.toLocaleDateString())
        $("#evolveDate").text(evolveDate.toLocaleDateString());
        getCitiesCountByDate(whole, evolveDate.getFullYear(), evolveDate.getMonth()+1, evolveDate.getDate())
    })

    $("#next").on("click", function() {
        evolveDate.setDate(evolveDate.getDate()+1)
        console.log(evolveDate.toLocaleDateString())
        $("#evolveDate").text(evolveDate.toLocaleDateString());
        getCitiesCountByDate(whole, evolveDate.getFullYear(), evolveDate.getMonth()+1, evolveDate.getDate())
    })
})
