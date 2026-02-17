// Load data
d3.csv("data/films.csv", d3.autoType).then(data => {

  const yearMap = {}
  data.forEach(d => {
    const year = +d.year; //convert 1995 string to number
    if (!yearMap[year]) yearMap[year] = { year }; //check if year exists in yearmap first
    yearMap[year][d.genre] = +d.gross;//add genre as a KEY on years object
  });

  const filmsData = Object.values(yearMap).sort((a, b) => a.year - b.year); //takes out just year into an array and sort 
  filmsData.columns = [...new Set(data.map(d => d.genre))].sort() // basically lets data.columns.filter(format => format !== "year")

  defineScales(filmsData);
  drawDonutCharts(filmsData);
  drawStackedBars(filmsData);
  drawStreamGraph(filmsData);
  addLegend();
});