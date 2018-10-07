(function ($)
{
	var select_single = function ($source, $row)
	{
		$source.find('option:selected').removeAttr('selected')
		$source.find('option').eq($row.index()).attr('selected', 'true')
		
		$source.change()
	}
	
	var select_multiple = function ($source, $row)
	{
		var $option = $source.find('option').eq($row.index())
		
		if ($row.is('.selected'))
		{
			$option.removeAttr('selected')
		}
		else
		{
			$option.attr('selected', true)
		}
		
		$source.change()
	}
	
	var select_range = function ($source, $row)
	{
		var a, b = $row.index()
		var $options = $source.find('option')
		var $selected_options = $row.parent().find('li.selected')
		
		if ($selected_options.length == 0)
		{
			a = b
		}
		else
		{
			a = $selected_options.eq(0).index()
		}
		
		var start = Math.min(a,b)
		var end = Math.max(a,b)
		
		for (var i=0; i<$options.length; i++)
		{
			if (i >= start && i <= end)
			{
				$options.eq(i).attr('selected', true)
			}
			else
			{
				$options.eq(i).removeAttr('selected')
			}
		}
		
		$source.change()
	}
	
	$.fn.list = function ()
	{
		return this.each(function ()
		{
			var $source = $(this)
							.attr('multiple', true)
							.hide()
							
			var $target = E('div', $source.attr('class'),
				E('div', 'list-container scrollbars vertical',
					E('ul')
				),
				E('div', 'scroll-shadow top'),
				E('div', 'scroll-shadow bottom')
			).insertAfter($source)
			var $ul = $target.find('ul')
			var $ul_container = $ul.parent()
			var $shadow = $target.find('.scroll-shadow')
			
			var setup_options = function ()
			{
				var options =[]
				$source.find('option').each(function ()
				{
					options.push(E('li',
						E('a', E('span', T($(this).html())) ).attr('href', '#')
					))
				})

				$ul.html('').appendlist(options)
				
				$ul_container 
					.find('li:first-child')
						.addClass('first-child')
					.end()
					.find('li:last-child')
						.addClass('last-child')

				$shadow.css('width', $target.width())
				
				$target.find('a').click(function (e)
				{
					e.preventDefault()

					var $row = $(this).parent()

					if (e.metaKey)
					{
						select_multiple($source, $row)
					}
					else if (e.shiftKey)
					{
						select_range($source, $row)
					}
					else
					{
						select_single($source, $row)
					}
				})
				
				$shadow.css('width', $target.width())
				var scrollbar = $ul_container.data('scrollbar-vertical')
				
				if (scrollbar)
				{
					scrollbar.size_changed()
				}
			}
			
			setup_options()
			$source.domchange(setup_options)
			
			var size = 4

			if ($source.attr('size'))
			{
				size = parseInt($source.attr('size'))
			}
			
			var element_height = 29
			
			if ($source.hasClass('small'))
			{
			element_height = 26
			}

			$ul_container 
				.css('height', size * element_height)
				.scrollbars()
			
			var scrolling_timeout = null
			var is_dragging = false
			
			var hide_scrolling_shadow = function ()
			{
				if (scrolling_timeout)
				{
					scrolling_timeout = null
				}
				
				$shadow.hide()
			}
			
			var show_scrolling_shadow = function ()
			{
				$shadow.show()
			}
			
			$ul_container
				.bind('scroll-move', function ()
				{
					if (!is_dragging)
					{
						if (scrolling_timeout)
						{
							clearTimeout(scrolling_timeout)
						}
						else
						{
							show_scrolling_shadow()
						}
						
						scrolling_timeout = setTimeout(hide_scrolling_shadow, 100)
					}
				})
				.bind('scroll-start', function ()
				{
					is_dragging = true
					show_scrolling_shadow()
				})
				.bind('scroll-end', function ()
				{
					is_dragging = false
					hide_scrolling_shadow()
				})
			
			$source.change(function ()
			{
				var $target_options = $target.find('li')
				
				$source.find('option').each(function (i)
				{
					var $target_option = $target_options.eq(i)
					
					if ($(this).is(':selected'))
					{
						$target_option.addClass('selected')
					}
					else
					{
						$target_option.removeClass('selected')
					}
				})
			})
		})
	}
	
	NSNReady(function () { $('select.list').list() })
})(jQuery)