import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RxdbService, debug } from './rxdb.service';
import { City, State } from './CreateDatabase';
import { Subject, map, shareReplay, tap } from 'rxjs';
import { UserDetails } from './Types/UserDetails';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public isConnected = true;
  protected className = "DataService";

  protected statesSubject = new Subject<State[]>();
  public states$ = this.statesSubject.asObservable();

  protected citiesSubject = new Subject<City[]>();
  public cities$ = this.citiesSubject.asObservable();

  protected userDetailsSubject = new Subject<UserDetails[]>();
  public userDetails$ = this.userDetailsSubject.asObservable();

  constructor(
    protected apiService: ApiService,
    protected rxdbService: RxdbService,
  ) {
  }

  getStates() {
    let functionName = "getStates()";
    debug(`${this.className}::${functionName}`);

    return this.isConnected ? this.apiService.getStates() : this.rxdbService.getStates();

  }

  getCitiesByState(state: State) {
    let functionName = "getCitiesByState()";

    return this.isConnected ? this.apiService.getCitiesByState(state) : this.rxdbService.getCitiesByState(state);
  }

  getAllUserDetails() {
    let functionName = 'getAllUserDetails()';
    debug(`${this.className}::${functionName}`);
  }

  addState(state: State) {
    this.rxdbService.addState(state);
  }

  addCities(cities: City[]) {
    this.rxdbService.addCities(cities);
  }

  toggleIsConnected() {
    let functionName = "toggleIsConnected()";

    this.isConnected = !this.isConnected;
    debug(`${this.className}::${functionName}`);

    // If we're in connected mode, clear the previous data from
    // rxdb
    if (this.isConnected == true) {
      this.rxdbService.getAllUserDetails().subscribe({
        next: (res) => {
          debug(`${this.className}::${functionName} Got userDetails`, res);

          this.apiService.submitUserDetails(res).subscribe({
            next: (res) => {
              this.rxdbService.clearUserDetails();
            }
          });
        }
      })
      this.rxdbService.clearCities();
      this.rxdbService.clearStates();
    }
  }

  submitForm(userDetails: UserDetails) {
    let functionName = "submitForm()";

    debug(`${this.className}::${functionName}`, userDetails);

    return this.isConnected ? this.apiService.submitUserDetails([userDetails]) : this.rxdbService.submitUserDetails(userDetails);
  }

  downloadData(state: State, cities: City[]) {
    let functionName = "downloadData()";
    debug(`$${this.className}::${functionName}`, state, cities);

    this.addState(state);
    this.addCities(cities);
  }
}
