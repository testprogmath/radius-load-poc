export interface DeliveryDetail {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact: {
      phone: string;
    };
  }

export const DeliveryDetails: Record<string, DeliveryDetail> = {
  de_ber_wedd: {
    coordinates: {
      latitude: 52.5512,
      longitude: 13.37187,
    },
    address: {
      street: "Martin-Opitz-Straße 20",
      city: "BER",
      postalCode: "13357",
      country: "DE",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  de_ber_mit2: {
    coordinates: {
      latitude: 52.53297,
      longitude: 13.39916,
    },
    address: {
      street: "Brunnenstraße 19-21",
      city: "BER",
      postalCode: "10119",
      country: "DE",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  de_ber_fran: {
    coordinates: {
      latitude: 52.51062,
      longitude: 13.46976, 
    },
    address: {
      street: "Oderstraße 23A",
      city: "BER",
      postalCode: "10247",
      country: "DE",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  de_ber_pren: {
    coordinates: {
      latitude: 52.54680,
      longitude: 13.41055, 
    },
    address: {
      street: "Gaudystraße 9",
      city: "BER",
      postalCode: "10437",
      country: "DE",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  nl_ams_diem: {
    coordinates: {
      latitude: 52.32243,
      longitude: 4.97875,
    },
    address: {
      street: "Glitterstraat 34",
      city: "AMS",
      postalCode: "1103 SK",
      country: "NL",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  nl_ame_cent: {
    coordinates: {
      latitude: 52.15609,
      longitude: 5.37070,
    },
    address: {
      street: "Ligusterstraat 26",
      city: "AME",
      postalCode: "3812 TL",
      country: "NL",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  nl_alm_cent: {
    coordinates: {
      latitude: 52.37538,
      longitude: 5.21121,
    },
    address: {
      street: "Gouverneurstraat 16",
      city: "ALM",
      postalCode: "1312 AD",
      country: "NL",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  de_ham_winw: {
    coordinates: {
      latitude: 53.57088,
      longitude: 10.01786,
    },
    address: {
      street: "Averhoffstraße 4",
      city: "HAM",
      postalCode: "22085",
      country: "DE",
    },
    contact: {
      phone: "+4917631661415",
    },
  },
  };