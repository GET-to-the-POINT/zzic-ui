<script>
/** @typedef {import('../../../zzic-api/todo.js').TodoStatisticsResponse} TodoStatisticsResponse */

/** @type {{ todoStatisticsResponse: TodoStatisticsResponse }} */
let {
    todoStatisticsResponse
} = $props();
  
</script>

<div class="card preset-outlined-surface-500 overflow-hidden grid grid-cols-4">
  {#each todoStatisticsResponse.content as stat, i (i)}
    <div class={[`px-4 py-1 flex flex-col `, 
      i === 0 ? 'preset-tonal' : 
      i === 1 ? 'preset-tonal-warning' : 
      i === 2 ? 'preset-tonal-success' : 
      'preset-tonal-surface'
    ]}>
      <span>{stat.statisticsName}</span>
      <span>{stat.statisticsValue}</span>
    </div>
  {/each}
</div>
