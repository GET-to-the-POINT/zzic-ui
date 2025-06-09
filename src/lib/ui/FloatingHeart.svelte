<script>
	import { Canvas } from '@threlte/core';
	import HeartMesh from './HeartMesh.svelte';
</script>

<!-- 화면 전체를 차지하는 고정 캔버스 (백그라운드 장식용) -->
<div 
	class={[
		'fixed inset-0 w-screen h-screen',
		'pointer-events-none -z-10'
	]}
>
	<Canvas>
		<HeartMesh />
	</Canvas>
</div>
