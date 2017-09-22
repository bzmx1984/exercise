//创建兼容所有浏览器AJAX对象
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
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
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
            throw new Error("浏览器版本太低");
        }
    }
    return xhr;
}

function ajax(method, url, data, success) {


        var xhr = createXHR();


    if (method == 'get' && data) {
        url += '?' + data+'_'+Math.random();
    }

    xhr.open(method,url,true);

    if (method == 'get') {
        xhr.send();
    } else {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }

    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                success && success(xhr.responseText);
            } else {
                alert('出错了,Err：' + xhr.status);
            }
        }

    }
}



