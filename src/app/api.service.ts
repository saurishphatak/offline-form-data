import { Injectable } from '@angular/core';
import { IDataService } from './Interfaces/IDataService';
import { HttpClient } from '@angular/common/http';
import { City, State } from './CreateDatabase';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = "http://localhost:5265";

  constructor(
    protected httpClient: HttpClient
  ) { }

  getStates() {
    return this.httpClient.get<State[]>(this.url + '/states');
  }
  getCitiesByState(state: State) {
    return this.httpClient.get<City[]>(`${this.url}/${state.name}/cities`);
  }
  submitFormData(formData: any) {
    throw new Error('Method not implemented.');
  }
}
