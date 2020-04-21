// Initialize the framework for the SVG
    const margin = {top: 20, right: 30, bottom: 40, left: 80};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const percentFormat = d3.format('.0%');
    const leftPadding = 5;

    // Provide a delay setting for switching to the next year of data
    const delay = function(d, i) {
      return i * 40;
    };
  
    // Function to sort values for each year on the GDP percentage
    function sortData(data) {
      return data.sort((a, b) => b.value - a.value);
    }
  
    // Function to remove a country from the chart in a given year
    // if it had data the previous cycle, but not the current.
    function removeGeoAreasWithNoData(data) {
      return data.filter(d => d.value);
    }
  
    // Function to parse data from the csv and split it into the appropriate fields.
    function prepareData(data) {
      return data.reduce((accumulator, d) => {
        Object.keys(d).forEach((k) => {
          if (!Number.isInteger(+k)) { return; }
          let value;
          if (d[+k] === '..') {
            value = 0;
          } else {
            value = +d[+k] / 100;
          }
          const newEntry = {
            value,
            geoCode: d.CountryCode,
            geoName: d.Country,
            cntCode: d.Series,
          };
          if (accumulator[+k]) {
            accumulator[+k].push(newEntry);
          } else {
            accumulator[+k] = [newEntry];
          }
        });
        return accumulator;
      }, {});
    }
  
    // functions to handle accessing the X & Y axis values and scales
    function xAccessor(d) {
      return d.value;
    }
  
    function yAccessor(d) {
      return d.geoName;
    }
  
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, 0.5]);
  
    const yScale = d3.scaleBand()
        .rangeRound([0, height], 0.1)
        .padding(0.1);
  
    function drawXAxis(el) {
      el.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', `translate(${leftPadding},${height})`)
          .call(d3.axisBottom(xScale).tickFormat(percentFormat));
    }
  
    function drawYAxis(el, data, t) {
      let axis = el.select('.axis--y');
      if (axis.empty()) {
        axis = el.append('g')
          .attr('class', 'axis axis--y');
      }
  
      axis.transition(t)
          .call(d3.axisLeft(yScale))
        .selectAll('g')
          .delay(delay);
    }
  
    // functions information for drawing the bars each cycle
    function drawBars(el, data, t) {
      let barsG = el.select('.bars-g');
      if (barsG.empty()) {
        barsG = el.append('g')
          .attr('class', 'bars-g');
      }
  
      const bars = barsG
        .selectAll('.bar')
        .data(data, yAccessor);
      bars.exit()
        .remove();
      bars.enter()
        .append('rect')
          .attr('class', d => d.geoCode === 'OTH' ? 'bar wld' : 'bar')
          .attr('x', leftPadding)
        .merge(bars).transition(t)
          .attr('y', d => yScale(yAccessor(d)))
          .attr('width', d => xScale(xAccessor(d)))
          .attr('height', yScale.bandwidth())
          .delay(delay);
    }
  
    // Construct the SVG using the framework variables defined above.
    const svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Get the data set from the CSV and parse it using the prepareData function
    fetch('./race_tabperc.csv')
      .then((res) => res.text())
      .then((res) => {
        const data = prepareData(d3.csvParse(res));
        const years = Object.keys(data).map(d => +d);
        const lastYear = years[years.length - 1];
        let startYear = years[0];
        let selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));
        let geoAreas = selectedData.map(yAccessor);
  
        d3.select('.year').text(startYear);
  
        yScale.domain(geoAreas);
        drawXAxis(svg, selectedData);
        drawYAxis(svg, selectedData);
        drawBars(svg, selectedData);
  
        const interval = d3.interval(() => {
          const t = d3.transition().duration(400);
  
          startYear += 1;
          selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));
  
          d3.select('.year').text(startYear);
  
          yScale.domain(selectedData.map(yAccessor));
          drawYAxis(svg, selectedData, t);
          drawBars(svg, selectedData, t);
  
          if (startYear === lastYear) {
            interval.stop();
          }
        }, 1000);
      });