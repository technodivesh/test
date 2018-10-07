(function ()
{
	var $window = $(window)
	var $tooltip = E('div', 'tooltip',
		E('div', 'content',
			E('div', 'topleft'),
			E('div', 'inner')
		),
		E('div', 'bottom', E('div'))
	)
	.css('left', '-10000px')
	.appendTo($('body'))
	
	var Tooltip = 
	{
		$tooltip: $tooltip,
		$tooltip_content: $tooltip.find('.content .inner'),
		$trigger: null,
		text: null,
		
		trigger: function (e, $trigger)
		{
			if (this.$trigger)
			{
				this.release_trigger()
			}
			
			this.$trigger = $trigger
			this.text = this.$trigger.attr('title')
			this.$trigger
				.attr('title', '')
				.bind('mousemove', Tooltip._mousemove)
				.bind('mouseout', Tooltip._mouseout)
				
			this.show(e)
		},
		
		release_trigger: function ($trigger)
		{
			this.$trigger
				.unbind('mousemove', Tooltip._mousemove)
				.unbind('mouseout', Tooltip._mouseout)
				.attr('title', this.text)
			this.$trigger = null
			this.hide()
		},
		
		hide: function ()
		{
			this.$tooltip.css('left', '-10000px')
		},
		
		show: function (e)
		{
			this.$tooltip_content.html(this.text)
			var tooltip_width = this.$tooltip.outerWidth()
			var tooltip_height = this.$tooltip.outerHeight()
			this.mousemove(e)
		},
		
		mousemove: function (e)
		{
			var left = e.clientX + 10
			var top = e.clientY + 20
			var window_width = $window.width()
			var tooltip_width = this.$tooltip.outerWidth()
			var tooltip_height = this.$tooltip.outerHeight()
			
			if (left + tooltip_width > window_width)
			{
				left = window_width - tooltip_width
			}
			
			if (top + tooltip_height > $window.height())
			{
				top = e.clientY - tooltip_height - 10
			}
			
			this.$tooltip.css(
			{
				left: left,
				top: top
			})
		},
		
		mouseout: function (e)
		{
			this.release_trigger()
		}
		/*
		position: function (e)
		{
			var tooltip_width = $tooltip.outerWidth()
			var tooltip_height = $tooltip.outerHeight()
			var trigger_pos = $trigger.offset()
			var left = trigger_pos.left + $trigger.outerWidth() / 2 - tooltip_width / 2

			if (left < 0)
			{
				left = 0
			}

			var top = trigger_pos.top + $trigger.outerHeight() + 5

			if (top + tooltip_height > $(window).height())
			{
				top = trigger_pos.top - tooltip_height - 5
			}

			$tooltip.css(
			{
				top: top + 'px',
				left: left + 'px'
			})
		},
		*/
	}
	Tooltip._mousemove = Tooltip.mousemove.bind(Tooltip)
	Tooltip._mouseout = Tooltip.mouseout.bind(Tooltip)
	
	$.fn.tooltip = function ()
	{
		return this.each(function ()
		{
			var $trigger = $(this)
			$trigger.mouseover(function (e)
			{
				Tooltip.trigger(e, $trigger)
			})
		})
	}
	
	$(function ()
	{
		$('[title]').tooltip()
	})
})(jQuery)