import { spawn } from "child_process";
import getPort from 'get-port';

export async function portForward(): Promise<{ stop: () => void; port: number }> {
    const port = await getPort({ port: 8080 });

    return new Promise((resolve, reject) => {
        const child = spawn("fproxy", ["up", "--port", `${port}`], { stdio: "inherit" });

        const timeout = setTimeout(() => {
            resolve({ stop: () => child.kill(), port });
        }, 3000);

        child.on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
        });

        child.on("exit", (code) => {
            if (code !== 0) {
                clearTimeout(timeout);
                reject(new Error(`fproxy exited with code ${code}`));
            }
        });
    });
}