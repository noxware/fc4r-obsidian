// Is something like `app://97ff213c3aa1aba2c27af4a1b7fb7f238a24/`.
// This internal scheme used by Obsidian can access files outside the vault.
let prefix: string | null = null;

// Reverse engineered way to fetch the prefix, with help of ChatGPT.
// The chat export can be found in the `docs` folder.
function ensurePrefix() {
	if (prefix === null) {
		// @ts-ignore
		const { ipcRenderer } = window.electron;
		prefix = ipcRenderer.sendSync("file-url");
	}
}

export function convertPathToUrl(path: string) {
	ensurePrefix();
	return `${prefix}${encodeURIComponent(path)}`;
}
