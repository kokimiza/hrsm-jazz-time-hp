export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/** src/app.html のインラインスクリプトと同じキーを使うこと（FOUC防止のため二重管理） */
export const THEME_STORAGE_KEY = 'jazztime-theme';

function systemPrefersDark(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** 未設定（初回訪問）なら 'system'。ユーザーがトグルで一度でも切り替えたら light/dark が保存される。 */
function readStored(): ThemeMode {
	if (typeof window === 'undefined') return 'system';
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function resolve(mode: ThemeMode): ResolvedTheme {
	return mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
}

function applyToDocument(resolved: ResolvedTheme) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', resolved === 'dark');
}

class ThemeState {
	mode = $state<ThemeMode>(readStored());
	/** 実際に表示している方（light/dark）。アイコン表示に使う。 */
	resolved = $state<ResolvedTheme>('light');

	constructor() {
		this.resolved = resolve(this.mode);
	}

	private set(next: ThemeMode) {
		this.mode = next;
		this.resolved = resolve(next);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
		applyToDocument(this.resolved);
	}

	/** ライト⇄ダークのアイコントグル用。以後はシステム設定に関わらずこの選択を維持する。 */
	toggle() {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}

	/** ルートレイアウトの $effect から一度だけ呼ぶ。system設定変更の追従を購読して解除関数を返す。 */
	watchSystem(): () => void {
		this.resolved = resolve(this.mode);
		applyToDocument(this.resolved);
		if (typeof window === 'undefined') return () => {};
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const listener = () => {
			if (this.mode === 'system') {
				this.resolved = resolve('system');
				applyToDocument(this.resolved);
			}
		};
		media.addEventListener('change', listener);
		return () => media.removeEventListener('change', listener);
	}
}

export const theme = new ThemeState();
