fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').
then(response => response.json()).
then(dataset => {
  dataset.monthlyVariance.forEach(obj => {
    obj.temperature = dataset.baseTemperature + obj.variance;
    obj.month = monthToString(obj.month);
  });
  function monthToString(d) {
    switch (d) {
      case 1:return 'January';
      case 2:return 'February';
      case 3:return 'March';
      case 4:return 'April';
      case 5:return 'May';
      case 6:return 'June';
      case 7:return 'July';
      case 8:return 'August';
      case 9:return 'September';
      case 10:return 'October';
      case 11:return 'November';
      case 12:return 'December';}

  }
  const legendData = [
  { temp: 2 },
  { temp: 3 },
  { temp: 4 },
  { temp: 5 },
  { temp: 6 },
  { temp: 7 },
  { temp: 8 },
  { temp: 9 },
  { temp: 10 },
  { temp: 11 },
  { temp: 12 },
  { temp: 13 }];



  const WIDTH = 1400;
  const HEIGHT = 700;
  const PADDING_TOP = 105;
  const PADDING_BOTTOM = 105;
  const PADDING_LEFT = 105;
  const PADDING_RIGHT = 45;

  const INNER_WIDTH = WIDTH - (PADDING_LEFT + PADDING_RIGHT);
  const INNER_HEIGHT = HEIGHT - (PADDING_TOP + PADDING_BOTTOM);

  const tooltipXOffset = 10;
  const tooltipYOffset = -50;

  const monthValue = d => d.month;
  const yearValue = d => d.year;
  const tempValue = d => d.temperature;

  const rectWidth = 2;
  const rectHeight = 2;

  const svg = d3.select('svg');

  svg.attr('width', WIDTH).
  attr('height', HEIGHT).
  attr('font-family', '"Lato", sans-serif');

  /* --TEXT-- */

  svg.append('text').
  attr('id', 'title').
  text('Monthly Global Land-Surface Temperature').
  attr('x', WIDTH / 2).
  attr('text-anchor', 'middle').
  attr('y', PADDING_TOP - 60).
  attr('font-size', '2.3em').
  attr('fill', "#222");

  svg.append('text').
  attr('id', 'description').
  text("1753 - 2015: base temperature 8.66℃").
  attr('x', WIDTH / 2).
  attr('text-anchor', 'middle').
  attr('y', PADDING_TOP - 25).
  attr('font-size', '1.5em').
  attr('fill', "#222");

  /* --LEGEND-- */

  const legendG = svg.append('g').
  attr('id', 'legend').
  attr('font-size', '.9em').
  attr('fill', '#444');

  legendG.append('text').
  attr('text-anchor', 'start').
  text('Temperature Scale (℃)').
  attr('x', PADDING_LEFT).
  attr('y', HEIGHT - PADDING_BOTTOM + 45);

  /* --SCALES-- */

  const yScale = d3.scaleBand().
  domain(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']).
  range([HEIGHT - PADDING_BOTTOM, PADDING_TOP]);

  let xDomainArr = [dataset.monthlyVariance[0].year];
  dataset.monthlyVariance.forEach(d => {
    if (d.year > xDomainArr[xDomainArr.length - 1]) {
      xDomainArr.push(d.year);
    }
  });

  const xScale = d3.scaleBand().
  domain(xDomainArr).
  range([PADDING_LEFT, WIDTH - PADDING_RIGHT]);

  const colorScale = d3.scaleThreshold().
  domain([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).
  range(['rgb(49, 54, 149)', 'rgb(69, 117, 180)', 'rgb(116, 173, 209)', 'rgb(171, 217, 233)', 'rgb(224, 243, 248)', 'rgb(255, 255, 191)', 'rgb(254, 224, 144)', 'rgb(253, 174, 97)', 'rgb(244, 109, 67)', 'rgb(215, 48, 39)', 'rgb(165, 0, 38)']);

  const legendXScale = d3.scaleLinear().
  domain(d3.extent(legendData, d => d.temp)).
  range([PADDING_LEFT, d3.max(legendData, d => d.temp) * 30 + PADDING_LEFT - 60]);


  /* --AXES-- */

  const xAxis = d3.axisBottom(xScale).
  tickFormat(d => d % 10 == 0 ? d : null);

  // .tickValues(xDomainArr.map(d => (d % 10 == 0) ? d : null));
  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM})`).
  call(xAxis);


  const yAxis = d3.axisLeft(yScale).
  tickPadding(7);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', `translate(${PADDING_LEFT} , 0)`).
  call(yAxis);

  const colorAxis = d3.axisBottom(legendXScale);

  legendG.append('g').
  attr('id', 'color-axis').
  attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM + 70})`).
  call(colorAxis);

  /* --DATA RENDERING-- */

  svg.selectAll('rect').
  data(dataset.monthlyVariance).
  enter().
  append('rect').
  attr('class', 'cell').
  attr('data-month', monthValue).
  attr('data-year', yearValue).
  attr('data-temp', tempValue).
  attr('x', d => xScale(d.year)).
  attr('y', d => yScale(d.month)).
  attr('width', xScale.bandwidth()).
  attr('height', yScale.bandwidth()).
  attr('fill', d => colorScale(d.temperature)).
  on('mouseover', d => {
    tooltip.select('rect').
    attr('data-year', d.year);
    tooltip.style('visibility', 'visible').
    append('text').
    attr('font-size', '1em').
    attr('font-weight', '600').
    attr('transform', `translate(10, 15)`).
    append('tspan').
    text(`${d.year} / ${d.month}`).
    attr('x', '.15em').
    attr('dy', '.4em').
    append('tspan').
    attr('dy', '1.5em').
    attr('x', '.15em').
    text(`Temperature: ${d.temperature.toFixed(2)}℃`).
    append('tspan').
    attr('dy', '1.5em').
    attr('x', '.15em').
    text(`Variance: ${d.variance.toFixed(2)}℃`);
  }).
  on('mouseout', () => {
    tooltip.style('visibility', 'hidden');
    tooltip.select('rect').
    attr('data-year', '');
    tooltip.select('text').remove();
  }).
  on('mousemove', d => {
    let mousePosition = d3.mouse(d3.event.currentTarget);
    let xPosition = mousePosition[0];
    let yPosition = mousePosition[1];
    tooltip.attr('transform', `translate(${xPosition + tooltipXOffset}, ${yPosition + tooltipYOffset})`).
    attr('data-year', `${d.year}`);
  });



  // --legend rendering
  legendG.selectAll('rect').
  data(legendData).
  enter().
  append('rect').
  attr('x', d => d.temp == 13 ? -100 : d.temp * 30 + PADDING_LEFT - 60).
  attr('y', HEIGHT - PADDING_BOTTOM + 55).
  attr('width', '30').
  attr('height', '15').
  attr('fill', d => colorScale(d.temp));



  /* --TOOLTIP-- */

  let tooltip = svg.append('g').
  attr('id', 'tooltip');

  tooltip.append('rect').
  attr('class', 'tooltip').
  attr('width', '168').
  attr('height', '80').
  attr('rx', '.5em').
  attr('ry', '.4em');

  tooltip.style('visibility', 'hidden');

}).
catch(() => {
  const svg = d3.select('svg');

  svg.attr('width', '300').
  attr('height', '50').
  attr('font-family', '"Lato", sans-serif').
  append('text').
  attr('x', '150').
  attr('text-anchor', 'middle').
  attr('y', '30').
  text('Unable to load data. Sorry =/');
});