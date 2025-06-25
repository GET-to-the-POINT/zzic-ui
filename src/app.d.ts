// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			zzic: any | null;
			user: User | null;
			serverInstant?: any;
			temporal: {
				epochMilliseconds: number; // 밀리초 단위의 타임스탬프 (예: 1719095400000)
				utcDateTime: string; // ISO 8601 UTC 형식 (예: "2025-06-23T05:30:00Z")
				plainDateTime: string; // 로컬 날짜시간 (예: "2025-06-23T14:30:00")
				plainDate: string; // 로컬 날짜 (예: "2025-06-23")
				plainTime: string; // 로컬 시간 (예: "14:30:00")
				year: number; // 연도 (예: 2025)
				month: number; // 월 (1-12)
				day: number; // 일 (1-31)
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
