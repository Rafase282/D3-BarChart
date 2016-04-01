$(document).ready(function() {
  // Handler for .ready() called.
  $.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(file) {
    sessionStorage.setItem('chartData', JSON.stringify(file));

    var width = $(window).width() * 0.9;
    var height = ($(window).height() - $(".title").height() - $(".bottom").height()) * 0.7;
    renderBarChart(width, height, file);

  });
});

$(window).resize(function() {
  d3.select("svg").remove()
  d3.select("p").remove()
  var width = $(window).width() * 0.9;
  var height = ($(window).height() - $(".title").height() - $(".bottom").height()) * 0.7;
  var newData = JSON.parse(sessionStorage.getItem('chartData'));
  renderBarChart(width, height, newData);
})

d3.select(".title")
  .append("header")
  .html("<h3>Gross Domestic Product</h3>");

function renderBarChart(Wwidth, Wheight, treeData) {
  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  };
  var data = treeData.data;
  var width = Wwidth - margin.left - margin.right;
  var height = Wheight - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;
  var formatDate = d3.time.format("%Y - %B");
  var formatNumber = d3.format(",.2f");

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"))
    .ticks(d3.time.year, 5);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong><span style='color:red'>$ " + formatNumber(d[1]) + " Billion</span><br/>" + formatDate(parseDate(d[0])) + "</strong>";
    })

  var svg = d3.select(".svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  x.domain([parseDate(treeData.from_date), parseDate(treeData.to_date)]);

  y.domain([0, d3.max(data, function(d) {
    return d[1];
  })]);
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(treeData.name);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(parseDate(d[0]));
    })
    .attr("width", Math.ceil(width / data.length))
    .attr("y", function(d) {
      return y(d[1]);
    })
    .attr("height", function(d) {
      return height - y(d[1]);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  d3.select(".bottom")
    .append("p")
    .text(treeData.description);

  function type(d) {
    d[1] = +d[1];
    return d;
  }
}