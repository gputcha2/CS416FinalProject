async function init() {
    const data = await d3.csv('https://gputcha2.github.io/CS416FinalProject/CS416Final.csv');
    var x = d3.scaleBand().domain(['Low Income','Lower middle income','Upper middle income','High income']).range([0,600]);
    var y = d3.scaleLinear().domain([3.5,7]).range([600,0]);
    var data1 = [4.040903226, 4.932906667, 5.439395349, 6.513895833];
    cs = d3.scaleLinear().domain([4,6.6]).range(['blue', 'purple']);
    const type = d3.annotationCustomType(
        d3.annotationLabel, 
        {"className":"custom",
            "connector":{"type":"line",
            "end":"arrow"},
            "note":{"align":"left",
            "orientation":"leftRight"}});
        
        const annotations = [{
            note: {
                label: "Average Happiness Score  6.513895833",
                bgPadding: 20,
                title: "High Income"
            },
            className: "annotation-text",
            x: 550,
            y: y(6.513895833)+50, 
            dy: -25,
            dx: 100,
            subject: { radius: 50, radiusPadding: 10 }
        },
        {
            note: {
                label: "Average Happiness Score  5.439395349",
                bgPadding: 20,
                title: "Upper middle income"
            },
            className: "annotation-text",
            x: 400,
            y: y(5.439395349)+50, 
            dy: -25,
            dx: 25,
            subject: { radius: 50, radiusPadding: 10 }
        },
        {
            note: {
                label: "Average Happiness Score  4.932906667",
                bgPadding: 20,
                title: "Lower middle income"
            },
            className: "annotation-text",
            x: 250,
            y: y(4.932906667)+50, 
            dy: -100,
            dx: 35,
            subject: { radius: 50, radiusPadding: 10 }
        },
        {
            note: {
                label: "Average Happiness Score  4.040903226",
                bgPadding: 20,
                title: "Low Income"
            },
            className: "annotation-text",
            x: 100,
            y: y(4.040903226)+50, 
            dy: -270,
            dx: 10,
            subject: { radius: 50, radiusPadding: 10 }
        }
    ];
    const makeAnnotations = d3.annotation()
    .editMode(false)
    .type(type)
    .annotations(annotations);

    d3.select("#svg2")
    .append("g")
    .attr("transform","translate(50,50)")
    .selectAll("rect").data(data1).enter().append('rect')
    .attr('x', function(d,i){ return (i*150)+60; })
    .attr('y', 600)
    .attr('width', 30)
    .attr ('height',0)
    .transition().duration(3000).delay(300)
    .attr('y', function(d){ return y(d); })
    .attr ('height', function (d) {return 600-y(d) ;})
    .style('fill',function(d,i) {return cs(d);});

    d3.select("#svg2")
    .append("g")
    .selectAll("line").data(data1).enter().append('line')
    .attr("class", "guide-line")
    .attr("x1", 50)
    .attr("y1", function(d,i){ return y(d)+50; })
    .transition().duration(3000).delay(300)
    .attr("x1", function(d,i){ return (i*150)+110; })
    .attr("y1", function(d,i){ return y(d)+50; })
    .attr("x2", 50)
    .attr("y2", function(d,i){ return y(d)+50; })
    .style("opacity", 1);

    d3.select("#svg2")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
    .style("opacity", 0)
    .transition().duration(3000).delay(2200)
    .style("opacity", 1);

    d3.select("#svg2").append("g")
    .attr("transform","translate(50,50)")
    .call(d3.axisLeft(y));

    d3.select("#svg2").append("g")
    .attr("transform","translate(50,650)")
    .call(d3.axisBottom(x));
}