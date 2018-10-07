// A date or datetime picker
// requires: spinner.js, buttons.js
(function ($)
{
	// Data that may need to be localized
	var data = 
	{
		// Months
		month_names: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
		// Day abbreviations
        day_names: [
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT"
        ],
		// Day format, Y=year, M=month, D=day of month
		date_format: "M/D/Y",
		// Time format, h=12-hour, m=minute a=meridiem
		time_format: "h:ma",
		// Regex patterns for matching parts of a datetime
		patterns: {
			Y: '(\\d{4})',
			M: '(\\d\\d?)',
			D: '(\\d\\d?)',
			h: '(\\d\\d?)',
			m: '(\\d{2})',
			a: '(AM|PM|am|pm)'
		}
	}
	
	
	
	// A month-based calendar view
	var Calendar = function ($container, current_datetime, selected_datetime)
	{
		this.$container = $container
		this.$container.data('calendar', this)
		this.$table = E('table').appendTo(this.$container)
		this.current_datetime = current_datetime
		this.selected_datetime = selected_datetime
	}
	Calendar.prototype = 
	{
		// Draw the days
		draw: function ()
		{
            var days_in_month = 32 - new Date(this.current_datetime.Y, this.current_datetime.M, 32).getDate()
            var weeks = Math.ceil(days_in_month / 7.0)
            var start_day = new Date(this.current_datetime.Y, this.current_datetime.M, 1).getDay()
            
            var rows = [
                E('tr').appendlist(
                    data.day_names.map(function (d)
                    {
                        return E('th', T(d))
                    })
                )
            ]
            
            var day = 1
            var me = this
            for (var i=0; i <= weeks && day <= days_in_month; i++)
            {
                rows.push(E('tr').appendlist(data.day_names.map(function (d, j)
                {
                    var $elm
                    
                    if ((i<1 && j<start_day) || day > days_in_month)
                    {
                        $elm = E('td', 'empty')
                    }
                    else
                    {
                        $elm = E('td', E('div', 'day', T(''+day)))
                                .click((function (day)
                                {
                                    return function ()
                                    {
                                        me.current_datetime.D = day
                                        $.extend(me.selected_datetime, me.current_datetime)
                                        me.$table.find('.selected').removeClass('selected')
                                        $(this).addClass('selected')
                                        me.$container.trigger('date_selected')
                                    }
                                }.bind(this))(day))

                        if (this.current_datetime.Y == this.selected_datetime.Y &&
                            this.current_datetime.M == this.selected_datetime.M &&
                            day == this.selected_datetime.D)
                        {
                            $elm.addClass('selected')
                        }
                        
                        day++
                    }
                    
                    return $elm
                }.bind(this))))
            }
            
            this.$table.html('').appendlist(rows)
		},
		
		set_selected_datetime: function (datetime)
		{
			this.selected_datetime = $.extend({}, datetime)
			this.current_datetime = $.extend({}, datetime)
			this.draw()
		},
		
		set_current_datetime: function (datetime)
		{
			this.current_datetime = $.extend({}, datetime)
			this.draw()
		}
	}
	
	// Add a calendar to a jQuery node
    $.fn.calendar = function (current_datetime, selected_datetime)
    {
		return this.each(function ()
		{
			var calendar = new Calendar($(this), current_datetime, selected_datetime)
			calendar.draw()
		})
    }
	
	
	
	// A selector for hours, minutes, seconds and meridiem
	var TimePicker = function ($container)
	{
		this.$container = $container.addClass('timepicker')
		this.$container.data('timepicker', this)
		this.selected_datetime = null
		
		var hours = [], minutes = [], meridiem = []

		for (var i=1; i<13; i++)
		{
			hours.push(E('option', T(''+i)).val(i))
		}

		for (var i=0; i<60; i++)
		{
			var m = i < 10 ? '0'+i : i
			minutes.push(E('option', T(''+m)).val(m))
		}

		;['AM', 'PM'].forEach(function (m)
		{
			meridiem.push(E('option', T(m)).val(m))
		})
		
		this.$container
			.append(
				E('select', 'spinner hours text-right', hours).data('time-part', 'h'),
				T(' : '),
				E('select', 'spinner minutes', minutes).data('time-part', 'm'),
				T(' '),
				E('select', 'spinner meridiem', meridiem).data('time-part', 'a')
			)
			.find('.spinner')
				.spinner()
			.end()
		
		var value_changed = this.value_changed.bind(this)
		this.$container.find('select').change(function ()
		{
			value_changed($(this))
		})
	}
	TimePicker.prototype = 
	{
		set_datetime: function (datetime)
		{
			this.selected_datetime = $.extend({}, datetime)
			
			this.$container
				.find('.hours').val(this.selected_datetime.h+'').change()
				.end()
				.find('.minutes').val(this.selected_datetime.m+'').change()
				.end()
				.find('.meridiem').val(this.selected_datetime.a).change()
		},
		
		value_changed: function ($selector)
		{
			var n = $selector.data('time-part')
			this.selected_datetime[n] = $selector.val()
			this.$container.trigger('time_changed')
		}
	}
	
	$.fn.timepicker = function ()
	{
		return this.each(function ()
		{
			new TimePicker($(this))
		})
	}
    
	
	
	// A visual date or date and time picker
	var DateTimePicker = function ($input, options)
	{
		this.options = $.extend(
		{
			// If true, show a time picker as well as a date picker
			with_time: false
		}, options)
		
		this.setup_parser()
		
		// Wrap the input box and add extra elements for navigation
		this.$input = $input
		this.$input
			.removeClass('datepicker')
        	.wrap(E('div', 'datepicker', E('div', 'input')))
			.parents('.datepicker')
				.append(
					E('a')
						.attr('href', '#')
						.normalize_interaction_states()
				)
		this.$input_container = this.$input.parents('.datepicker')
        
		// Create a container for the picker
		this.$picker = E('div', 'calendar-container',
            E('div', 'calendar',
				E('div', 'header',
                    E('span', 'month-and-year'),
                    E('a', 'previous-month').attr('href', '#'),
                    E('a', 'next-month').attr('href', '#')
                )
			)
        )
        .appendTo('body')
		.click(function (e)
		{
			// We want the current picker to close when the document
			// is clicked, but not when the picker is clicked
			e.stopPropagation()
		})
		
		// Add the calendar
		this.calendar = new Calendar(this.$picker.find('.calendar'))
		
		// Add the timepicker, if options include it
		if (options.with_time)
		{
			this.timepicker = new TimePicker(E('div', 'timepicker vpush-1 text-right').appendTo(this.$picker))
		}
		
		// Add now & done buttons
		this.$picker.append(
			E('div', 'buttons text-right buttonbar vpush-1',
				E('button', 'small now', T('Now')),
				T(' '),
				E('button', 'small done call-to-action', T('Done'))
			)
		)
		this.$picker.find('.buttons button').button()
		
		// Attach input event handlers
		this.$input.change(this.input_changed.bind(this))
		
		// Attach calendar event handlers
		this.calendar.$container.bind('date_selected', this.datetime_changed.bind(this))
				
		// Attach timepicker event handlers
		if (this.timepicker)
		{
			this.timepicker.$container.bind('time_changed', this.datetime_changed.bind(this))
		}
		
		// Attach picker toggle events
		this.$input_container.find('a').click(function (e)
		{
			e.preventDefault()
			e.stopPropagation()
			this.toggle()
		}.bind(this))
		
		// Attach month navigation event handlers
		this.$picker
            .find('a.next-month')
                .click(function (e)
                {
                    e.preventDefault()
					this.next_month()
                }.bind(this))
            .end()
            .find('a.previous-month')
                .click(function (e)
                {
                    e.preventDefault()
					this.previous_month()
                }.bind(this))
		
		// Add done and now event handlers
		this.$picker
			.find('button.now')
				.click(function (e)
				{
					e.preventDefault()
					this.set_to_now()
				}.bind(this))
			.end()
			.find('button.done')
				.click(function (e)
				{
					e.preventDefault()
					this.update_input()
					this.close()
				}.bind(this))
		
		// Make sure the input container's disabled state stays in sync with the
		// input element
		if (this.$input.is(':disabled'))
		{
			this.$input_container.addClass('disabled')
		}
		
		this.$input.watch('disabled', function ()
		{
			if (this.$input.is(':disabled'))
			{
				this.$input_container.addClass('disabled')
			}
			else
			{
				this.$input_container.removeClass('disabled')
			}
		})
		
		// Set current date and time
		this.input_changed()
	}
	DateTimePicker.prototype = 
	{
		setup_parser: function ()
		{
			// Set up some regexes and other data for 
			// parsing datetimes
			this.format = data.date_format

			if (this.options.with_time)
			{
				this.format += ' '+data.time_format
			}

			var pattern = '^'+this.format+'$'

			for (var n in data.patterns)
			{
				if (data.patterns.hasOwnProperty(n))
				{
					pattern = pattern.replace(n, data.patterns[n])
				}
			}

			this.format_pattern = new RegExp(pattern)
			this.parts_order = this.format.match(/[YMDhma]/g)
		},
		
		datetime_from_date: function (date)
		{
			return {
				Y: date.getFullYear(),
				M: date.getMonth(),
				D: date.getDate(),
				h: date.getHours() % 12,
				m: date.getMinutes(),
				a: date.getHours() > 12 ? 'PM' : 'AM'
			}
		},
		
		// Parse a datetime string
		parse: function (str)
		{
			var datetime = this.datetime_from_date(new Date())
            var matches = str.match(this.format_pattern)

			if (matches)
			{
				matches = matches.slice(1)

				for (var i = 0; i<this.parts_order.length; i++)
				{
					if (typeof matches[i] == "undefined")
					{
						break
					}

					datetime[this.parts_order[i]] = matches[i]
				}
			}
			
			for (var n in datetime)
			{
				if (datetime.hasOwnProperty(n) && n != 'a')
				{
					datetime[n] = parseInt(datetime[n])
				}
			}
			
			datetime.M -= 1
			
			return datetime
		},
		
		update_header: function ()
		{
			this.$picker.find('.header .month-and-year').html(
                data.month_names[this.calendar.current_datetime.M]+
				" "+
				this.calendar.current_datetime.Y
            )
		},
		
		datetime_changed: function ()
		{
			this.update_header()
		},
		
		update_input: function ()
		{
			var parts = []
            var str = this.format
			var date_parts = ['Y', 'M', 'D']
			var time_parts = ['h', 'm', 'a'] 
			
			date_parts.forEach(function (n)
			{
				if (n == 'M')
				{
					this.calendar.selected_datetime[n] += 1
				}
				str = str.replace(n, this.calendar.selected_datetime[n])
			}, this)
			
			if (this.timepicker)
			{
				time_parts.forEach(function (n)
				{
					str = str.replace(n, this.timepicker.selected_datetime[n])
				}, this)
			}
			
			this.$input.val(str)
		},
		
		input_changed: function ()
		{
			var datetime = this.parse(this.$input.val())
			this.calendar.set_selected_datetime(datetime)
			
			if (this.timepicker)
			{
				this.timepicker.set_datetime(datetime)
			}
			
			this.update_header()
		},
		
		close: function ()
		{
			this.$picker.fadeOut()
			this.$input_container.removeClass('expanded')
			DateTimePicker.current = null
		},
		
		toggle: function ()
		{
			if (this.$input.is(':disabled'))
			{
				return
			}
			
			if (this.$picker.is(':visible'))
			{
				this.close()
			}
			else
			{
				if (DateTimePicker.current)
				{
					DateTimePicker.current.close()
				}
				
				DateTimePicker.current = this
				
				var pos = this.$input_container.offset()
				
				this.$picker.css(
                {
                    top: pos.top + this.$input_container.outerHeight() - 2,
                    left: pos.left + this.$input_container.outerWidth() - this.$picker.outerWidth()
                }).fadeIn()
				
				this.$input_container.addClass('expanded')
			}
		},
		
		next_month: function ()
		{
            this.calendar.current_datetime.M += 1
			
            if (this.calendar.current_datetime.M > 11)
            {
                this.calendar.current_datetime.M = 0
                this.calendar.current_datetime.Y++
            }
            
            this.calendar.draw()
			this.update_header()
		},
		
		previous_month: function ()
		{
            this.calendar.current_datetime.M -= 1
            
            if (this.calendar.current_datetime.M < 0)
            {
                this.calendar.current_datetime.M = 11
                this.calendar.current_datetime.Y--
                
                if (this.calendar.current_datetime.Y < 0)
                {
                    this.calendar.current_datetime.Y = 0
                }
            }
            
			this.calendar.draw()
			this.update_header()
		},
		
		set_to_now: function ()
		{
			var now = this.datetime_from_date(new Date())
			
			this.calendar.set_selected_datetime(now)
			
			if (this.timepicker)
			{
				this.timepicker.set_datetime(now)
			}
			
			this.update_header()
		}
	}
	
	// Enforce a single DateTimePicker open at a time globally
    DateTimePicker.current = null
    
    $(document).click(function (e)
    {
        if (DateTimePicker.current)
        {
			DateTimePicker.current.close()
        }
    })
	
    $.fn.datepicker = function (options)
    {
		return this.each(function ()
		{
			var $input = $(this)
			$input.data('datetimepicker', new DateTimePicker($input, options))
		})
    }
    
	NSNReady(function ()
	{
		$('input.datepicker').datepicker({ with_time: false })
		$('input.datetimepicker').datepicker({ with_time: true })
	})
	
})(jQuery)