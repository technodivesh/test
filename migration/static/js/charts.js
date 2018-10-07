(function ($){

// Method to offset the plot background by a padding value
Highcharts.Chart.prototype.offsetPlotBackgroundImage = function (t, r, b, l)
{
    if (!this.plotBGImage)
    {
        return
    }
    
    this.plotBGImage.attr(
    {
        x: this.plotLeft - l,
        y: this.plotTop - t,
        width: this.plotWidth + l + r,
        height: this.plotHeight + t + b
    });
};

Highcharts.setOptions(
{
    credits: {
        enabled: false
    },
    
    title: {
        text: ''
    },
    
    colors:
    [
        '#00C9FF',
        '#474747',
        '#A8BBC0',
        '#D8D9DA',
        '#0B6DAF',
        '#68717A',
        '#B2E3F0',
        '#FF9900',
        '#FFCC00',
        '#124191',
        '#00A1CC',
        '#B3B8BC'
    ],
    
    plotOptions: {
        bar: {
            animation: false
        },
        pie: {
            animation: false
        }
    },
    
    xAxis: {
        labels: {
            style: {
                fontFamily: 'Nokia Pure',
                fontSize: '14px'
            }
        }
    },
    
    yAxis: {
        labels: {
            style: {
                fontFamily: 'Nokia Pure',
                fontSize: '14px'
            }
        }
    },
    
    tooltip: {
        
        backgroundColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, '#666666'],
                [1, '#000000']
            ]
        },
        borderWidth: 0,
        style: {
            color: '#ffffff',
            fontFamily: "Nokia Pure",
            fontSize: '14px',
            padding: '10px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }
    }
})

