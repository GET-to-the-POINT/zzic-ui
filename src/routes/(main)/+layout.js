/**
 * Main layout data loader
 * 공통 데이터를 로드하고 하위 페이지에서 접근 가능하도록 합니다
 */
export async function load({ parent }) {
	const parentData = await parent();

	return {
		// 부모 데이터 전달
		...parentData,
		// 공통 레이아웃 데이터
		layout: {
			name: 'main',
			hasHeader: true,
			hasNavigation: true
		}
	};
}
