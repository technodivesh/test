(function ($)
{
    var window_padding = 20
    var $bubble = E('div',
            E('div', 'content',
                E('div', 'topleft'),
                E('div', 'inner')
            ),
            E('div', 'bottom',
                E('div')
            ),
            E('div', 'arrow')
        )
        .attr('id', 'bubble')
        .appendTo('body')
    
    var $arrow = $bubble.find('.arrow')
    
    var position_bubble = function ($trigger)
    {
        $bubble.css({
            top: 0,
            left: '-10000px'
        }).show()
        
        var factor = $trigger.is('.west') ? .85 : .15
        
        var bubble_pos = $trigger.offset()
        bubble_pos.top += $trigger.height() + 10
        bubble_pos.left -= $bubble.outerWidth() * factor - $trigger.width() / 2
        
        var arrow_pos = {
            left: $bubble.width() * factor - $arrow.width() / 2
        }
        
        var shift = 0
        
        if (bubble_pos.left < 0)
        {
            shift = bubble_pos.left * -1
        }
        else if (bubble_pos.left + $bubble.outerWidth() > $(window).width())
        {
            shift = $(window).width() - bubble_pos.left + $bubble.outerWidth()
        }
        
        if (shift != 0)
        {
            bubble_pos.left += shift
            arrow_pos.left -= shift
        }
        
        $bubble
            .hide()
            .css(
            {
                top: bubble_pos.top,
                left: bubble_pos.left
            })
            
        $arrow.css(
        {
            left: arrow_pos.left
        })
    }
    
    $.fn.bubble = function ()
    {
        return this.each(function ()
        {
            var $trigger = $(this)
            var $content = null
            
            if ($trigger.attr('id'))
            {
                $content = $('.bubble-content[for='+$trigger.attr('id')+']')
                
                if ($content.length == 0)
                {
                    $content = null
                }
            }
            
            if (!$content)
            {
                $content = E('div', T($trigger.attr('title') || ''))
            }
            
			if ($content.is('.with-close'))
			{
				$content.append(
					E('a', 'close')
						.attr('href', '#')
						.click(function (e)
						{
							e.preventDefault()
							hide()
						})
				)
			}
			
            $trigger.removeAttr('title')
            
			$(window).resize(function ()
			{
				position_bubble($trigger)
			})
			
            var show = function ()
            {
                if ($bubble.is('.visible'))
                {
                    return
                }
                
                $bubble.addClass('visible')
                
                $bubble.find('.content .inner').html('').append($content.show())
                position_bubble($trigger)
                
                if ($.browser.msie && parseInt($.browser.version) < 9)
                {
                    $bubble.show()
                }
                else
                {
                    $bubble.fadeIn(250)
                }
            }
            
            var hide = function ()
            {
                if (!$bubble.is('.visible'))
                {
                    return
                }
                
                $bubble.removeClass('visible')
                
                if ($.browser.msie)
                {
                    $bubble.hide()
                    $content.hide().appendTo('body')
                }
                else
                {
                    $bubble.fadeOut(250, function ()
                    {
                        $content.hide().appendTo('body')
                    })
                }
            }
            
            if ($trigger.is('.hover'))
            {
                $trigger.hover(
                    function ()
                    {
                        show()
                    },
                    function ()
                    {
                        hide()
                    }
                )
            }
            
            $trigger
                .bind('bubbleshow', show)
                .bind('bubblehide', hide)
        })
    }
    
	NSNReady(function () { $('.bubble').bubble() })
})(jQuery)