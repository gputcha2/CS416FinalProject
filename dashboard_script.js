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

    svg.append("text")
    .attr("class", "axis-group")
    .attr("x", 300)
    .attr("y", 650)
    .attr("text-anchor", "middle")
    .text("Corruption Perception Index");
    svg.append("text")
    .attr("class", "axis-group")
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

    d3.select("svg").append("g")
    .attr("transform","translate(50,50)")
    .attr("class", "axis-group")
    .call(d3.axisLeft(y)
    .tickValues([2,4,6,8])
    .tickFormat(d3.format("~s")));

    d3.select("svg").append("g")
    .attr("transform","translate(50,650)")
    .attr("class", "axis-group")
    .call(d3.axisBottom(x)
    .tickValues([25,50,75,100])
    .tickFormat(d3.format("~s")));
}

async function edit_items() {
    console.log('entered remove_item');
    var svg = d3.select("svg");
    svg.selectAll(".legend-item").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".axis-group").remove();
    document.getElementById("maxValueX").value = '';
    document.getElementById("minValueY").value = '';
    document.getElementById("maxValueY").value = '';
    document.getElementById("minValueX").value = '';
    document.getElementById("asia").checked = false;
    document.getElementById("africa").checked = false;
    document.getElementById("northamerica").checked = false;
    document.getElementById("southamerica").checked = false;
    document.getElementById("australia").checked = false;
    document.getElementById("europe").checked = false;
    draw_graph(null, null, null, null, false);
}

