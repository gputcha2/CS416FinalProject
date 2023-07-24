async function init() {
    const data = await d3.csv('https://gputcha2.github.io/CS416FinalProject/CS416Final.csv');
    console.log(data);
    var x = d3.scaleLinear().domain([100,0]).range([0,600]);
    var y = d3.scaleLinear().domain([2,8]).range([600,0]);
    var tooltip = d3.select("#tooltip");
    const colorScale = d3.scaleOrdinal().domain(['Asia', 'Africa', 'North America', 'South America', 'Australia/Oceania', 'Europe']).range(['green', 'yellow', 'red', 'orange', 'blue', 'violet']);
    var svg = d3.select("svg")
                .append("g")
                .attr("transform","translate(50,50)");


    const type = d3.annotationCustomType(
        d3.annotationLabel, 
        {"className":"custom",
            "connector":{"type":"line",
            "end":"arrow"},
            "note":{"align":"left",
            "orientation":"leftRight"}});
        
        const annotations = [{
            note: {
                label: "Tend to have higher levels of corruption and as a result - we can see lower happiness levels",
                bgPadding: 20,
                title: "African Countries"
            },
            className: "annotation-text",
            x: x(26),
            y: y(4), 
            dy: 25,
            dx: 200,
            subject: { radius: 50, radiusPadding: 10 }
        },
        {
            note: {
                label: "With this trendline we can clearly see that with increasing corruption, happiness levels decline",
                bgPadding: 20,
                title: "Correlation"
            },
            className: "annotation-text",
            x: x(57),
            y: y(5.7), 
            dy: 160,
            dx: -75,
            subject: { radius: 50, radiusPadding: 10 }
        }
    ];
    const makeAnnotations = d3.annotation()
    .editMode(false)
    .type(type)
    .annotations(annotations);


    var verticalLine = svg.append("line")
    .attr("class", "guide-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0);
    var horizontalLine = svg.append("line")
    .attr("class", "guide-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0);
    var trendLine = svg.append("line")
    .attr("class", "trend-line")
    .attr("x1", x(91))
    .attr("y1", y(7.9))
    .attr("x2", x(91))
    .attr("y2", y(7.9))
    .transition().duration(3000).delay(1000)
    .attr("class", "trend-line")
    .attr("x1", x(9))
    .attr("y1", y(3.3))
    .attr("x2", x(91))
    .attr("y2", y(7.9));
    svg.append("text")
    .attr("x", 300)
    .attr("y", 650)
    .attr("text-anchor", "middle")
    .text("Corruption Perception Index");
    svg.append("text")
    .attr("x", -300)
    .attr("y", -30)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Happiness Score");
    var scatter = svg.selectAll("circle").data(data).enter().append('circle')
    .attr('cx', function(d,i){ return x(parseInt(d.CorruptionPerceptionIndex)); })
    .attr('cy', function(d,i){ return y(parseFloat(d.Score)); })
    .attr('r', 4)
    .attr('fill', d => colorScale(d.Continent));
    scatter.on("mouseover", function(d,i) {
        tooltip.style("opacity", 1)
        .style("left", "400px")
        .style("top", "200px")
        .html("<b>" + d.Country + "</b><br>" + "Corruption Index - " + d.CorruptionPerceptionIndex + " Happiness Score - " + d.Score);
        verticalLine.attr("x1", x(parseInt(d.CorruptionPerceptionIndex)))
        .attr("y1", y(parseFloat(d.Score)))
        .attr("x2", x(parseInt(d.CorruptionPerceptionIndex)))
        .attr("y2", y.range()[0])
        .style("opacity", 1);
        horizontalLine.attr("x1", x(parseInt(d.CorruptionPerceptionIndex)))
        .attr("y1", y(parseFloat(d.Score)))
        .attr("x2", 0)
        .attr("y2", y(parseFloat(d.Score)))
        .style("opacity", 1);
    })
    .on("mouseout", function() { 
        tooltip.style("opacity", 0);
        verticalLine.style("opacity", 0);
        horizontalLine.style("opacity", 0); 
    });
    

    const legend = svg.append("g")
        .attr("transform", "translate(650, 50)");

    const legendItems = legend.selectAll(".legend-item")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale);

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 7.5)
        .attr("dy", "0.35em")
        .text(d => d);

    d3.select("svg")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
    .style("opacity", 0)
    .transition().duration(3000).delay(1200)
    .style("opacity", 1);

    d3.select("svg").append("g")
    .attr("transform","translate(50,50)")
    .call(d3.axisLeft(y)
    .tickValues([2,4,6,8])
    .tickFormat(d3.format("~s")));

    d3.select("svg").append("g")
    .attr("transform","translate(50,650)")
    .call(d3.axisBottom(x)
    .tickValues([25,50,75,100])
    .tickFormat(d3.format("~s")));
}
