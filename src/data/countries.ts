/** ISO 3166-1 countries for address forms */
export interface Country {
  code: string;
  name: string;
}

export interface PhoneCountryCode {
  countryCode: string;
  dialCode: string;
  name: string;
}

export const countries: Country[] = [
  {
    "code": "AF",
    "name": "Afghanistan"
  },
  {
    "code": "AX",
    "name": "Åland Islands"
  },
  {
    "code": "AL",
    "name": "Albania"
  },
  {
    "code": "DZ",
    "name": "Algeria"
  },
  {
    "code": "AS",
    "name": "American Samoa"
  },
  {
    "code": "AD",
    "name": "Andorra"
  },
  {
    "code": "AO",
    "name": "Angola"
  },
  {
    "code": "AI",
    "name": "Anguilla"
  },
  {
    "code": "AQ",
    "name": "Antarctica"
  },
  {
    "code": "AG",
    "name": "Antigua & Barbuda"
  },
  {
    "code": "AR",
    "name": "Argentina"
  },
  {
    "code": "AM",
    "name": "Armenia"
  },
  {
    "code": "AW",
    "name": "Aruba"
  },
  {
    "code": "AU",
    "name": "Australia"
  },
  {
    "code": "AT",
    "name": "Austria"
  },
  {
    "code": "AZ",
    "name": "Azerbaijan"
  },
  {
    "code": "BS",
    "name": "Bahamas"
  },
  {
    "code": "BH",
    "name": "Bahrain"
  },
  {
    "code": "BD",
    "name": "Bangladesh"
  },
  {
    "code": "BB",
    "name": "Barbados"
  },
  {
    "code": "BY",
    "name": "Belarus"
  },
  {
    "code": "BE",
    "name": "Belgium"
  },
  {
    "code": "BZ",
    "name": "Belize"
  },
  {
    "code": "BJ",
    "name": "Benin"
  },
  {
    "code": "BM",
    "name": "Bermuda"
  },
  {
    "code": "BT",
    "name": "Bhutan"
  },
  {
    "code": "BO",
    "name": "Bolivia"
  },
  {
    "code": "BA",
    "name": "Bosnia & Herzegovina"
  },
  {
    "code": "BW",
    "name": "Botswana"
  },
  {
    "code": "BV",
    "name": "Bouvet Island"
  },
  {
    "code": "BR",
    "name": "Brazil"
  },
  {
    "code": "IO",
    "name": "British Indian Ocean Territory"
  },
  {
    "code": "VG",
    "name": "British Virgin Islands"
  },
  {
    "code": "BN",
    "name": "Brunei"
  },
  {
    "code": "BG",
    "name": "Bulgaria"
  },
  {
    "code": "BF",
    "name": "Burkina Faso"
  },
  {
    "code": "BI",
    "name": "Burundi"
  },
  {
    "code": "KH",
    "name": "Cambodia"
  },
  {
    "code": "CM",
    "name": "Cameroon"
  },
  {
    "code": "CA",
    "name": "Canada"
  },
  {
    "code": "CV",
    "name": "Cape Verde"
  },
  {
    "code": "BQ",
    "name": "Caribbean Netherlands"
  },
  {
    "code": "KY",
    "name": "Cayman Islands"
  },
  {
    "code": "CF",
    "name": "Central African Republic"
  },
  {
    "code": "TD",
    "name": "Chad"
  },
  {
    "code": "CL",
    "name": "Chile"
  },
  {
    "code": "CN",
    "name": "China"
  },
  {
    "code": "CX",
    "name": "Christmas Island"
  },
  {
    "code": "CC",
    "name": "Cocos (Keeling) Islands"
  },
  {
    "code": "CO",
    "name": "Colombia"
  },
  {
    "code": "KM",
    "name": "Comoros"
  },
  {
    "code": "CG",
    "name": "Congo - Brazzaville"
  },
  {
    "code": "CD",
    "name": "Congo - Kinshasa"
  },
  {
    "code": "CK",
    "name": "Cook Islands"
  },
  {
    "code": "CR",
    "name": "Costa Rica"
  },
  {
    "code": "CI",
    "name": "Côte d’Ivoire"
  },
  {
    "code": "HR",
    "name": "Croatia"
  },
  {
    "code": "CU",
    "name": "Cuba"
  },
  {
    "code": "CW",
    "name": "Curaçao"
  },
  {
    "code": "CY",
    "name": "Cyprus"
  },
  {
    "code": "CZ",
    "name": "Czechia"
  },
  {
    "code": "DK",
    "name": "Denmark"
  },
  {
    "code": "DJ",
    "name": "Djibouti"
  },
  {
    "code": "DM",
    "name": "Dominica"
  },
  {
    "code": "DO",
    "name": "Dominican Republic"
  },
  {
    "code": "EC",
    "name": "Ecuador"
  },
  {
    "code": "EG",
    "name": "Egypt"
  },
  {
    "code": "SV",
    "name": "El Salvador"
  },
  {
    "code": "GQ",
    "name": "Equatorial Guinea"
  },
  {
    "code": "ER",
    "name": "Eritrea"
  },
  {
    "code": "EE",
    "name": "Estonia"
  },
  {
    "code": "SZ",
    "name": "Eswatini"
  },
  {
    "code": "ET",
    "name": "Ethiopia"
  },
  {
    "code": "FK",
    "name": "Falkland Islands"
  },
  {
    "code": "FO",
    "name": "Faroe Islands"
  },
  {
    "code": "FJ",
    "name": "Fiji"
  },
  {
    "code": "FI",
    "name": "Finland"
  },
  {
    "code": "FR",
    "name": "France"
  },
  {
    "code": "GF",
    "name": "French Guiana"
  },
  {
    "code": "PF",
    "name": "French Polynesia"
  },
  {
    "code": "TF",
    "name": "French Southern Territories"
  },
  {
    "code": "GA",
    "name": "Gabon"
  },
  {
    "code": "GM",
    "name": "Gambia"
  },
  {
    "code": "GE",
    "name": "Georgia"
  },
  {
    "code": "DE",
    "name": "Germany"
  },
  {
    "code": "GH",
    "name": "Ghana"
  },
  {
    "code": "GI",
    "name": "Gibraltar"
  },
  {
    "code": "GR",
    "name": "Greece"
  },
  {
    "code": "GL",
    "name": "Greenland"
  },
  {
    "code": "GD",
    "name": "Grenada"
  },
  {
    "code": "GP",
    "name": "Guadeloupe"
  },
  {
    "code": "GU",
    "name": "Guam"
  },
  {
    "code": "GT",
    "name": "Guatemala"
  },
  {
    "code": "GG",
    "name": "Guernsey"
  },
  {
    "code": "GN",
    "name": "Guinea"
  },
  {
    "code": "GW",
    "name": "Guinea-Bissau"
  },
  {
    "code": "GY",
    "name": "Guyana"
  },
  {
    "code": "HT",
    "name": "Haiti"
  },
  {
    "code": "HM",
    "name": "Heard & McDonald Islands"
  },
  {
    "code": "HN",
    "name": "Honduras"
  },
  {
    "code": "HK",
    "name": "Hong Kong SAR China"
  },
  {
    "code": "HU",
    "name": "Hungary"
  },
  {
    "code": "IS",
    "name": "Iceland"
  },
  {
    "code": "IN",
    "name": "India"
  },
  {
    "code": "ID",
    "name": "Indonesia"
  },
  {
    "code": "IR",
    "name": "Iran"
  },
  {
    "code": "IQ",
    "name": "Iraq"
  },
  {
    "code": "IE",
    "name": "Ireland"
  },
  {
    "code": "IM",
    "name": "Isle of Man"
  },
  {
    "code": "IL",
    "name": "Israel"
  },
  {
    "code": "IT",
    "name": "Italy"
  },
  {
    "code": "JM",
    "name": "Jamaica"
  },
  {
    "code": "JP",
    "name": "Japan"
  },
  {
    "code": "JE",
    "name": "Jersey"
  },
  {
    "code": "JO",
    "name": "Jordan"
  },
  {
    "code": "KZ",
    "name": "Kazakhstan"
  },
  {
    "code": "KE",
    "name": "Kenya"
  },
  {
    "code": "KI",
    "name": "Kiribati"
  },
  {
    "code": "KW",
    "name": "Kuwait"
  },
  {
    "code": "KG",
    "name": "Kyrgyzstan"
  },
  {
    "code": "LA",
    "name": "Laos"
  },
  {
    "code": "LV",
    "name": "Latvia"
  },
  {
    "code": "LB",
    "name": "Lebanon"
  },
  {
    "code": "LS",
    "name": "Lesotho"
  },
  {
    "code": "LR",
    "name": "Liberia"
  },
  {
    "code": "LY",
    "name": "Libya"
  },
  {
    "code": "LI",
    "name": "Liechtenstein"
  },
  {
    "code": "LT",
    "name": "Lithuania"
  },
  {
    "code": "LU",
    "name": "Luxembourg"
  },
  {
    "code": "MO",
    "name": "Macao SAR China"
  },
  {
    "code": "MG",
    "name": "Madagascar"
  },
  {
    "code": "MW",
    "name": "Malawi"
  },
  {
    "code": "MY",
    "name": "Malaysia"
  },
  {
    "code": "MV",
    "name": "Maldives"
  },
  {
    "code": "ML",
    "name": "Mali"
  },
  {
    "code": "MT",
    "name": "Malta"
  },
  {
    "code": "MH",
    "name": "Marshall Islands"
  },
  {
    "code": "MQ",
    "name": "Martinique"
  },
  {
    "code": "MR",
    "name": "Mauritania"
  },
  {
    "code": "MU",
    "name": "Mauritius"
  },
  {
    "code": "YT",
    "name": "Mayotte"
  },
  {
    "code": "MX",
    "name": "Mexico"
  },
  {
    "code": "FM",
    "name": "Micronesia"
  },
  {
    "code": "MD",
    "name": "Moldova"
  },
  {
    "code": "MC",
    "name": "Monaco"
  },
  {
    "code": "MN",
    "name": "Mongolia"
  },
  {
    "code": "ME",
    "name": "Montenegro"
  },
  {
    "code": "MS",
    "name": "Montserrat"
  },
  {
    "code": "MA",
    "name": "Morocco"
  },
  {
    "code": "MZ",
    "name": "Mozambique"
  },
  {
    "code": "MM",
    "name": "Myanmar (Burma)"
  },
  {
    "code": "NA",
    "name": "Namibia"
  },
  {
    "code": "NR",
    "name": "Nauru"
  },
  {
    "code": "NP",
    "name": "Nepal"
  },
  {
    "code": "NL",
    "name": "Netherlands"
  },
  {
    "code": "NC",
    "name": "New Caledonia"
  },
  {
    "code": "NZ",
    "name": "New Zealand"
  },
  {
    "code": "NI",
    "name": "Nicaragua"
  },
  {
    "code": "NE",
    "name": "Niger"
  },
  {
    "code": "NG",
    "name": "Nigeria"
  },
  {
    "code": "NU",
    "name": "Niue"
  },
  {
    "code": "NF",
    "name": "Norfolk Island"
  },
  {
    "code": "KP",
    "name": "North Korea"
  },
  {
    "code": "MK",
    "name": "North Macedonia"
  },
  {
    "code": "MP",
    "name": "Northern Mariana Islands"
  },
  {
    "code": "NO",
    "name": "Norway"
  },
  {
    "code": "OM",
    "name": "Oman"
  },
  {
    "code": "PK",
    "name": "Pakistan"
  },
  {
    "code": "PW",
    "name": "Palau"
  },
  {
    "code": "PS",
    "name": "Palestinian Territories"
  },
  {
    "code": "PA",
    "name": "Panama"
  },
  {
    "code": "PG",
    "name": "Papua New Guinea"
  },
  {
    "code": "PY",
    "name": "Paraguay"
  },
  {
    "code": "PE",
    "name": "Peru"
  },
  {
    "code": "PH",
    "name": "Philippines"
  },
  {
    "code": "PN",
    "name": "Pitcairn Islands"
  },
  {
    "code": "PL",
    "name": "Poland"
  },
  {
    "code": "PT",
    "name": "Portugal"
  },
  {
    "code": "PR",
    "name": "Puerto Rico"
  },
  {
    "code": "QA",
    "name": "Qatar"
  },
  {
    "code": "RE",
    "name": "Réunion"
  },
  {
    "code": "RO",
    "name": "Romania"
  },
  {
    "code": "RU",
    "name": "Russia"
  },
  {
    "code": "RW",
    "name": "Rwanda"
  },
  {
    "code": "WS",
    "name": "Samoa"
  },
  {
    "code": "SM",
    "name": "San Marino"
  },
  {
    "code": "ST",
    "name": "São Tomé & Príncipe"
  },
  {
    "code": "SA",
    "name": "Saudi Arabia"
  },
  {
    "code": "SN",
    "name": "Senegal"
  },
  {
    "code": "RS",
    "name": "Serbia"
  },
  {
    "code": "SC",
    "name": "Seychelles"
  },
  {
    "code": "SL",
    "name": "Sierra Leone"
  },
  {
    "code": "SG",
    "name": "Singapore"
  },
  {
    "code": "SK",
    "name": "Slovakia"
  },
  {
    "code": "SI",
    "name": "Slovenia"
  },
  {
    "code": "SB",
    "name": "Solomon Islands"
  },
  {
    "code": "SO",
    "name": "Somalia"
  },
  {
    "code": "ZA",
    "name": "South Africa"
  },
  {
    "code": "GS",
    "name": "South Georgia & South Sandwich Islands"
  },
  {
    "code": "KR",
    "name": "South Korea"
  },
  {
    "code": "SS",
    "name": "South Sudan"
  },
  {
    "code": "ES",
    "name": "Spain"
  },
  {
    "code": "LK",
    "name": "Sri Lanka"
  },
  {
    "code": "BL",
    "name": "St. Barthélemy"
  },
  {
    "code": "SH",
    "name": "St. Helena"
  },
  {
    "code": "KN",
    "name": "St. Kitts & Nevis"
  },
  {
    "code": "LC",
    "name": "St. Lucia"
  },
  {
    "code": "MF",
    "name": "St. Martin"
  },
  {
    "code": "PM",
    "name": "St. Pierre & Miquelon"
  },
  {
    "code": "VC",
    "name": "St. Vincent & Grenadines"
  },
  {
    "code": "SD",
    "name": "Sudan"
  },
  {
    "code": "SR",
    "name": "Suriname"
  },
  {
    "code": "SJ",
    "name": "Svalbard & Jan Mayen"
  },
  {
    "code": "SE",
    "name": "Sweden"
  },
  {
    "code": "CH",
    "name": "Switzerland"
  },
  {
    "code": "SY",
    "name": "Syria"
  },
  {
    "code": "TW",
    "name": "Taiwan"
  },
  {
    "code": "TJ",
    "name": "Tajikistan"
  },
  {
    "code": "TZ",
    "name": "Tanzania"
  },
  {
    "code": "TH",
    "name": "Thailand"
  },
  {
    "code": "TL",
    "name": "Timor-Leste"
  },
  {
    "code": "TG",
    "name": "Togo"
  },
  {
    "code": "TK",
    "name": "Tokelau"
  },
  {
    "code": "TO",
    "name": "Tonga"
  },
  {
    "code": "TT",
    "name": "Trinidad & Tobago"
  },
  {
    "code": "TN",
    "name": "Tunisia"
  },
  {
    "code": "TR",
    "name": "Türkiye"
  },
  {
    "code": "TM",
    "name": "Turkmenistan"
  },
  {
    "code": "TC",
    "name": "Turks & Caicos Islands"
  },
  {
    "code": "TV",
    "name": "Tuvalu"
  },
  {
    "code": "UM",
    "name": "U.S. Outlying Islands"
  },
  {
    "code": "VI",
    "name": "U.S. Virgin Islands"
  },
  {
    "code": "UG",
    "name": "Uganda"
  },
  {
    "code": "UA",
    "name": "Ukraine"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates"
  },
  {
    "code": "GB",
    "name": "United Kingdom"
  },
  {
    "code": "US",
    "name": "United States"
  },
  {
    "code": "UY",
    "name": "Uruguay"
  },
  {
    "code": "UZ",
    "name": "Uzbekistan"
  },
  {
    "code": "VU",
    "name": "Vanuatu"
  },
  {
    "code": "VA",
    "name": "Vatican City"
  },
  {
    "code": "VE",
    "name": "Venezuela"
  },
  {
    "code": "VN",
    "name": "Vietnam"
  },
  {
    "code": "WF",
    "name": "Wallis & Futuna"
  },
  {
    "code": "EH",
    "name": "Western Sahara"
  },
  {
    "code": "YE",
    "name": "Yemen"
  },
  {
    "code": "ZM",
    "name": "Zambia"
  },
  {
    "code": "ZW",
    "name": "Zimbabwe"
  }
];

