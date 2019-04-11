import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails = '';
  solutionHistory ;
  constructor(private userService: UserService, private _dataService: DataService, private router: Router) { }

  // This will fetch user profile first.
  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        if (this.userDetails['birth_date'] !== null) {
          this.userDetails['birth_date'] =  this.userDetails['birth_date'].slice(0, 10);
        } else {
          this.userDetails['birth_date'] =  'Not Assign';
        }
      },
      err => {
      }
    );
    this._dataService.getSolutionHistory().subscribe(
      res => {
        this.solutionHistory = res;
      },
      err => {

      }
    );
  }

  viewFile(data) {
    this._dataService.findAllProblem([data.problemCode]).subscribe(
      status => {
        console.log(123);
        this.router.navigate(['viewsolution', data.user_name, data._id]);
      }
     );
  }

}
