import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxSchema,
  RxDocument,
  RxJsonSchema
} from 'rxdb';

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

export type State = {
  id: string;
  name: string;
};

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

export type City = {
  id: string;
  name: string;
  stateId: string;
};


export const citySchema: RxJsonSchema<City> = citySchemaLiteral;

export type StateCollection = RxCollection<State>;
export type CityCollection = RxCollection<City>;

export type OfflineDataCollections = {
  states: StateCollection,
  cities: CityCollection
}

export type OfflineDatabase = RxDatabase<OfflineDataCollections>;
