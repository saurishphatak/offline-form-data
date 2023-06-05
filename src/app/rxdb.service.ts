import { Injectable } from '@angular/core';
import { IDataService } from './Interfaces/IDataService';
import { City, OfflineDatabase, State, citySchema, stateSchema } from './CreateDatabase';
import { createRxDatabase } from 'rxdb';
import { } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RxdbService {
  db!: OfflineDatabase;

  // Emits the states stored by the db
  statesSubject = new Subject<State[]>();
  states$ = this.statesSubject.asObservable();

  citiesSubject = new Subject<City[]>();
  cities$ = this.citiesSubject.asObservable();

  constructor() {
    this.setupDatabase();
  }

  async setupDatabase() {
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
    })
  }

  getStates() {
    console.log("RxdbService::getStates()");

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
    console.log("RxdbService::getCitiesByState()", state);

    this.db.cities.find({
      selector: {
        stateId: state.id,
      }
    }).exec().then(res => {
      this.citiesSubject.next(res);
    });

    return this.cities$;
  }

  submitFormData(formData: any) {
    throw new Error('Method not implemented.');
  }

  async addState(state: State) {
    console.log("RxdbService::addState()", state);
    await this.db.states.insert(state);
  }

  async addCities(cities: City[]) {
    console.log("RxdbService::addCities()", cities);
    for (const city of cities) {
      await this.db.cities.insert(city);
    }
  }

  async clearCities() {
    console.log("RxdbService::clearCities()");
    await this.db.cities.remove();
  }

  async clearStates() {
    console.log("RxdbService::clearStates()");
    await this.db.states.remove();
  }
}
