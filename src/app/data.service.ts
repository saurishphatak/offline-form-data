import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RxdbService } from './rxdb.service';
import { City, State } from './CreateDatabase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  protected isConnectedSubject = new Subject<boolean>();
  public isConnected$ = this.isConnectedSubject.asObservable();

  public isConnected = true;

  constructor(
    protected apiService: ApiService,
    protected rxdbService: RxdbService,
  ) { }

  getStates() {
    if (this.isConnected)
      return this.apiService.getStates();
    return this.rxdbService.getStates();
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
    if (!this.isConnected) {
      this.rxdbService.clearCities();
      this.rxdbService.clearStates();
    }
    this.isConnectedSubject.next(this.isConnected);
  }
}