export const phoneCountryCodes: PhoneCountryCode[] = [
  {
    "countryCode": "AF",
    "dialCode": "+93",
    "name": "Afghanistan"
  },
  {
    "countryCode": "AX",
    "dialCode": "+358",
    "name": "Åland Islands"
  },
  {
    "countryCode": "AL",
    "dialCode": "+355",
    "name": "Albania"
  },
  {
    "countryCode": "DZ",
    "dialCode": "+213",
    "name": "Algeria"
  },
  {
    "countryCode": "AD",
    "dialCode": "+376",
    "name": "Andorra"
  },
  {
    "countryCode": "AO",
    "dialCode": "+244",
    "name": "Angola"
  },
  {
    "countryCode": "AQ",
    "dialCode": "+672",
    "name": "Antarctica"
  },
  {
    "countryCode": "AR",
    "dialCode": "+54",
    "name": "Argentina"
  },
  {
    "countryCode": "AM",
    "dialCode": "+374",
    "name": "Armenia"
  },
  {
    "countryCode": "AW",
    "dialCode": "+297",
    "name": "Aruba"
  },
  {
    "countryCode": "AU",
    "dialCode": "+61",
    "name": "Australia"
  },
  {
    "countryCode": "AT",
    "dialCode": "+43",
    "name": "Austria"
  },
  {
    "countryCode": "AZ",
    "dialCode": "+994",
    "name": "Azerbaijan"
  },
  {
    "countryCode": "BH",
    "dialCode": "+973",
    "name": "Bahrain"
  },
  {
    "countryCode": "BD",
    "dialCode": "+880",
    "name": "Bangladesh"
  },
  {
    "countryCode": "BY",
    "dialCode": "+375",
    "name": "Belarus"
  },
  {
    "countryCode": "BE",
    "dialCode": "+32",
    "name": "Belgium"
  },
  {
    "countryCode": "BZ",
    "dialCode": "+501",
    "name": "Belize"
  },
  {
    "countryCode": "BJ",
    "dialCode": "+229",
    "name": "Benin"
  },
  {
    "countryCode": "BT",
    "dialCode": "+975",
    "name": "Bhutan"
  },
  {
    "countryCode": "BO",
    "dialCode": "+591",
    "name": "Bolivia"
  },
  {
    "countryCode": "BA",
    "dialCode": "+387",
    "name": "Bosnia & Herzegovina"
  },
  {
    "countryCode": "BW",
    "dialCode": "+267",
    "name": "Botswana"
  },
  {
    "countryCode": "BV",
    "dialCode": "+47",
    "name": "Bouvet Island"
  },
  {
    "countryCode": "BR",
    "dialCode": "+55",
    "name": "Brazil"
  },
  {
    "countryCode": "IO",
    "dialCode": "+246",
    "name": "British Indian Ocean Territory"
  },
  {
    "countryCode": "BN",
    "dialCode": "+673",
    "name": "Brunei"
  },
  {
    "countryCode": "BG",
    "dialCode": "+359",
    "name": "Bulgaria"
  },
  {
    "countryCode": "BF",
    "dialCode": "+226",
    "name": "Burkina Faso"
  },
  {
    "countryCode": "BI",
    "dialCode": "+257",
    "name": "Burundi"
  },
  {
    "countryCode": "KH",
    "dialCode": "+855",
    "name": "Cambodia"
  },
  {
    "countryCode": "CM",
    "dialCode": "+237",
    "name": "Cameroon"
  },
  {
    "countryCode": "CA",
    "dialCode": "+1",
    "name": "Canada"
  },
  {
    "countryCode": "CV",
    "dialCode": "+238",
    "name": "Cape Verde"
  },
  {
    "countryCode": "BQ",
    "dialCode": "+599",
    "name": "Caribbean Netherlands"
  },
  {
    "countryCode": "CF",
    "dialCode": "+236",
    "name": "Central African Republic"
  },
  {
    "countryCode": "TD",
    "dialCode": "+235",
    "name": "Chad"
  },
  {
    "countryCode": "CL",
    "dialCode": "+56",
    "name": "Chile"
  },
  {
    "countryCode": "CN",
    "dialCode": "+86",
    "name": "China"
  },
  {
    "countryCode": "CX",
    "dialCode": "+61",
    "name": "Christmas Island"
  },
  {
    "countryCode": "CC",
    "dialCode": "+61",
    "name": "Cocos (Keeling) Islands"
  },
  {
    "countryCode": "CO",
    "dialCode": "+57",
    "name": "Colombia"
  },
  {
    "countryCode": "KM",
    "dialCode": "+269",
    "name": "Comoros"
  },
  {
    "countryCode": "CG",
    "dialCode": "+242",
    "name": "Congo - Brazzaville"
  },
  {
    "countryCode": "CD",
    "dialCode": "+243",
    "name": "Congo - Kinshasa"
  },
  {
    "countryCode": "CK",
    "dialCode": "+682",
    "name": "Cook Islands"
  },
  {
    "countryCode": "CR",
    "dialCode": "+506",
    "name": "Costa Rica"
  },
  {
    "countryCode": "CI",
    "dialCode": "+225",
    "name": "Côte d’Ivoire"
  },
  {
    "countryCode": "HR",
    "dialCode": "+385",
    "name": "Croatia"
  },
  {
    "countryCode": "CU",
    "dialCode": "+53",
    "name": "Cuba"
  },
  {
    "countryCode": "CW",
    "dialCode": "+599",
    "name": "Curaçao"
  },
  {
    "countryCode": "CY",
    "dialCode": "+357",
    "name": "Cyprus"
  },
  {
    "countryCode": "CZ",
    "dialCode": "+420",
    "name": "Czechia"
  },
  {
    "countryCode": "DK",
    "dialCode": "+45",
    "name": "Denmark"
  },
  {
    "countryCode": "DJ",
    "dialCode": "+253",
    "name": "Djibouti"
  },
  {
    "countryCode": "EC",
    "dialCode": "+593",
    "name": "Ecuador"
  },
  {
    "countryCode": "EG",
    "dialCode": "+20",
    "name": "Egypt"
  },
  {
    "countryCode": "SV",
    "dialCode": "+503",
    "name": "El Salvador"
  },
  {
    "countryCode": "GQ",
    "dialCode": "+240",
    "name": "Equatorial Guinea"
  },
  {
    "countryCode": "ER",
    "dialCode": "+291",
    "name": "Eritrea"
  },
  {
    "countryCode": "EE",
    "dialCode": "+372",
    "name": "Estonia"
  },
  {
    "countryCode": "SZ",
    "dialCode": "+268",
    "name": "Eswatini"
  },
  {
    "countryCode": "ET",
    "dialCode": "+251",
    "name": "Ethiopia"
  },
  {
    "countryCode": "FK",
    "dialCode": "+500",
    "name": "Falkland Islands"
  },
  {
    "countryCode": "FO",
    "dialCode": "+298",
    "name": "Faroe Islands"
  },
  {
    "countryCode": "FJ",
    "dialCode": "+679",
    "name": "Fiji"
  },
  {
    "countryCode": "FI",
    "dialCode": "+358",
    "name": "Finland"
  },
  {
    "countryCode": "FR",
    "dialCode": "+33",
    "name": "France"
  },
  {
    "countryCode": "GF",
    "dialCode": "+594",
    "name": "French Guiana"
  },
  {
    "countryCode": "PF",
    "dialCode": "+689",
    "name": "French Polynesia"
  },
  {
    "countryCode": "TF",
    "dialCode": "+262",
    "name": "French Southern Territories"
  },
  {
    "countryCode": "GA",
    "dialCode": "+241",
    "name": "Gabon"
  },
  {
    "countryCode": "GM",
    "dialCode": "+220",
    "name": "Gambia"
  },
  {
    "countryCode": "GE",
    "dialCode": "+995",
    "name": "Georgia"
  },
  {
    "countryCode": "DE",
    "dialCode": "+49",
    "name": "Germany"
  },
  {
    "countryCode": "GH",
    "dialCode": "+233",
    "name": "Ghana"
  },
  {
    "countryCode": "GI",
    "dialCode": "+350",
    "name": "Gibraltar"
  },
  {
    "countryCode": "GR",
    "dialCode": "+30",
    "name": "Greece"
  },
  {
    "countryCode": "GL",
    "dialCode": "+299",
    "name": "Greenland"
  },
  {
    "countryCode": "GP",
    "dialCode": "+590",
    "name": "Guadeloupe"
  },
  {
    "countryCode": "GT",
    "dialCode": "+502",
    "name": "Guatemala"
  },
  {
    "countryCode": "GG",
    "dialCode": "+44",
    "name": "Guernsey"
  },
  {
    "countryCode": "GN",
    "dialCode": "+224",
    "name": "Guinea"
  },
  {
    "countryCode": "GW",
    "dialCode": "+245",
    "name": "Guinea-Bissau"
  },
  {
    "countryCode": "GY",
    "dialCode": "+592",
    "name": "Guyana"
  },
  {
    "countryCode": "HT",
    "dialCode": "+509",
    "name": "Haiti"
  },
  {
    "countryCode": "HM",
    "dialCode": "+672",
    "name": "Heard & McDonald Islands"
  },
  {
    "countryCode": "HN",
    "dialCode": "+504",
    "name": "Honduras"
  },
  {
    "countryCode": "HK",
    "dialCode": "+852",
    "name": "Hong Kong SAR China"
  },
  {
    "countryCode": "HU",
    "dialCode": "+36",
    "name": "Hungary"
  },
  {
    "countryCode": "IS",
    "dialCode": "+354",
    "name": "Iceland"
  },
  {
    "countryCode": "IN",
    "dialCode": "+91",
    "name": "India"
  },
  {
    "countryCode": "ID",
    "dialCode": "+62",
    "name": "Indonesia"
  },
  {
    "countryCode": "IR",
    "dialCode": "+98",
    "name": "Iran"
  },
  {
    "countryCode": "IQ",
    "dialCode": "+964",
    "name": "Iraq"
  },
  {
    "countryCode": "IE",
    "dialCode": "+353",
    "name": "Ireland"
  },
  {
    "countryCode": "IM",
    "dialCode": "+44",
    "name": "Isle of Man"
  },
  {
    "countryCode": "IL",
    "dialCode": "+972",
    "name": "Israel"
  },
  {
    "countryCode": "IT",
    "dialCode": "+39",
    "name": "Italy"
  },
  {
    "countryCode": "JP",
    "dialCode": "+81",
    "name": "Japan"
  },
  {
    "countryCode": "JE",
    "dialCode": "+44",
    "name": "Jersey"
  },
  {
    "countryCode": "JO",
    "dialCode": "+962",
    "name": "Jordan"
  },
  {
    "countryCode": "KZ",
    "dialCode": "+7",
    "name": "Kazakhstan"
  },
  {
    "countryCode": "KE",
    "dialCode": "+254",
    "name": "Kenya"
  },
  {
    "countryCode": "KI",
    "dialCode": "+686",
    "name": "Kiribati"
  },
  {
    "countryCode": "KW",
    "dialCode": "+965",
    "name": "Kuwait"
  },
  {
    "countryCode": "KG",
    "dialCode": "+996",
    "name": "Kyrgyzstan"
  },
  {
    "countryCode": "LA",
    "dialCode": "+856",
    "name": "Laos"
  },
  {
    "countryCode": "LV",
    "dialCode": "+371",
    "name": "Latvia"
  },
  {
    "countryCode": "LB",
    "dialCode": "+961",
    "name": "Lebanon"
  },
  {
    "countryCode": "LS",
    "dialCode": "+266",
    "name": "Lesotho"
  },
  {
    "countryCode": "LR",
    "dialCode": "+231",
    "name": "Liberia"
  },
  {
    "countryCode": "LY",
    "dialCode": "+218",
    "name": "Libya"
  },
  {
    "countryCode": "LI",
    "dialCode": "+423",
    "name": "Liechtenstein"
  },
  {
    "countryCode": "LT",
    "dialCode": "+370",
    "name": "Lithuania"
  },
  {
    "countryCode": "LU",
    "dialCode": "+352",
    "name": "Luxembourg"
  },
  {
    "countryCode": "MO",
    "dialCode": "+853",
    "name": "Macao SAR China"
  },
  {
    "countryCode": "MG",
    "dialCode": "+261",
    "name": "Madagascar"
  },
  {
    "countryCode": "MW",
    "dialCode": "+265",
    "name": "Malawi"
  },
  {
    "countryCode": "MY",
    "dialCode": "+60",
    "name": "Malaysia"
  },
  {
    "countryCode": "MV",
    "dialCode": "+960",
    "name": "Maldives"
  },
  {
    "countryCode": "ML",
    "dialCode": "+223",
    "name": "Mali"
  },
  {
    "countryCode": "MT",
    "dialCode": "+356",
    "name": "Malta"
  },
  {
    "countryCode": "MH",
    "dialCode": "+692",
    "name": "Marshall Islands"
  },
  {
    "countryCode": "MQ",
    "dialCode": "+596",
    "name": "Martinique"
  },
  {
    "countryCode": "MR",
    "dialCode": "+222",
    "name": "Mauritania"
  },
  {
    "countryCode": "MU",
    "dialCode": "+230",
    "name": "Mauritius"
  },
  {
    "countryCode": "YT",
    "dialCode": "+262",
    "name": "Mayotte"
  },
  {
    "countryCode": "MX",
    "dialCode": "+52",
    "name": "Mexico"
  },
  {
    "countryCode": "FM",
    "dialCode": "+691",
    "name": "Micronesia"
  },
  {
    "countryCode": "MD",
    "dialCode": "+373",
    "name": "Moldova"
  },
  {
    "countryCode": "MC",
    "dialCode": "+377",
    "name": "Monaco"
  },
  {
    "countryCode": "MN",
    "dialCode": "+976",
    "name": "Mongolia"
  },
  {
    "countryCode": "ME",
    "dialCode": "+382",
    "name": "Montenegro"
  },
  {
    "countryCode": "MA",
    "dialCode": "+212",
    "name": "Morocco"
  },
  {
    "countryCode": "MZ",
    "dialCode": "+258",
    "name": "Mozambique"
  },
  {
    "countryCode": "MM",
    "dialCode": "+95",
    "name": "Myanmar (Burma)"
  },
  {
    "countryCode": "NA",
    "dialCode": "+264",
    "name": "Namibia"
  },
  {
    "countryCode": "NR",
    "dialCode": "+674",
    "name": "Nauru"
  },
  {
    "countryCode": "NP",
    "dialCode": "+977",
    "name": "Nepal"
  },
  {
    "countryCode": "NL",
    "dialCode": "+31",
    "name": "Netherlands"
  },
  {
    "countryCode": "NC",
    "dialCode": "+687",
    "name": "New Caledonia"
  },
  {
    "countryCode": "NZ",
    "dialCode": "+64",
    "name": "New Zealand"
  },
  {
    "countryCode": "NI",
    "dialCode": "+505",
    "name": "Nicaragua"
  },
  {
    "countryCode": "NE",
    "dialCode": "+227",
    "name": "Niger"
  },
  {
    "countryCode": "NG",
    "dialCode": "+234",
    "name": "Nigeria"
  },
  {
    "countryCode": "NU",
    "dialCode": "+683",
    "name": "Niue"
  },
  {
    "countryCode": "NF",
    "dialCode": "+672",
    "name": "Norfolk Island"
  },
  {
    "countryCode": "KP",
    "dialCode": "+850",
    "name": "North Korea"
  },
  {
    "countryCode": "MK",
    "dialCode": "+389",
    "name": "North Macedonia"
  },
  {
    "countryCode": "NO",
    "dialCode": "+47",
    "name": "Norway"
  },
  {
    "countryCode": "OM",
    "dialCode": "+968",
    "name": "Oman"
  },
  {
    "countryCode": "PK",
    "dialCode": "+92",
    "name": "Pakistan"
  },
  {
    "countryCode": "PW",
    "dialCode": "+680",
    "name": "Palau"
  },
  {
    "countryCode": "PS",
    "dialCode": "+970",
    "name": "Palestinian Territories"
  },
  {
    "countryCode": "PA",
    "dialCode": "+507",
    "name": "Panama"
  },
  {
    "countryCode": "PG",
    "dialCode": "+675",
    "name": "Papua New Guinea"
  },
  {
    "countryCode": "PY",
    "dialCode": "+595",
    "name": "Paraguay"
  },
  {
    "countryCode": "PE",
    "dialCode": "+51",
    "name": "Peru"
  },
  {
    "countryCode": "PH",
    "dialCode": "+63",
    "name": "Philippines"
  },
  {
    "countryCode": "PN",
    "dialCode": "+870",
    "name": "Pitcairn Islands"
  },
  {
    "countryCode": "PL",
    "dialCode": "+48",
    "name": "Poland"
  },
  {
    "countryCode": "PT",
    "dialCode": "+351",
    "name": "Portugal"
  },
  {
    "countryCode": "PR",
    "dialCode": "+1",
    "name": "Puerto Rico"
  },
  {
    "countryCode": "QA",
    "dialCode": "+974",
    "name": "Qatar"
  },
  {
    "countryCode": "RE",
    "dialCode": "+262",
    "name": "Réunion"
  },
  {
    "countryCode": "RO",
    "dialCode": "+40",
    "name": "Romania"
  },
  {
    "countryCode": "RU",
    "dialCode": "+7",
    "name": "Russia"
  },
  {
    "countryCode": "RW",
    "dialCode": "+250",
    "name": "Rwanda"
  },
  {
    "countryCode": "WS",
    "dialCode": "+685",
    "name": "Samoa"
  },
  {
    "countryCode": "SM",
    "dialCode": "+378",
    "name": "San Marino"
  },
  {
    "countryCode": "ST",
    "dialCode": "+239",
    "name": "São Tomé & Príncipe"
  },
  {
    "countryCode": "SA",
    "dialCode": "+966",
    "name": "Saudi Arabia"
  },
  {
    "countryCode": "SN",
    "dialCode": "+221",
    "name": "Senegal"
  },
  {
    "countryCode": "SC",
    "dialCode": "+248",
    "name": "Seychelles"
  },
  {
    "countryCode": "SL",
    "dialCode": "+232",
    "name": "Sierra Leone"
  },
  {
    "countryCode": "SG",
    "dialCode": "+65",
    "name": "Singapore"
  },
  {
    "countryCode": "SK",
    "dialCode": "+421",
    "name": "Slovakia"
  },
  {
    "countryCode": "SI",
    "dialCode": "+386",
    "name": "Slovenia"
  },
  {
    "countryCode": "SB",
    "dialCode": "+677",
    "name": "Solomon Islands"
  },
  {
    "countryCode": "SO",
    "dialCode": "+252",
    "name": "Somalia"
  },
  {
    "countryCode": "ZA",
    "dialCode": "+27",
    "name": "South Africa"
  },
  {
    "countryCode": "GS",
    "dialCode": "+500",
    "name": "South Georgia & South Sandwich Islands"
  },
  {
    "countryCode": "KR",
    "dialCode": "+82",
    "name": "South Korea"
  },
  {
    "countryCode": "SS",
    "dialCode": "+211",
    "name": "South Sudan"
  },
  {
    "countryCode": "ES",
    "dialCode": "+34",
    "name": "Spain"
  },
  {
    "countryCode": "LK",
    "dialCode": "+94",
    "name": "Sri Lanka"
  },
  {
    "countryCode": "BL",
    "dialCode": "+590",
    "name": "St. Barthélemy"
  },
  {
    "countryCode": "MF",
    "dialCode": "+590",
    "name": "St. Martin"
  },
  {
    "countryCode": "PM",
    "dialCode": "+508",
    "name": "St. Pierre & Miquelon"
  },
  {
    "countryCode": "SD",
    "dialCode": "+249",
    "name": "Sudan"
  },
  {
    "countryCode": "SR",
    "dialCode": "+597",
    "name": "Suriname"
  },
  {
    "countryCode": "SJ",
    "dialCode": "+47",
    "name": "Svalbard & Jan Mayen"
  },
  {
    "countryCode": "SE",
    "dialCode": "+46",
    "name": "Sweden"
  },
  {
    "countryCode": "CH",
    "dialCode": "+41",
    "name": "Switzerland"
  },
  {
    "countryCode": "SY",
    "dialCode": "+963",
    "name": "Syria"
  },
  {
    "countryCode": "TW",
    "dialCode": "+886",
    "name": "Taiwan"
  },
  {
    "countryCode": "TJ",
    "dialCode": "+992",
    "name": "Tajikistan"
  },
  {
    "countryCode": "TZ",
    "dialCode": "+255",
    "name": "Tanzania"
  },
  {
    "countryCode": "TH",
    "dialCode": "+66",
    "name": "Thailand"
  },
  {
    "countryCode": "TL",
    "dialCode": "+670",
    "name": "Timor-Leste"
  },
  {
    "countryCode": "TG",
    "dialCode": "+228",
    "name": "Togo"
  },
  {
    "countryCode": "TK",
    "dialCode": "+690",
    "name": "Tokelau"
  },
  {
    "countryCode": "TO",
    "dialCode": "+676",
    "name": "Tonga"
  },
  {
    "countryCode": "TN",
    "dialCode": "+216",
    "name": "Tunisia"
  },
  {
    "countryCode": "TR",
    "dialCode": "+90",
    "name": "Türkiye"
  },
  {
    "countryCode": "TM",
    "dialCode": "+993",
    "name": "Turkmenistan"
  },
  {
    "countryCode": "TV",
    "dialCode": "+688",
    "name": "Tuvalu"
  },
  {
    "countryCode": "UG",
    "dialCode": "+256",
    "name": "Uganda"
  },
  {
    "countryCode": "UA",
    "dialCode": "+380",
    "name": "Ukraine"
  },
  {
    "countryCode": "AE",
    "dialCode": "+971",
    "name": "United Arab Emirates"
  },
  {
    "countryCode": "GB",
    "dialCode": "+44",
    "name": "United Kingdom"
  },
  {
    "countryCode": "US",
    "dialCode": "+1",
    "name": "United States"
  },
  {
    "countryCode": "UY",
    "dialCode": "+598",
    "name": "Uruguay"
  },
  {
    "countryCode": "UZ",
    "dialCode": "+998",
    "name": "Uzbekistan"
  },
  {
    "countryCode": "VU",
    "dialCode": "+678",
    "name": "Vanuatu"
  },
  {
    "countryCode": "VE",
    "dialCode": "+58",
    "name": "Venezuela"
  },
  {
    "countryCode": "VN",
    "dialCode": "+84",
    "name": "Vietnam"
  },
  {
    "countryCode": "WF",
    "dialCode": "+681",
    "name": "Wallis & Futuna"
  },
  {
    "countryCode": "EH",
    "dialCode": "+212",
    "name": "Western Sahara"
  },
  {
    "countryCode": "YE",
    "dialCode": "+967",
    "name": "Yemen"
  },
  {
    "countryCode": "ZM",
    "dialCode": "+260",
    "name": "Zambia"
  },
  {
    "countryCode": "ZW",
    "dialCode": "+263",
    "name": "Zimbabwe"
  }
];

