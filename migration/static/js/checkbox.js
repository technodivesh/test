(function ($)
{
    $.fn.checkbox = function ()
    {
        return $(this).each(function ()
        {
            var $source = $(this)
            
            var $checkbox = E('span', 'checkbox')
            var $label = E('span', 'label')
            var $container = E('a', 'checkbox-container', 
                $checkbox, $label).attr('href', '#');
            
            if ($source.parent().is('label'))
            {			    
                $label.append($source.parent().html()).children("input:checkbox").remove()					
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
                $checkbox.addClass('checked')
            }
            else if ($source.is('.mixed'))
            {
                $checkbox.addClass('mixed')
            }
            
			var update_value = function ()
			{
				if ($source.attr('checked'))
                {
					$checkbox.removeClass('mixed').addClass('checked')
                }
                else
                {
                    $checkbox.removeClass('checked')
                }
			}
			
			$source.change(update_value)
			
            $container.click(function (e)
            {
                e.preventDefault()
				e.stopPropagation()
                
                if ($container.is('.disabled'))
                {
                    return
                }
                
                if ($checkbox.is('.checked'))
                {
                    $source.removeAttr('checked')
                }
                else
                {
                    $source.attr('checked', true)
                }

				$source.change()
            })
        })
    }
    
	$(function () { $('input[type=checkbox]:not(.toggle)').checkbox() })
})(jQuery)