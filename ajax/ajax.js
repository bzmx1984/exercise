//function ajax(method,url,){
//    var xhr=null;
//
//    try{
//        xhr=new XMLHttpRequest();
//    }catch (e){
//        xhr=new ActiveXObject('Microsoft.XMLHTTP');
//    }
//
//    xhr.open('get','get.php',true);
//    xhr.send();
//
//    xhr.onreadystatechange=function(){
//        if(xhr.readyState==4){
//            if(xhr.status==200){
//                alert(xhr.statusText);
//            }else{
//                alert('出错了'+xhr.status)
//            }
//        }
//
//    }
//
//}




/**
 *兼容所有浏览器版本
 * **/
function createXHR(){
    var xhr=null;
        flag=true;
    ary=[
        function(){
            return new XMLHttpRequest();
        },
        function(){
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function(){
            return new ActiveXObject('Msxml2.XMLHTTP');
        },
        function(){
            return new ActiveXObject('Msxml3.XMLHTTP')
        }
    ];

    for(i=0,i<ary.length;i++;){
        var curFn=ary[i];
        try{
            xhr=curFn();
            createXHR=curFn;
            flag=true;
            break;
        }catch (e){

        }
        if(!flag){
            throw new Error('浏览器版本太低了！');
        }
    }

    return xhr;
}



