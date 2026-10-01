<script>
	import { modal } from './modalState.svelte.ts'
</script>

{#each modal.stack as item, index (item.id)}
  {@const DynamicModal = item.component}

  <div class="modal-wrapper" style="z-index: {1000 + index * 10};">
    <DynamicModal {...item.props} />
  </div>
{/each}
