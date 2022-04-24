// Append a SVG container
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 700 800")

d3.csv("data/data.csv", (d) => {
  return {
    technology: d.technology,
    count: +d.count,
  }
}).then((d) => {
  const sortedData = d.sort((a, b) => b.count - a.count)
  const maxCount = sortedData[0].count

  const margin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 120,
  }

  const svgWidth = 700
  const svgHeight = 800

  const boundsWidth = svgWidth - margin.left - margin.right
  const boundsHeight = svgHeight - margin.top - margin.bottom

  const xAccessor = (d) => d.count
  const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, boundsWidth])
  const xScaledAccessor = (d) => xScale(xAccessor(d))

  const yAccessor = (d) => d.technology
  const yScale = d3
    .scaleBand()
    .domain(sortedData.map(yAccessor))
    .range([0, boundsHeight])
    .paddingOuter(0.5)
    .paddingInner(0.3)

  const yScaledAccessor = (d) => yScale(yAccessor(d))

  const bar = svg
    .selectAll("g")
    .data(sortedData)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScaledAccessor(d)})`)

  bar
    .append("rect")
    .attr("class", (d) => `bar`)
    .attr("width", (d) => xScaledAccessor(d))
    .attr("height", yScale.bandwidth())
    .attr("x", margin.left)
    .attr("y", 0)
    .attr("fill", (d) => (d.technology === "D3.js" ? "#ffbb00" : "#e2e2e2"))

  bar
    .append("text")
    .text((d) => d.technology)
    .attr("x", (d) => margin.left - 8)
    .attr("y", yScale.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .attr("fill", "#444")
    .attr("font-family", "Avenir")
    .attr("dominant-baseline", "central")

  bar
    .append("text")
    .text((d) => d3.format(",")(d.count))
    .attr("x", (d) => margin.left + 4)
    .attr("y", yScale.bandwidth() / 2)
    .attr("text-anchor", "start")
    .attr("font-size", "10px")
    .attr("fill", "#666666")
    .attr("font-family", "Monolisa")
    .attr("dominant-baseline", "central")
})
