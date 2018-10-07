for ( var p in mapJs) {
	if (mapJs.hasOwnProperty(p)) {
		if (mapJs[p] === "false") {
			var a = p.split(':');
			if(p.indexOf("HSS_") > -1 && a.length > 1)
			{
				if (document.getElementById(a[1]) != null) {
						document.getElementById(a[1]).style.display = 'none';
					}
			}else{				
				if (document.getElementById(p) != null) {					
					document.getElementById(p).style.display = 'none';
				}
			}
		}
	}
	}