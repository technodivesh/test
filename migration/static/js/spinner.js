(function ($)
{
    $.fn.spinner = function ()
    {
        $selected_spinner = null
        
        return $(this).each(function ()
        {
            var $source = $(this).hide()
            var $target = E('div', $source.attr('class')+' with-combotextinput',
                E('div', 'input', 
                    E('span', 'topleft'), 
                    E('input', 'selected-item').attr('type', 'text')
                ).normalize_interaction_states(),
                E('div', 'buttons',
                    E('a', 'up-button').attr('href', '#').normalize_interaction_states(),
                    E('a', 'down-button').attr('href', '#').normalize_interaction_states()
                )
            )
            
            if ($source.is(':disabled'))
            {
                $target.addClass('disabled').find('input').attr('disabled', true)
            }
            
            $source.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $target
                        .addClass('disabled')
                        .removeClass('expanded')
                        .find('input').removeAttr('disabled')
                }
                else
                {
                    $target.removeClass('disabled')
                }
            })
            
            $source.removeClass('spinner').after($target)
            
            var options = []
            
            $source.find('option').each(function (i)
            {
                options.push($(this).html())
            })
            
            var current_index = $source.get(0).selectedIndex
			var custom_value = null
            
			var update_values = function ()
			{
				if (current_index < 0)
				{
					$target.find('.selected-item').val(custom_value)
					$source.get(0).selectedIndex = -1
					$source.val(custom_value)
				}
				else
				{
					custom_value = null
					$target.find('.selected-item').val(options[current_index])
					$source.get(0).selectedIndex = current_index
				}
			}
			
			$source.change(function ()
			{
				current_index = $source.get(0).selectedIndex
				update_values()
			})
			
			$target.find('input').change(function ()
			{
				var match = false
				var $options = $source.find('option')
				var val = $(this).val()
				
				for (var i=0; i<$options.length; i++)
				{
					if (val == $options.eq(i).val())
					{
						match = true
						current_index = i
						break
					}
				}
				
				if (match)
				{
					$source.get(0).selectedIndex = current_index
				}
				else
				{
					$source.get(0).selectedIndex = -1
					custom_value = val
				}
				
				$source.change()
			})
			
            var spin_up = function ()
            {
                current_index++
                current_index = current_index == options.length ? 0 : current_index
                update_values()
				$source.change()
            }
            
            var spin_down = function ()
            {
				current_index--
                current_index = current_index < 0 ? options.length - 1 : current_index
                update_values()
				$source.change()
            }
            
            $target
                .find('.selected-item')
                    .focus(function ()
                    {
                        $target.find('.input').addClass('focus')
                    })
                    .blur(function ()
                    {
                        $target.find('.input').removeClass('focus')
                    })
                    .val($source.find('option:selected').html())
                .end()
                .find('.up-button')
                    .click(function (e)
                    {
                        e.preventDefault()
                        
                        if ($target.is('.disabled'))
                        {
                            return
                        }
                        
                        spin_up()
                    })
                .end()
                .find('.down-button')
                    .click(function (e)
                    {
                        e.preventDefault()
                        
                        if ($target.is('.disabled'))
                        {
                            return
                        }
                        
                        spin_down()
                    })
        })
    }
    
    $(document).click(function (e)
    {
        if ($selected_spinner)
        {
            $selected_spinner.removeClass('expanded')
        }
    })
    
    $(function () { $('select.spinner').spinner() })
})(jQuery)