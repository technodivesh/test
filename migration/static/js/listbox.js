(function ($)
{
    /**
     * Create a listbox from a select element.
     */
    $.fn.listbox = function ()
    {
        return this.each(function ()
        {
            $source_select = $(this)
            
            if (!$source_select.is('select'))
            {
                return
            }
            
            $target_select = E('ul', 'listbox')
            
            var is_multiple = $source_select.is('[multiple]')
            $target_select.css('width', $source_select.width()+'px')
            
            if ($source_select.is('[multiple]'))
            {
                $target_select.addClass('multiple')
            }
            
            var options = []
            
            $source_select.find('option').each(function ()
            {
                var $source_option = $(this)
                var $target_option = E('li')
                
                $target_option.append(E('a').attr('href', '#').append(E('span').html($source_option.html())))
                
                if ($source_option.is(':selected'))
                {
                    $target_option.addClass('selected')
                }
                
                $target_option.find('a').click(function (e)
                {
                    e.preventDefault()
                    
                    var $parent = $(this).parent()
                    
                    if ($parent.is('.selected'))
                    {
                        $parent.removeClass('selected')
                        $source_option.removeAttr('selected')
                    }
                    else
                    {
                        if (!is_multiple)
                        {
                            $target_select.find('li.selected').removeClass('selected')
                            $source_option.parent().find('option').removeAttr('selected')
                        }
                        
                        $parent.addClass('selected')
                        $source_option.attr('selected', 'true')
                    }
                })
                
                options.push($target_option)
            })
            
            options[0].addClass('first')
            
            $target_select.appendlist(options)
            $source_select.after(E('div', 'select-list', $target_select))
            
            var size = parseInt($source_select.attr('size'))
            
            if (!size)
            {
                size = 5
            }
            
            $target_select.parent()
                .css('height', $target_select.find('li:last-child').outerHeight() * size + 'px')
				.addClass('scrollbars vertical')
                .scrollbars()
        })
    }
    
    NSNReady(function ()
	{
		// Automatically create listbox elements out of select elements
	    // that are already on the page.
	    $('select.listbox').hide().removeClass('listbox').listbox()
	})
    
})(jQuery)
