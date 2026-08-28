export type ThemeMode = 'light' | 'dark';

/** src/app.html のインラインスクリプトと同じキーを使うこと（FOUC防止のため二重管理） */
export const THEME_STORAGE_KEY = 'jazztime-theme';

/** デフォルトはダーク。システム設定は見ない（未設定の初回訪問は常にダークで表示する）。 */
const DEFAULT_MODE: ThemeMode = 'dark';

function readStored(): ThemeMode {
	if (typeof window === 'undefined') return DEFAULT_MODE;
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	return stored === 'light' || stored === 'dark' ? stored : DEFAULT_MODE;
}

function applyToDocument(mode: ThemeMode) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', mode === 'dark');
}

class ThemeState {
	mode = $state<ThemeMode>(readStored());

	/** 表示中のテーマ。ThemeToggle.svelte がアイコン切替に参照する。 */
	get resolved() {
		return this.mode;
	}

	private set(next: ThemeMode) {
		this.mode = next;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
		applyToDocument(next);
	}

	/** ライト⇄ダークのアイコントグル。 */
	toggle() {
		this.set(this.mode === 'dark' ? 'light' : 'dark');
	}
}

export const theme = new ThemeState();
