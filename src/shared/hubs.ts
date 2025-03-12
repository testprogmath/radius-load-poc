import dotenv from 'dotenv';

dotenv.config();

const genericPassword = process.env.GENERIC_PASSWORD as string;

interface Hub {
    latitude: number;
    longitude: number;
    email: string;
    password: string;
}

type HubsType = {
    [key: string]: Hub;
};
export const Hubs: HubsType = {
    "nl_ams_diem": {
        latitude: 52.320093,
        longitude: 4.957252,
        email: "nl_ams_diem@goflink.nl",
        password: genericPassword
    },
    "fr_par_lepe": {
        latitude: 48.855259,
        longitude: 2.332992,
        email: "fr_par_lepe@goflink.fr",
        password: "P7NwtX547HcGVwZ29EouhLHQGZVVie"
    },
    "de_ber_temp": {
        latitude: 52.485735,
        longitude: 13.388179,
        email: "de_ber_temp@goflink.de",
        password: genericPassword
    },
    "de_ber_wedd": {
        latitude: 52.540392,
        longitude: 13.349166,
        email: "de_ber_wedd@goflink.de",
        password: genericPassword
    },
    "de_ber_mit1": {
        latitude: 52.5160958,
        longitude: 13.3763289,
        email: "de_ber_mit1@goflink.com",
        password: genericPassword
    },
    "de_ber_mit2": {
        latitude: 52.532985,
        longitude: 13.380318,
        email: "de_ber_mit2@goflink.de",
        password: genericPassword
    },
    "nl_ame_cent": {
        latitude: 52.173164,
        longitude: 5.4150880,
        email: "nl_ame_cent_instore@goflink.nl",
        password: genericPassword
    },
    "de_ber_fran": {
        latitude: 52.513962,
        longitude: 13.469216,
        email: "de_ber_fran@goflink.de",
        password: genericPassword
    },
    "de_ham_otte": {
        latitude: 53.55622,
        longitude: 9.888704,
        email: "de_ham_otte@goflink.de",
        password: genericPassword
    },
    "fr_par_coue": {
        latitude: 48.830018,
        longitude: 2.329368,
        email: "fr_par_coue@goflink.com",
        password: genericPassword
    },
    "de_ham_winw": {
        latitude: 53.571147,
        longitude: 10.026537,
        email: "de_ham_winw@goflink.de",
        password: genericPassword
    },
    "de_ber_pren": {
        latitude: 52.5483165,
        longitude: 13.4130471,
        email: "de_ber_pren@goflink.de",
        password: genericPassword
    },
    "de_qaa_test": {
        latitude: 54.273626,
        longitude: 11.0586705,
        email: "de_qaa_test@goflink.de",
        password: genericPassword
    },
    "nl_alm_cent": {
        latitude: 52.369119,
        longitude: 5.215824,
        email: "nl_alm_cent@goflink.nl",
        password: genericPassword
    },
    // Add more hubs as needed
};
