import { Injectable } from '@angular/core';
import { IDataService } from './Interfaces/IDataService';
import { City, OfflineDatabase, State, citySchema, stateSchema, userDetailsSchema } from './CreateDatabase';
import { createRxDatabase } from 'rxdb';
import { } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { Subject, share, shareReplay, take } from 'rxjs';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { UserDetails } from './Types/UserDetails';

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

  userDetailsSubject = new Subject<UserDetails[]>();
  userDetails$ = this.userDetailsSubject.asObservable();

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
      },
      userDetails: {
        schema: userDetailsSchema
      }
    });

    // Add plugins to the database
    // addRxPlugin(RxDBDevModePlugin);
  }

  getStates() {
    let functionName = 'getStates()';
    debug(`${this.className}::${functionName}`);

    this.db.states.find().exec().then(res => {
      let statesArray: State[] = res.map(st => ({
        id: st.id,
        name: st.name
      }));

      this.statesSubject.next(statesArray);
    });

    return this.states$.pipe(take(1));
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

    return this.cities$.pipe(take(1));
  }

  submitUserDetails(userDetails: UserDetails) {
    let functionName = 'submitFormData()';

    debug(`${this.className}::${functionName}`, userDetails);

    // Temporarily create a user application id and
    // store it
    userDetails.applicationId = new Date().getTime().toString();

    this.db.userDetails.upsert(userDetails).then(res => {
      debug(`${this.className}::${functionName} added userDetails`);

      this.userDetailsSubject.next([userDetails]);
    });

    return this.userDetails$.pipe(take(1));
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

  public getAllUserDetails() {
    let functionName = "getAllUserDetails()";
    debug(`${this.className}::${functionName}`);

    this.db.userDetails.find().exec().then(res => {
      let userDetailsArray: UserDetails[] = res.map(u => ({
        address: u.address,
        applicationId: u.applicationId,
        lastName: u.lastName,
        firstName: u.firstName,
        city: u.city,
        email: u.email,
        gender: u.gender,
        phoneNumber: u.phoneNumber,
        state: u.state,
        status: u.status,
        age: u.age
      }));

      this.userDetailsSubject.next(userDetailsArray);
    });

    return this.userDetails$.pipe(take(1));
  }

  async clearUserDetails() {
    let functionName = "clearUserDetails()";
    debug(`${this.className}::${functionName}`);

    for (const user of await this.db.userDetails.find().exec()) {
      await user.remove();
    }
  }
}
