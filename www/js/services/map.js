angular.module('starter.services')
    .factory('Map', function() {
        var mapObj = {};
        var mapInit = function(pos) {
            mapObj = new AMap.Map('mapContainer', {
                rotateEnable: true,
                dragEnable: true,
                zoomEnable: true,
                zooms: [3, 18],
                zoom: 15,
                //二维地图显示视口
                view: new AMap.View2D({
                    zoom: 13, //地图显示的缩放级别,
                    center: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null
                })
            });
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
            return mapObj;
        }
        var initAutoSearch = function(keywords, autoOptions, success, fail) {
            var auto;
            AMap.service(["AMap.Autocomplete"], function() {
                auto = new AMap.Autocomplete(autoOptions);
                if (keywords.length > 0) {
                    auto.search(keywords, function(status, result) {
                        success(result);
                    })
                } else {
                    fail && fail();
                }
            })
        }
        var citySearch = function(success, fail) {
            AMap.service(["AMap.CitySearch"], function() {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            success(result);
                        }
                    } else {
                        fail && fail();
                    }
                });
            });
        }
        var setMaker = function(mapObj, pos) {
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
        }
        var setCenter = function(mapObj, pos) {
            try {
                setMaker(mapObj, pos);
                var lg = new AMap.LngLat(pos.longitude, pos.latitude);
                mapObj.setCenter(lg);
            } catch (e) {

            }
        }
        var initGeolocation = function(mapObj, onComplete, onError) {
            mapObj.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
                AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
            });
        }
        var geocoder;
        var getLngLatInfo = function(pos, geocoder_callBack) {
            var lnglatXY = new AMap.LngLat(pos.longitude, pos.latitude);
            //加载地理编码插件 
            mapObj.plugin(["AMap.Geocoder"], function() {
                geocoder = new AMap.Geocoder({
                    radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息 
                    extensions: "all" //返回地址描述以及附近兴趣点和道路信息，默认"base" 
                });
                //返回地理编码结果 
                AMap.event.addListener(geocoder, "complete", geocoder_callBack);
                //逆地理编码 
                geocoder.getAddress(lnglatXY);
            });

        }
        return {
            mapInit: mapInit,
            initAutoSearch: initAutoSearch,
            citySearch: citySearch,
            setMaker: setMaker,
            setCenter: setCenter,
            initGeolocation: initGeolocation,
            getLngLatInfo: getLngLatInfo
        }
    })
