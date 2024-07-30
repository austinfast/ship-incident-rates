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

/*
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
  */
  
  const customColors = [
  	"#c96743", //orange
    //"#e15759", //red
    '#c1e7ff', '#95bed9', '#6a96b3', '#3e708f', '#004c6d', '#3e708f', '#6a96b3', '#95bed9', '#c1e7ff'];
    //'#c1e7ff', '#abd2ec', '#95bed9', '#7fa9c6', '#6a96b3', '#5482a1', '#3e708f', '#255e7e', '#004c6d'];

/*
    "#004c6d",
    "#006083",
    "#007599",
    "#008bad",
    "#00a1c1",
    "#00b8d3",
    "#00cfe3",
    "#00e7f2",
    "#00ffff"
    ];
    */

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
  //let currentFocusedElement = null;


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
  //console.log (ariaLabel)
  
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
    
  //for focus control
  /*  
  if (currentFocusedElement && currentFocusedElement !== event.currentTarget) {
    currentFocusedElement.blur(); // Remove focus from the previously focused element
  }
  
  currentFocusedElement = event.currentTarget; // Update the currently focused element
  currentFocusedElement.focus(); // Apply focus to the new element
*/

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
  <!-- removed tabindex="0" from under aria-label-->
    {#each data_ready1 as slice}
      <path
        d={arc(slice)}
        fill={color(slice.data[0])}
        stroke="white"
        role="img"
        aria-label={slice.data[0] + ': ' + slice.data[1]}
        on:mouseover={(event) => handleMouseOver(event, slice, 0)}
        on:focus={(event) => handleFocus(event, slice, 0)}
        on:mouseout={(event) => handleMouseOut(event)}
        on:blur={(event) => handleBlur(event)}
      >
        <title>{slice.data[0] + ': ' + slice.data[1]}</title>
      </path>
    {/each}
    <!--
    <g transform="translate(-20,-100)">
    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 32 32" {...$$props}>
	<path fill="black" d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .683 1.2l-1.517 6.068A4.99 4.99 0 0 1 16 16a5 5 0 0 1-4 2a5 5 0 0 1-4-2a4.99 4.99 0 0 1-4.252 1.994l-1.516-6.068a1 1 0 0 1 .682-1.2zm2-.6L12 8l2.754.826l1.809.543L18 9.8V5H6zM4 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 12 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 20 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 12 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 4 22H2v-2z" />
	</svg>
	</g> -->
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
    <g transform="translate(-175,10)">
    <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 32 32" {...$$props}>
	<path fill="black" d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .683 1.2l-1.517 6.068A4.99 4.99 0 0 1 16 16a5 5 0 0 1-4 2a5 5 0 0 1-4-2a4.99 4.99 0 0 1-4.252 1.994l-1.516-6.068a1 1 0 0 1 .682-1.2zm2-.6L12 8l2.754.826l1.809.543L18 9.8V5H6zM4 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 12 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 20 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 12 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 4 22H2v-2z" />
	</svg>
	</g>
  </g>

  <g class="chart-inner" transform="translate({width / 4.5}, 50)">
    <!-- removed tabindex="0" from under aria-label-->
    {#each data_ready2 as slice}
      <path
        d={arc2(slice)}
        fill={color(slice.data[0])}
        stroke="white"
        role="img"
        aria-label={slice.data[0] + ': ' + slice.data[1]}
        on:mouseover={(event) => handleMouseOver(event, slice, 1)}
        on:focus={(event) => handleFocus(event, slice, 1)}
        on:mouseout={(event) => handleMouseOut(event)}
        on:blur={(event) => handleBlur(event)}
      >
        <title>{slice.data[0] + ': ' + slice.data[1]}</title>
      </path>
    {/each}
    <!--
    <g transform="translate(-17,-100)">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 2048 2048" {...$$props}>
	<path fill="black" d="M1920 2048H0L960 128zm-896-384H896v128h128zm0-128V896H896v640z" />
	</svg>
	</g>
	-->
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
      x="-15"
      y="{height / 8}"  
      text-anchor="middle"
      font-size="30px"
      fill="#000"
      font-family="var(--mk-font-family-sans, sans-serif)"
    >
      Share of Incidents
    </text>
    <g transform="translate(110,2)">
	<svg xmlns="http://www.w3.org/2000/svg" width="4.5em" height="4.5em" viewBox="0 0 32 32" {...$$props}>
	<path fill="black" d="M26.71 14.086L16.915 4.29a2.007 2.007 0 0 0-2.83 0L4.29 14.086a2.007 2.007 0 0 0 0 2.83l9.796 9.795c.778.778 2.05.778 2.83 0l9.796-9.796a2.009 2.009 0 0 0 0-2.828zM14.703 8.98c.22-.237.5-.356.844-.356s.624.118.844.353c.22.235.33.53.33.885c0 .306-.1 1.333-.303 3.082c-.2 1.75-.38 3.44-.53 5.072h-.717c-.135-1.633-.3-3.323-.5-5.072c-.198-1.75-.298-2.776-.298-3.082c0-.35.11-.642.33-.88zm1.73 12.82c-.248.24-.543.36-.886.36s-.638-.12-.885-.36c-.247-.242-.37-.534-.37-.877s.123-.638.37-.885c.248-.248.543-.372.886-.372s.638.124.885.372c.25.247.373.542.373.885s-.124.635-.372.876z" />
</svg>
	</g>
  </g>
</svg>
</center>
</div>
<div class="article-inner">
  <!--<p class="source-line">NOTE Slices represent circles are not positioned precisely, but have been adjusted to prevent overlap. USA TODAY used areal weighting to approximate funding distribution when grant recipients crossed county lines. </p>-->
  <p class="source-line">SOURCE USA TODAY analysis of data from <a href="https://www.seasearcher.com/" target="_blank">Lloyd's List Intelligence</a> and the <a href="https://cgmix.uscg.mil/IIR/IIRSearch.aspx" target="_blank">U.S. Coast Guard</a></p>
</div>
</div>