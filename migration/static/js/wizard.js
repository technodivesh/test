(function ($)
{
	var Wizard = function ($container)
	{
		$container.wrap(E('div', 'wizard'))
		this.$container = $container.parent()
		this.$track = E('div', 'track',
			E('div', 'bar', E('div'))
		).appendTo(this.$container)
		this.$bar = this.$track.find('.bar')
		this.$steps = this.$container.find('li')
		this.current_step = 1
		this.size_steps()
		this.setup_bar_lengths()
	}
	Wizard.prototype = 
	{
		size_steps: function ()
		{
			if (this.$steps.length == 1)
			{
				return
			}
			
			this.step_width = this.$steps.eq(0).outerWidth()
			this.step_gap = Math.floor(
				(this.$container.width() - this.$steps.length * this.step_width) /
				(this.$steps.length - 1)
			)
			
			this.$steps
				.filter(':not(:last-child)')
					.css('margin-right', this.step_gap+'px')
				.end()
				.filter(':last-child')
					.css('margin-right', 0)
					.addClass('last-child')
				.end()
				.filter(':first-child')
					.addClass('first-child')
			
		},
		
		setup_bar_lengths: function ()
		{
			this.bar_lengths = [0]
			var l = this.step_gap
			
			for (var i=1; i<this.$steps.length; i++)
			{
				this.bar_lengths.push(l)
				l += this.step_gap + this.step_width
			}
		},
		
		set_step: function (n, duration)
		{
			if (n == this.current_step || n > this.$steps.length || n < 1)
			{
				return
			}
			
			var a = Math.min(n, this.current_step)
			var b = Math.max(n, this.current_step)
			var steps = []
			var class_action = 'addClass'
			
			for (var i=a; i<=b; i++)
			{
				steps.push(i)
			}
			
			if (n < this.current_step)
			{
				steps.sort(function (a,b) { return b-a })
				class_action = 'removeClass'
			}
			
			if (duration)
			{
				var step = steps.shift()
				
				var next = function ()
				{
					if (steps.length == 0)
					{
						this.$steps.eq(step-1).addClass('full')
						this.current_step = n
						
						if (n > 1 && n < this.$steps.length)
						{
							this.$bar.css('width', this.bar_lengths[step-1] + this.step_width)
						}
						
						return
					}
					
					this.$steps.eq(step-1)[class_action]('full')
					
					step = steps.shift()
					
					this.$bar.animate(
						{ width: this.bar_lengths[step-1] },
						duration,
						next
					)
				}.bind(this)
				next()
			}
			else
			{
				var last_step = steps.pop()
				
				steps.forEach(function (i)
				{
					this.$steps.eq(i-1)[class_action]('full')
				}, this)
				
				this.$steps.eq(last_step-1).addClass('full')
				this.$bar.css('width', this.bar_lengths[last_step-1])
				this.current_step = n
			}
		}
	}
	
	
	$.fn.wizard = function ()
	{
		return this.each(function ()
		{
			var $container = $(this)
			$container.data('wizard', new Wizard($container))
		})
	}
	
	NSNReady(function ()
	{
		$('.wizard').wizard()
	})
	
})(jQuery)