(function ($)
{
    $.fn.drawer = function ()
    {
        return $(this).each(function ()
        {
            var $container = $(this)
            var $tabs = $container.find('.tab-links')
			var $shadow = E('div', 'shadow').hide().appendTo($container)
            var bottom = -1 * ($container.outerHeight() - $tabs.height())
            
            var hide = function (animated)
            {
                if (animated)
                {
                    $container.animate(
                        {
                            bottom: bottom
                        },
                        350,
                        function ()
                        {
                            $container.removeClass('up')
                        }
                    )
					$shadow.fadeOut(350)
                }
                else
                {
                    $container
                        .css('bottom', -1 * ($container.outerHeight() - $tabs.height()))
                        .removeClass('up')
                }
            }
            
            var show = function (animated)
            {
                if (animated)
                {
                    $container.animate(
                        {
                            bottom: 0
                        },
                        350,
                        function ()
                        {
                            $container.addClass('up')
                        }
                    )
					$shadow.fadeIn(350)
                }
                else
                {
                    $container
                        .css('bottom', 0)
                        .addClass('up')
                }
            }
            
            $(document).click(function (e)
            {
                e.preventDefault()
                
                if ($container.is('.up') && $(e.target).parents('.drawer').length == 0)
                {
                    hide(true)
                }
            })
            
            var tab_changed = false
            
            $container
                .append(
                    E('a', 'drawer-toggle')
                        .attr('href', '#')
                        .click(function (e)
                        {
                            e.preventDefault()
                            
                            if ($container.is('.up'))
                            {
                                hide(true)
                            }
                            else
                            {
                                show(true)
                            }
                        })
                )
                .bind('tabchange', function (e, i)
                {
                    // The tab right before the selected tab
                    // needs a special style
                    var $tabs = $container.find('> .tabs-container > .tab-links > li')
                    
                    $tabs.removeClass('before-selected')
                    
                    if (-1 < i - 1)
                    {
                        $tabs.eq(i-1).addClass('before-selected')
                    }
                    
                    tab_changed = true
                })

			var $toggle = $container.find('a.drawer-toggle')
			$toggle.normalize_interaction_states()
			
			$container
                .find('> .tabs-container > .tab-links > li > a')
					.click(function (e)
	                {
	                    e.preventDefault()
                    
	                    if ($container.is('.up'))
	                    {
	                        if (!tab_changed)
	                        {
	                            hide(true)
	                        }
	                    }
	                    else
	                    {
	                        show(true)
	                    }
                    
	                    tab_changed = false
                	})
					.mouseover(function ()
					{
						if ($(this).parent().is('.selected'))
						{
							$toggle.addClass('hover')
						}
					})
					.mouseout(function ()
					{
						$toggle.removeClass('hover focus active')
					})
					.mousedown(function ()
					{
						if ($(this).parent().is('.selected'))
						{
							$toggle.addClass('active')
						}
					})
					.mouseup(function ()
					{
						$toggle.removeClass('active')
					})
        })
    }
    
	NSNReady(function () { $('.drawer').drawer() })
})(jQuery)