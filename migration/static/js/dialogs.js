/**
 * Page-centered dialogs.
 */
(function ($)
{
    var $window = $(window)
    var $dimmer = E('div', 'dialog-dimmer').hide().appendTo('body')
    
    var position_dimmer = function ()
    {
        if ($dimmer.is(':hidden'))
        {
            return
        }
        
        $dimmer.css({
            top: $window.scrollTop(),
            left: $window.scrollLeft()
        })
    }
    
    $window.scroll(position_dimmer)
    
    var position_dialog = function ($dialog)
    {
        // Position the dialog
        // in the center of the screen
        var top = ($window.height() - $dialog.outerHeight()) * .46 + $window.scrollTop()
        var left = ($window.width() - $dialog.outerWidth()) / 2 + $window.scrollLeft()
        
        $dialog.css(
        {
            top: top + 'px',
            left: left + 'px'
        })
    }
    
    var setup_dragbar = function ($dialog, $dragbar)
    {
        // Handle events on the (optional) drag bar
        
        var is_dragging = false
        var last_event = null
        
        var onmove = function (e)
        {
            e.preventDefault()
            
            if (!is_dragging)
            {
                is_dragging = true
                last_event = e
                return
            }
            
            var diff = {
                top: e.pageY - last_event.pageY,
                left: e.pageX - last_event.pageX
            }
            
            $dialog.css(
            {
                top: (parseInt($dialog.css('top')) + diff.top) + 'px',
                left: (parseInt($dialog.css('left')) + diff.left) + 'px',
            })
            
            last_event = e
        }
        
        var onup = function (e)
        {
            $(document).unbind('mousemove', onmove)
            $(document).unbind('mouseup', onup)
            is_dragging = false
        }
        
        $dragbar
            .bind('mousedown', function (e)
            {
                e.preventDefault()
                $(document).bind('mousemove', onmove)
                $(document).bind('mouseup', onup)
            })
    }
    
    // Create a new dialog
    $.fn.dialog = function ()
    {
        return this.each(function (options)
        {
			var $dialog = $(this)
			
            options = $.extend(
            {
                // If true, there will be no close button.
                // This can also be set by adding a class of "modal" to the 
                // source element.
                is_modal: $dialog.is('.modal'),
                
                // If true, the dialog will have a rop shadow
                has_shadow: $dialog.is('.with-shadow'),
                
                // If true, reposition the dialog to the center of the viewport
                // when the viewport size changes
                position_on_resize: !$dialog.is('.inline'),
                
                // If true, dims the background when the dialog is opened.
                // This can also be set by adding a class of "dim" to the 
                // source element.
                dim_on_open: $dialog.is('.dim')
                
            }, options)
            
            var $dialog = $(this)
            
            $dialog
                .addClass('dialog')
                .wrapInner(E('div', 'content', E('div', 'inner')))
                .append(E('div', 'bottom', E('div')))
                .find('> .content')
                    .prepend(E('div', 'top'))
                .end()
                .bind('open', function ()
                {
                    position_dialog($(this))
                    
                    if (options.dim_on_open)
                    {
                        position_dimmer()
                    }
                    
                    if ($.browser.msie && parseInt($.browser.version) < 9)
                    {
                        if (options.dim_on_open)
                        {
                            $dimmer.show()
                        }
                        
                        $(this).show()
                    }
                    else
                    {
                        if (options.dim_on_open)
                        {
                            $dimmer.fadeIn(250)
                        }
                        
                        $(this).fadeIn(750)
                    }
                })
                .bind('close', function ()
                {
                    if ($.browser.msie && parseInt($.browser.version) < 9)
                    {
                        if (options.dim_on_open)
                        {
                            $dimmer.hide()
                        }
                        
                        $(this).hide()
                    }
                    else
                    {
                        if (options.dim_on_open)
                        {
                            $dimmer.fadeOut(750)
                        }
                        
                        $(this).fadeOut(500)
                    }
                })
            
            var $title = $dialog.find('.title')
            
            if ($title.length > 0)
            {
                $title
					.wrapInner(E('div', 'content'))
                    .prepend(E('div', 'dragbar', E('div')))
					
            }
            
            if (!options.is_modal)
            {
                E('a', 'close').attr('href', '#').appendTo($dialog)
                    .click(function (e)
                    {
                        e.preventDefault()
                        $dialog.trigger('close')
                    })
            }
            
            if (options.has_shadow)
            {
                $dialog.append('<div class="shadow"><div></div></div>')
            }
            
            var $dragbar = $dialog.find('.dragbar')
            
            if ($dragbar.length > 0)
            {
                $dialog.addClass('draggable')
                setup_dragbar($dialog, $dragbar)
            }
            
            if (options.position_on_resize)
            {
                $window.resize(function ()
                {
                    if ($dialog.is(':visible'))
                    {
                        position_dialog($dialog)
                    }
                })
            }
            
            if ($dialog.is('.error,.warning'))
            {
                $dialog.find('> .content > .inner > .title > .content h1')
                    .prepend(E('span', 'icon'))
            }
        })
    }
    
	NSNReady(function () { 
		// Setup dialogs already on the page
	    $('.dialog').dialog()
	 })
})(jQuery)