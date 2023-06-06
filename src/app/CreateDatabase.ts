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

export type StateCollection = RxCollection<State>;
export type CityCollection = RxCollection<City>;

export type OfflineDataCollections = {
  states: StateCollection,
  cities: CityCollection
}

export type OfflineDatabase = RxDatabase<OfflineDataCollections>;
export { State, City };

