//Consts/global variables  
const w = 1600;
const h = 1200;
const margin = 120;
const parseTime = d3.timeParse("%Y-%m");

d3.csv("Spotify-2023.csv").then(rawData => {


    const rolled = d3.rollups(rawData,
        v => ({
            max: d3.max(v, d => +d.streams),
            mean: d3.mean(v, d => +d.streams),
            min: d3.min(v, d => +d.streams)
        }),
        d => d.date
    );


    const data = rolled.map(([dateStr, stats]) => ({
        date: dateStr,
        max: stats.max,
        mean: stats.mean,
        min: stats.min
    }));


    data.sort((a, b) => d3.ascending(a.date, b.date));

    console.log("data", data)

    data.forEach(d => {
        d.date = parseTime(d.date);
        d.max = +d.max;
        d.mean = +d.mean;
        d.min = +d.min;
    });

    //scales - with Scale Time
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin, w - margin]);


    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.max)])
        .range([h - margin, margin]);


    //bottom axis with tick time formatting
    const bottomAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat("%b"));


    //left axis
    const leftAxis = d3.axisLeft()
        .scale(yScale);
    //.ticks(4);


    //SVG
    const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    const lineMax = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.max));

    const lineMean = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.mean));

    const lineMin = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.min));

    svg.append("path")
        .data([data])
        .attr("d", lineMax)
        .attr("class", "line max");

    svg.append("path")
        .data([data])
        .attr("d", lineMean)
        .attr("class", "line mean");

    svg.append("path")
        .data([data])
        .attr("d", lineMin)
        .attr("class", "line min");

    //call axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - margin) + ")")
        .call(bottomAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin + ",0)")
        .call(leftAxis);

    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", w / 2)
        .attr("y", margin / 2)
        .text("Spotify 2023 Monthly Stream Metrics");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2)
        .attr("y", h - 60)
        .text("Months (2023)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", 20)
        .text("Total Streams");

    //call axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - margin) + ")")
        .call(bottomAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin + ",0)")
        .call(leftAxis);

});


