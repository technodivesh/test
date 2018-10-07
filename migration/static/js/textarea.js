(function ($)
{
    $.fn.textarea = function ()
    {
        return $(this).each(function ()
        {
            var $textarea = $(this)
            var $container = E('div', 'textarea',
                E('div', 'textarea-content', E('div', 'textarea-inner')),
                E('div', 'textarea-bottom', E('div'))
            )
            
            if ($textarea.is(':disabled'))
            {
                $container.addClass('disabled')
            }
            
            $textarea.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $container
                        .addClass('disabled')
                }
                else
                {
                    $container.removeClass('disabled')
                }
            })
            
            $textarea
                .after($container).appendTo(
                    $container.find('.textarea-content')
                )
                .hover(
                function ()
                {
                    $container.addClass('hover')
                },
                function ()
                {
                    $container.removeClass('hover')
                })
                .focus(function ()
                {
                    $container.addClass('focus')
                })
                .blur(function ()
                {
                    $container.removeClass('focus')
                })
        })
    }
    
    $(function () { $('textarea').textarea() })
})(jQuery)