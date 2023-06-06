import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { debug } from '../rxdb.service';
import { State } from '../Types/State';
import { City } from '../Types/City';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {
  fg: FormGroup;

  className = "DataFormComponent";

  isConnected = true;

  currentSelectedState?: State;

  states: State[] = [];
  cities: City[] = [];

  public constructor(fb: FormBuilder, protected dataService: DataService) {
    this.fg = fb.group({
      applicationId: fb.control(''),
      firstName: fb.control('', [Validators.required]),
      lastName: fb.control('', [Validators.required]),
      address: fb.control('', [Validators.required]),
      email: fb.control('', [Validators.required, Validators.email]),
      age: fb.control('', [Validators.min(0)]),
      state: fb.control('', [Validators.required]),
      city: fb.control('', [Validators.required])
    });
  }

  ngOnInit(): void {
    let functionName = "ngOnInit()";
    debug(`${this.className}::${functionName}`);

    // Subscribe to the states and cities objservable
    this.dataService.states$.subscribe(res => {
      debug(`${this.className}::${functionName} got states`, res);

      this.states = res;
    });

    this.dataService.cities$.subscribe(res => {
      debug(`${this.className}::${functionName} got cities`, res);

      this.cities = res;
    });

    // Manually get the states the first time
    this.dataService.getStates()

  }

  getCitiesByState(e: any, state: State) {

    if (e.isUserInput) {
      let functionName = "getCitiesByState()";
      debug(`${this.className}::${functionName}`, state);

      console.log("Got", state);

      this.currentSelectedState = state;
      console.log({ selectedState: this.currentSelectedState });

      this.dataService.getCitiesByState(state).subscribe(res => {
        console.log("Got cities", res);
        this.cities = res;
      })
    }
  }

  downloadStateData() {
    let functionName = "downloadStateData()";
    debug(`${this.className}::${functionName}`, this.currentSelectedState);


    if (this.currentSelectedState) {
      this.dataService.getCitiesByState(this.currentSelectedState).subscribe(res => {
        console.log("Downloading cities", res);

        this.dataService.addState(this.currentSelectedState!);

        this.dataService.addCities(res);
      });
    }
  }

  toggleIsConnected() {
    this.dataService.toggleIsConnected();
  }

  submitUserDetails() {
    let functionName = 'submitUserDetails()';

    debug(`${this.className}::${functionName}`, this.fg.errors, this.fg.valid);
    if (this.fg.valid) {
      debug(`${this.className}::${functionName}`, this.fg.value);

    }
  }
}