async function draw_graph(minX, maxX, minY, maxY, onlyContinentFilter) {
    var selectedItem = document.getElementById("yAxisDropdown").value;
    const data = await d3.csv('https://gputcha2.github.io/CS416FinalProject/CS416Final.csv');
    console.log(data);
    const contList = get_continent_list(data);
    var tooltip = d3.select("#tooltip");
    const colorScale = d3.scaleOrdinal().domain(['Asia', 'Africa', 'North America', 'South America', 'Australia/Oceania', 'Europe']).range(['green', 'yellow', 'red', 'orange', 'blue', 'violet']);
    var svg = d3.select("svg")
                .append("g")
                .attr("transform","translate(50,50)");
    var selectedItem = document.getElementById("yAxisDropdown").value;

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

    svg.append("text")
    .attr("class", "axis-group")
    .attr("x", -300)
    .attr("y", -30)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Happiness Score");

    if (selectedItem === 'Corruption Perception Index'){
        if (minX != null && maxX != null && minY != null && maxY != null && !onlyContinentFilter) {
            var newdata = data.filter(d => {
                return d.CorruptionPerceptionIndex >= minX && d.CorruptionPerceptionIndex <= maxX && d.Score >= minY && d.Score <= maxY && contList.includes(d.Continent);
            });
        } else {
            if (onlyContinentFilter) {
                var newdata = data.filter(d => contList.includes(d.Continent));
            }
            else{
                var newdata = data;
            }
        }
        var x = d3.scaleLinear().domain([100,0]).range([0,600]);
        var y = d3.scaleLinear().domain([2,8]).range([600,0]);
        var scatter = svg.selectAll("circle").data(newdata).enter().append('circle')
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

        d3.select("svg").append("g")
        .attr("transform","translate(50,650)")
        .attr("class", "axis-group")
        .call(d3.axisBottom(x)
        .tickValues([25,50,75,100])
        .tickFormat(d3.format("~s")));
        svg.append("text")
        .attr("class", "axis-group")
        .attr("x", 300)
        .attr("y", 650)
        .attr("text-anchor", "middle")
        .text("Corruption Perception Index");
    }

    if (selectedItem === 'Life Expectancy') {
        if (minX != null && maxX != null && minY != null && maxY != null & !onlyContinentFilter) {
            var newdata = data.filter(d => {
                return d.LifeExpectancy >= minX && d.LifeExpectancy <= maxX && d.Score >= minY && d.Score <= maxY && contList.includes(d.Continent);
            });
        } else {
            if (onlyContinentFilter) {
                var newdata = data.filter(d => contList.includes(d.Continent));
            }
            else{
                var newdata = data;
            }
        }
        var x = d3.scaleLinear().domain([50,86]).range([0,600]);
        var y = d3.scaleLinear().domain([2,8]).range([600,0]);
        var scatter = svg.selectAll("circle").data(newdata).enter().append('circle')
        .attr('cx', function(d,i){ return x(parseInt(d.LifeExpectancy)); })
        .attr('cy', function(d,i){ return y(parseFloat(d.Score)); })
        .attr('r', 4)
        .attr('fill', d => colorScale(d.Continent));
        scatter.on("mouseover", function(d,i) {
            tooltip.style("opacity", 1)
            .style("left", "200px")
            .style("top", "200px")
            .html("<b>" + d.Country + "</b><br>" + "Life Expectancy - " + d.LifeExpectancy + " Happiness Score - " + d.Score);
            verticalLine.attr("x1", x(parseInt(d.LifeExpectancy)))
            .attr("y1", y(parseFloat(d.Score)))
            .attr("x2", x(parseInt(d.LifeExpectancy)))
            .attr("y2", y.range()[0])
            .style("opacity", 1);
            horizontalLine.attr("x1", x(parseInt(d.LifeExpectancy)))
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

        d3.select("svg").append("g")
        .attr("transform","translate(50,650)")
        .attr("class", "axis-group")
        .call(d3.axisBottom(x)
        .tickValues([50,55,60,65,70,75,80,85])
        .tickFormat(d3.format("~s")));

        svg.append("text")
        .attr("class", "axis-group")
        .attr("x", 300)
        .attr("y", 650)
        .attr("text-anchor", "middle")
        .text("Life Expectancy");
    }

    if (selectedItem === 'Gdp Per Capita') {
        if (minX != null && maxX != null && minY != null && maxY != null && !onlyContinentFilter) {
            var newdata = data.filter(d => {
                return d.GdpPerCapita >= minX && d.GdpPerCapita <= maxX && d.Score >= minY && d.Score <= maxY && contList.includes(d.Continent);
            });
        } else {
            if (onlyContinentFilter) {
                var newdata = data.filter(d => contList.includes(d.Continent));
            }
            else{
                var newdata = data;
            }
        }
        var x = d3.scaleLog().domain([200,120000]).range([0,600]);
        var y = d3.scaleLinear().domain([2,8]).range([600,0]);
        var scatter = svg.selectAll("circle").data(newdata).enter().append('circle')
        .attr('cx', function(d,i){ return x(parseInt(d.GdpPerCapita)); })
        .attr('cy', function(d,i){ return y(parseFloat(d.Score)); })
        .attr('r', 4)
        .attr('fill', d => colorScale(d.Continent));
        scatter.on("mouseover", function(d,i) {
            tooltip.style("opacity", 1)
            .style("left", "200px")
            .style("top", "200px")
            .html("<b>" + d.Country + "</b><br>" + "Gdp Per Capita - " + d.GdpPerCapita + " Happiness Score - " + d.Score);
            verticalLine.attr("x1", x(parseInt(d.GdpPerCapita)))
            .attr("y1", y(parseFloat(d.Score)))
            .attr("x2", x(parseInt(d.GdpPerCapita)))
            .attr("y2", y.range()[0])
            .style("opacity", 1);
            horizontalLine.attr("x1", x(parseInt(d.GdpPerCapita)))
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

        d3.select("svg").append("g")
        .attr("transform","translate(50,650)")
        .attr("class", "axis-group")
        .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.format("~s")));

        svg.append("text")
        .attr("class", "axis-group")
        .attr("x", 300)
        .attr("y", 650)
        .attr("text-anchor", "middle")
        .text("Gdp Per Capita");
    }
    

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

    d3.select("svg").append("g")
    .attr("transform","translate(50,50)")
    .attr("class", "axis-group")
    .call(d3.axisLeft(y)
    .tickValues([2,4,6,8])
    .tickFormat(d3.format("~s")));
}

function get_continent_list(data) {
    var asia = document.getElementById("asia").checked;
    var africa = document.getElementById("africa").checked;
    var north_america = document.getElementById("northamerica").checked;
    var south_america = document.getElementById("southamerica").checked;
    var australia = document.getElementById("australia").checked;
    var europe = document.getElementById("europe").checked;

    if (!asia && !africa && !north_america && !south_america && !australia && !europe){
        return ["Asia", "Africa", "North America", "South America", "Australia/Oceania", "Europe"];
    }

    const contList = [];
    if (asia){
        contList.push("Asia");
    }
    if (africa){
        contList.push("Africa");
    }
    if (north_america){
        contList.push("North America");
    }
    if (south_america){
        contList.push("South America");
    }
    if (australia){
        contList.push("Australia/Oceania");
    }
    if (europe){
        contList.push("Europe");
    }
    return contList;
}

async function filter_data() {
    var minX = document.getElementById("minValueX").value;
    var maxX = document.getElementById("maxValueX").value;
    var minY = document.getElementById("minValueY").value;
    var maxY = document.getElementById("maxValueY").value;
    var asia = document.getElementById("asia").checked;
    var africa = document.getElementById("africa").checked;
    var north_america = document.getElementById("northamerica").checked;
    var south_america = document.getElementById("southamerica").checked;
    var australia = document.getElementById("australia").checked;
    var europe = document.getElementById("europe").checked;

    if (isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY)) {
        alert("Please enter valid numeric values for all fields.");
        return;
    }
    if (minX === '' && maxX === '' && minY === '' && maxY === '') {
        if (asia || africa || north_america || south_america || australia || europe) {
            var svg = d3.select("svg");
            svg.selectAll(".legend-item").remove();
            svg.selectAll("circle").remove();
            svg.selectAll(".axis-group").remove();
            draw_graph(minX, maxX, minY, maxY, true);
            return;
        }
    }

    if (minX === '' || maxX === '' || minY === '' || maxY === '') {
        alert("Please fill out all fields to filter.");
        return;
    }
    var svg = d3.select("svg");
    svg.selectAll(".legend-item").remove();
    svg.selectAll("circle").remove();
    svg.selectAll(".axis-group").remove();
    draw_graph(minX, maxX, minY, maxY, false);
}

async function remove_filters() {
    document.getElementById("maxValueX").value = '';
    document.getElementById("minValueY").value = '';
    document.getElementById("maxValueY").value = '';
    document.getElementById("minValueX").value = '';
    document.getElementById("asia").checked = false;
    document.getElementById("africa").checked = false;
    document.getElementById("northamerica").checked = false;
    document.getElementById("southamerica").checked = false;
    document.getElementById("australia").checked = false;
    document.getElementById("europe").checked = false;
    draw_graph(null, null, null, null, false);
}
