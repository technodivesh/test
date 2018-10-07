(function ($)
{
    $.fn.search = function (options)
    {
        var options = $.extend(
        {
            // Include an options pulldown
            // When an option is selected, the "optionselected" event is triggered.
            options: null,
            
            // Show a cancel/clear button
            // The "cancel" event is triggered when this button is clicked.
            show_cancel_button: false,
            
            //Show a submit button
            //The "search" event is triggered when this button is clicked.
            show_search_button: false,
            search_button_text: 'Search',
            
            // Take a search string and use the provided callback to pass in a list
            // of strings to display in the search box's drop down. When an option is
            // clicked the "resultselected" event is triggered.
            onsearch: function (search_string, callback) { }
            
        }, options)
        
        return this.each(function ()
        {
            var $input = $(this)
            var $container = E('div', 'search-input').insertAfter($input)
            $container.appendlist([
                E('span', 'topleft'),
                E('a', 'options').attr('href', '#'),
                E('div', 'text-input', $input),
                (options.show_cancel_button ? E('a', 'cancel').attr('href', '#').css('opacity', 0) : null)
            ])
            
            if (options.options)
            {
                $container.addClass('with-options-pulldown')
            }
            
            if (options.show_cancel_button)
            {
                $container.find('.text-input').addClass('with-cancel')
            }
            
            if (options.show_search_button)
            {
                $container
                    .addClass('with-search-button')
                    .append(
                        E('a', 'search-button', 
                            E('span', 'topleft'),
                            E('span', 'button-text', T(options.search_button_text))
                        )
                        .attr('href', '#')
                    )
					.find('input')
						.css('right', $container.find('.search-button').outerWidth() + 5)
            }
            
            if ($input.is('[disabled]'))
            {
                $container.addClass('disabled')
            }
            
            $input.watch('disabled', function (is_disabled)
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
            
            var $pulldown = E('div', 'search-input-pulldown', E('ul')).appendTo('body')
            var showing_options = false
            
            var show_pulldown = function (items)
            {
                $pulldown
                    .find('ul')
                        .html('')
                        .append(E('li', 'topleft'))
                        .appendlist(
                            items.map(function (item, i)
                            {
                                return E('li', 
                                    E('a', E('span', T(item)))
                                        .attr('href', '#')
                                        .click(function (e)
                                        {
                                            e.preventDefault()
                                            $input.trigger(showing_options ? 'optionselected' : 'resultselected', i)
                                        })
                                    )
                            })
                        )
                        .append(E('li', 'bottom', E('span')))
                        
                $container.addClass('expanded')
                
                var pos = $container.offset()
                
                $pulldown.css(
                {
                    top: pos.top + $container.height() - 1,
                    left: pos.left - parseInt($container.css('margin-left')) - parseInt($pulldown.css('padding-left')),
                    width: $container.outerWidth() + parseInt($container.css('margin-left')) - parseInt($pulldown.css('margin-left'))
                }).show()
            }
            
            var hide_pulldown = function ()
            {
                $container.removeClass('expanded showing-options')
                $pulldown.hide()
                showing_options = false
            }
            
            $container
                
                .find('.options')
                    .click(function (e)
                    {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        if ($input.is(':disabled'))
                        {
                            return
                        }
                        
                        if (!options.options)
                        {
                            return
                        }
                        
                        if ($container.is('.expanded'))
                        {
                            hide_pulldown()
                        }
                        else
                        {
                            showing_options = true
                            show_pulldown(options.options)
                            $container.addClass('showing-options')
                        }
                    })
                .end()
                
                .find('.cancel')
                    .click(function (e)
                    {
                        e.preventDefault()
                        
                        if ($input.is(':disabled'))
                        {
                            return
                        }
                        
                        $input
                            .val('')
                            .trigger('cancel')
                        
                        $container.find('.cancel').css('opacity', 0)
                    })
                .end()
                
                .find('.search-button')
                    .click(function (e)
                    {
                        e.preventDefault()
                        
                        if ($input.is(':disabled'))
                        {
                            return
                        }
                        
                        $input.trigger('search')
                    })
                .end()
                
                
            $input
                .hover(
                    function ()
                    {
                        $container.addClass('hover')
                    },
                    function ()
                    {
                        $container.removeClass('hover')
                    }
                )
                .focus(function ()
                {
                    $container.addClass('focus')
                })
                .blur(function ()
                {
                    $container.removeClass('focus')
                })
                .bind('keyup', function (e)
                {
                    if (e.altKey || e.ctrlKey)
                    {
                        return
                    }
                    
                    switch (e.keyCode)
                    {
                    case 9:
                    case 13:
                    case 27:
                        break;
                    default:
                        var text = $input.val()
                        
                        if (text.length > 0)
                        {
                            $container.find('.cancel').css('opacity', 1)
                        }
                        else
                        {
                            $container.find('.cancel').css('opacity', 0)
                        }
                        
                        options.onsearch($input.val(), function (results)
                        {
                            if (results && results.length > 0)
                            {
                                show_pulldown(results)
                            }
                            else
                            {
                                hide_pulldown()
                            }
                        })
                    }
                })
                
            $(document).click(function ()
            {
                hide_pulldown()
            })
        })
    }
})(jQuery)