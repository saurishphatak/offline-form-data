import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { debug } from '../rxdb.service';
import { State } from '../Types/State';
import { City } from '../Types/City';
import { UserDetails } from '../Types/UserDetails';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit, OnDestroy {
  fg: FormGroup;

  className = "DataFormComponent";

  currentSelectedState?: State;

  states: State[] = [];
  cities: City[] = [];

  statesSubscription!: Subscription;
  citiesSubscription!: Subscription;

  public constructor(fb: FormBuilder, protected dataService: DataService) {
    this.fg = fb.group({
      applicationId: fb.control(''),
      firstName: fb.control('', [Validators.required]),
      lastName: fb.control('', [Validators.required]),
      address: fb.control('', [Validators.required]),
      email: fb.control('', [Validators.required, Validators.email]),
      age: fb.control('', [Validators.min(0)]),
      state: fb.control('', [Validators.required]),
      city: fb.control('', [Validators.required]),
      gender: fb.control('')
    });
  }

  ngOnDestroy(): void {
    try {
      this.statesSubscription.unsubscribe();
      this.citiesSubscription.unsubscribe();
    } catch (e) {

    }
  }

  ngOnInit(): void {
    let functionName = "ngOnInit()";
    debug(`${this.className}::${functionName}`);

    // this.statesSubscription = this.dataService.getStates()

    // this.citiesSubscription = this.dataService.cities$
    this.getStates();

  }

  public getStates() {
    let functionName = "getStates()";

    debug(`${this.className}::${functionName}`);

    this.dataService.getStates().subscribe({
      next: (res) => {
        debug(`${this.className}::${functionName} Got states`, res);

        this.states = res;
      }
    });
  }

  getCitiesByState(e: any, state: State) {

    if (e.isUserInput) {
      let functionName = "getCitiesByState()";
      debug(`${this.className}::${functionName}`, state);

      this.currentSelectedState = state;

      this.dataService.getCitiesByState(state).subscribe({
        next: (res) => {
          debug(`${this.className}::${functionName} Got cities`, res);

          this.cities = res;
        }
      });
    }
  }

  downloadStateData() {
    let functionName = "downloadStateData()";
    debug(`${this.className}::${functionName}`, this.currentSelectedState);

    if (this.currentSelectedState) {
      this.dataService.downloadData(this.currentSelectedState!, this.cities);
    }
  }

  toggleIsConnected() {
    let functionName = "toggleIsConnected()";
    debug(`${this.className}::${functionName}`);

    this.cities = [];
    this.dataService.toggleIsConnected();
    this.getStates();
  }

  submitUserDetails() {
    let functionName = 'submitUserDetails()';

    debug(`${this.className}::${functionName}`, this.fg.errors, this.fg.valid);
    if (this.fg.valid) {
      debug(`${this.className}::${functionName}`, this.fg.value);

      let userDetails: UserDetails = this.fg.value;

      this.dataService.submitForm(userDetails).subscribe({
        next: (res) => {
          debug(`${this.className}::${functionName} Submitted userDetails`);

          this.fg.reset();
        }
      });
    }
  }
}
