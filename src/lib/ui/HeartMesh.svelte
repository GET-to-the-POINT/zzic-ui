<script>
	import { T, useTask, useThrelte } from '@threlte/core';
	import { 
		Shape, 
		ExtrudeGeometry, 
		MeshPhysicalMaterial, 
		Color, 
		DoubleSide, 
		ACESFilmicToneMapping, 
		SRGBColorSpace 
	} from 'three';
	import { WebGLPathTracer, GradientEquirectTexture } from 'three-gpu-pathtracer';
	import { onMount } from 'svelte';

	// === 상수 정의 ===
	const HEART_SIZE = 1.0;
	const ANIMATION_SPEEDS = {
		floating: 0.5,
		rotation: 0.08,
		rotationX: 0.3,
		rotationZ: 0.25,
		breathing: 0.8
	};

	// === 하트 지오메트리 생성 ===
	function createHeartShape() {
		const shape = new Shape();
		const size = HEART_SIZE;
		
		// 베지어 곡선으로 부드러운 하트 모양 생성
		shape.moveTo(0, size * 0.3);
		shape.bezierCurveTo(-size * 0.3, size * 0.8, -size * 0.8, size * 0.8, -size * 0.8, size * 0.3);
		shape.bezierCurveTo(-size * 0.8, size * 0.0, -size * 0.5, -size * 0.3, -size * 0.3, -size * 0.5);
		shape.lineTo(0, -size * 1.0);
		shape.lineTo(size * 0.3, -size * 0.5);
		shape.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.8, size * 0.0, size * 0.8, size * 0.3);
		shape.bezierCurveTo(size * 0.8, size * 0.8, size * 0.3, size * 0.8, 0, size * 0.3);

		return shape;
	}

	// === 지오메트리 설정 ===
	const extrudeSettings = {
		depth: 0.8,
		bevelEnabled: true,
		bevelThickness: 0.12,
		bevelSize: 0.08,
		bevelSegments: 2,
		steps: 2,
		curveSegments: 3
	};

	// === 하트 지오메트리 생성 ===
	const heartShape = createHeartShape();
	const heartGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);
	heartGeometry.center();

	// === 플라스틱 머티리얼 생성 ===
	const heartMaterial = new MeshPhysicalMaterial({
		// 기본 색상
		color: new Color('#ff99cc'),
		
		// 물리적 속성 (플라스틱)
		metalness: 0.0,
		roughness: 0.4,
		transmission: 0.0,
		thickness: 0.0,
		ior: 1.0,
		reflectivity: 0.02,
		
		// 표면 코팅 (플라스틱 광택)
		clearcoat: 0.3,
		clearcoatRoughness: 0.3,
		
		// 내부 광택 (플라스틱 특성)
		sheen: 0.05,
		sheenColor: new Color('#ffb3dd'),
		
		// 불투명 설정
		transparent: false,
		opacity: 1.0,
		side: DoubleSide,
		
		// 환경 반사 (플라스틱 수준)
		envMapIntensity: 0.1,
		
		// 무지개 효과 (약간)
		iridescence: 0.0,
		iridescenceIOR: 1.0,
		iridescenceThicknessRange: [0, 0]
	});

	// === 상태 변수 ===
	let meshRef = $state();
	let elapsed = 0;

	// === 애니메이션 시스템 ===
	useTask((delta) => {
		elapsed += delta;
		if (!meshRef) return;

		// 부드러운 부유 효과
		meshRef.position.y = Math.sin(elapsed * ANIMATION_SPEEDS.floating) * 0.15;
		
		// 회전 애니메이션
		meshRef.rotation.y = elapsed * ANIMATION_SPEEDS.rotation;
		meshRef.rotation.x = Math.sin(elapsed * ANIMATION_SPEEDS.rotationX) * 0.06;
		meshRef.rotation.z = Math.cos(elapsed * ANIMATION_SPEEDS.rotationZ) * 0.03;
		
		// 호흡하는 듯한 크기 변화
		const breathScale = 1.0 + Math.sin(elapsed * ANIMATION_SPEEDS.breathing) * 0.05;
		meshRef.scale.set(breathScale, breathScale, breathScale);
	});

	// === Three.js 시스템 접근 ===
	const { renderer, scene, camera } = useThrelte();
	let pathTracer;

	// === 환경 텍스처 생성 ===
	function createCottonCandyEnvironment() {
		const gradientTexture = new GradientEquirectTexture(1024);
		gradientTexture.topColor.setHex(0xffd4e6);     // 솜사탕 핑크
		gradientTexture.bottomColor.setHex(0xe6ccff);  // 라벤더
		gradientTexture.exponent = 2.5;
		gradientTexture.update();
		return gradientTexture;
	}

	// === 리사이즈 핸들러 ===
	function handleResize() {
		if (!renderer || !camera) return;
		
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		
		// 렌더러 크기 업데이트 (픽셀 밀도 고려)
		renderer.setSize(width, height, false);
		
		// 카메라 aspect ratio 업데이트 (안전하게)
		if (camera.aspect !== undefined && camera.updateProjectionMatrix) {
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
	}

	// === 패스 트레이서 설정 ===
	function setupPathTracer() {
		if (!renderer || !scene || !camera) {
			console.log('Renderer, scene, or camera not ready yet');
			return;
		}

		// camera 객체가 Three.js Camera 인스턴스인지 확인
		if (!camera.updateMatrixWorld || typeof camera.updateMatrixWorld !== 'function') {
			console.log('Camera does not have updateMatrixWorld method, skipping path tracer setup');
			return;
		}

		try {
			pathTracer = new WebGLPathTracer(renderer);
			pathTracer.bounces = 15;
			pathTracer.renderScale = 1.0;
			pathTracer.tiles.set(2, 2);
			pathTracer.filterGlossyFactor = 0.25;
			pathTracer.dynamicLowRes = true;
			pathTracer.lowResScale = 0.25;
			pathTracer.setScene(scene, camera);

			// 렌더링 루프 시작
			const animate = () => {
				if (pathTracer) pathTracer.renderSample();
				requestAnimationFrame(animate);
			};
			animate();
			
			console.log('Path tracer setup successful');
		} catch (error) {
			console.warn('Failed to setup path tracer:', error);
			// 패스 트레이서 실패 시에도 기본 렌더링은 계속 진행
		}
	}

	// === 초기화 ===
	$effect(() => {
		// renderer, scene, camera가 모두 준비될 때까지 기다림
		if (!renderer || !scene || !camera) return;

		// 렌더러 설정
		renderer.toneMapping = ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.0;
		renderer.outputColorSpace = SRGBColorSpace;

		// 환경 설정
		const envTexture = createCottonCandyEnvironment();
		scene.environment = envTexture;
		scene.background = envTexture;

		// 패스 트레이서 설정 (약간의 지연을 두어 camera가 완전히 준비되도록 함)
		setTimeout(() => {
			setupPathTracer();
		}, 100);
		
		// 초기 리사이즈 처리
		handleResize();
		
		// 리사이즈 이벤트 리스너 등록
		window.addEventListener('resize', handleResize);
		
		// 정리 함수
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- ===== LIGHTING SYSTEM ===== -->

<!-- 메인 카메라 -->
<T.PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />

<!-- 키 라이트 (메인 조명) -->
<T.DirectionalLight
	position={[8, 12, 8]}
	intensity={1.2}
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

<!-- 필 라이트 (보조 조명) -->
<T.DirectionalLight
	position={[-5, 8, 6]}
	intensity={0.6}
	color="#f0e6ff"
/>

<!-- 백 라이트 (윤곽 조명) -->
<T.DirectionalLight
	position={[0, -3, -12]}
	intensity={0.9}
	color="#ffe6f0"
/>

<!-- 환경광 -->
<T.AmbientLight intensity={0.3} color="#fdf2f8" />

<!-- 스페큘러 하이라이트용 포인트 라이트들 -->
<T.PointLight
	position={[4, 5, 3]}
	intensity={3.0}
	color="#ffffff"
	distance={12}
	decay={2}
/>
<T.PointLight
	position={[-4, 4, 3]}
	intensity={2.5}
	color="#fff5f8"
	distance={10}
	decay={2}
/>
<T.PointLight
	position={[0, -2, 6]}
	intensity={1.5}
	color="#f8f0ff"
	distance={8}
	decay={2}
/>

<!-- 면광원들 (스튜디오 조명) -->
<T.RectAreaLight
	position={[6, 8, 4]}
	width={8}
	height={6}
	intensity={1.5}
	color="#ffffff"
	lookAt={[0, 0, 0]}
/>
<T.RectAreaLight
	position={[-6, 6, 4]}
	width={6}
	height={4}
	intensity={1.0}
	color="#fff8fc"
	lookAt={[0, 0, 0]}
/>

<!-- ===== MAIN MESH ===== -->

<!-- 크리스탈 하트 메시 -->
<T.Mesh
	bind:ref={meshRef}
	geometry={heartGeometry}
	material={heartMaterial}
	position={[0, 0, 0]}
	scale={[1.5, 1.5, 1.5]}
	castShadow
	receiveShadow
/>
