(function ($)
{
    $.fn.radiobutton = function ()
    {
        return $(this).each(function ()
        {
            var $source = $(this)
            
            var $radio = E('span', 'radiobutton')
            var $label = E('span', 'label')
            var $container = E('a', 'radiobutton-container', 
                $radio, $label
            )
            .attr({
                href: '#',
                name: $source.attr('name')
            });
            
            if ($source.parent().is('label'))
            {
                $label.text($source.parent().text())
                $source.parent().hide().after($container)
            }
            else
            {
                $source.hide().after($container)
            }
            
            if ($source.is('.small'))
            {
                $container.addClass('small')
            }
            
            $container.normalize_interaction_states()
            
            if ($source.attr('disabled'))
            {
                $container.addClass('disabled')
            }
            
            $source.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $container.addClass('disabled')
                }
                else
                {
                    $container.removeClass('disabled')
                }
            })
            
            if ($source.is(':checked'))
            {
                $radio.addClass('checked')
            }
			
			var update_value = function ()
			{
				if ($source.attr('checked'))
				{
					$('.radiobutton-container[name='+$container.attr('name')+'] .checked').removeClass('checked')
                    $radio.addClass('checked')
				}
			}
            
			$source.change(update_value)
			
            $container.click(function (e)
            {
                e.preventDefault()
                
                if ($container.is('.disabled'))
                {
                    return
                }
                
                if (!$radio.is('.checked'))
                {
					$('input[name='+$container.attr('name')+']:checked').removeAttr('checked').change()
                    $source
						.attr('checked', true)
						.change()
                }
            })
        })
    }
    
    $(function () { $('input[type=radio]').radiobutton() })
})(jQuery)