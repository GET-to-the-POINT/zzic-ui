<script>
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Shape, ExtrudeGeometry, MeshPhysicalMaterial, Color, DoubleSide, ACESFilmicToneMapping, SRGBColorSpace } from 'three';
	import * as THREE from 'three';
	import { WebGLPathTracer, GradientEquirectTexture } from 'three-gpu-pathtracer';
	import { onMount } from 'svelte';

	// 별 모양의 Shape 생성 (5개 꼭짓점)
	function createStarShape() {
		const shape = new Shape();
		const outerRadius = 1.0;
		const innerRadius = 0.4;
		const spikes = 5;
		
		// 별 모양 생성 (외부 점과 내부 점을 번갈아가며)
		for (let i = 0; i < spikes * 2; i++) {
			const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			
			if (i === 0) {
				shape.moveTo(x, y);
			} else {
				shape.lineTo(x, y);
			}
		}
		shape.closePath();

		return shape;
	}

	// Extrude 설정 (로우폴리 레트로)
	const extrudeSettings = {
		depth: 0.8,
		bevelEnabled: true,
		bevelThickness: 0.12, // 더 얇게
		bevelSize: 0.08,      // 더 작게
		bevelSegments: 2,     // 최소 세그먼트
		steps: 2,             // 최소 스텝
		curveSegments: 3      // 매우 낮은 곡률 세그먼트
	};

	// 별 지오메트리 생성
	const starShape = createStarShape();
	const starGeometry = new ExtrudeGeometry(starShape, extrudeSettings);
	starGeometry.center();

	// 핑크-노랑-블루 그라데이션 텍스처 생성
	function createStarGradientTexture() {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d');
		
		if (!ctx) return null;
		
		// 원형 그라데이션 생성 (중앙에서 외곽으로)
		const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
		gradient.addColorStop(0, '#ffb3e6');    // 중앙: 솜사탕 핑크
		gradient.addColorStop(0.5, '#fff9b3');  // 중간: 부드러운 노랑
		gradient.addColorStop(1, '#b3d9ff');    // 외곽: 파스텔 블루
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 512, 512);
		
		// 캔버스를 텍스처로 변환
		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;
		return texture;
	}

	// 포토리얼리즘 머티리얼 생성 (진짜 크리스탈 같은 속성)
	const starMaterial = new MeshPhysicalMaterial({
		map: createStarGradientTexture(),       // 핑크-노랑-블루 그라데이션
		color: new Color('#ffffff'),            // 베이스 컬러 (흰색으로 텍스처 색상 유지)
		metalness: 0.0,                     // 완전 비금속 (유리/크리스탈)
		roughness: 0.02,                    // 거울처럼 매끄러운 표면
		transmission: 1.0,                 // 완전 투명
		thickness: 3.5,                     // 더 두껍게
		ior: 1.8,                          // 굴절률 증가 (유리 느낌 극대화)
		reflectivity: 0.05,                 // 매우 낮은 반사율 (투명감 극대화)
		clearcoat: 1.0,                     // 완벽한 표면 코팅
		clearcoatRoughness: 0.0,            // 완전히 매끄러운 코팅
		sheen: 1.0,                         // 강한 내부 광택
		sheenColor: new Color('#ff99dd'),   // 핑크 내부 광택
		transparent: true,
		opacity: 0.98,
		side: DoubleSide,
		envMapIntensity: 2.0,               // 강한 환경 반사
		attenuationColor: new Color('#ffb3e6'),  // 투과 시 핑크 틴트
		attenuationDistance: 1.5,
		iridescence: 0.3,                   // 무지개 효과 (크리스탈 느낌)
		iridescenceIOR: 1.3,
		iridescenceThicknessRange: [100, 400]
	});

	let meshRef = $state();
	let elapsed = 0;
	let xRotation = 0; // $state 제거, 일반 변수로 변경

	// 애니메이션 (부드럽게 둥둥 떠다니는 효과 + X축 지속 회전)
	useTask((delta) => {
	    elapsed += delta;
	    if (meshRef) {
	        // 부드러운 부유 효과: 느린 주기로 위아래 이동
	        const floatAmplitude = 0.2;
	        const floatFrequency = 0.3;
	        meshRef.position.y = 1.3 + Math.sin(elapsed * floatFrequency) * floatAmplitude;

	        // 부드러운 천천히 도는 회전
	        const rotationSpeedY = 0.02;
	        meshRef.rotation.y = elapsed * rotationSpeedY;

	        // 약간의 X축 회전으로 자연스러운 기울기 효과
	        meshRef.rotation.x = Math.sin(elapsed * 0.15) * 0.1;

	        // 미세한 Z축 흔들림
	        meshRef.rotation.z = Math.cos(elapsed * 0.2) * 0.05;

	        // 크기 변화는 제거하여 일관된 부유감 유지
	        meshRef.scale.set(1.5, 1.5, 1.5);
	    }
	});

	const { renderer, scene, camera } = useThrelte();
	// @ts-ignore
	let pathTracer;

	function createCottonCandyEnvironment() {
		const gradientTexture = new GradientEquirectTexture(1024);
		gradientTexture.topColor.setHex(0xffd4e6);     // 밝은 솜사탕 핑크
		gradientTexture.bottomColor.setHex(0xe6ccff);  // 부드러운 라벤더
		gradientTexture.exponent = 2.5;
		gradientTexture.update();
		return gradientTexture;
	}

	onMount(() => {
		if (renderer && scene && camera) {
			renderer.toneMapping = ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.0;
			renderer.outputColorSpace = SRGBColorSpace;

			const envTexture = createCottonCandyEnvironment();
			scene.environment = envTexture;
			scene.background = envTexture;

			pathTracer = new WebGLPathTracer(renderer);
			pathTracer.bounces = 15;
			pathTracer.renderScale = 1.0;
			pathTracer.tiles.set(2, 2);
			pathTracer.filterGlossyFactor = 0.25;
			pathTracer.dynamicLowRes = true;
			pathTracer.lowResScale = 0.25;
			pathTracer.setScene(scene, camera.current);

			const animate = () => {
				// @ts-ignore
				if (pathTracer) pathTracer.renderSample();
				requestAnimationFrame(animate);
			};
			animate();
		}
	});
