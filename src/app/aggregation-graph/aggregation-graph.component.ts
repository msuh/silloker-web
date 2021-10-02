import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import * as d3 from 'd3';
import d3tip from "d3-tip";
import { KeywordAggregation } from '../aggregation/aggregation.component';
import { KeywordInputAndAggregationV2 } from '../aggregation/aggregation.component';

@Component({
  selector: 'aggregation-graph',
  templateUrl: './aggregation-graph.component.html',
  styleUrls: ['./aggregation-graph.component.css']
})
export class AggregationGraphComponent implements OnChanges {
  
  @Input() aggregationOutput: KeywordInputAndAggregationV2; 
  @ViewChild('figure') figure: ElementRef;

  private svg;
  private margin = {top: 10, right: 10, bottom: 20, left: 30};
  private width = 1000 - (this.margin.left + this.margin.right);
  private height = 600 - (this.margin.top + this.margin.bottom);

  // class-wide variables for graph transition
  x;
  y; 
  yMax;
  y1Max; 
  xzToString: string[];
  rect;
  n;
  // TODO: Make this not hardcoded.
  // The total dataset range this is graphed across.
  dataRange = [1392, 1928];
  figureId;

  constructor() {}

  ngOnChanges(): void {
    if (this.aggregationOutput == null) {
      return;
    }

    this.figureId = this.aggregationOutput.graphSelector;
    this.emptySvg();
    this.createSvg();
    this.graphAggregationGraph(this.aggregationOutput.keywords, 
                              this.aggregationOutput.aggregation); 

      // this.graphAggregationGraph(["wangjo", "secretariat", "garrison"], 
      //                           this.aggregationOutput.totalRecordCount, true);
      // this.graphAggregationGraph(this.aggregationOutput.keywords, 
      //                           this.aggregationOutput.aggregation, false);
  }

  // Chnages display style of the graph from grouped to stacked and vice versa.
  onDisplayOptionChange(radioChangeEvent) {
    if (radioChangeEvent.value === "grouped") {
        this.transitionGrouped();
      } else {
        this.transitionStacked();
      }
  }

  private createSvg(): void {
    // changed from d3.select("figure#<id>") because for some reason, the dynamic assignment
    // of the id seems to not allow d3 to select the figure appropriately.
    this.svg = d3.select("figure")
    .append("svg")
    .attr("width", this.width + (this.margin.left + this.margin.right))
    .attr("height", this.height + (this.margin.top + this.margin.bottom))
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  }

  private emptySvg(): void {
    d3.select("figure#" + this.aggregationOutput.graphSelector).select("svg").remove();

  }

  transitionGrouped() {
      let x = this.x,
          xzToString = this.xzToString,
          n = this.n,
          y = this.y,
          yMax = this.yMax;

      this.y.domain([0, yMax]);

      this.rect.transition()
          .duration(400)
          .delay(function(d, i) { return i * 15; })
          .attr("x", function(d, i) { 
            // d[3] contains the index of the rect
            return x(xzToString[i]) + (x.bandwidth() * d[2] / n); 
          })
          .attr("width", this.x.bandwidth() / this.n)
        .transition()
          .attr("y", function(d) { return y(d[1] - d[0]); })
          .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
  }

  transitionStacked() {
    let x = this.x,
          xzToString = this.xzToString,
          y = this.y,
          y1Max = this.y1Max;

      this.y.domain([0, y1Max]);

      this.rect.transition()
          .duration(400)
          .delay(function(d, i) { return i * 15; })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .transition()
          .attr("x", function(d, i) { return x(xzToString[i]); })
          .attr("width", x.bandwidth());
  }

