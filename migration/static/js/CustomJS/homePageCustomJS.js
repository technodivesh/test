javascript: window.history.forward(1);

	function call_Application(applicationName) {
			document.location.href = 'login.form?application=' + applicationName+'&jsessionid='+getJSessionId();
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

	function mssMultiSim() {
		delete_cookie('redirectToMssMultiSIMPage');
		document.location.href = '#/mssmultisimhomepage';
		angular.element(document.getElementById('applicationsNavigationView')).scope().config['intermediatePage'] = false;
	}

	var delete_cookie = function(name) {
	    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	function callHomePage() {
		document.location.href = 'home.nhtm?jsessionid='+getJSessionId()+'&Id='+new Date().getTime();
	}

	function resetToHomePageOnRefresh() {
		var url = window.location.href;

		if (document.cookie.indexOf('redirectToMssMultiSIMPage') != -1) {
			setTimeout(mssMultiSim, 2000);
		}

		if (url.indexOf("#/") !== -1) {
			if (document.cookie.indexOf('redirectToMssMultiSIMPage') == -1) {
				// cookie doesn't exist, create it now
				document.cookie = 'redirectToMssMultiSIMPage=1';
			}
			callHomePage();
		}
	}
	
	function changePassword() {
		document.location.href = 'passwordchangepage.nhtm?jsessionid='+getJSessionId();
	}

	function logout() {
		document.location.href = 'logout.nhtm';
	}