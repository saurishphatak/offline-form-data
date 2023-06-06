import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RxdbService } from './rxdb.service';
import { City, State } from './CreateDatabase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public isConnected = true;

  protected statesSubject = new Subject<State[]>();
  public states$ = this.statesSubject.asObservable();

  protected citiesSubject = new Subject<City[]>();
  public cities$ = this.citiesSubject.asObservable();

  constructor(
    protected apiService: ApiService,
    protected rxdbService: RxdbService,
  ) {
  }

  getStates() {
    let resultObservable = this.isConnected ? this.apiService.getStates() : this.rxdbService.getStates();

    resultObservable.subscribe(res => {
      this.statesSubject.next(res);
    })
  }

  getCitiesByState(state: State) {
    return this.isConnected ? this.apiService.getCitiesByState(state) : this.rxdbService.getCitiesByState(state);
  }

  addState(state: State) {
    this.rxdbService.addState(state);
  }

  addCities(cities: City[]) {
    this.rxdbService.addCities(cities);
  }

  toggleIsConnected() {
    this.isConnected = !this.isConnected;

    // If we're in connected mode, clear the previous data from
    // rxdb
    if (this.isConnected) {
      this.rxdbService.clearCities();
      this.rxdbService.clearStates();
    }

    // Get the states
    this.getStates();
  }
}