 /*
  * data and totalCount format:
  * [
  *   [ {year: 1626, count: 3}, {year: 1627, count: 2} ... ]
  *   [ {year: 1626, count: 3}, {year: 1627, count: 2} ... ]
  * ]
  *
  * graphAsSecondary: true if the provided dataset should be graphed as a secondary graph with legend and
  * y-axis on the left instead of the default positino.
  */
  private graphAggregationGraph(searchKeywords: string[], 
                               data: KeywordAggregation[][]) {
    if (data.length == 0) {
      console.log("No data received for ", searchKeywords);
      return;
    }
    
    // Range makes closing exclusive
    let xz: number[] = d3.range(this.dataRange[0], this.dataRange[1]+1), // Generates a list of values from the given min and max
        yz = this.dataToLayer(data, searchKeywords, this.dataRange),
        xzToString = xz.map(val => val.toString());

        let x = d3.scaleBand()
        .domain(xzToString)
        .range([0, this.width]);


    //////////////////////////////////////////////////////////////////////////////////////////////////

    // y01zTotal is in the form of [y0, y1, data, index] where each layer contains another array of 
    // [stack accumulative value for year, new value to add, index, original data]. So this will be the form of: 
    // [
    //   [
    //    [0, 3, data: {year: 1626, keyword1: 3, keyword2: 4}, 0]
    //    [0, 2, data: {year: 1627, keyword1: 2, keyword2: 5}, 0]
    //    ..
    //   ]
    // ],
    // [
    //   [
    //    [3, 7, data: {year: 1626, keyword1: 3, keyword2: 4}, 1]
    //    [2, 7, data: {year: 1627, keyword1: 2, keyword2: 5}, 1]
    //    ..
    //   ]
    // ],
    let y01z = d3.stack().keys(searchKeywords)(yz).map(
       (data, i) => {
         return data.map((d) => {
           let newData = d;
           newData.push(i);
           return newData;
       })
    });


    let yMaxTotal = d3.max(data, function(d) {
      let max: number = 0;
      for (let i in d) {
        if (max < d[i]["count"]) {
          max = d[i]["count"]; 
        }
      }
      return max;
    });
    let y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { 
      return d[1]; }); });

    let y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([this.height, 0]);
    
    let color = d3.scaleSequential(d3.interpolateMagma).domain([1, data.length]);
    if (this.aggregationOutput.graphAsSecondary) {
      color = d3.scaleSequential(d3.interpolateBlues).domain([0, data.length]);  
    } 
      
    if (this.aggregationOutput.graphAsSecondary) {
      this.svg.append("g").call(d3.axisRight(y));

      this.svg.append("g")
        .selectAll("path")
        .data(y01z)
        //.enter()
        .join("path")
          .attr("fill", function(d, i) { return color(i); })
          // .attr("fill", "none")
          .attr("stroke", function(d, i) { return color(i); })
          .attr("d", d3.area()
            .curve(d3.curveNatural)
            .x(function(d, i) { 
              return x(xzToString[i]); })
            .y0(d => { return y(d[0]); })
            .y1(d => { return y(d[1]); })
          );

    } else {
      this.svg.append("g").call(d3.axisLeft(y));  

      let series = this.svg.selectAll(".series")
      .data(y01z)
      .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });

      this.rect = series.selectAll("rect")
      .data(function(d) { 
        return d; 
      })
      .enter()
      .append("rect")
        .attr("x", function(d, i) { 
          return x(xzToString[i]); 
        })
        .attr("y", this.height)
        .attr("width", x.bandwidth())
        .attr("height", 0);

      this.rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });
    }
    
    this.svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x)
            .tickSize(1)
            .tickValues(this.getTickValues(xz)));

    if (this.aggregationOutput.graphAsSecondary) {
      let legend = this.svg.selectAll(".legend")
          .data(Array.apply(null, {length: data.length}).map(Number.call, Number))
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", this.width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", this.width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(i) { return "Total Count: "+ getArraySum(data[i]) +" / "+ searchKeywords[i]; });
    } else {
      let legendTotal = this.svg.selectAll(".legendTotal")
          .data(Array.apply(null, {length: data.length}).map(Number.call, Number))
        .enter().append("g")
          .attr("class", "legendTotal")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legendTotal.append("rect")
          .attr("x", 40)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legendTotal.append("text")
          .attr("x", 63)
          .attr("y", 9)
          .attr("dy", ".35em")
          // .style("text-anchor", "end")
          .text(function(d, i) { 
            return "Total Count: "+ getArraySum(data[i]) +" / "+ searchKeywords[i]; });
    }

    function getArraySum(data: KeywordAggregation[]) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i]["count"];
      }
      return sum;
    }
}

/*
   Each array represents the search result of a keyword where year is western year and
   count represents the frequency of entries with the searched keyword
   return: [minimum possible year, maximum possible year] => [1492, 1800]
 */
 private getRange(data: KeywordAggregation[][]) {
    var minmax = [2000, 0];
    for (var j=0; j<data.length; j++) {
        var searchedResult = data[j];
        if (searchedResult.length > 0) {
            if (searchedResult[0].year < minmax[0]) {
                minmax[0] = searchedResult[0].year;
            }

            var largestIndex;
            if (searchedResult[searchedResult.length - 1].year == null) {
                largestIndex = searchedResult.length - 2;
            } else {
                largestIndex = searchedResult.length - 1;
            }

            if (searchedResult[largestIndex].year > minmax[1]) {
                minmax[1] = searchedResult[largestIndex].year;
            }
        }
    }

    return minmax;
}

