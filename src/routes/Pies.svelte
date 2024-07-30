<script>
  import * as d3 from "d3";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";


  let width = 900;
  let height = 450;
  let margin = 5;
  let radius = Math.min(width / 2, height / 2) - margin;

  const data1 = {
    "Synergy Marine": 843,
    "Anglo-Eastern": 899,
    "Bernhard Schulte Shipmanagement": 742,
    "Columbia Ship Management": 477,
    "Fleet Management": 877,
    "OSM Thome": 656,
    "Seacon Shipping Group": 227,
    "V. Group": 940,
    "Wallem Group": 326,
    "Wilhelmsen Ship Management": 324
  };

  const data2 = {
    "Synergy Marine": 12,
    "Anglo-Eastern": 3,
    "Bernhard Schulte Shipmanagement": 5,
    "Columbia Ship Management": 3,
    "Fleet Management": 8,
    "OSM Thome": 5,
    "Seacon Shipping Group": 1,
    "V. Group": 7,
    "Wallem Group": 1,
    "Wilhelmsen Ship Management": 4
  };

  const customColors = [
    "#e15759", //red
    "#4e79a7", //blue
    "#76b7b2", //turquoise
    "#59a14f", //green
    "#f28e2c", //orange
    "#bab0ab", //grey
    "#af7aa1", //purple
    "#ff9da7", //pink
    "#9c755f", //brown
    "#edc949" //yellow
  ];

  const color = d3
    .scaleOrdinal()
    .domain(Object.keys(data1))
    .range(customColors);

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d[1])
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  const arc2 = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  const data_ready1 = pie(Object.entries(data1));
  const data_ready2 = pie(Object.entries(data2));

  // Use a writable store to handle central text
  const centralTextStore = writable({
    centralText1: '13%',
    centralText2: '24%',
    companyName1: 'Synergy Marine'
  });

  function updateCentralText(key, percentText, index) {
    centralTextStore.update(currentText => {
      if (index === 0) {
        // Update text for the left chart
        return { ...currentText, centralText1: `${percentText}`,
                companyName1: key
         };
      } else {
        // Update text for the right chart
        return { ...currentText, centralText2: `${percentText}`,
                companyName1: key
         };
      }
    });
  }

  let highlightedSlice = null; // Track the currently highlighted slice

  function handleMouseOver(event, d, index) {
    const percentText = d3.format(".0%")(d.data[1] / d3.sum(index === 1 ? Object.values(data2) : Object.values(data1)));
    const keyText = d.data[0];

    // Update the central text for both charts
    if (index === 0) {
      updateCentralText(keyText, percentText, 0);
      // Find the corresponding slice in the second chart and update its text
      const matchingSlice = data_ready2.find(slice => slice.data[0] === keyText);
      if (matchingSlice) {
        const matchingPercentText = d3.format(".0%")(matchingSlice.data[1] / d3.sum(Object.values(data2)));
        updateCentralText(keyText, matchingPercentText, 1);
      }
    } else {
      updateCentralText(keyText, percentText, 1);
      // Find the corresponding slice in the first chart and update its text
      const matchingSlice = data_ready1.find(slice => slice.data[0] === keyText);
      if (matchingSlice) {
        const matchingPercentText = d3.format(".0%")(matchingSlice.data[1] / d3.sum(Object.values(data1)));
        updateCentralText(keyText, matchingPercentText, 0);
      }
    }

    // Highlight the hovered slice
    /*
    if (highlightedSlice) {
      // Remove highlight from the previously highlighted slice
      d3.select(highlightedSlice).style('stroke', 'white')
                                 .style('stroke-width', '1px');
    }

    highlightedSlice = event.currentTarget;
    d3.select(event.currentTarget).raise();
    d3.select(highlightedSlice).style('stroke', '#000000')
                               .style('stroke-width', '3px');
                               */
                               
                                 // Get the aria-label from the current target
  let ariaLabel = d3.select(event.currentTarget).attr('aria-label');
  // Extract the part before the colon
  if (ariaLabel && ariaLabel.includes(':')) {
    ariaLabel = ariaLabel.split(':')[0].trim();
  }
  console.log (ariaLabel)
  
  // Remove highlight from the previously highlighted slice
  if (highlightedSlice) {
    d3.select(highlightedSlice)
      .style('stroke', 'white')
      .style('stroke-width', '1px');
  }

  // Set the new highlighted slice
  highlightedSlice = event.currentTarget;

  // Highlight the currently hovered slice and bring it to the top
  d3.select(highlightedSlice)
    .style('stroke', '#000000')
    .style('stroke-width', '3px')
    .raise();

  // Highlight all slices with the same aria-label
  d3.selectAll('path')
    .each(function() {
      const path = d3.select(this);
      const pathAriaLabel = path.attr('aria-label');
      if (pathAriaLabel && pathAriaLabel.includes(ariaLabel)) {
        path.style('stroke', '#000000')
            .style('stroke-width', '3px')
            .raise(); // Bring the matching slices to the top
      } else {
        path.style('stroke', 'white')
            .style('stroke-width', '1px');
      }
    });

  }

  function handleMouseOut(event) {
    // Don't remove highlight from the currently selected slice
    if (highlightedSlice !== event.currentTarget) {
      d3.select(event.currentTarget).style('stroke', 'white')
                                   .style('stroke-width', '1px');
    }
  }

  function handleFocus(event, d, index) {
    handleMouseOver(event, d, index);
  }

  function handleBlur(event) {
    handleMouseOut(event);
  }
  
  function highlightByAriaLabel(label) {
  d3.selectAll('path')
    .each(function(d) {
      const path = d3.select(this);
      const ariaLabel = path.attr('aria-label');
      if (ariaLabel && ariaLabel.includes(label)) {
        path.style('stroke', '#000000').style('stroke-width', '3px')
        .raise(); // Bring the highlighted slice to the top
      } else {
        path.style('stroke', 'white').style('stroke-width', '1px');
      }
    });
}

