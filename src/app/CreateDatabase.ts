import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxSchema,
  RxDocument,
  RxJsonSchema
} from 'rxdb';
import { State } from './Types/State';
import { City } from './Types/City';
import { UserDetails } from './Types/UserDetails';


const stateSchemaLiteral = {
  title: 'states',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    }
  }
} as const;



export const stateSchema: RxJsonSchema<State> = stateSchemaLiteral;

const citySchemaLiteral = {
  title: 'cities',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    stateId: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  }
} as const;

export const citySchema: RxJsonSchema<City> = citySchemaLiteral;

const userDetailsSchemaLiteral = {
  title: 'userDetails',
  version: 0,
  primaryKey: 'applicationId',
  type: 'object',
  properties: {
    applicationId: {
      type: 'string',
      maxLength: 100
    },
    firstName: {
      type: "string"
    },
    lastName: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    state: {
      type: 'State'
    },
    city: {
      type: 'City'
    },
    status: {
      type: 'string'
    },
    age: {
      type: 'string'
    }
  }
} as const;

export const userDetailsSchema: RxJsonSchema<UserDetails> = userDetailsSchemaLiteral;

export type StateCollection = RxCollection<State>;
export type CityCollection = RxCollection<City>;
export type UserDetailsCollection = RxCollection<UserDetails>;

export type OfflineDataCollections = {
  states: StateCollection,
  cities: CityCollection,
  userDetails: UserDetailsCollection
}

export type OfflineDatabase = RxDatabase<OfflineDataCollections>;
export { State, City };