/*
   Given the data format in
   [
        [ {year: 1626, count: 3}, {year: 1628, count: 2}, {year: 1700, count: 7} ... ], // y values for keyword1
        [ {year: 1626, count: 10}, {year: 1627, count: 1}, {year: 1700, count: 4} ... ] // y values for keyword2
   ]

   keywords=  = ["keyword1", "keyword2"];
   // The range of x values available from the returned data.
   xRange = [1392, 1870];

   Return as a list of list of y values for each y point for a given x value
   [
        [ year: 1626, keyword1: 3, keyword2: 2],
        [ year: 1627, keyword1: null, keyword2: 1],
        [ year: 1628, keyword1: 2, keyword2: null],
        [ year: 1700, keyword1: 7, keyword2: 4],
        ...
   ]

   This function works under the condition that the values for each keyword aggregation are 
   organized from lowest year to highest.
 */
 private dataToLayer(data: KeywordAggregation[][], keywords: string[], xRange: number[]) {
    if (xRange.length !== 2 || xRange[0] > xRange[1]) {
       // Return with an error
       return;
    }

    let layers = [],
        valueIndex: number[] = Array<number>(keywords.length).fill(0);

    for (let year=xRange[0]; year<=xRange[1]; year++) {
        // y values for each year (x value)
        let yValuesByYear = {"year": year};

        // Extract the values for each 
        for (let j=0; j<data.length; j++) {
          if (data[j][valueIndex[j]] == null) {
            yValuesByYear[keywords[j]] = 0;
            continue;
          }
          if (data[j][valueIndex[j]].year == year) {
             yValuesByYear[keywords[j]] = data[j][valueIndex[j]].count;
             valueIndex[j]++;
          } else {
            yValuesByYear[keywords[j]] = 0;
          }
        }
        
        layers.push(yValuesByYear);
    }
    return layers;
}

