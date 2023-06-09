import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { debug } from '../rxdb.service';
import { UserDetails } from '../Types/UserDetails';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  className = "DashboardComponent";

  userDetails: UserDetails[] = [];

  public constructor(
    protected dataService: DataService
  ) {
  }

  ngOnInit(): void {
    let functionName = "ngOnInit()";

    debug(`${this.className}::${functionName}`);

    this.dataService.userDetails$.subscribe({
      next: (res) => {
        debug(`${this.className}::${functionName}`, res);

        this.userDetails = res;
      }
    });

    // Get all the user details
    this.dataService.getAllUserDetails();
  }


}
