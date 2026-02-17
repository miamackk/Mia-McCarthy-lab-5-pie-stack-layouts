const drawDonutCharts = (data) => {

  const svg = d3.select("#donut")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const years = [1995, 2002, 2010, 2018];
  const formats = data.columns.filter(format =>
    format !== "year");

  xScale.domain([1995, 2002, 2010, 2018]); //redefine xscale bc donuts are too far apart since it goes by all years

  years.forEach(year => {
    const donutContainer = svg
      .append("g")
        .attr("transform", `translate(${[xScale(year)+margin.left+30]}, ${innerHeight/2})`)  
  
    const yearData = data.find(d => +d.year === year);

    const formattedData = []

    formats.forEach(format => {
      formattedData.push({ 
        format: format,
        sales: yearData[format]
      });
    });

  const pieGenerator = d3.pie()
    .value(d => d.sales);
  const annotatedData = pieGenerator(formattedData)

  const arcGenerator = d3.arc()
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .innerRadius(60)
    .outerRadius(100)
    .padAngle(.02)
    .cornerRadius(3);

  //append svg group for each year
  const arcs = donutContainer
    .selectAll(`.arc-${year}`)
    .data(annotatedData)
    .join("g")
      .attr("class", `arc-${year}`)

      //append path element in each group, draw arcs, set cfill with color scale
  arcs
    .append("path")
      .attr("d", arcGenerator)
      .attr("fill", d => colorScale(d.data.format))

  arcs
    .append("text") //append text within each group
      .text(d => {
        d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI); //calculate percantage of each arc. store in bound data d["percentage"]
        return d3.format(".0%")(d.percentage);
      })
      .attr("x", d => { //get pos of centroid of each arc, store in d["centroid"], use to set x and y of labels
        d["centroid"] = arcGenerator
          .startAngle(d.startAngle)
          .endAngle(d.endAngle)
          .centroid();
        return d.centroid[0]
      })
      .attr("y", d => d.centroid[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#f6fafc")
      .attr("fill-opacity", d => d.percentage < 0.05 ? 0 : 1) // hide labels for segments that are less than 5%
      .style("font-size", "16px")
      .style("font-weight", 500)

  donutContainer
      .append("text")
        .text(year)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "24px")
        .style("font-weight", 500);

 });
};