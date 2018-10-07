(function ()
{
	$.fn.lifecycle_indicator = function ()
	{
		return this.each(function ()
		{
			var $container = $(this)
			var $items = $container.find('li')
			$items.append(E('span'))
			$items.eq(0).addClass('first-child')
			$items.eq($items.length-1).addClass('last-child')
			
			var selected_index = 0
			
			var select_item = function (i)
			{
				selected_index = i
				
				$items.each(function (j)
				{
					if (j <= i)
					{
						$items.eq(j).addClass('on')
					}
					else
					{
						$items.eq(j).removeClass('on')
					}
				})
			}
			
			var $selected_item = $items.filter('.selected:first')
			
			if ($selected_item.length > 0)
			{
				selected_index = $selected_item.index
			}
			
			select_item(selected_index)
			
			$container
				.bind('select-item', function (e, i)
				{
					select_item(i)
				})
				.bind('next-item', function ()
				{
					select_item(Math.min(selected_index + 1, $items.length - 1))
				})
				.bind('previous-item', function ()
				{
					select_item(Math.max(selected_index - 1, 0))
				})
		})
	}
	
	NSNReady(function ()
	{
		$('.lifecycle-indicator').lifecycle_indicator()
	})
})(jQuery)