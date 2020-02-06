$(function(){

    var colors = {};
    var china ={};

    var getColorByDGP = function(adcode){
        if(!colors[adcode]){
            var gdp = GDPSpeed[adcode];
            if(!gdp){
                colors[adcode] = 'rgb(227,227,227)'
            }else{   
                var rg = 255-Math.floor((gdp-5)/5*255);
                colors[adcode] = 'rgb('+ rg +','+ rg +',255)';
            }
        }
        return colors[adcode]
    }

    var getColorByConfirm = function(name_chn) {
        var pros = china.children
        for (var i = pros.length - 1; i >= 0; i--) {
            if (name_chn.indexOf(pros[i].name) != -1) {
                var confirm = pros[i]['total']['confirm']
                if (confirm > 5000)
                    return '#420001'
                else if (confirm >2000)
                    return '#590000'
                else if (confirm > 1000)
                    return '#710000'
                else if (confirm > 500)
                    return '#880000'
                else if (confirm > 200)
                    return '#A00000'
                else if (confirm > 100)
                    return '#B80000'
                else if (confirm > 90)
                    return '#CF0000'
                else if (confirm > 80)
                    return '#E70000'
                else if (confirm > 70)
                    return '#FF0000'
                else if (confirm > 60)
                    return '#FF1F1F'
                else if (confirm > 50)
                    return '#FF3F3F'
                else if (confirm > 40)
                    return '#FF5F5F'
                else if (confirm > 30)
                    return '#FF7F7F'
                else if (confirm > 20)
                    return '#FF9F9F'
                else if (confirm >= 10)
                    return '#FFBFBF'
                else if (confirm > 0)
                    return '#FFDFDF'
                return '#FFFFFF'
            }
        }
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
               //console.log(props)    NAME_CHN
               return getColorByConfirm(props.NAME_CHN) //getColorByDGP(props.adcode_pro)
            }
        }
    })
    //$("#btn").on("click",function(){
    //});

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
    map.addControl(new AMap.ToolBar({liteStyle:true}));

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
        //console.log(tData);
    }).fail(function(error) {    // 请求失败以后的操作
        console.log(error);
    });
})
