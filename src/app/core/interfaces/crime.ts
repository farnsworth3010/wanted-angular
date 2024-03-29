interface File {
  url: null | string;
  name: null | string;
}

interface Image {
  caption: null | string;
  large: null | string;
  thumb: null | string;
  original: null | string;
}

interface CustomField {
  name: string;
  value: null | string | number;
}

export interface Crime {
  details: null | string;
  eyes_raw: null | string;
  age_min: null | number;
  path: null | string;
  hair_raw: null | string;
  age_range: null | number;
  legat_names: null | string[];
  modified: null | string;
  height_max: null | number;
  reward_max: null | number;
  coordinates: null | string[];
  remarks: null | string;
  weight_max: null | number;
  title: null | string;
  height_min: null | number;
  warning_message: null | string;
  reward_text: null | string;
  person_classification: null | string;
  age_max: null | string;
  locations: null | string[];
  sex: null | string;
  occupations: null | string[];
  race_raw: null | string;
  subjects: null | string[];
  caution: null | string;
  hair: null | string;
  description: null | string;
  scars_and_marks: null | string[];
  possible_countries: null;
  aliases: null | string[];
  dates_of_birth_used: null | string;
  publication: null | string;
  weight: null | string;
  files: null | File[];
  ncic: null | string;
  race: null | string;
  eyes: null | string;
  images: null | Image[];
  languages: null | string[];
  additional_information: null | string;
  field_offices: null | string[];
  place_of_birth: null | string;
  possible_states: null | string[];
  status: null | string;
  build: null | string;
  nationality: null | string;
  url: string;
  poster_classification: null | string;
  complexion: null | string;
  uid: string;
  weight_min: null | number;
  reward_min: null | number;
  suspects: null | string[];
  customFields?: CustomField[];
  deleting?: boolean;
  editing?: boolean;
  '@id': string;
}