</script>

<!-- 포토리얼리즘 카메라 -->
<T.PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />

<!-- 스튜디오 조명 설정 (포토리얼리즘) -->

<!-- 키 라이트 (메인 조명) - 부드러운 솜사탕 핑크 -->
<T.DirectionalLight
	position={[8, 12, 8]}
	intensity={2.5}
	color="#fff0f5"
	castShadow
	shadow.mapSize.width={4096}
	shadow.mapSize.height={4096}
	shadow.camera.near={0.1}
	shadow.camera.far={50}
	shadow.camera.left={-20}
	shadow.camera.right={20}
	shadow.camera.top={20}
	shadow.camera.bottom={-20}
	shadow.bias={-0.0005}
/>

<!-- 필 라이트 (보조 조명) - 부드러운 라벤더 */
<T.DirectionalLight
	position={[-5, 8, 6]}
	intensity={1.2}
	color="#f0e6ff"
/>

<!-- 백 라이트 (윤곽 조명) - 따뜻한 핑크 -->
<T.DirectionalLight
	position={[0, -3, -12]}
	intensity={1.8}
	color="#ffe6f0"
/>

<!-- HDR 환경광 (글로벌 일루미네이션) -->
<T.AmbientLight intensity={0.3} color="#fdf2f8" />

<!-- 스페큘러 하이라이트용 포인트 라이트들 -->
<T.PointLight
	position={[4, 5, 3]}
	intensity={8.0}
	color="#ffffff"
	distance={12}
	decay={2}
/>
<T.PointLight
	position={[-4, 4, 3]}
	intensity={6.0}
	color="#fff5f8"
	distance={10}
	decay={2}
/>
<T.PointLight
	position={[0, -2, 6]}
	intensity={4.0}
	color="#f8f0ff"
	distance={8}
	decay={2}
/>

<!-- 면광원들 (부드러운 스튜디오 조명) -->
<T.RectAreaLight
	position={[6, 8, 4]}
	width={8}
	height={6}
	intensity={3.0}
	color="#ffffff"
	lookAt={[0, 0, 0]}
/>
<T.RectAreaLight
	position={[-6, 6, 4]}
	width={6}
	height={4}
	intensity={2.0}
	color="#fff8fc"
	lookAt={[0, 0, 0]}
/>

<!-- 크리스탈 별 메시 -->
<T.Mesh
	bind:ref={meshRef}
	geometry={starGeometry}
	material={starMaterial}
	position={[0, 1.3, 0]}
	scale={[1.5, 1.5, 1.5]}
	castShadow
	receiveShadow
/>
