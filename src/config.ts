export interface AppConfig {
    consumerApiUrl: string;
    hubManagerApiUrl: string;
    hubApiUrl: string;
    CTAuthUrl: string;
    CTApiUrl: string;
    hubForTests: string;
    testEmail: string;
    hubApiKey: string;
    identityToolkitUrl: string;
    instoreLogin: string;
    instorePassword: string;
    quinyxUrl: string;
    inventoryServiceUrl: string;
    genericPassword: string;
    firebaseUrl: string;

    quinyxHub?: string;
    quinyxBadge?: string;
    quinyxEmail?: string;
    quinyxPassword?: string;
    quinyxShiftType?: string;
    quinyxIsCli?: boolean;

    CT_PROJECT_KEY?: string;
    CT_CLIENT_ID?: string;
    CT_CLIENT_SECRET?: string;
    IDENTITY_KEY?: string;
    FIREBASE_API_KEY?: string;
    INVENTORY_SERVICE_TOKEN?: string;
}