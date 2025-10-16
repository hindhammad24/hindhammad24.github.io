const DATA_URL = "dataset/videogames_long.csv";

async function loadData() {
  // autoType parses numbers automatically so year becomes a number as i previosly had trouble with it 
  return d3.csv(DATA_URL, d3.autoType);
}

async function render() {
  const data = await loadData();

  // ================================================================
  // VIZ 1: Global Sales by Genre × Platform
  // ================================================================

  const vis1_heatmap = vl
    .markRect()
    .data(data)
    .transform(vl.filter("isValid(datum.genre) && isValid(datum.platform)"))
    .encode(
      vl.x().fieldN("platform")
        .sort({ op: "sum", field: "global_sales", order: "descending" })
        .axis({ labelAngle: -40, title: "Platform" }),
      vl.y().fieldN("genre")
        .sort({ op: "sum", field: "global_sales", order: "descending" })
        .title("Genre"),
      vl.color().aggregate("sum").fieldQ("global_sales").title("Global Sales (M)"),
      vl.tooltip([
        { field: "platform", title: "Platform" },
        { field: "genre", title: "Genre" },
        { aggregate: "sum", field: "global_sales", title: "Global Sales (M)" }
      ])
    )
    .width("container")
    .height(440)
    .toSpec();

  await vegaEmbed("#vis1", vis1_heatmap, { actions: false });

  // B) Stacked bars by Genre (color = Platform), second angle on the same question
  const vis1_stacked = vl
    .markBar()
    .data(data)
    .transform(
      // keep popular platforms so colors stay readable
      vl.filter("indexof(['Wii','DS','PS2','PS3','X360','PS4','3DS','PSP','PC'], datum.platform) >= 0")
    )
    .encode(
      vl.x().fieldN("genre")
        .sort({ op: "sum", field: "global_sales", order: "descending" })
        .title("Genre"),
      vl.y().aggregate("sum").fieldQ("global_sales").title("Global Sales (M)"),
      vl.color().fieldN("platform").title("Platform"),
      vl.tooltip([
        { field: "genre", title: "Genre" },
        { field: "platform", title: "Platform" },
        { aggregate: "sum", field: "global_sales", title: "Global Sales (M)" }
      ])
    )
    .width("container")
    .height(420)
    .toSpec();

  await vegaEmbed("#vis1b", vis1_stacked, { actions: false });

  document.getElementById("notes1").innerHTML = `
    <strong>Reflection – Viz 1:</strong>
    <ul>
      <li><em>What patterns pop?</em> The darkest heatmap cells show a handful of sales on action games along with some on sports.</li>
      <li><em>Any surprises?</em> Handhelds (DS/PSP) show up stronger than I expected in some genres maybe becouse they have huge libraries + friendly price points.</li>
      <li><em>Personal angle:</em> I’m not usually an Action gamer, but this made me curious. Quick skim through articles and Action gets broad marketing, easy-to-grasp gameplay loops, and sequel momentum so the dominance checks out.</li>
      <li><em>Fun fact:</em> It’s a winner takes most world, few combos drive a big chunk of totals.</li>
    </ul>
  `;

  // ================================================================
  // VIZ 2: Sales Over Time by Platform and Genre
  // ================================================================

  const genreSelect = document.getElementById("genreSelect");

  async function renderVis2() {
    const g = genreSelect.value;

    const vis2 = vl
      .markLine({ point: true })
      .data(data)
      .transform(
        
        vl.filter("isValid(datum.year) && datum.year >= 1980 && datum.year <= 2020"),
       
        vl.filter(`datum.genre == '${g}'`),
        
        vl.filter("indexof(['Wii','DS','PS2','PS3','X360','PS4','3DS','PSP','PC'], datum.platform) >= 0"),
        
        { aggregate: [{ op: "sum", field: "global_sales", as: "global_sum" }], groupby: ["year", "platform"] }
      )
      .encode(
        // ***** THE FIX: use QUANTITATIVE year, not temporal *****
        vl.x().fieldQ("year")
          .title("Year")
          .axis({ tickMinStep: 1, format: "d" }), // integer ticks
        vl.y().fieldQ("global_sum").title("Global Sales (M)"),
        vl.color().fieldN("platform").title("Platform"),
        vl.tooltip([
          { field: "platform", title: "Platform" },
          { field: "year", title: "Year" },
          { field: "global_sum", title: "Global Sales (M)" }
        ])
      )
      .width("container")
      .height(380)
      .toSpec();

    await vegaEmbed("#vis2", vis2, { actions: false });

    document.getElementById("notes2").innerHTML = `
      <strong>Reflection – Viz 2:</strong>
      <ul>
        <li><em>How do sales shift over time?</em> For <b>${g}</b>, I see console waves, DS/Wii era pops, then HD consoles catch up, and newer platforms take over.</li>
        <li><em>Who peaks when?</em> Some platforms spike hard then fade; others hold a flatter, longer tail. It reads like generations passing the baton.</li>
        <li><em>Personal angle:</em> I’m curious why ${g} behaves like this. My guess: tech jumps HD, motion controls and online ecosystems and  franchise cycles pull demand toward whichever platform is hot that year.</li>
      </ul>
    `;
  }

  await renderVis2();
  genreSelect.addEventListener("change", renderVis2);

  // ================================================================
  // VIZ 3: Regional Sales vs. Platform
  // ================================================================

  const vis3a = vl
    .markBar()
    .data(data)
    .transform({
      aggregate: [{ op: "sum", field: "sales_amount", as: "region_sales" }],
      groupby: ["platform", "sales_region"]
    })
    .encode(
      vl.column().fieldN("sales_region")
        .sort(["na_sales","eu_sales","jp_sales","other_sales"])
        .title("Region"),
      vl.x().fieldN("platform")
        .sort({ op: "sum", field: "region_sales", order: "descending" })
        .axis({ labelAngle: -40, title: "Platform" }),
      vl.y().fieldQ("region_sales").title("Sales (M)"),
      vl.tooltip([
        { field: "platform", title: "Platform" },
        { field: "sales_region", title: "Region" },
        { field: "region_sales", title: "Sales (M)" }
      ])
    )
    .width(280)
    .height(260)
    .toSpec();

  await vegaEmbed("#vis3a", vis3a, { actions: false });

  const vis3b = vl
    .markBar()
    .data(data)
    .encode(
      vl.x().fieldN("platform")
        .sort({ op: "sum", field: "sales_amount", order: "descending" })
        .axis({ labelAngle: -40 }),
      vl.y().aggregate("sum").fieldQ("sales_amount").stack("normalize").title("Regional Share"),
      vl.color().fieldN("sales_region")
        .sort(["na_sales","eu_sales","jp_sales","other_sales"])
        .title("Region"),
      vl.tooltip([
        { field: "platform", title: "Platform" },
        { field: "sales_region", title: "Region" },
        { aggregate: "sum", field: "sales_amount", title: "Sales (M)" }
      ])
    )
    .width("container")
    .height(360)
    .toSpec();

  await vegaEmbed("#vis3b", vis3b, { actions: false });

  document.getElementById("notes3").innerHTML = `
    <strong>Reflection – Viz 3 </strong>
    <ul>
      <li><em>Regional preferences:</em> NA/EU lean into mainstream home consoles; JP leans more Nintendo/RPG ecosystems.</li>
      <li><em>Totals vs shares:</em> Small multiples show raw power; normalized bars reveal taste. A platform can be big overall but not dominant in every region.</li>
      <li><em>Personal angle:</em> I tend to assume my region’s favorites are universal. This chart humbles that Japan’s chart looks different on purpose.</li>
      <li><em>Fun fact:</em> Even when two platforms tie in totals, their audience mix can be wildly different.</li>
    </ul>
  `;
      // ================================================================
  // VIZ 4: Tell Us a Visual Story — JP Sales by Genre Over Time
  // approach:
  // 1) In JS, compute the Top 6 genres in Japan by total sales.
  // 2) Filter the chart to those genres.
  // 3) Aggregate by (year, genre) and plot lines.
  // ================================================================

  // --- Step 1: compute Top 6 genres in Japan in plain JS ---
  // Keep only Japan rows with a valid numeric year
  const jpRows = data.filter(d =>
    /jp_sales/i.test(d.sales_region) &&
    Number.isFinite(d.year)
  );

  // Sum sales per genre using d3.rollup
  const totalsByGenre = d3.rollup(
    jpRows,
    v => d3.sum(v, d => d.sales_amount || 0),
    d => d.genre
  );

  // Sort by total descending and take top 6 genre names
  const topGenres = Array.from(totalsByGenre, ([genre, total]) => ({ genre, total }))
    .sort((a, b) => d3.descending(a.total, b.total))
    .slice(0, 6)
    .map(d => d.genre);

  // --- Step 2: the actual chart spec ---
  const vis4 = vl
    .markLine({ point: true })
    .data(data)
    .transform(
      // Japan only case-insensitive, reasonable year range
      vl.filter("test(/jp_sales/i, datum.sales_region)"),
      vl.filter("isValid(datum.year) && datum.year >= 1985 && datum.year <= 2020"),

      // Keep only the Top 6 genres we just computed in JS
      vl.filter(`indexof(${JSON.stringify(topGenres)}, datum.genre) >= 0`),

      // Aggregate to yearly sums per genre
      { aggregate: [{ op: "sum", field: "sales_amount", as: "jp_sum" }], groupby: ["year", "genre"] }
    )
    .encode(
      // Numeric year axis prevents any 1969 temporal issues
      vl.x().fieldQ("year").title("Year").axis({ tickMinStep: 1, format: "d" }),
      vl.y().fieldQ("jp_sum").title("JP Sales (M)"),
      vl.color().fieldN("genre").title("Genre"),
      vl.tooltip([
        { field: "genre", title: "Genre" },
        { field: "year", title: "Year" },
        { field: "jp_sum", title: "JP Sales (M)" }
      ])
    )
    .width("container")
    .height(380)
    .toSpec();

  await vegaEmbed("#vis4", vis4, { actions: false });

  document.getElementById("notes4").innerHTML = `
    <strong>Reflection – Viz 4 </strong>
    <ul>
      <li><em>What stands out?</em> The Top 6 JP genres rise and fall with console/handheld eras, RPGs usually grab the spotlight.</li>
      <li><em>When are the spikes?</em> Peaks around DS/Wii and handheld-heavy periods suggest portable first habits in Japan.</li>
      <li><em>Personal angle:</em> I don’t play many RPGs, but now I get why they’re huge in JP, story first design, long playtime value, and homegrown franchises with serious loyalty.</li>
      <li><em>Fun fact:</em> A genre can be mid globally and still be a total celebrity locally.</li>
    </ul>
  `;

}
render();
