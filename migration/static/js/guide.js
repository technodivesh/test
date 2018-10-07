(function ($)
{
	NSNReady(function ()
	{
		// Build the table of contents
		var $frame = $('body > .content iframe')

		if ($frame.length > 0)
		{
			$('.table-of-contents .tree a').click(function (e)
			{
			    e.preventDefault()

			    var $link = $(this)
				
				if ($link.attr('href') == '#')
				{
					return
				}

			    if ($link.attr('target') == '_blank')
			    {
			        window.open($link.attr('href'))
			    }
			    else
			    {
			        $frame.attr('src', $link.attr('href'))
			    }
			})
		}
	})
	
	// Set up code samples
	$('.example').each(function ()
	{
		var $container = $(this)
		var content = $container.html()
		$container.wrapInner(E('div', 'example-live clearfix'))

		// remove any initial indent
		var lines = content.split("\n").filter(function (line)
		{
			return line.length > 0 && !line.match(/^\s+$/)
		})
		var first_indent = lines[0].match(/(^\s+)/)
		if (first_indent)
		{
			var pattern = new RegExp("^"+first_indent[0])
			content = lines.map(function (line)
			{
				return line.replace(pattern, "")
			}).join("\n")
		}

		var $example = E('div', 'example-content',
			E('pre', 'brush: html').text(content)
		).hide()

		$container.append(
			$example,
			E('a', 'code-toggle link', T('Show code...'))
				.attr('href', '#')
				.click(function (e)
				{
					e.preventDefault()

					if ($example.is(':visible'))
					{
						$example.slideUp('fast')
						$(this).text('Show code...')
					}
					else
					{
						$example.slideDown('fast')
						$(this).text('Hide code')
					}
				})
		)
	})
	
	if (typeof SyntaxHighlighter != "undefined")
	{
		SyntaxHighlighter.all()
	}
})(jQuery)