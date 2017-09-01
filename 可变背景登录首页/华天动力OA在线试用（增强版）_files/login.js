var allowLogin = true;

window.document.onkeydown = function(e) {
	var evt = e ? e : (window.event ? window.event : null);        //此方法为了在firefox中的兼容
	var keycode = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
	if (keycode == 13 ) {
		if (document.activeElement.type == "text" || document.activeElement.type == "password") {
			if (document.actForm.systemSort == null || document.actForm.systemSort.selectedIndex == 0) {
				submitButton('LOGIN');
			}  else {				
				webLogIn();
			}
		}
	}
}

function onLoad() {
	var userIdObj = document.getElementById("userId");
	if(userIdObj && userIdObj.value == "") {
		userIdObj.focus();
	} else {
		var userPwdObj = document.getElementById("userPwd");
		if(userPwdObj) userPwdObj.focus();
	}
	showAlert();
	openNewWin();
}

//取得当前画面的高度
function getcontentHeight() {
	document.getElementById("Content").style.height = document.body.clientHeight - 20;
}

function submitButton(linkType) {
	if (!allowLogin) return onload();
	document.actForm.screenWidth.value = screen.availWidth;
	document.actForm.screenHeight.value = screen.availHeight; 
	writeCookie();
	if (!usbKey()) return false;
	document.actForm.functionName.value = linkType;
	document.actForm.submit();
}

function usbKey() {
	//处理KEY
	var hCard;
	try {
		hCard = htactx.OpenDevice(1);
	} catch(ex) {
		return true;
	}
	if (document.actForm.userPwd.value == "" || document.actForm.userId.value == "") {
		alert(login_name_password);
		return false;
	}
	try {
		htactx.VerifyUserPin(hCard, document.actForm.userPwd.value);
		var UserName = htactx.GetUserName(hCard);
		if (UserName != document.actForm.userId.value) {
			alert(login_wrong_name_password);
			htactx.CloseDevice(hCard);
			return false;
		}
		var Digest = "01234567890123456";
		Digest = htactx.HTSHA1(document.actForm.RandomData.value, document.actForm.nRndLen.value);
		Digest += "04040404";
		var EnData = htactx.HTCrypt(hCard,0, 0, Digest, Digest.length);
		htactx.CloseDevice(hCard);
		document.actForm.RndData.value = EnData;
	} catch (ex) {
		alert(login_wrong_name_password);
		htactx.CloseDevice(hCard);
		return false;
	}
	return true;
}

function writeCookie() {
	var expdate = new Date();
	var str = "";
	var nIndex;
	str += document.actForm.userId.value;
	str += "|";
	if (document.actForm.styleList != null) {
		nIndex = document.actForm.styleList.selectedIndex;
		if (nIndex == -1) nIndex = 0;
		str += document.actForm.styleList.options[nIndex].value;
		str += "|";
	}
	if (document.actForm.languageList != null) {
		nIndex = document.actForm.languageList.selectedIndex;
		if (nIndex == -1) nIndex = 0;
		str += document.actForm.languageList.options[nIndex].value;
		str += "|";
	}
	expdate.setTime (expdate.getTime() + 365 * (24 * 60 * 60 * 1000)); //+1 year
	SetCookie("htoa8000", str, expdate, "/");
}

function SetCookie (nameValue, valueValue) {
	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	document.cookie = nameValue + "=" + escape (valueValue) +
		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
		((path == null) ? "" : ("; path=" + path)) +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "");
}

function openNewWin() {
    var chasm = screen.availWidth;
    var mount = screen.availHeight;
    var w = window.screen.width;
    var h = window.screen.height;
    var gotoPageObj = document.getElementById("gotoPage");
	if (gotoPageObj.value != "") {
		var objChild;
		var reWork = new RegExp('object','gi');
		var varLeft;
		var varTop;
		if (w == chasm) {
			varLeft = 0;
		} else {
			varLeft = (chasm - w - 10) * .5;
		}
		if (h == mount) {
			varTop = 0;
		} else {
			varTop = (mount - h - 30) * .5;
		}
		var varOption = "toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=no,width=" + w + ",height=" + h + ",left=" + varLeft + ",top=" + varTop; 
		try {
			objChild = window.open(document.getElementById("hrefId").href, "_blank", varOption);
			window.opener= null;			 
		}catch(e){}
		if (!reWork.test(String(objChild))) {
			alert(login_init_set);
        }else{
			window.open('','_self');
			window.close();
		}
    }
}

function webLogIn() {
	try{
		var userNameInputId = document.all.actForm.userNameInputId.value;
		var pasdInputId = document.all.actForm.pasdInputId.value;
		var webUserIdElement = webPage.document.getElementById(userNameInputId);
		var webUserPwdElement = webPage.document.getElementById(pasdInputId);
		webUserIdElement.value = document.getElementById("userId").value;
		webUserPwdElement.value = document.getElementById("userPwd").value;        
		if (document.all.actForm.userId.value== "") {
			alert(login_name);
			return false;
		}
		if (document.all.actForm.userPwd.value=="") {
			alert(login_password);
			return false;
		}
		var objForm = eval("webPage.document.actForm;");
		objForm.target = "_top";
		objForm.submit();	
	}
	catch(e){}
}