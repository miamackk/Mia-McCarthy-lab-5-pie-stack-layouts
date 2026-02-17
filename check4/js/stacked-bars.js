const drawStackedBars = (data) => {
  // Generate the stacked bar chart here

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3.select("#bars")
  .append("svg")
    .attr("viewBox", [0, 0, width, height]);
xScale.domain(data.map(d => d.year))
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  //initialize stack layout

  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetExpand)

  const annotatedData = stackGenerator(data);
  console.log("annotatedData bars", annotatedData)

  const minLowerBoundaries = [];
  const maxUpperBoundaries = [];

  annotatedData.forEach(series => {
    minLowerBoundaries.push(d3.min(series, d => d[0]));
    maxUpperBoundaries.push(d3.max(series, d => d[1]));
  })
  const minDomain = d3.min(minLowerBoundaries);
  const maxDomain = d3.max(maxUpperBoundaries);

  const yScale = d3.scaleLinear()
    .domain([minDomain, maxDomain])
    .range([innerHeight, 0]);

  annotatedData.forEach(series => {
    innerChart
      .selectAll(`.bar-${series.key}`)
      .data(series)
      .join("rect")
        .attr("class", d => `bar-${series.key}`)
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("fill", colorScale(series.key))
  })

  const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(1995, 2019, 4))
    .tickSizeOuter(0);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format(".0%"))
  
  innerChart
    .append("g")
    .call(leftAxis)
};