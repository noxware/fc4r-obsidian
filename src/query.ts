import { spawn } from "child_process";

interface QueryParams {
	prompt: string;
	path: string;
}

export function query({ prompt, path }: QueryParams): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const fcwalk = spawn("fcwalk", [], { cwd: path });
		const fcq = spawn("fcq", [prompt], { cwd: path });
		let output = "";
		let fcwalkError = "";
		let fcqError = "";

		fcwalk.stdout.on("data", (data) => {
			fcq.stdin.write(data);
		});

		fcwalk.stderr.on("data", (data) => {
			fcwalkError += data.toString("utf8");
		});

		fcwalk.on("close", (code) => {
			fcq.stdin.end();
			if (code !== 0) {
				reject(
					new Error(
						`fcwalk process exited with code ${code}. stderr: ${fcwalkError}`
					)
				);
			}
		});

		fcq.stdout.on("data", (data) => {
			// Pretty sure `data` could be used directly but let's be explicit.
			output += data.toString("utf8");
		});

		fcq.stderr.on("data", (data) => {
			fcqError += data.toString("utf8");
		});

		fcq.on("close", (code) => {
			if (code !== 0) {
				reject(
					new Error(
						`fcq process exited with code ${code}. stderr: ${fcqError}`
					)
				);
			} else {
				resolve(output.split("\n"));
			}
		});
	});
}
