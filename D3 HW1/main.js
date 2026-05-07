    //Declare consts/global variables
        const margin = 50;
        const width = 500; 
        const height = 500;


    //Load data and related variables
        d3.csv("2024_top_baby_names.csv").then(data => {
            console.log("data", data)
        //format data
        data.forEach(d => { 
            d.Boy = d.Boy;
            d.BoyCount = +d.BoyCount; 
            d.Girl = d.Girl;
            d.GirlCount = +d.GirlCount; 
        });
        
        const maxY = d3.max(data, d => d.BoyCount);


    //Scales - note: band and linear
        const xScale = d3.scaleBand()
                        .domain(data.map(d => d.Boy))
                        .range([margin, width - margin])
                        .paddingInner(.02);
        
        const yScale = d3.scaleLinear()
                        .domain([0, maxY]) 
                        .range([height - margin, margin]);
        

    //SVG
        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                    
    //Axes - create axes
        const bottomAxis = d3.axisBottom()
                             .scale(xScale);
        
        const leftAxis = d3.axisLeft()
                           .scale(yScale);
        

    //Bars
    //rect needs x, y, width, and height
        svg.selectAll("rect") 
            .data(data) 
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.Boy)) 
            .attr("y", d => yScale(d.BoyCount)) 
            .attr("width", xScale.bandwidth()) // note this is specific to using the bandscale as the scale calculates padding
            .attr("height", d => (height-margin) - yScale(d.BoyCount))
            .attr("fill", "#007AFF");
        

    //Axes - call axes
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin) + ")") 
            .call(bottomAxis);

        svg.append("g")
            .attr("transform", "translate(" + margin + ",0)")
            .call(leftAxis); 

                
    });