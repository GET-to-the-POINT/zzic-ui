import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { themes, getCurrentTheme, setTheme, initializeTheme } from './theme.js';

// Mock browser environment
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

const mockDocument = {
	documentElement: {
		setAttribute: vi.fn()
	}
};

// Mock browser module
vi.mock('$app/environment', () => ({
	browser: true
}));

describe('Theme Utils', () => {
	beforeEach(() => {
		// Setup global mocks
		global.localStorage = mockLocalStorage;
		global.document = mockDocument;

		// Reset mocks
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('themes', () => {
		it('should have correct theme list', () => {
			expect(themes).toEqual([
				{ name: 'pinky', label: '핑키' },
				{ name: 'catppuccin', label: '카푸치노' },
				{ name: 'cerberus', label: '세르베루스' },
				{ name: 'concord', label: '콩코드' },
				{ name: 'crimson', label: '크림슨' },
				{ name: 'fennec', label: '페넥' },
				{ name: 'hamlindigo', label: '햄린디고' },
				{ name: 'legacy', label: '레거시' },
				{ name: 'mint', label: '민트' },
				{ name: 'modern', label: '모던' },
				{ name: 'mona', label: '모나' },
				{ name: 'nosh', label: '노시' },
				{ name: 'nouveau', label: '누보' },
				{ name: 'pine', label: '파인' },
				{ name: 'reign', label: '레인' },
				{ name: 'rocket', label: '로켓' },
				{ name: 'rose', label: '로즈' },
				{ name: 'sahara', label: '사하라' },
				{ name: 'seafoam', label: '시폼' },
				{ name: 'terminus', label: '터미너스' },
				{ name: 'vintage', label: '빈티지' },
				{ name: 'vox', label: '복스' },
				{ name: 'wintry', label: '윈터리' }
			]);
		});

		it('should have 23 themes', () => {
			expect(themes).toHaveLength(23);
		});

		it('should contain pinky theme', () => {
			const pinkyTheme = themes.find((theme) => theme.name === 'pinky');
			expect(pinkyTheme).toBeDefined();
			expect(pinkyTheme.label).toBe('핑키');
		});
	});

	describe('getCurrentTheme', () => {
		it('should return saved theme from localStorage', () => {
			mockLocalStorage.getItem.mockReturnValue('wintry');

			const result = getCurrentTheme();

			expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
			expect(result).toBe('wintry');
		});

		it('should return pinky as default when no theme saved', () => {
			mockLocalStorage.getItem.mockReturnValue(null);

			const result = getCurrentTheme();

			expect(result).toBe('pinky');
		});
	});

	describe('setTheme', () => {
		it('should set theme attribute on document and save to localStorage', () => {
			setTheme('crimson');

			expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
				'data-theme',
				'crimson'
			);
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'crimson');
		});

		it('should handle pinky theme', () => {
			setTheme('pinky');

			expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'pinky');
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'pinky');
		});
	});

	describe('initializeTheme', () => {
		it('should initialize with saved theme', () => {
			mockLocalStorage.getItem.mockReturnValue('vintage');

			initializeTheme();

			expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
			expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
				'data-theme',
				'vintage'
			);
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'vintage');
		});

		it('should initialize with pinky theme when no saved theme', () => {
			mockLocalStorage.getItem.mockReturnValue(null);

			initializeTheme();

			expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
				'data-theme',
				'pinky'
			);
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'pinky');
		});
	});
});

describe('Theme Utils - Non-browser Environment', () => {
	beforeEach(() => {
		// Mock non-browser environment
		vi.doMock('$app/environment', () => ({
			browser: false
		}));
	});

	afterEach(() => {
		vi.doUnmock('$app/environment');
	});

	it('getCurrentTheme should return pinky in non-browser environment', async () => {
		// Re-import with mocked environment
		const { getCurrentTheme } = await import('./theme.js');

		const result = getCurrentTheme();
		expect(result).toBe('pinky');
	});
});
