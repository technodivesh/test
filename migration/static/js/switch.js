(function ($)
{
    $.fn.switchbutton = function ()
    {
        return this.each(function ()
        {
            var $source = $(this).hide()
            var $target = E('a', 'switch', E('span', 'thumb'))
                                .attr('href', '#')
                                .insertAfter($source)
            
            if ($source.is('.alt'))
            {
                $target.addClass('alt')
                $target.append(E('span', 'next').hide())
            }
            
            var $next = $target.find('.next')
            
            if ($source.is('.small'))
            {
                $target.addClass('small')
            }
            
            if ($source.is(':checked'))
            {
                $target.addClass('on')
            }
            
            if ($source.is('[disabled]'))
            {
                $target.addClass('disabled')
            }
            
            $source.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $target.addClass('disabled')
                }
                else
                {
                    $target.removeClass('disabled')
                }
            })
            
			var update_value = function ()
			{
				if ($source.attr('checked'))
				{
					$target.find('.thumb').animate({ left: 0 }, 150, function ()
                    {
                        $target.addClass('on')
                    })
				}
				else
				{
					$target.find('.thumb').animate({ left: $target.width() - $target.find('span').width() }, 150, function ()
                    {
                        $target.removeClass('on')
                    })
				}
				
				if (!$.browser.msie || parseInt($.browser.version) > 8)
                {
                    $next.fadeIn(150, function ()
                    {
                        $next.hide()
                    })
                }
			}
			
			$source.change(update_value)
			
            $target
                .normalize_interaction_states()
                .click(function (e)
                {
                    e.preventDefault()
                    
                    if ($target.is('.disabled'))
                    {
                        return
                    }
                    
                    if ($target.is('.on'))
                    {
                        $source.removeAttr('checked').change()
                    }
                    else
                    {
                        $source.attr('checked', true).change()   
                    }
                })
        })
    }
    
    $(function () { $('input[type=checkbox].switch').switchbutton() })
})(jQuery)