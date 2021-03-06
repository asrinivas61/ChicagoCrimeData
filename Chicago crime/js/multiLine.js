var result = {}, result_1 = [];
var margin = {top: 50, right: 100, bottom: 30, left: 300},
       width =1050- margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
       .range([0, width]);

var y = d3.scale.linear()
       .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
       .scale(x)
       .ticks(16)
       .tickFormat(d3.format(function(d,i){return d;}))
     .orient("bottom");

var yAxis = d3.svg.axis()
   .scale(y)
   .ticks(10)
   .orient("left")
  .tickFormat(d3.format(".2s"));
  
var line=d3.svg.line()
   .interpolate("basis")
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.status); });

var svg = d3.select("body").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")");
       
d3.json("../output/assault.json", function(error, data) {
    if (error) throw error;

    var cases = ["true", "false"];

    function counter(i, caseType) {
      return data.filter(function(elem) {
        return elem.Year==i && elem.Arrest==caseType;
      }).length;
    }

    for(var i=2001; i<2017; i++) {
      result = {};
      result["year"] = i;
      result["Arrest_true"] = counter(i, cases[0]);
      result["Arrest_false"] = counter(i, cases[1]);
      result_1.push(result);
    }

    result_1.forEach(function(d) {
        d.year = +d.year;
        d.Arrest_true = +d.Arrest_true;
        d.Arrest_false = +d.Arrest_false;
    });

 color.domain(d3.keys(result_1[0]).filter(function(key) { return key !== "year"; }));

  result_1.forEach(function(d) {
     d.year = parseInt(d.year);
  });
  var count = color.domain().map(function(name) {
    return {
     name: name,
     values: result_1.map(function(d) {
       return {year: d.year, status: +d[name]};
     })
    };
  });

 x.domain(d3.extent(result_1, function(d) { return d.year; }));

 y.domain([
   d3.min(count, function(c) { return d3.min(c.values, function(v) { return v.status; }); }),
   d3.max(count, function(c) { return d3.max(c.values, function(v) { return v.status; }); })
 ]);

svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + 420 + ")")
     .call(xAxis)
      .append("text")
        .attr("x",width/2)
        .attr("y", 25)
         .text("Year");

 svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
      .append("text")
   .attr("transform", "rotate(-90)")
         .attr("x", -height/2)
         .attr("y", -50)
         .attr("dy", ".70em")
         .style("text-anchor", "end")
         .text("Arrest Details");
 var counts = svg.selectAll(".counts")
     .data(count)
   .enter().append("g")
     .attr("class", "counts");

 var path = svg.selectAll(".counts").append("path")
     .attr("class", "line")
     .attr("d", function(d) { return line(d.values); })
     .style("stroke", function(d) {
                                    if (d.name == "Arrest_true") return "red";
                                    else return "steelblue";
          });
svg.append("text")
  .attr("transform", "translate(" + (width) + "," + height + ")")
   .attr("y",0)
   .attr("dy", "95px")
  .attr("text-anchor", "end")
   .style("fill", "red")
   .text("Arrest");

 svg.append("text")
   .attr("transform", "translate(" + (width) + "," + height + ")")
     .attr("y",0)
   .attr("dy", "450px")
   .attr("dx",".5em")
   .attr("text-anchor", "end")
   .style("fill", "steelblue")
   .text("Noarrest");
     
});
