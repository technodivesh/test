(function ($)
{
    $.fn.slider = function ()
    {
        return $(this).each(function ()
        {
            var $thumb = E('a', 'thumb')
                                .attr('href', '#')
                                .normalize_interaction_states()
                                .click(function (e)
                                {
                                    e.preventDefault()
                                })
                                
            var $slider = $(this)
                            .appendlist([
                                    E('span', 'track-left'),
                                    E('span', 'track-right'),
                                    $thumb
                            ])
            
            var val = parseFloat($slider.attr('value'))
            $slider.val(val)
            
            var drag_position = {}
            var $document = $(document)
            var max_left = -1 * ($thumb.width()/2)
            
            var update_value = function ()
            {
                $slider.val(
                    (parseInt($thumb.css('left')) - max_left) / $slider.width()
                )
				$('.slider').attr('value',$slider.val())			
            }
            
            var drag_start = function (e)
            {
                e.preventDefault()
                e.stopPropagation()
                
                if ($slider.is('.disabled'))
                {
                    return
                }
                
                should_hide_scrollbar = false
                
                drag_position.mouse_start = e.pageX
                drag_position.start = parseInt($thumb.css('left'))
                
                $document
                    .bind('mousemove', drag_move)
                    .bind('mouseup', drag_end)
                
                $thumb.bind('mouseup', drag_end)
                
                document.ontouchmove = function (e)
                {
                    $document.unbind('mousemove', drag_move)
                    drag_move(e)
                    return false
                }
                
                $thumb.get(0).ontouchend = document.ontouchend = function (e)
                {
                    $document.unbind('mouseup', drag_end)
                    $thumb.unbind('mouseup')
                }
                
                return false
            }
            
            var drag_move = function (e)
            {
                var max_right = $slider.width() + max_left;
				var thumb_offset = drag_position.start + (e.pageX - drag_position.mouse_start)
                thumb_offset = Math.min(Math.max(thumb_offset, max_left), max_right)
                
                $thumb.css('left', thumb_offset+'px')
                update_value()
            }
            
            var drag_end = function (e)
            {
                $document
                    .unbind('mousemove', drag_move)
                    .unbind('mouseup', drag_end)
                    
                $thumb
                    .unbind('mouseup', drag_end)
                    
                document.ontoucnmove = null
                document.ontouchend = null
            }
            
            $thumb
                .css('left', (max_left + $slider.width() * val) + 'px')
                .bind('mousedown', drag_start)
                .get(0).ontouchstart = function (e)
                {
                    e.preventDefault()
                    $thumb.unbind('mousedown')
                    drag_start(e)
                    return false
                }
        })
    }
    
    $(function () { $('.slider').slider() })
})(jQuery)