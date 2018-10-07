(function ($)
{
    $.fn.tabs = function ()
    {
        return this.each(function ()
        {
            var $tabs = $(this)
                            .wrap(E('div', 'tabs-container'))
                            .removeClass('tabs')
                            .addClass('tab-links')
                            
            var $container = $tabs.parent()
            
            var number_of_tabs = $tabs.find('> li').length
            var tabs = []
            var bodies = []
            
			$tabs.find('> li > .tab_content').each(function ()
            {
                var $body = E('div', 'tab-body', $(this))
                bodies.push($body)
                $body
                    .find('.tab_content')
                        .append(E('div', 'topleft'))
                    .end()
                    .appendTo($container)
            })
			
            $tabs.find('> li').each(function (i)
            {
                var $tab = $(this)
                tabs.push($tab)
                $tab
                    .css('z-index', number_of_tabs - i)
                    .find('> a')
                        .wrapInner(E('span', 'border-container'))
                        .prepend(E('span', 'topleft'))
                        .click(function (e)
                        {
                            e.preventDefault()
                            
                            if ($tab.is('.selected'))
                            {
                                return
                            }
                            
                            $container
                                .find('.tab-body.selected')
                                    .removeClass('selected')
                                .end()
                            
                            tabs.forEach(function ($tab, i)
                            {
                                if ($tab.is('.selected'))
                                {
                                    $tab
                                        .removeClass('selected')
                                        .css('z-index', number_of_tabs - i)
                                }
                            })
                            
                            tabs[i]
                                .addClass('selected')
                                .css('z-index', 1000)
                            bodies[i].addClass('selected')
                            
                            $tabs.trigger('tabchange', i)
                        })
            })
            
			$tabs.find('li:first-child a').trigger('click')
        })
    }
    
    $(function () { $('.tabs:not(.secondary .tabs)').tabs() })
})(jQuery)