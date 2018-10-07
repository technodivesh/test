(function ($)
{
    $.fn.splitpane = function ()
    {
        return $(this).each(function ()
        {
            var $container = $(this)
            
            $container
                .find('> div')
                    .wrap(E('div', 'panel', E('div', 'content')))
					.addClass('inner')
					.parents('.panel')
	                    .append(
	                        E('div', 'bottom', E('div'))
	                    )
	                    .find('.content')
	                        .prepend(E('div', 'topleft'))
			$container
                .find('> div:first-child')
                    .after(E('a', 'handle', E('span')).attr('href', '#'))
                .end()
            
            var $handle = $container.find('> .handle')
            
            var fields = $container.is('.vertical')
            ? {
                split_size: 'height',
                split_outer_size: 'outerHeight',
                other_size: 'width',
                other_outer_size: 'outerWidth',
                axis: 'top',
                position: 'pageY'
            }
            : {
                split_size: 'width',
                split_outer_size: 'outerWidth',
                other_size: 'height',
                other_outer_size: 'outerHeight',
                axis: 'left',
                position: 'pageX'
            }
            
            var $first = $container.find('> div:first-child')
            var $first_content = $first.find('> .content')
			var $first_content_inner = $first_content.find('> .inner')
            var $last = $container.find('> div:last-child')
            var $last_content = $last.find('> .content')
			var $last_content_inner = $last_content.find('> .inner')
			
            var update_split = function (percent)
            {
                var total = $container[fields.split_size]() - $handle[fields.split_size]()
                var first_split_size = total * percent
                var last_split_size = total * (1 - percent)
                var other_size = $container[fields.other_size]()
                
                $first_content_inner[fields.split_size](
                    Math.floor(first_split_size - $first_content[fields.split_outer_size](true) + $first_content[fields.split_size]())
                ).trigger('resize')
                
                $last_content_inner[fields.split_size](
                    Math.floor(last_split_size - $last_content[fields.split_outer_size](true) + $last_content[fields.split_size]())
                ).trigger('resize')
                
                $first_content_inner[fields.other_size](
                    Math.floor(other_size - $first_content[fields.other_outer_size](true) + $first_content[fields.other_size]())
                ).trigger('resize')
                
                $last_content_inner[fields.other_size](
                    Math.floor(other_size - $last_content[fields.other_outer_size](true) + $last_content[fields.other_size]())
                ).trigger('resize')
            }
            
            update_split(0.5)
            
            var drag_data = {
                container_pos: 0,
                container_size: 0,
                handle_pos: 0,
                handle_size: 0,
                start_pos: 0,
                min_pos: 0,
                max_pos: 0
            }
            
            var drag_start = function (e)
            {
                e.preventDefault()
                e.stopPropagation()
                
                $.extend(drag_data, 
                {
                    container_pos: $container.offset()[fields.axis],
                    container_size: $container[fields.split_size](),
                    handle_size: $handle[fields.split_size](),
                    start_pos: e[fields.position]
                })
                
                $.extend(drag_data,
                {
                    handle_pos: $handle.offset()[fields.axis] - drag_data.container_pos,
                    min_pos: drag_data.handle_size + 50,
                    max_pos: drag_data.container_size - drag_data.handle_size - 50,
                })
                
                $(document)
                    .bind('mousemove', drag_move)
                    .bind('mouseup', drag_end)
            }
            
            var drag_move = function (e)
            {
                var delta = e[fields.position] - drag_data.start_pos
                var new_handle_pos = Math.min(
                        Math.max(drag_data.handle_pos + delta, drag_data.min_pos), 
                    drag_data.max_pos)
                
                update_split(new_handle_pos / drag_data.container_size)
            }
            
            var drag_end = function ()
            {
                $(document)
                    .unbind('mousemove', drag_move)
                    .unbind('mouseup', drag_move)
            }
            
            $handle
                .bind('mousedown', drag_start)
                .bind('mouseup', drag_end)
				.bind('click', function (e) { e.preventDefault() })
        })
    }
    
    NSNReady(function () { $('.splitpane').splitpane() })
})(jQuery)