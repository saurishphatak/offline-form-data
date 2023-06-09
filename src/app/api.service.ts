import { Injectable, OnDestroy } from '@angular/core';
import { IDataService } from './Interfaces/IDataService';
import { HttpClient } from '@angular/common/http';
import { City, State } from './CreateDatabase';
import { UserDetails } from './Types/UserDetails';
import { Subject, Subscription } from 'rxjs';
import { debug } from './rxdb.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {
  url = "https://localhost:7213";
  protected className = 'ApiService';

  constructor(
    protected httpClient: HttpClient
  ) { }

  ngOnDestroy(): void {

  }

  getStates() {
    let functionName = "getStates()";
    debug(`${this.className}::${functionName}`);

    return this.httpClient.get<State[]>(this.url + '/getStates');
  }

  getCitiesByState(state: State) {
    let functionName = "getCitiesByState()";
    debug(`${this.className}::${functionName}`, state);

    return this.httpClient.get<City[]>(`${this.url}/${state.name}/cities`);
  }

  submitUserDetails(userDetails: UserDetails[]) {
    let functionName = 'submitUserDetails()';
    debug(`${this.className}::${functionName}`, userDetails);

    return this.httpClient.post<UserDetails[]>(`${this.url}/addUserDetails`, userDetails);
  }

  getAllUserDetails() {
    this.httpClient.get<UserDetails[]>(`${this.url}/getAllUserDetails`);
  }
}
