(function ($)
{
    $.fn.tabbuttons = function ()
    {
        return $(this).each(function ()
        {
            var $tabs = $(this).addClass('clearfix')
            $tabs
                .find('li').each(function ()
                {
                    $(this)
                        .wrapInner(E('a', E('span', 'button-text')).attr('href', '#'))
                        .prepend(E('span', 'topleft'))
                        .find('a')
                            .click(function (e)
                            {
                                e.preventDefault()
                                var $tab = $(this).parent()
                                
                                if ($tab.is('.selected') || $tabs.is('.disabled'))
                                {
                                    return
                                }
                                
                                $tabs.find('.selected').removeClass('selected')
                                $tab.addClass('selected')
                                $tabs.trigger('change')
                            })
                })
                .end()
                .find('li:first-child').addClass('first-child').end()
                .find('li:last-child').addClass('last-child').end()
        })
    }
    
    $(function () { $('.tabbuttons').tabbuttons() })
})(jQuery)