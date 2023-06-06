import { Injectable } from '@angular/core';
import { IDataService } from './Interfaces/IDataService';
import { City, OfflineDatabase, State, citySchema, stateSchema } from './CreateDatabase';
import { createRxDatabase } from 'rxdb';
import { } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { Subject } from 'rxjs';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

export const debug = console.log;

@Injectable({
  providedIn: 'root'
})
export class RxdbService {
  db!: OfflineDatabase;

  className = "RxdbService";

  // Emits the states stored by the db
  statesSubject = new Subject<State[]>();
  states$ = this.statesSubject.asObservable();

  citiesSubject = new Subject<City[]>();
  cities$ = this.citiesSubject.asObservable();

  constructor() {
    let functionName = "constructor()";

    debug(`${this.className}::${functionName}`);

    this.setupDatabase();
  }

  async setupDatabase() {
    let functionName = "setupDatabase()";
    debug(`${this.className}::${functionName}`);

    // Create the db
    this.db = await createRxDatabase(
      {
        name: 'offlineDatabase',
        storage: getRxStorageDexie()
      }
    );

    // Add collections
    await this.db.addCollections({
      states: {
        schema: stateSchema
      },
      cities: {
        schema: citySchema
      }
    });

    // Add plugins to the database
    addRxPlugin(RxDBDevModePlugin);
  }

  getStates() {
    let functionName = 'getStates()';
    debug(`${this.className}::${functionName}`);

    debug(`${this.className}::${functionName}`, this.db.states);

    this.db.states.find().exec().then(res => {
      let statesArray: State[] = res.map(st => ({
        id: st.id,
        name: st.name
      }));

      this.statesSubject.next(statesArray);
    });

    return this.states$;
  }

  getCitiesByState(state: State) {
    let functionName = "getCitiesByState()";
    debug(`${this.className}::${functionName}`, state);

    this.db.cities.find({
      selector: {
        stateId: state.id,
      }
    }).exec().then(res => {
      let citiesArray: City[] = res.map(c => ({
        id: c.id,
        name: c.name,
        stateId: c.stateId
      }));

      this.citiesSubject.next(citiesArray);
    });

    return this.cities$;
  }

  submitFormData(formData: any) {
    throw new Error('Method not implemented.');
  }

  async addState(state: State) {
    let functionName = "addState()";
    debug(`${this.className}::${functionName}`, state);

    // Use incremental upsert to avoid 409 CONFLICT
    // error
    await this.db.states.incrementalUpsert(state);
  }

  async addCities(cities: City[]) {
    let functionName = "addCities()";
    debug(`${this.className}::${functionName}`, cities);

    for (const city of cities) {
      await this.db.cities.insert(city);
    }
  }

  async clearCities() {
    let functionName = "clearCities()";
    debug(`${this.className}::${functionName}`);

    for (const city of await this.db.cities.find().exec()) {
      await city.remove();
    }
  }

  async clearStates() {
    let functionName = 'clearStates()';
    debug(`${this.className}::${functionName}`);

    for (const state of await this.db.states.find().exec()) {
      await state.remove();
    }
  }
}
