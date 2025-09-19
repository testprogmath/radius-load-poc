// Secrets Manager for flinkord-cli
// Provides secure access to embedded secrets using SOPS + Age

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Default environment variable fallbacks
const DEFAULT_ENV_FALLBACKS = {
  INVENTORY_SERVICE_TOKEN: process.env.INVENTORY_SERVICE_TOKEN || '',
  CT_PROJECT_KEY: process.env.CT_PROJECT_KEY || '',
  CT_CLIENT_ID: process.env.CT_CLIENT_ID || '',
  CT_CLIENT_SECRET: process.env.CT_CLIENT_SECRET || ''
} as const;

export class SecretsManager {
  private secrets: Record<string, string> = {};
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      const secretsPath = path.join(process.cwd(), 'embedded-secrets.enc');
      const embeddedKeyPath = path.join(process.cwd(), 'keys', 'embedded-key.js');
      
      if (fs.existsSync(secretsPath) && fs.existsSync(embeddedKeyPath)) {
        try {
          // Dynamically import the embedded key only if file exists
          const { getEmbeddedAgeKey } = await import('../keys/embedded-key.js');
          const privateKey = getEmbeddedAgeKey();
          const tempKeyFile = path.join(process.cwd(), 'temp-age-key.txt');
        
          // Write temporary key file
          fs.writeFileSync(tempKeyFile, privateKey);
          
          // Decrypt secrets using SOPS with properly escaped paths
          try {
            const decrypted = execSync(`sops --decrypt --age-private-key "${tempKeyFile}" "${secretsPath}"`, {
              encoding: 'utf8',
              stdio: 'pipe'
            });
            
            const secretsData = JSON.parse(decrypted);
            this.secrets = secretsData;
          } catch (error) {
            console.warn('Failed to decrypt embedded secrets, using environment variables');
            // Fallback to environment variables
            this.secrets = { ...DEFAULT_ENV_FALLBACKS };
          } finally {
            // Clean up temporary key file
            if (fs.existsSync(tempKeyFile)) {
              fs.unlinkSync(tempKeyFile);
            }
          }
        } catch (keyError) {
          console.warn('Failed to load embedded key, using environment variables');
          this.secrets = { ...DEFAULT_ENV_FALLBACKS };
        }
      } else {
        // No embedded secrets or key file, fallback to environment variables
        console.log('No embedded secrets found, using environment variables');
        this.secrets = { ...DEFAULT_ENV_FALLBACKS };
      }
      
      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize secrets manager:', error);
      this.secrets = {};
      this.initialized = true;
    }
  }

  async getSecret(key: string): Promise<string> {
    await this.initPromise;
    return this.secrets[key] || process.env[key] || '';
  }

  async getAllSecrets(): Promise<Record<string, string>> {
    await this.initPromise;
    return { ...this.secrets };
  }
}