interface Hub {
    latitude: number;
    longitude: number;
}

type HubsType = {
    [key: string]: Hub;
};
export const Hubs: HubsType = {
    "nl_ams_diem": {
        latitude: 52.320093,
        longitude: 4.957252
    },
    "fr_par_lepe": {
        latitude: 48.855259,
        longitude: 2.332992
    },
    "de_ber_temp": {
        latitude: 52.485735,
        longitude: 13.388179
    },
    "de_ber_wedd": {
        latitude: 52.540392,
        longitude: 13.349166
    },
    "de_ber_mit1": {
        latitude: 52.5160958,
        longitude: 13.3763289
    },
    "de_ber_mit2": {
        latitude: 52.532985,
        longitude: 13.35965
    },
    "nl_ame_cent": {
        latitude: 52.173164,
        longitude: 5.4150880
    },
    "de_ham_wint": {
        latitude: 53.564408,
        longitude: 10.034963
    },
    "de_ber_fran": {
        latitude: 52.513962,
        longitude: 13.469216
    },
    // Add more hubs as needed
};