private getTickValues(xRange) {
    let tickNumbers = 10;
    let tickValues = [];

    let interval = Math.floor(xRange.length/tickNumbers);
    for (let i=0; i<tickNumbers; i++) {
        tickValues.push(xRange[0] + (interval * i));
    }

    tickValues.push(xRange[xRange.length -1]);
    return tickValues;
 }

 ////////////////////////////////////////////////////////////////////
 /////////////////////////// DEPRECATED /////////////////////////////

   /*
  * Method for graphing the keyword search aggregation as well as the count graph
  * on the same svg.
  *
  * TODO: remove after simplified function stable.
  */
  private drawAggregationAndTotalGraph(searchKeywords: string[], 
                               data: KeywordAggregation[][],
                               totalCount: KeywordAggregation[][]) {
    if (data.length == 0) {
      return;
    }

    let n: number = data.length, // The number of series.
        m: number = data[0].length; // Number of values in each keyword

    // The xz array has m elements, representing the x-values shared by all series.
    // The yz array has n elements, representing the y-values of each of the n series.
    // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
    // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
    // let xRange = this.getRange(data);
    // Range makes closing exclusive
    let xz: number[] = d3.range(this.dataRange[0], this.dataRange[1]+1), // Generates a list of values from the given min and max
        yz = this.dataToLayer(data, searchKeywords, this.dataRange),
        xzToString = xz.map(val => val.toString());


    //////////////////////////////////////////////////////////////////////////////////////////////////


    // y01z is in the form of [y0, y1, data, index] where each layer contains another array of 
    // [stack accumulative value for year, new value to add, index, original data]. So this will be the form of: 
    // [
    //   [
    //    [0, 3, data: {year: 1626, keyword1: 3, keyword2: 4}, 0]
    //    [0, 2, data: {year: 1627, keyword1: 2, keyword2: 5}, 0]
    //    ..
    //   ]
    // ],
    // [
    //   [
    //    [3, 7, data: {year: 1626, keyword1: 3, keyword2: 4}, 1]
    //    [2, 7, data: {year: 1627, keyword1: 2, keyword2: 5}, 1]
    //    ..
    //   ]
    // ],
    let y01z = d3.stack().keys(searchKeywords)(yz).map(
       (data, i) => {
         return data.map((d) => {
           let newData = d;
           newData.push(i);
           return newData;
       })
       });


    let yMax = d3.max(data, function(d) {
      let max: number = 0;
      for (let i in d) {
        if (max < d[i]["count"]) {
          max = d[i]["count"]; 
        }
      }
      return max;
    });
    let y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

    let x = d3.scaleBand()
        .domain(xzToString)
        .range([0, this.width]);

    this.y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([this.height, 0]);

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Count of records by record type by year  ////////////////////////////////

    // TODO: make the total count list dynamic
    let yzTotal = this.dataToLayer(totalCount, ["wangjo", "secretariat", "garrison"], this.dataRange);

    let y01zTotal = d3.stack().keys(["wangjo", "secretariat", "garrison"])(yzTotal).map(
       (data, i) => {
         return data.map((d) => {
           let newData = d;
           newData.push(i);
           return newData;
       })
       });


    let yMaxTotal = d3.max(totalCount, function(d) {
      let max: number = 0;
      for (let i in d) {
        if (max < d[i]["count"]) {
          max = d[i]["count"]; 
        }
      }
      return max;
    });
    let y1MaxTotal = d3.max(y01zTotal, function(y) { return d3.max(y, function(d) { 
      return d[1]; }); });

    let yTotal = d3.scaleLinear()
        .domain([0, y1MaxTotal])
        .range([this.height, 0]);
    
    let colorTotal = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, 4]);

    this.svg.append("g")
        .selectAll("path")
        .data(y01zTotal)
        //.enter()
        .join("path")
          .attr("fill", function(d, i) { return colorTotal(i); })
          // .attr("fill", "none")
          .attr("stroke", function(d, i) { return colorTotal(i); })
          .attr("d", d3.area()
            .curve(d3.curveNatural)
            .x(function(d, i) { 
              //console.log(d, i);
              return x(xzToString[i]); })
            //.y( d => { console.log(d); return yTotal(d[1])} )
            .y0(d => { return yTotal(d[0]); })
            .y1(d => { return yTotal(d[1]); })
          );
      
    this.svg.append("g")
      .call(d3.axisRight(yTotal));

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// original graph /////////////////////////////////////////////
    
    let color = d3.scaleSequential(d3.interpolateMagma)
    .domain([0, n -1]);

    let series = this.svg.selectAll(".series")
      .data(y01z)
      .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });
 
    let tip = d3tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            console.log(d);
            return "<strong>count: </strong> <span style='color:red'>" + (d[1] - d[0]) + "</span>";
          });
    // this.svg.call(tip);

    this.rect = series.selectAll("rect")
      .data(function(d) { 
        return d; 
      })
      .enter()
      .append("rect")
        .attr("x", function(d, i) { 
          return x(xzToString[i]); 
        })
        .attr("y", this.height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on('mouseover', tip.show )
        .on('mouseout', tip.hide );

    let y = this.y;
    this.rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });

    this.svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x)
            .tickSize(1)
            .tickValues(this.getTickValues(xz)));

    this.svg.append("g")
      .call(d3.axisLeft(this.y));

    let legend = this.svg.selectAll(".legend")
          .data(Array.apply(null, {length: n}).map(Number.call, Number))
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
          .attr("x", this.width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

    legend.append("text")
          .attr("x", this.width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(i) { return "Total Count: "+ getArraySum(data[i]) +" / "+ searchKeywords[i]; });

    let legendTotal = this.svg.selectAll(".legendTotal")
          .data(Array.apply(null, {length: totalCount.length}).map(Number.call, Number))
        .enter().append("g")
          .attr("class", "legendTotal")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legendTotal.append("rect")
          .attr("x", 40)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", colorTotal);

    let totalCountRecordType = ["wangjo", "secretariat", "garrison"];
    legendTotal.append("text")
          .attr("x", 63)
          .attr("y", 9)
          .attr("dy", ".35em")
          // .style("text-anchor", "end")
          .text(function(d, i) { 
            return "Total Count: "+ getArraySum(totalCount[i]) +" / "+ totalCountRecordType[i]; });

    this.n = n;    
    this.xzToString = xzToString;
    this.yMax = yMax;
    this.y1Max = y1Max;
    this.x = x;

    function getArraySum(data: KeywordAggregation[]) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i]["count"];
      }
      return sum;
    }
  }
}



// need to transfer all logic here: https://github.com/msuh/sillokerContainer/blob/master/sillokerApp/src/main/resources/static/js/aggregation-graph.js