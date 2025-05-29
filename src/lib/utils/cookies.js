/**
 * Set-Cookie 헤더 파서 유틸리티
 * 백엔드에서 받은 Set-Cookie 헤더를 SvelteKit 쿠키 형식으로 변환
 */
export function parseSetCookie(setCookieHeader) {
	if (!setCookieHeader) return [];
	
	return setCookieHeader.split(',').map((cookieStr) => {
		const [pair, ...options] = cookieStr.split(';');
		const [name, value] = pair.split('=');
		
		const cookieOptions = {};
		options.forEach(option => {
			const [key, val] = option.trim().split('=');
			if (key && val) {
				cookieOptions[key.toLowerCase()] = val;
			} else if (key) {
				cookieOptions[key.toLowerCase()] = true;
			}
		});

		return { 
			name: name.trim(), 
			value: value.trim(), 
			options: cookieOptions 
		};
	});
}