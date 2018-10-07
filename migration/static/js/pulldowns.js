(function ($)
{
	var $body = $('body')
	var $window = $(window)
	
	var Pulldown = function (type, $source)
	{
		this.$source = $source.hide()
		this.$target = Pulldown.templates[type]
						.clone()
						.addClass($source.attr('class')+' pulldown')
						.insertAfter($source)
		
		if (this.$target.parents('.secondary').length > 0)
		{
			this.$target.addClass('secondary')
		}
		
		// Create the pulldown list elements
		this.$list_wrapper = E('div', 'list-wrapper '+this.$target.attr('class'),
			E('div', 'list-wrapper-inner',
				E('div', 'topleft'),
			 	E('div', 'scrollbars vertical',
					E('ul', 'options')
				),
				E('div', 'bottom', E('div'))
			)
		).appendTo($body)
		this.$scrollbars = this.$list_wrapper.find('.scrollbars')
		
		// Check if this is a required element
		if (this.$source.is('.required'))
        {
            this.$target
                .addClass('required')
                .find('.selected-item').parent()
                    .append(E('span', 'required', T('*')))
        }
        
		// If the current style changes this pulldown to a block
		// element then the selected element needs to be block as well
		if (this.$target.css('display') == 'block')
		{
			this.$target.find('.selected-item').css('display', 'block')
		}
		
		// Link component's disabled state to the source element
        if (this.$source.is(':disabled'))
        {
            this.$target
				.addClass('disabled')
				.find('input').attr('disabled', true)
        }
		
		this.$source.watch('disabled', function (is_disabled)
        {
            if (is_disabled)
            {
				this.collapse()
                this.$target
                    .addClass('disabled')
					.find('input').attr('disabled', true)
            }
            else
            {
                this.$target
					.removeClass('disabled')
					.find('input').removeAttr('disabled')
            }
        }.bind(this))
		
		// Setup the options in the pulldown list
		this.update_options()
		
		// Watch for changes in the source select's options
		this.$source.domchange(this.update_options.bind(this))
		
		// After the options are set up, setup the scrollbars in the list
		this.$scrollbars.scrollbars()
		
		// Setup normalized events for the toggle element
		this.$target
			.find('a')
				.attr('href', '#')
				.click(function (e) { e.preventDefault() })
				.normalize_interaction_states()
			.end()
			.find('.input')
				.normalize_interaction_states()
			.end()
			.find('.pulldown-toggle')
				.bind('focus', function ()
				{
					if ($('.pulldown-toggle').is('.active')){
				      return
				    }
					this.$target.addClass('focus')
					this.$list_wrapper.addClass('focus')				
				}.bind(this))
				.bind('blur', function ()
				{
					this.$target.removeClass('focus')
					this.$list_wrapper.removeClass('focus')
				}.bind(this))
			
		// Handle change events
		this.$source.change(this.onchange.bind(this))
			
		// Make sure clicking a pulldown list doesn't close it
		this.$list_wrapper.click(function (e)
		{
			e.stopPropagation()
		})
		
		// Set up event handlers for showing and hiding the pulldown list
		this.$target.find('.pulldown-toggle').click(function (e)
        {
            e.preventDefault()
            e.stopPropagation()
            this.toggle()
        }.bind(this))
		
		// Hide on window resize
		$window.resize(function ()
		{
			this.collapse()
		}.bind(this))
		
		if (Pulldown.additional_setup[type])
		{
			Pulldown.additional_setup[type].apply(this)
		}
		
		this.collapse()
	}
	$.extend(Pulldown,
	{
		prototype: 
		{
			// Set the options in the pulldown list from the source element
			update_options: function ()
			{
				var options = []
				var option_selected = this.option_selected.bind(this)
				
	            this.$source.find('option').each(function (i)
	            {
	                var $source_option = $(this)
	                var $target_option = E('li', 'option',
	                    E('a')
							.attr('href', '#')
	                        .append(E('span').html($source_option.html()))
	                ).addClass($source_option.attr('class'))

	                $target_option.find('a').click(function (e)
	                {
	                    e.preventDefault()
						option_selected(i)
	                })

	                options.push($target_option)
	            })
				
				this.$list_wrapper.find('ul').html('').appendlist(options)
				this.update_size()
				this.onchange()
			},
			
			// Update the width of the component based on its pulldown list items
			update_size: function ()
			{
				if (this.$target.css('display') == 'block')
				{
					return
				}
				
				var $option_links = this.$list_wrapper.find('li.option a')
				var counter = $option_links.length
				var widths = []
				
				$option_links.each(function (i)
				{
					widths.push($(this).width())
				})
				
				widths.sort(function (a,b) { return a - b })
				this.$target.find('.selected-item').css('width', widths[widths.length-1]+5)
				this.$list_wrapper.css('width', this.$target.outerWidth() + 'px')
				
				// Make sure scrollbars get recalculated
				setTimeout(function ()
				{
					this.$scrollbars.trigger('resize')
				}.bind(this), 0)
			},
			
			option_selected: function (i)
			{
				this.$source.get(0).selectedIndex = i
				this.$source.change()
				this.collapse()
			},
			
			onchange: function ()
			{
				var selected_index = this.$source.get(0).selectedIndex
				var $options = this.$target.find('.options .option')
				
				$options
					.removeClass('selected')
					.eq(selected_index)
					.addClass('selected')
				
				var $source_option = this.$source.find('option').eq(selected_index)
				var $selected_item = this.$target.find('.selected-item')
				
				if ($selected_item.is('input'))
				{
					$selected_item.val($source_option.html())
				}
				else
				{
					$selected_item.html($source_option.html())
				}
			},
			
			toggle: function ()
			{
				if (this.$target.is('.disabled'))
	            {
	                return
	            }

	            if (this.$target.is('.expanded'))
	            {
	                this.collapse()
	            }
	            else
	            {
					this.expand()
	            }
			},
			
			expand: function ()
			{
				if (Pulldown.current && Pulldown.current != this)
				{
					Pulldown.current.collapse()
				}
				
				if (this.$target.css('display') == 'block')
				{
					this.$list_wrapper.css('width', this.$target.width() + 'px')
					this.$scrollbars.trigger('resize')
				}
				
                this.$target
                    .addClass('expanded')
                    .removeClass('collapsed')
				
				var pos = this.$target.offset()
				
				this.$list_wrapper
					.css({
						top: pos.top + this.$target.height() + 'px',
						left: pos.left + 'px'
					})
					.removeClass('collapsed')
					.addClass('expanded')
				
				Pulldown.current = this
			},
			
			collapse: function ()
			{
				this.$target
                    .removeClass('expanded hover')
                    .addClass('collapsed')
					
				this.$list_wrapper
					.css('left', '-10000px')
					.removeClass('expanded')
					.addClass('collapsed')
			}
		},
		
		templates: 
		{
			standard: E('div', 'standard',
				E('a', 'pulldown-toggle',
					E('span', 'selected-item'),
					E('span', 'arrow'),
					E('span', 'topleft')
				)
			),
			
			combotextinput: E('div',
                E('div', 'input', 
                    E('span', 'topleft'), 
                    E('input', 'selected-item').attr('type', 'text')
                ),
                E('a', 'pulldown-toggle')
            ),
			
			'menu-button': E('div',
                E('a', 'trigger')
					.attr('href', '#')
					.append(
						E('span', 'topleft'), E('span', 'selected-item')
					),
                E('a', 'pulldown-toggle')
            )
		},
		
		additional_setup:
		{
			combotextinput: function ()
			{
				var $container = this.$target.find('.input')
				var $input = $container.find('input')
				var placeholder = this.$source.attr('placeholder')
				
				$input
					.bind('focus', function ()
					{
						$container.addClass('focus')
					})
					.bind('blur', function ()
					{
						$container.removeClass('focus')
					})
				
				if (placeholder)
				{
					$input.attr('placeholder', placeholder).placeholder().val('')
				}
			}
		},
		
		current: null
	})
	
	$(document).click(function (e)
    {
        if (Pulldown.current)
        {
			Pulldown.current.collapse()
        }
    })
	
	$(document).bind('nsnscroll', function (e, elm)
	{
		if (Pulldown.current && Pulldown.current.$scrollbars.get(0) != elm)
        {
			Pulldown.current.collapse()
        }
	})
	
    $.fn.pulldown = function ()
    {
		return this.each(function ()
		{
			var $source = $(this)
			var type = 'standard'
			
			for (var n in Pulldown.templates)
			{
				if (Pulldown.templates.hasOwnProperty(n))
				{
					if ($source.is('.'+n))
					{
						type = n
						break
					}
				}
			}
			
			var pulldown = new Pulldown(type, $source)
			$source.data('pulldown', pulldown)
		})
    }
    
	NSNReady(function ()
	{
		$('select.pulldown,select.combotextinput,select.menu-button').pulldown()
	})
})(jQuery)