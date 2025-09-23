import {
    afterEach,
    describe,
    expect,
    test,
} from 'vitest';
import { hubMap } from '../src/utils/hub.js';
import { QuinyxGroup } from '../src/shared/enums.js';
import { Hubs } from '../src/shared/hubs.js';

describe('Error Handling Improvements', () => {
    afterEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    test('Should validate de_ber_wedd hub configuration', () => {
        // Verify de_ber_wedd is properly configured
        expect(hubMap['de_ber_wedd']).toBeDefined();
        expect(hubMap['de_ber_wedd'].id).toBe(QuinyxGroup.DE_BER_WEDD);
        expect(hubMap['de_ber_wedd'].id).toBe(223884);
        expect(hubMap['de_ber_wedd'].description).toBe('DE - Berlin - Wedding');
    });

    test('Should handle hub slug format validation', () => {
        const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;
        
        // Test valid formats
        expect(hubSlugRegex.test('de_ber_temp')).toBe(true);
        expect(hubSlugRegex.test('nl_ams_diem')).toBe(true);
        expect(hubSlugRegex.test('fr_par_mar')).toBe(true);
        
        // Test invalid formats
        expect(hubSlugRegex.test('invalid')).toBe(false);
        expect(hubSlugRegex.test('de_ber_temp_invalid')).toBe(false);
        expect(hubSlugRegex.test('DE_BER_TEMP')).toBe(false);
    });

    test('Should ensure hub consistency between hubMap and QuinyxGroup', () => {
        // Check that key hubs exist and have correct IDs
        expect(hubMap['de_ber_temp']).toBeDefined();
        expect(hubMap['de_ber_temp'].id).toBe(QuinyxGroup.DE_BER_TEMP);
        
        expect(hubMap['de_ber_wedd']).toBeDefined();
        expect(hubMap['de_ber_wedd'].id).toBe(QuinyxGroup.DE_BER_WEDD);
        
        expect(hubMap['de_ber_mit1']).toBeDefined();
        expect(hubMap['de_ber_mit1'].id).toBe(QuinyxGroup.DE_BER_MIT1);
        
        expect(hubMap['de_ber_mit2']).toBeDefined();
        expect(hubMap['de_ber_mit2'].id).toBe(QuinyxGroup.DE_BER_MIT2);
        
        expect(hubMap['de_ham_wate']).toBeDefined();
        expect(hubMap['de_ham_wate'].id).toBe(QuinyxGroup.DE_HAM_WATE);
    });

    test('Should validate all configured hubs have correct format', () => {
        const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;
        
        // Test that all hubs from shared/hubs.ts follow the correct format
        Object.keys(Hubs).forEach(hubSlug => {
            expect(hubSlugRegex.test(hubSlug)).toBe(true);
        });
        
        // Test that all hubs from hubMap (except settings_unit) follow the correct format
        Object.keys(hubMap).forEach(hubSlug => {
            if (hubSlug === 'settings_unit') {
                // settings_unit is a special case and doesn't follow the same pattern
                expect(hubSlugRegex.test(hubSlug)).toBe(false);
            } else {
                expect(hubSlugRegex.test(hubSlug)).toBe(true);
            }
        });
        
        // Test invalid formats don't match
        const invalidHubSlugs = ['invalid', 'DE_BER_TEMP', 'de_ber_temp_invalid'];
        invalidHubSlugs.forEach(hubSlug => {
            expect(hubSlugRegex.test(hubSlug)).toBe(false);
        });
    });

    test('Should validate hub IDs are numbers', () => {
        Object.values(hubMap).forEach(hubInfo => {
            expect(typeof hubInfo.id).toBe('number');
            expect(hubInfo.id).toBeGreaterThan(0);
        });
    });

    test('Should validate hub descriptions are strings', () => {
        Object.values(hubMap).forEach(hubInfo => {
            expect(typeof hubInfo.description).toBe('string');
            expect(hubInfo.description.length).toBeGreaterThan(0);
        });
    });

    test('Should validate QuinyxGroup enum values match hubMap', () => {
        // Check that the enum values are consistent
        expect(QuinyxGroup.DE_BER_WEDD).toBe(223884);
        expect(QuinyxGroup.DE_BER_TEMP).toBe(223883);
        expect(QuinyxGroup.DE_BER_MIT1).toBe(223932);
        expect(QuinyxGroup.DE_BER_MIT2).toBe(223927);
        expect(QuinyxGroup.DE_HAM_WATE).toBe(239172);
    });

    test('Should validate de_ber_wedd has correct properties', () => {
        const deBerWedd = hubMap['de_ber_wedd'];
        
        expect(deBerWedd).toEqual({
            id: 223884,
            description: 'DE - Berlin - Wedding'
        });
    });

    test('Should ensure hub consistency between hubMap and Hubs', () => {
        // Check that hubs that exist in both places are consistent
        const commonHubs = ['de_ber_temp', 'de_ber_wedd', 'de_ber_mit1', 'de_ber_mit2'];
        
        commonHubs.forEach(hubSlug => {
            expect(hubMap[hubSlug]).toBeDefined();
            expect(Hubs[hubSlug]).toBeDefined();
        });
    });
});