export function getCountryName(code: string): string {
  return countries.find((c) => c.code === code)?.name ?? code;
}

export function getDialCodeForCountry(countryCode: string): string {
  return phoneCountryCodes.find((c) => c.countryCode === countryCode)?.dialCode ?? "+65";
}

export function formatPhoneNumber(dialCode: string, localNumber: string): string {
  const digits = localNumber.replace(/\s+/g, "").trim();
  if (!digits) return "";
  return `${dialCode} ${digits}`;
}

export function getCountrySelectOptions(defaultCode: string, allowedCodes?: string[]) {
  const pool = allowedCodes
    ? countries.filter((c) => allowedCodes.includes(c.code))
    : countries;
  const rest = pool.filter((c) => c.code !== defaultCode);
  const preferred = pool.find((c) => c.code === defaultCode);
  const options = rest.map((c) => ({ value: c.code, label: c.name }));
  if (preferred) {
    return [{ value: preferred.code, label: `${preferred.name} (default)` }, ...options];
  }
  return options;
}

export function getPhoneCodeSelectOptions(defaultCountryCode: string) {
  const byDial = new Map<string, PhoneCountryCode>();
  for (const entry of phoneCountryCodes) {
    if (!byDial.has(entry.dialCode)) byDial.set(entry.dialCode, entry);
  }
  const unique = [...byDial.values()].sort((a, b) => a.name.localeCompare(b.name));
  const preferred = phoneCountryCodes.find((c) => c.countryCode === defaultCountryCode);
  const rest = unique.filter((c) => c.dialCode !== preferred?.dialCode);
  const options = rest.map((c) => ({
    value: c.dialCode,
    label: `${c.dialCode} ${c.name}`,
  }));
  if (preferred) {
    return [
      { value: preferred.dialCode, label: `${preferred.dialCode} ${preferred.name} (default)` },
      ...options,
    ];
  }
  return options;
}
