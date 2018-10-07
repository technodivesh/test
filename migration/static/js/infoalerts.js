(function ($)
{
	
	window.NSNInfoAlerts =
	{
		$container: null,
		
		alert: function (type, message, timeout)
		{
			var $alert = E('div', 'info-alert '+type,
				E('div', 'message-container',
					E('div', 'message-top'),
					E('div', 'message', 
						E('div', 'alert-icon'),
						T(message)
					),
					E('a', 'close').attr('href', '#')
				)
			).hide()
			
			if (!this.$container)
			{
				this.$container = E('div', 'info-alerts').appendTo('body')
			}
			
			this.$container.append($alert)
			
			$alert.fadeIn(350, function ()
			{
				if (timeout)
				{
					setTimeout(function ()
					{
						$alert.fadeOut(350, function ()
						{
							$alert.remove()
						})
					}, timeout)
				}
			})
			
			$alert.find('.close').click(function (e)
			{
				e.preventDefault()
				
				$alert.fadeOut(350, function ()
				{
					$alert.remove()
				})
			})
		},
		
		error: function ()
		{
			var args = $.makeArray(arguments)
			args.unshift('error')
			return alert.apply(this, args)
		}
	}
	
	NSNReady(function ()
	{
		;['error', 'warning', 'info', 'success'].forEach(function (type)
		{
			NSNInfoAlerts[type] = function (message, timeout)
			{
				return NSNInfoAlerts.alert.call(NSNInfoAlerts, type, message, timeout)
			}
		})
	})
})(jQuery)