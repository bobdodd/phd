<script>
  let count = 0;
  let isOpen = false;
</script>

<!-- Issue 1: on:click without on:keydown (MouseOnlyClickAnalyzer should detect this) -->
<div on:click={() => count++}>
  Click me: {count}
</div>

<!-- Issue 2: bind:value without label (SvelteReactivityAnalyzer should detect this) -->
<input bind:value={count} />

<!-- Issue 3: class:hidden without aria-hidden (SvelteReactivityAnalyzer should detect this) -->
<div class:hidden={!isOpen}>
  Content
</div>

<!-- Good example: Has both click and keyboard handler -->
<button on:click={() => isOpen = !isOpen} on:keydown={(e) => { if (e.key === 'Enter') isOpen = !isOpen; }}>
  Toggle
</button>
