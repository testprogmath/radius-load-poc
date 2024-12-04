declare module 'find-up' {
    type Options = {
        cwd?: string;
        type?: 'file' | 'directory';
    };

    export function sync(name: string | string[], options?: Options): string | undefined;

    export function exists(file: string): Promise<boolean>;

    export function findUp(
        name: string | string[],
        options?: Options
    ): Promise<string | undefined>;

    export default findUp;
}