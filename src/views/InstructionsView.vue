<template>
  <div class="page narrow-page">
    <RouterLink class="back-link" to="/search">
      <i class="pi pi-arrow-left" aria-hidden="true"></i> Back to search
    </RouterLink>

    <article class="prose-page">
      <p class="eyebrow">Search guide</p>
      <h1>How to search Silloker</h1>
      <p class="lead">
        Silloker searches selected Korean historical archives for records containing your terms.
      </p>

      <h2>1. Choose record sources</h2>
      <p>
        Select one or more archives. Searching every source omits the record-type filter from the
        request, preserving the original service contract.
      </p>

      <h2>2. Add a date range</h2>
      <p>
        Years are optional. When both bounds are supplied, use an inclusive range between 1392
        and 1910.
      </p>

      <h2>3. Add keywords</h2>
      <p>
        Press Enter, type a comma, or leave the field to add a term. Search supports up to five
        keywords. Use the remove control on a keyword to revise the query.
      </p>

      <h2>4. Review or download</h2>
      <p>
        Results are returned in pages of 50 and retain the order supplied by the server. Download
        produces a tab-separated values file for offline analysis.
      </p>

      <div class="context-note">
        <i class="pi pi-lightbulb" aria-hidden="true"></i>
        <p>
          Start with a focused term and a broad range. Add terms or narrow the dates after you see
          how the language appears in the records.
        </p>
      </div>
    </article>
  </div>
</template>
