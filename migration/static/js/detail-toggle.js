(function ($)
{
	$.fn.detail_toggle = function ()
	{
		return this.each(function ()
		{
			var $container = $(this).wrapInner(E('span', 'text'))
			var $icon = E('span', 'icon').appendTo($container)
			
			$container.click(function (e)
			{
				e.preventDefault()
				
				if ($container.is('.open'))
				{
					$container
						.removeClass('open')
						.trigger('detail-hide')
				}
				else
				{
					$container
						.addClass('open')
						.trigger('detail-show')
				}
			})
		})
	}
	NSNReady(function () { $('a.detail-toggle').detail_toggle() })
})(jQuery)