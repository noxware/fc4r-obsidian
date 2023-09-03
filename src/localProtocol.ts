// Internal protocol for local files from Obsidian?
const prefix = `app://97ff213c3aa1aba2c27af4a1b7fb7f238a24/`;

export function convertPathToUrl(path: string) {
	return `${prefix}${encodeURIComponent(path)}`;
}