window.Charts = 
{
    gradients: [
        ['#00a1cc', '#00b5e5', '#26c0ea', '#26d0fd'],
        ['#343434', '#3d3d3d', '#5a5a5a', '#626262'],
        ['#88989c', '#98aaae', '#a8b7bb', '#b4c4c9'],
        ['#87979b', '#97a8ad', '#a6b6b9', '#b4c4c9'],
        ['#aeafaf', '#c2c3c4', '#cccdcd', '#dddedf'],
        ['#09588d', '#0a629d', '#2f79ac', '#2f82ba'],
        ['#545b63', '#5d656e', '#767d84', '#7e858d'],
        ['#b3e3f0', '#bfebf7', '#c9eff9', '#d3f5ff']
    ].map(function (colors)
    {
        return {
            linearGradient: (($.browser.msie && parseInt($.browser.version) < 9)
            ? {
                  x1: 0, 
                  y1: 1, 
                  x2: 0, 
                  y2: 0
              }
            : {
                  x1: 0, 
                  y1: 0, 
                  x2: 1, 
                  y2: 0
              }
            ),
            stops: [
                [0, colors[0]],
                [0.5, colors[1]],
                [0.5, colors[2]],
                [1, colors[3]]
            ]
        }
    }),
    
    make_options: function (defaults, user_options)
    {
        var options = $.extend(
        {
            // The ID of the charts container
            container: 'chart',
            
            // If true, show the background image, otherwise the chart 
            // background will be transparent.
            showBackground: true,
            
            // If true, show tooltips when hovering over points.
            showTooltips: true
        }, defaults)
        
        return $.extend(options, user_options)
    },
    
    create: function (options, chart_options, callback)
    {
        if (!chart_options.chart)
        {
            chart_options.chart = {}
        }
        
        $.extend(chart_options.chart,
        {
            renderTo: options.container,
            backgroundColor: 'rgba(0,0,0,0)'
        })
        
        if (options.showBackground)
        {
            chart_options.chart.plotBackgroundImage = 'images/plot-background.png'
        }
        
        return new Highcharts.Chart(chart_options, callback)
    },
    
    stacked_bar: function (options)
    {
        var options = this.make_options(
        {
            // Categories for the X axis, e.g.,
            // ['Foo', 'Bar', 'Baz']
            categories: [],
            
            // Data for each series in the stacked bar, e.g.,
            //
            // [
            //     {
            //         name: 'A',
            //         data: [4, 1.8, 3.8, 1.4, 1.8]
            //     },
            //     {
            //         name: 'B',
            //         data: [1, 1.7, 1.7, 0.2, 0.6]
            //     },
            //     {
            //         name: 'C',
            //         data: [1.35, 2, 0.2, 2.7, 0.8]
            //     }
            // ]
            series: []
        }, options)
        
        var bar_outlines = {}
        var visible_bar_outline = null
        
        options.series.forEach(function (s, i)
        {
            s.color = Charts.gradients[i % Charts.gradients.length]
        })
        
        var create_outline = function (bar, color, offset)
        {
            var i = bar.x
            var first_series = bar.series.chart.series[bar.series.chart.series.length - 1]
            var first_data = first_series.data[first_series.data.length - 1]
            var x = first_series.data[i].graphic.attr('x')
            var width = first_data.graphic.attr('width')
            var height = 0
            
            bar.series.chart.series.forEach(function (series)
            {
                var point = series.data[i]
                height += point.graphic.attr('height')
            })
            
            var y = first_data.graphic.attr('y') - height + first_data.graphic.attr('height')
            
            x -= offset
            width += offset * 2
            y -= offset
            height += offset * 2
            
            return bar.series.chart.renderer
                .path(
                    (($.browser.msie && parseInt($.browser.version) < 9))
                    ? [
                          'M', x, y + 8,
                          'L', x, y + height,
                          'L', x + width, y + height,
                          'L', x + width, y + 8,
                          'C', x + width, y,
                               x + width - 8, y,
                               x + width - 8, y,
                          'L', x + 8, y,
                          'C', x, y,
                               x, y + 8,
                               x, y + 8
                      ]
                    : [
                          'M', x, y + 8,
                          'l', 0, height - 8,
                          'l', width, 0,
                          'l', 0, -height + 8,
                          'c', 0, -8, -8, -8, -8, -8,
                          'l', -width + 16, 0,
                          'c', -8, 0, -8, 8, -8, 8
                      ]
                )
                .attr({
                    "stroke-width": 2,
                    stroke: color,
                    zIndex: 0
                })
                .add(first_data.graphic.parent)
        }
        
        return this.create(options, {
            chart: {
                type: 'bar',
                marginLeft: 150
            },
            
            xAxis: {
                categories: options.categories,
                labels:{
                    align: 'left',
                    x: -130
                },
                tickColor: 'rgba(0,0,0,0)',
                offset: 20,
                lineWidth: 0
            },
            
            yAxis: {
                tickWidth: 1,
                tickLength: 20,
                tickColor: '#c0c0c0',
                tickPosition: 'inside',
                tickInterval: 1,
                endOnTick: false,
                max: 7,
                title: {
                    text: null
                },
                labels: {
                    style: {
                        fontFamily: 'Nokia Pure',
                        fontSize: '14px'
                    },
                    y: 20
                },
                offset: 20,
                stackLabels: {
                    enabled: true,
                    align: 'left',
                    textAlign: 'right',
                    verticalAlign: 'middle',
                    x: -25,
                    style: {
                        fontFamily: 'Nokia Pure',
                        fontSize: '14px'
                    },
                    formatter: function ()
                    {
						var n = (this.total.toFixed(1)+'').split('.')
                        return n.join(',')+'%'
                    }
                }
            },
            
            tooltip: {
                formatter: function ()
                {
                    return this.series.name + " <strong>" + Highcharts.numberFormat(this.y, 2, ',', '.') +"%</strong>"
                }
            },
            
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                margin: 30,
                y: -20,
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: "Nokia Pure",
                    color: '#666666',
                    padding: ($.browser.msie && parseInt($.browser.version) < 9) ? 0 : '15px 0'
                },
                itemHoverStyle: {
                    fontSize: '14px',
                    fontFamily: "Nokia Pure",
                    color: '#666666',
                    padding: ($.browser.msie && parseInt($.browser.version) < 9) ? 0 : '15px 0',
                    cursor: 'auto'
                },
                symbolPadding: 15
            },
            
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                bar: {
                    borderColor: '#ffffff',
                    borderWidth: 0,
                    borderRadius: 8,
                    shadow: false,
                    pointWidth: 44,
                    point: {
                        events: {
                            mouseOver: function ()
                            {
                                if ($.browser.msie && parseInt($.browser.version) < 9)
                                {
                                    return
                                }
                                
                                // Draw outline of whole bar on hover
                                
                                if (!bar_outlines[this.x])
                                {
                                    bar_outlines[this.x] = [
                                        create_outline(this, '#fff', -1),
                                        create_outline(this, '#00A1CC', 0)
                                    ]
                                }
                                
                                for (var n in bar_outlines)
                                {
                                    var visibility = n == this.x ? 'visible' : 'hidden'
                                    bar_outlines[n][0].attr('visibility', visibility)
                                    bar_outlines[n][1].attr('visibility', visibility)
                                }
                                
                                visible_bar_outline = bar_outlines[n]
                            },
                            
                            mouseOut: function ()
                            {
                                if (visible_bar_outline)
                                {
                                    visible_bar_outline[0].attr('visibility', 'hidden')
                                    visible_bar_outline[1].attr('visibility', 'hidden')
                                    visible_bar_outline = null
                                }
                            }
                        }
                    }
                }
            },
            
            series: options.series
        },
        function (chart)
        {
            // Adjust the position of the background image
            chart.offsetPlotBackgroundImage(5, 11, 23, 12)
            
            chart.series.forEach(function (series, i)
            {
                // Disable legend toggle functionality
                series.legendItem.element.onclick = null
                
                // Fix the legend symbols if we are in a supported browser
                if (!$.browser.msie || parseInt($.browser.version) > 8)
                {
                    var legend_symbol_box = series.legendSymbol.getBBox()
                    series.legendSymbol.destroy()
                    series.legendSymbol = chart.renderer
                        .circle(
                            legend_symbol_box.x + legend_symbol_box.width / 2,
                            legend_symbol_box.y + legend_symbol_box.height / 2,
                            6)
                        .attr('fill', Charts.gradients[i % Charts.gradients.length].stops[2][1])
                        .add(series.legendItem.parent)
                }
                
                // Make and place rectangles that cover some of the rounded corners
                // on bars
                var cover_rect
                
                series.data.forEach(function (point)
                {
                    cover_rect = chart.renderer.rect(
                        point.graphic.attr('x'),
                        point.graphic.attr('y') + point.graphic.attr('height') - 10,
                        point.graphic.attr('width'),
                        10,
                        0
                    )
                    .attr(
                    {
                        fill: Charts.gradients[i % Charts.gradients.length]
                    })
                    .add(point.graphic.parent)
                    .toFront()
                    
                    if (i != 0)
                    {
                        cover_rect = chart.renderer.rect(
                            point.graphic.attr('x'),
                            point.graphic.attr('y'),
                            point.graphic.attr('width'),
                            10,
                            0
                        ).add(point.graphic.parent)
                        
                        cover_rect.attr(
                        {
                            fill: Charts.gradients[i % Charts.gradients.length]
                        }).toFront()
                    }
                })
            })
        })
    },
    
    pie: function (options)
    {
        var options = this.make_options(
        {
            // An array of data arrays. E.g.,
            // [ [['foo', 10, 'bar', 23]], [['baz', 101], ['qux', 503]] ]
            data: null
        }, options)
        
        var series
        
        if (!options.data)
        {
            series = []
        }
        else
        {
            series = options.data.map(function (d, i)
            {
                return { type: 'pie', data: d }
            })
        }
        
        return this.create(options, {
            chart: {
                type: 'pie'
            },
            
            tooltip: {
                enabled: false
            },
            
            plotOptions: {
                pie: {
                    animation: false,
                    innerSize: '40%',
                    borderWidth: 0,
                    shadow: false,
                    slicedOffset: 10,
                    dataLabels: {
                        connectorWidth: 0,
                        connectorPadding: 0,
                        distance: 15,
                        formatter: function ()
                        {
                            return '<strong>'+this.point.name+'</strong> '+Highcharts.numberFormat(this.percentage, 0)+'%'
                        },
                        style: {
                            fontSize: 13,
                            fontFamily: "Nokia Pure",
                            fontWeight: 'bold',
                            color: '#333333'
                        }
                    },
                    states: {
                        hover: {
                            borderWidth: 2,
                            borderColor: '#00A1CC'
                        }
                    }
                }
            },
            
            series: series
        },
        function (chart)
        {
            chart.offsetPlotBackgroundImage(0,10,20,0)
            
            // Draw shading for each series
            
            chart.series.forEach(function (s)
            {
                var zIndex = 6
                var group = s.points[0].graphic.parent
                
                chart.renderer.arc(
                    s.center[0] + chart.plotLeft, s.center[1] + chart.plotTop + 2,
                    s.center[2] / 2.5, s.center[3] / 2,
                    0, -Math.PI
                )
                .attr({
                        fill: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, 'rgba(0,0,0,0)'],
                                [0.8, 'rgba(255,255,255,0.1)']
                            ]
                        },
                        zIndex: zIndex
                })
                .add()
                
                chart.renderer.arc(
                    s.center[0] + chart.plotLeft, s.center[1] + chart.plotTop + 2,
                    s.center[2] / 2, s.center[3] / 1.4,
                    -(Math.PI+0.5), 0.5
                )
                .attr({
                        fill: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, 'rgba(255,255,255,0.1)'],
                                [0.6, 'rgba(255,255,255,0.1)'],
                                [1, 'rgba(0,0,0,0)'],
                            ]
                        },
                        zIndex: zIndex
                })
                .add()
            })
        })
    }
}
})(jQuery)