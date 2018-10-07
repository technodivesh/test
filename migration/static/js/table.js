(function ($)
{
    var add_sort_indicator = function ($table, $elms)
    {
        $elms.each(function ()
        {
            var $elm = $(this)
            
            $elm.click(function (e)
            {
                if (!$elm.is('.selected'))
                {
                    $table
                        .find('thead th.selected')
                        .not($elm)
                            .removeClass('selected')
                    
                    $elm
                        .addClass('selected')
                }
                else
                {
                    $elm.toggleClass('up')   
                }
            })
            .each(function ()
            {
                $(this).appendlist([T(' '),E('span', 'arrow')])
            })
        })
    }
    
    $.fn.list_table = function ()
    {
        return $(this).each(function ()
        {
            var $table = $(this).attr(
            {
                cellpadding: 0,
                cellspacing: 0
            })
            
            add_sort_indicator($table, $table.find('thead th'))
            
            $table.find('th,td').each(function ()
            {
                var $cell = $(this)
                
                if ($cell.html())
                {
                    $cell.wrapInner(E('div', 'cell', E('span', 'content')))
                }
                else
                {
                    $cell.append(E('div', 'cell'))
                }
            })
            
            $table
                .find('.expandable > tr:first-child > th:first-child > .cell')
                    .prepend(E('span', 'arrow'))
                    .click(function (e)
                    {
                        e.preventDefault()
                        var $tbody = $(this).parents('tbody.expandable')
                        
                        if ($tbody.is('.collapsed'))
                        {
                            $tbody.removeClass('collapsed')
                            $tbody.find('tr:hidden').fadeIn(150)
                        }
                        else
                        {
                            $tbody.addClass('collapsed')
                            $tbody.find('tr:first-child ~ tr').fadeOut(150)
                        }
                    })
                .end()
                .find('.expandable.collapsed > tr:not(:first-child)')
                    .hide()
            
            $table
                .find('.cell')
                    .append(E('div', 'inner'))
                .end()
                .find('tbody:not(.group) > tr > td, tbody > tr > th')
                    .addClass('selectable-item')
                .end()
                .find('tbody.group')
                    .addClass('selectable-item')
                    .find('tr:not(:last-child) td:not(:first-child)')
                        .addClass('separated-item')
                    .end()
                    .find('tr:last-child')
                        .addClass('last-row')
                    .end()
                .end()
                .find('.selectable-item')
                    .click(function (e)
                    {
                        e.preventDefault()
                        
                        var $cell = $(this)
                        
                        if (!$cell.is('.selected'))
                        {
                            $table.find('.selectable-item.selected').removeClass('selected')
                            $cell.addClass('selected')
                        }
                    })
                .end()
            
            // IE doesn't handle first/last-child selectors properly so
            // we need to use classes.
            $table
                .find('tr:first-child,th:first-child,td:first-child')
                    .addClass('first-child')
                .end()
                .find('tbody:last-child, tbody:last-child tr:last-child,th:last-child,td:last-child')
                    .addClass('last-child')
        })
    }
    
	NSNReady(function () { $('table.list').list_table() })
    
    $.fn.datatable = function ()
    {
        var colors = [
            '#00C9FF',
            '#474747',
            '#A8BBC0',
            '#D8D9DA',
            '#0B6DAF',
            '#68717A',
            '#B2E3F0',
            '#FF9900',
            '#FFCC00',
            '#124191'
        ]
        
        return $(this).each(function ()
        {
            var $table = $(this)
            var selected_row = -1
            var selected_column = -1
            
            var row_hover_on = function ()
            {
            }
            
            var row_hover_off = function ()
            {
            }
            
            var row_select = function ()
            {
                var $row = $(this).parent()
                var index = $row.index()
                
                if (index == selected_row)
                {
                    return
                }
                
                $table.trigger('row-selected', index)
                
                $table.find('.selected').removeClass('selected')
                $row.addClass('selected')
                
                selected_row = index
                selected_column = -1
            }
            
            var column_hover_on = function ()
            {
            }
            
            var column_hover_off = function ()
            {
            }
            
            var column_select = function ()
            {
                var $cell = $(this)
                var index = $cell.index()
                
                if (index == selected_column)
                {
                    return
                }
                
                $table.trigger('column-selected', index)
                
                $table.find('.selected').removeClass('selected')
                
                if (index == 0)
                {
                    $table.find('tbody th').addClass('selected')
                }
                else
                {
                    $table.find('tbody td:nth-child('+(index+1)+')').addClass('selected')
                }
                
                $cell.addClass('selected')
                
                selected_column = index
                selected_row = -1
            }
            
            $table.find('tbody tr').each(function (i)
            {
                var $row = $(this)
                
                if (i % 2 == 0)
                {
                    $row.addClass('alt')
                }
                
                $row.find('th')
                    .prepend(
                        E('div', 'marker').css('background-color', colors[i%colors.length])
                    )
                    .wrapInner(E('div', 'header', E('div', 'datatable-inner')))
                    .find('.header')
                        .prepend(E('div', 'datatable-left'))
                    .end()
                    .hover(row_hover_on, row_hover_off)
                    .click(row_select)
            })
            
            $table
                .find('thead th')
                    .wrapInner(E('div', 'header', E('div', 'datatable-inner')))
                    .find('.header .datatable-inner')
                        .append(E('div', 'datatable-left'))
                    .end()
                    .find('.header')
                        .append(E('div', 'datatable-bottom', E('div')))
                        .append(E('div', 'datatable-arrow'))
                    .end()
                    .hover(column_hover_on, column_hover_off)
                    .click(column_select)
                .end()
                .find('tbody td')
                    .wrapInner(
                        E('div', 'datatable-content')
                    )
                    .find('.datatable-content')
                        .append(E('div', 'strip', E('div')))
                .end()
        })
    }
    
    NSNReady(function () { $('table.data').datatable() })
   	
    $.fn.standard_table = function ()
    {
        return this.each(function ()
        {
            var $table = $(this)
			
			// Setup filter cells, if we have them
			if ($table.find('thead tr.filters').length > 0)
			{
				$table
					.addClass('with-filters')
					.find('thead th.has-filter')
						.append(E('div', 'filter-icon'))
						.wrapInner(E('div', 'inner'))
					.end()
					.find('tr.filters select')
						.addClass('combotextinput small')
						.pulldown()
					.end()
					.find('thead tr:first-child')
						.append(E('th').html('&nbsp;'))
					.end()
					.find('tbody tr')
						.append(E('td').html('&nbsp;'))
					.end()
					.find('thead tr:last-child')
						.append(
							E('th')
								.append(E('a', 'clear-filters', T('Clear filters')).attr('href', '#'))
						)
			}
            
			// IE doesn't handle first/last-child selectors properly so
            // we need to use classes. Also, we need to set the last row
			// of tbody to .last-child ONLY if we do not have a footer
            $table
                .find('tbody:first-child,tr:first-child,th:first-child,td:first-child')
                    .addClass('first-child')
                .end()
                .find('tbody:last-child,tr:last-child,th:last-child,td:last-child')
                    .addClass('last-child')
                .end()
                .find('tbody tr:nth-child(even)')
                    .addClass('alt')
                .end()
                .find('thead th:last-child, tbody td:last-child')
                    .wrapInner(E('div', 'cell'))
                    .find('.cell')
                        .append(E('div', 'inner'))
            
            var $selection_unit = null;
            
            if ($table.is('.cell-selection'))
            {
                $selection_unit = $table.find('tbody td')
            }
            else if ($table.is('.row-selection'))
            {
                $selection_unit = $table.find('tbody tr')
            }
            
            if ($selection_unit)
            {
                $selection_unit.click(function (e)
                {
                    $table.find('.selected').removeClass('selected')
                    $(this).addClass('selected')
                })
            }
            
            $table.find('td.alarm').each(function ()
            {
                $(this).append(E('div', 'alarm-container',
                        E('div', 'strip'),
                        E('span', 'icon')
                ))
            })
            
            add_sort_indicator($table, $table.find('thead th.sortable'))
			
			$table.bind('alert', function (e, alert_text)
			{
				var $alert = $table.is('.with-scrolling') ? $table.parent().find('.alert-row') : $table.find('.alert-row')
				
				if ($alert.length == 0)
				{
					if ($table.is('.with-scrolling'))
					{
						$alert = E('div', 'alert-row',
							E('div', 'alert-container',
								E('div', 'topleft'),
								E('div', 'content'),
								E('div', 'icon'),
								E('a', 'close').attr('href', '#')
							)
						).insertAfter($table.parent().find('.header-container'))
					}
					else
					{
						$alert = E('tr', 'alert-row',
							E('th')
								.attr('colspan', $table.find('thead tr:first-child th').length)
								.append(
									E('div', 'alert-container',
										E('div', 'topleft'),
										E('div', 'content'),
										E('div', 'icon'),
										E('a', 'close').attr('href', '#')
									)
								)
						).appendTo($table.find('thead'))
					}
					
					$alert.find('.close').click(function (e)
					{
						e.preventDefault()
						$alert.hide()
					})
				}
				
				$alert.find('.content').html(alert_text)
				$alert.show()
			})
        })
    }
	
	// Here's the general approach:
	// Create two new tables, one for the table's head and one for the body.
	// Put each in its own container so that they can be moved around independently.
	// Add scrollbars in the top level container.
	// Move the body table around both vertically and horizontally within its container.
	// Move the head table around only horizontally within its container.
	// We move the thead and tbody elements rather than cloning them so that
	// any references to them or their children will be maintained.
	
	// We extend the standard scrollbar object for use within tables.
	var TableScrollbar = function ($table_container, $scroll_container, axis)
	{
		this.$table_container = $table_container
		NSNScrollbar.call(this, $scroll_container, axis)
		
		if (axis == 'horizontal')
		{
			this.$head = $table_container.find('.header-container table')
		}
	}
	TableScrollbar.prototype = $.extend({}, NSNScrollbar.prototype)
	$.extend(TableScrollbar.prototype, 
	{
		// We override NSNScrollbar's position_changed() method
		// to pass on horizontal offsets to the table's head
		onpositionchange: function (content_offset, animated)
		{
			if (this.$head)
			{
				if (animated)
				{
					this.$head.animate({ left: content_offset }, this.animation_duration)
				}
				else
				{
					this.$head.css('left', content_offset)
				}
			}
		},
		
		onsizechange: function ()
		{
			if (this.$container.is('.scrollbars-horizontal-visible'))
			{
				this.$table_container.addClass('scrollbars-horizontal-visible')
			}
			else
			{
				this.$table_container.removeClass('scrollbars-horizontal-visible')
			}
			
			if (this.$container.is('.scrollbars-vertical-visible'))
			{
				this.$table_container.addClass('scrollbars-vertical-visible')
			}
			else
			{
				this.$table_container.removeClass('scrollbars-vertical-visible')
			}
		}
	})
	
	$.fn.scrolling_table = function ()
	{
		return this.each(function ()
		{
			var $container = $(this)
			var $table = $container.find('table')
			$table.addClass('with-scrolling')
			
			$container
				.addClass('horizontal vertical')
				.find('thead th.last-child,thead th.first-child,tbody td.last-child,tbody td.first-child')
					.removeClass('last-child first-child')
				.end()
				.find('tbody td:first-child')
					.addClass('scrolling-first-child')
				.end()
				.find('tbody.last-child,tr.last-child')
					.removeClass('last-child')
			
			if ($table.is('.with-filters'))
			{
				$container.addClass('with-filters')
				$table
					.find('thead tr:first-child th:last-child').remove()
					.end()
					.find('thead tr:last-child th:last-child').remove()
					.end()
					.find('tbody tr td:last-child').remove()
			}
			
			// Save the column widths so they can be forced later
			var column_widths = []
			var total_width = 0
			$table.find('thead:first-child tr:first-child th').each(function ()
			{
				var $elm = $(this)
				var width = $elm.innerWidth()
				if (width % 2 == 1)
				{
					width += 1
				}
				column_widths.push(width)
				total_width += width
			})
			
			// Now add back the first and last child classes so that
			// we can apply a different look
			$container
				.find('thead th:first-child,tbody td:first-child')
				.addClass('first-child')
			
			// Move the head and body to separate tables
			// and set up the container elements for scrolling
			$container
				.prepend(
					E('div', 'header-container',
						E('table', $table.attr('class'),
							$table.find('thead')
						)
					),
					E('div', 'scrollbars table-body',
						E('div', 'body-container scrolling-content-container',
							E('table', $table.attr('class') + ' scrolling-content',
								$table.find('tbody')
							),
							E('div', 'bottomleft')
						)
					)
					.css({
						width: $container.width() + 'px',
						height: $container.height() + 'px'
					}),
					E('div', 'topright'),
					E('div', 'topleft')
				)
			
			if ($table.is('.with-filters'))
			{
				$container
					.find('> .topright')
						.append(E('div', 'clear-container',
							E('div', 'topleft'),
							E('a', 'clear-filters', T('Clear filters')).attr('href', '#')
						))
					.end()
					.find('> .topleft')
						.append(E('div'))
			}
			
			var $head = $container.find('.header-container')
			var $body = $container.find('.body-container')
			var $scrollbar_container = $container.find('.scrollbars.table-body')
			
			// create spacer rows
			var $head_spacer = E('tr').prependTo($head.find('thead'))
			var first_cell_padding = parseInt($body.find('tbody tr:first-child td:first-child').css('padding-left'))
			var second_cell_padding = parseInt($body.find('tbody tr:first-child td:last-child').css('padding-left'))
			var first_cell_offset = first_cell_padding - second_cell_padding
			var $body_spacer = E('tr').prependTo($body.find('tbody'))
			
			for (var i=0; i<column_widths.length; i++)
			{
				var style = {
					padding: 0,
					width: column_widths[i] + 'px',
					height: 0,
					background: 'none'
				}
				
				$head_spacer.append(E('th').css(style))
				
				// The first cell of the body has extra left padding
				if (i == 0)
				{
					style.width = column_widths[i] + first_cell_offset + 'px'
				}
				
				$body_spacer.append(E('td').css(style))
			}
			
			// Fix the dimensions of the scrolling body container
			var $header_table = $head.find('table')
			var $body_table = $body.find('table')
			$header_table.width(total_width)
			$body_table.width(total_width)
			var table_width = $header_table.outerWidth(true) + parseInt($head.css('margin-left')) - parseInt($scrollbar_container.css('padding-left'))
			var head_height = $header_table.outerHeight()
			var body_height = $body_table.outerHeight()
			
			if (table_width < $container.width())
			{
				$container.width(table_width + parseInt($scrollbar_container.css('padding-right')) + parseInt($scrollbar_container.css('padding-left')))
				$scrollbar_container.width(table_width)
			}
			else
			{
				var width = $container.width() - parseInt($scrollbar_container.css('padding-right')) - parseInt($scrollbar_container.css('padding-left')) + 'px'
				$scrollbar_container.css('width', width)
			}
			
			if (body_height + head_height < $container.height())
			{
				$container.height(body_height + head_height + parseInt($scrollbar_container.css('padding-top')) + parseInt($scrollbar_container.css('padding-bottom')))
				$scrollbar_container.height(body_height)
			}
			else
			{
				$scrollbar_container.height($container.height() - head_height - parseInt($scrollbar_container.css('padding-top')) - parseInt($scrollbar_container.css('padding-bottom')))
			}
			
			// Add the scrollbars to the body container.
			// The table scrollbar will also move the head if
			// horizontal scrolling is detected
			$container.data('scrollbar-horizontal', 
				new TableScrollbar($container, $scrollbar_container, 'horizontal'))
			$container.data('scrollbar-vertical', 
				new TableScrollbar($container, $scrollbar_container, 'vertical'))
			
			var $foot = $table.find('tfoot')
			
			if ($foot.length > 0)
			{
				$container
					.addClass('with-footer')
					.css('margin-bottom', parseInt($foot.height()) + 'px')
					
				$table.css('width', '100%')
			}
		})
	}
    
	NSNReady(function ()
	{
		$('table.standard').standard_table()
		
		// Setup table scrolling
		$('.scrolling-table').scrolling_table()
	})
})(jQuery)