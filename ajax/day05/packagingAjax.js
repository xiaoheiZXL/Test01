function ajax(obj) {
    var defaults = {
        type: 'get',
        async: true,
        url: '#',
        dataType: 'text',
        jsonp: 'callback',
        data: {},
        success: function(data) {
            console.log(data);
        }
    }
    for (var k in obj) {
        defaults[k] = obj[k];
    }
    if (defaults.dataType == 'jsonp') {
        ajax4jsonp(defaults);
    } else {
        ajax$json(defaults);
    }
    function ajax4json(obj) {
        var x = new XMLHttpRequest();
        var param = '';
        for (var k in defaults.data) {
            param += k + '=' + defaults.data[k] + '&';
        }
        if (param) {
            param = param.substring(0, param.length - 1);
        }
        if (defaults.type == 'get') {
            defaults.url += '?' + encodeURI(param); //转码数据,防止中文乱码
        }
        x.open(defaults.type, defaults.url);
        var data = null;
        if (defaults.type == 'post') {
            data = param;
            x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        x.send(data);
        //如果为同步请求,不会调用回调函数,直接返回
        if (!defaults.async) {
            if (defaults.dataType == 'json') {
                return JSON.parse(x.responseText);
            } else {
                return x.responseText;
            }
        }
        x.onreadystatechange = function() {
            if (x.readyState == 4 && x.status == 200) {
                var data = x.responseText;
                if (defaults.dataType == 'json') {
                    data = JSON.parse(data);
                }
                defaults.success(data);
            }
        }
    }

    function ajax4jsonp(obj) {
        var cbName = 'jQuery' + ('1.11.1' + Math.random()).replace(/\D/g, '') + '_' + (new Date()).getTime();
        if (defaults.jsonpCallback) {
            defaults.jsonpCallback = cbName;
        }
        window[cbName] = function(data) {
            defaults.success(data);
        }
        var param = '';
        for (var k in defaults.data) {
            param += k + '=' + defaults.data[k] + '&';
        }
        if (param) {
            param = param.substring(0, param.length - 1);
        }
        var script = document.createElement('script');
        script.src = defaults.url + '?' + defaults.jsonp + '=' + cbName + '&' + param;
        document.body.append(script);
    }
}