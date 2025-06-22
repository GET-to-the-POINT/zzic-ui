/**
 * URL 쿼리 파라미터를 옵션 객체로 변환합니다.
 * 배열 파라미터들을 올바르게 처리합니다.
 * 
 * @param {URLSearchParams} searchParams - URL 검색 파라미터
 * @param {Object} [arrayFields] - 배열로 처리할 필드들의 설정
 * @param {string[]} [arrayFields.numbers] - 숫자 배열로 처리할 필드명들
 * @param {string[]} [arrayFields.strings] - 문자열 배열로 처리할 필드명들
 * @returns {any} 변환된 옵션 객체
 */
export function parseSearchParams(searchParams, arrayFields = {}) {
	/** @type {any} */
	const options = {};
	
	// 기본 배열 필드 설정
	const defaultArrayFields = {
		numbers: ['statusIds', 'categoryIds', 'priorityIds', 'hideStatusIds'],
		strings: ['tags']
	};
	
	const finalArrayFields = {
		numbers: [...(defaultArrayFields.numbers), ...(arrayFields.numbers || [])],
		strings: [...(defaultArrayFields.strings), ...(arrayFields.strings || [])]
	};
	
	for (const [key, value] of searchParams.entries()) {
		if (finalArrayFields.numbers.includes(key)) {
			// 숫자 배열 파라미터 처리
			if (!options[key]) {
				options[key] = [];
			}
			const numValue = parseInt(value, 10);
			if (!isNaN(numValue)) {
				options[key].push(numValue);
			}
		} else if (finalArrayFields.strings.includes(key)) {
			// 문자열 배열 파라미터 처리
			if (!options[key]) {
				options[key] = [];
			}
			options[key].push(value);
		} else {
			// 단일 값 파라미터 처리
			options[key] = value;
		}
	}
	
	return options;
}

/**
 * Zod 스키마로 검증된 데이터를 API 호출용 옵션으로 변환
 * @param {any} validatedData - Zod로 검증된 데이터
 * @param {any} rawOptions - 원본 옵션 (추가 필드용)
 * @returns {any} API 호출용 옵션
 */
export function prepareApiOptions(validatedData, rawOptions = {}) {
	return {
		...rawOptions,
		...validatedData
	};
}

/**
 * 옵션 객체를 URL 쿼리 파라미터로 변환합니다.
 * 
 * @param {any} options - 옵션 객체
 * @returns {URLSearchParams} URL 검색 파라미터
 */
export function buildSearchParams(options) {
	const params = new URLSearchParams();
	
	for (const [key, value] of Object.entries(options)) {
		if (value === undefined || value === null) {
			continue;
		}
		
		if (Array.isArray(value)) {
			// 배열 파라미터 처리
			/** @type {any[]} */ (value).forEach(/** @type {any} */ item => {
				params.append(key, String(item));
			});
		} else {
			// 단일 값 파라미터 처리
			params.set(key, String(value));
		}
	}
	
	return params;
}
