(function ()
{
	$.fn.flyout = function ()
	{
		return this.each(function ()
		{
			var $flyout = $(this)
			var hidden_left = 0
			
			var show = function ($flyout)
			{
				$flyout
					.addClass('show')
					.animate(
					{
						left: 0
					}, 350)
			}

			var hide = function ($flyout)
			{
				$flyout
					.removeClass('show')
					.animate(
					{
						left: hidden_left
					}, 350)
			}
			
			$flyout
				.bind('flyout-show', function () { show($flyout) } )
				.bind('flyout-hide', function () { hide($flyout) } )
				
			// We may have a tabbed flyout, if not we add a single grip
			var $tab_links = $flyout.find('> .tabs-container > .tab-links > li > a')
			
			if ($tab_links.length > 0)
			{
				var tab_changed = false
				
				$flyout
					.addClass('with-tabs')
					.bind('tabchange', function (e, i)
		            {
		                tab_changed = true
		            })
				
				$tab_links.click(function (e)
				{
					if ($flyout.is('.show') && !tab_changed)
					{
						hide($flyout)
					}
					else
					{
						tab_changed = false
						show($flyout)
					}
				})
			}
			else
			{
				$flyout
					.addClass('with-grip')
					.wrapInner(E('div', 'container'))
						.find('.container').append(E('div', 'bottom'))
					.end()
					.append(
						E('a', 'grip', E('span')).attr('href', '#')
							.click(function (e)
							{
								e.preventDefault()
							
								if ($flyout.is('.show'))
								{
									hide($flyout)
								}
								else
								{
									show($flyout)
								}
							})
					)
					
				// This type of flyout has a dynamic height so we need to calculate
				// its position and the position of the grip.
				var $window = $(window)
				
				var position_flyout = function ()
				{
					$flyout.css('top', ($window.height() - $flyout.height()) / 2)
				}
				position_flyout()
				$window.resize(position_flyout)
				
				var $grip = $flyout.find('> .grip')
				$grip.css('top', ($flyout.height() - $grip.height()) / 2)
			}
			
			hidden_left = $flyout.css('left')
			
			// Chat demo
			
			var get_time = function (t)
			{
				var now = new Date().getTime()
				var diff = now - t
				
				if (diff < 3600000)
				{
					var d = new Date(t)
					return d.getHours() % 12 + ':' + d.getMinutes() + d.getHours() > 12 ? 'pm' : 'am'
				}
				else if (diff < 86400000)
				{
					return Math.round(diff / 3600000) + 'hr'
				}
				else
				{
					return Math.round(diff / 86400000) + 'd'
				}
			}
			
			$flyout
				// Chat window
				.find('.messenger')
				.each(function ()
				{
					var $container = $(this)
					var $messages = $container.find('.scrolling-content')
					var scrollbar = $container.find('.scrollbars').data('scrollbar-vertical')
					var message_index = 0
					
					$container.bind('new-message', function (e, message)
					{
						$messages.append(
							E('div', 'message '+(message_index % 2 != 0 ? 'alt' : ''),
								E('div', 'head'),
								E('div', 'message-bubble',
									E('div', 'top', E('div')),
									E('div', 'message-content',
										E('a', 'author', T(message.author)).attr('href', '#'),
										E('div', 'time', T(get_time(message.time))),
										E('div', 'text', T(message.text))
									),
									E('div', 'bottom', E('div'))
								)
							)
						)
						message_index++ 
						
						scrollbar.size_changed()
						scrollbar.smooth_to(scrollbar.max_content_offset)
					})
				})
				.end()
				// Task pad
				.find('.taskpad')
				.each(function ()
				{
					var $container = $(this)
					
					var $sections = $container.find('.body > ul > li')
					$sections.last().addClass('last-child')
					$sections
						.append(E('div', 'arrow'))
						.append(E('div', 'section-border'))
					var $scrollbar_containers = $container.find('.body > ul > li > .scrollbars')
					var closed_height = $sections.eq(0).height()
					var open_height = ($container.find('.body').height() - closed_height * $sections.length) + closed_height
					
					$scrollbar_containers
						.css('height', open_height - closed_height)
						.prepend(E('div', 'section-shadow'))
					
					var select_section = function (i, animated)
					{
						var $section = $sections.eq(i)
						
						if ($section.is('.selected'))
						{
							return
						}
						
						var $previously_selected_section = $sections.filter('.selected')
						$section.addClass('selected')
						
						if (animated)
						{
							$previously_selected_section.animate({height: closed_height, queue: false }, 250, function ()
							{
								$previously_selected_section.removeClass('selected')
							})
							$section.animate({height: open_height, queue: false }, 250, function ()
							{
								$scrollbar_containers.eq(i).trigger('resize')
							})
						}
						else
						{
							$previously_selected_section
								.removeClass('selected')
								.css('height', closed_height + 'px')
							$section
								.css('height', open_height + 'px')
								
							$scrollbar_containers.eq(i).trigger('resize')
						}
					}
					
					$sections.find('> a').click(function (e)
					{
						e.preventDefault()
						select_section($(this).parent().index(), true)
					})
					
					var $selected_section = $sections.filter('.selected')
					
					if ($selected_section.length > 0)
					{
						$selected_section.removeClass('selected')
						select_section($selected_section.index())
					}
					else
					{
						select_section(0)
					}
					
					$container.find('.tree').each(function (i)
					{
						var $scrollbar_container = $scrollbar_containers.eq(i)
						
						$(this)
							.bind('leaf-expanded', function ()
							{
								$scrollbar_container.trigger('resize')
							})
							.bind('leaf-collapsed', function ()
							{
								$scrollbar_container.trigger('resize')
							})
							.find('li.alarm a,li.alert a')
								.append(E('span', 'icon'))
					})
				})
		})
	}
	
	NSNReady(function ()
	{
		$('.flyout .menu li a').wrapInner('<span></span>')
		$('.flyout').flyout()
	})
})(jQuery)