import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, State } from '../CreateDatabase';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {
  fg: FormGroup;

  isConnected = true;

  currentSelectedState?: State;

  states: State[] = [];
  cities: City[] = [];

  public constructor(fb: FormBuilder, protected dataService: DataService) {
    this.fg = fb.group({
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
    this.dataService.getStates().subscribe(res => {
      console.log("Got states", res);

      this.states = res;
    });

    this.dataService.isConnected$.subscribe(res => {

      this.dataService.getStates().subscribe(res => {
        this.states = res;
      });

    })
  }

  getCitiesByState(e: any, state: State) {
    if (e.isUserInput) {
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
    console.log("Downloading state data", this.currentSelectedState?.id);

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
}
