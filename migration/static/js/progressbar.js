(function ($)
{
    $.fn.progressbar = function (options)
    {
        var options = $.extend(
        {
            animated: true
        }, options)
        
        return this.each(function ()
        {
            var $progressbar = $(this).append(
                E('div', 'track', E('div')),
                E('div', 'bar',
                    E('div', 'bar-left'),
                    E('div', 'bar-right')
                )
            )
            
            var min_width = $progressbar.find('.bar-right').width()
            var max_width = $progressbar.find('.track').outerWidth(true) - 
                                     $progressbar.find('.bar-left').width() - 
                                     parseInt($progressbar.find('.bar-left').css('margin-left')) - 
                                     min_width
            
            var update_value = function (animated)
            {
                var val = parseFloat($progressbar.val())
                
                if (isNaN(val))
                {
                    val = 0
                }
                
				if (val == 0)
				{
					$progressbar.find('.bar').hide()
				}
				else
				{
					$progressbar.find('.bar').show()
				}
				
                var new_width = (min_width + max_width * val) + 'px'
                
                if (animated)
                {
                    $progressbar.find('.bar-right').animate(
                    {
                        width: new_width
                    })
                }
                else
                {
                    $progressbar.find('.bar-right').css('width', new_width)
                }
				
				if (val == 1)
				{
					$progressbar.addClass('complete')
				}
				else
				{
					$progressbar.removeClass('complete')
				}
            }
            
            $progressbar.change(function ()
            {
                update_value(options.animated)
            })
            
            update_value(false)
        })
    }
    
    var oldval = $.fn.val
    $.fn.val = function (value)
    {
        if (this.is('.progressbar'))
        {
            if (typeof value == "undefined")
            {
                return parseFloat(this.attr('value'))
            }
            else
            {
                this.attr('value', value)
                this.trigger('change')
            }
        }
        else
        {
            return oldval.call(this, value)
        }
    }
    
    $(function ()
	{
		$('.progressbar').progressbar()
	})
})(jQuery)