onMount(() => {
  setTimeout(() => {
    highlightByAriaLabel('Synergy Marine');
  }, 100); // Adjust timeout if necessary
});
</script>


<style>
  :global(body) {
    margin: 0;
  }

  .map-wrap {
    max-width: 1600px;
    margin: 0 auto;
    position: relative;
  }

</style>

<div class="usat-interactive-graphic">
<div class="header-wrap article-inner">
  	<h2 class="graphic-header">Synergy's outsized share of shipping accidents</h2>
	<p class="graphic-chatter">Among almost 6,000 ships that USA TODAY could confirm the largest companies have managed over the past five years, Synergy managed about 13% -- but the company's ships had 24% of the incidents we found with a death or injury. <!--Synergy stood out for its outsized share of incidents causing a death or injury. -->
	Hover over the wedges on the chart below to compare the other companies' rates.</p>
 </div>
<div class="map-wrap">
<center>
<svg
  {width}
  {height}
  viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
  style:max-width="100%"
  style:height="auto"
>
  <g>
   <text
      x="0"
      y="-150"
      text-anchor="middle"
      font-size="48px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      {#if $centralTextStore.companyName1}
        <!--<tspan x="0" dy="1.5em">{$centralTextStore.companyName1}</tspan>-->
                <tspan x="0" dy="0">{$centralTextStore.companyName1}</tspan>

      {/if}
    </text>
    </g>
  <g class="chart-inner" transform="translate({-width / 4.5}, 50)">
    {#each data_ready1 as slice}
      <path
        d={arc(slice)}
        fill={color(slice.data[0])}
        stroke="white"
        role="img"
        aria-label={slice.data[0] + ': ' + slice.data[1]}
        tabindex="0"
        on:mouseover={(event) => handleMouseOver(event, slice, 0)}
        on:focus={(event) => handleFocus(event, slice, 0)}
        on:mouseout={(event) => handleMouseOut(event)}
        on:blur={(event) => handleBlur(event)}
      >
        <title>{slice.data[0] + ': ' + slice.data[1]}</title>
      </path>
    {/each}
    <text
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="central"
      font-size="80px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      {#if $centralTextStore.centralText1}
        <tspan x="0" dy="-0.3em">{$centralTextStore.centralText1.split('\n')[0]}</tspan>
        <!--<tspan x="0" dy="1.2em">{$centralTextStore.centralText1.split('\n')[1]}</tspan>-->
      {/if}
    </text>
    <text
      x="0"
      y="{height / 8}"  
      text-anchor="middle"
      font-size="30px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      Share of Ships
    </text>
  </g>

  <g class="chart-inner" transform="translate({width / 4.5}, 50)">
    {#each data_ready2 as slice}
      <path
        d={arc2(slice)}
        fill={color(slice.data[0])}
        stroke="white"
        role="img"
        aria-label={slice.data[0] + ': ' + slice.data[1]}
        tabindex="0"
        on:mouseover={(event) => handleMouseOver(event, slice, 1)}
        on:focus={(event) => handleFocus(event, slice, 1)}
        on:mouseout={(event) => handleMouseOut(event)}
        on:blur={(event) => handleBlur(event)}
      >
        <title>{slice.data[0] + ': ' + slice.data[1]}</title>
      </path>
    {/each}
    <text
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="central"
      font-size="80px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      {#if $centralTextStore.centralText2}
        <tspan x="0" dy="-0.3em">{$centralTextStore.centralText2.split('\n')[0]}</tspan>
        <!--<tspan x="0" dy="1.2em">{$centralTextStore.centralText2.split('\n')[1]}</tspan>-->
      {/if}
    </text>
        <text
      x="0"
      y="{height / 8}"  
      text-anchor="middle"
      font-size="30px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      Share of Incidents
    </text>
  </g>
</svg>
</center>
</div>
<div class="article-inner">
  <!--<p class="source-line">NOTE Slices represent circles are not positioned precisely, but have been adjusted to prevent overlap. USA TODAY used areal weighting to approximate funding distribution when grant recipients crossed county lines. </p>-->
  <p class="source-line">SOURCE USA TODAY analysis of data from Lloyd's List Intelligence and the U.S. Coast Guard</p>
</div>
</div>