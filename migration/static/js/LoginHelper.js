function checkTextBox() {
		if (document.login.userName.value != ''
				&& document.login.password.value != '') {
			document.login.submit.disabled = false;
		} else {
			document.login.submit.disabled = true;
		}
               if (document.login.userName.value != '')
                {
                     document.login.password.disabled = false;
                }
                else
                {
                     document.login.password.disabled = true;
                }
	}

	function browserCompatibilityCheck() {
		if (isVersionCompatible() != true) {
			var e = document.getElementById('notCompatibleBrowserErrorMsg').style.display = 'block';
		}
	}

	function isVersionCompatible() {
		var ver = document.documentMode;
		if (ver > -1) {
			if (ver > 8.0)
				return true;
		}
		return false;
	}

	function setHtmlValues(item) {
		var variable = item.split("=");

		if (variable.length == 2 && document.getElementById(variable[0]) != null) {
			document.getElementById(variable[0]).innerHTML = variable[1];
		}
	}

	function redirectPage(page) {
		document.location.href = page + '?jsessionid=' + getJSessionId();
	}

	function getJSessionId(){
	    var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
	    if(jsId != null && undefined !== jsId) {
	        if (jsId instanceof Array)
	            jsId = jsId[0].substring(11);
	        else
	            jsId = jsId.substring(11);
	    }
	    return jsId;
	}
