

~(function () {

    /**
     *兼容所有浏览器版本
     * **/
    function createXHR() {
        var xhr = null;
        flag = false;
        ary = [
            function () {
                return new XMLHttpRequest;
            },
            function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function () {
                return new ActiveXObject('Msxml3.XMLHTTP')
            }
        ];

        for (var i = 0, len = ary.length; i < len; i++) {
            var curFn = ary[i];
            try {
                xhr = curFn();
                createXHR = curFn;
                flag = true;
                break;
            } catch (e) {

            }
            if (!flag) {
                throw new Error('浏览器版本太低了！');
            }
        }

        return xhr;
    }


//实现AJAX请求的公共方法；v一个方法传递的参数据值过多，而且还不固定，我们使用对象统一传值法（把需要传递的参数值都先放在一个对像中，一起传递进去即可）
    function ajax() {
        //把需要使用的参数值设定一个规则和初始值
        var _default = {
            url: '',         //请求的地址
            type: 'get',     //请求的方式
            dataType: 'json',    //设置请求回来的内容格式，JSON就是JSON格式的对像，TXT就是字符串或是JSON格式字符串
            async: true,     //请求是同步还是异步
            data: null,      //放在请求主体中的内容（当是POST）
            getHead: null,   //当 ready state===2的时候执行的回调方法
            success: null   //当 ready state===4的时候执行的回调方法
        };

        // 使用用户自己传递进来的值覆盖我们的默认值
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }
        //如果当前请求方式是GET我们需要在URL末尾加随机数来清除缓存

        if (_default.type === "get") {
            _default.url.indexOf("?") >= 0 ? _default.url += "&" : _default.url += "?";
            _default.url += "_=" + Math.random();
        }

        var xhr = createXHR();

        xhr.open(_default.type, _default.url, _default.async);

        xhr.onreadystatechange = function () {
            if (/^2\d{2}$/.test(xhr.status)) {

                //想要在 readyState 等于2的时候做一些操作，需要保证AJAX是异步请求
                if (xhr.readyState === 2) {
                    if (typeof  _default.getHead === "function") {
                        _default.getHead.call(xhr);
                    }
                }

                if (xhr.readyState === 4) {
                    var val = xhr.responseText;
                    //如果传递参数值是JSON，说明获取的应该是JSON格的对象
                    if (_default.dataType === "json") {
                        val = "JSON" in window ? JSON.parse(val) : eval("(" + val + ")");
                    }
                    _default.success && _default.success.call(xhr, val);
                }
            }
        };
        xhr.send(_default.data);
    }
    windown.ajax=ajax;
})();

//调用
//ajax({
//    url:'data.txt',
//    type:'get',
//    dataType:'json',
//    async:true,
//    getHead:function(){
//
//    },
//    success:function(data){
//        //data 我们从服务器获取的内容
//    }
//});


