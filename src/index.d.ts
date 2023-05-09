export { create, free, setupEnv } from './commands/index';


declare module '@flink/flinkord-cli' {
    export function create(locale: string, hubSlug: string, email: string): Promise<void>;

    export function free(hubSlug: string): Promise<void>;

    export function setupEnv(): Promise<void>;
}