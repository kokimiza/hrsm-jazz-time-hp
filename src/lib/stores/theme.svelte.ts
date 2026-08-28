export type ThemeMode = 'light' | 'dark' | 'system';

/** src/app.html のインラインスクリプトと同じキーを使うこと（FOUC防止のため二重管理） */
export const THEME_STORAGE_KEY = 'jazztime-theme';

function systemPrefersDark(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStored(): ThemeMode {
	if (typeof window === 'undefined') return 'system';
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

function applyToDocument(mode: ThemeMode) {
	if (typeof document === 'undefined') return;
	const resolved = mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
	document.documentElement.classList.toggle('dark', resolved === 'dark');
}

class ThemeState {
	mode = $state<ThemeMode>(readStored());

	set(next: ThemeMode) {
		this.mode = next;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
		applyToDocument(next);
	}

	/** ルートレイアウトの $effect から一度だけ呼ぶ。system設定変更の追従を購読して解除関数を返す。 */
	watchSystem(): () => void {
		applyToDocument(this.mode);
		if (typeof window === 'undefined') return () => {};
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const listener = () => {
			if (this.mode === 'system') applyToDocument('system');
		};
		media.addEventListener('change', listener);
		return () => media.removeEventListener('change', listener);
	}
}

export const theme = new ThemeState();
