export * from './commands/create';
export * from './commands/free';
export * from './commands/setup';

declare module '@flink/flinkord-cli' {
    export function create(locale: string, hubSlug: string, email: string): Promise<void>;

    export function free(hubSlug: string): Promise<void>;

    export function setupEnv(): Promise<void>;
}