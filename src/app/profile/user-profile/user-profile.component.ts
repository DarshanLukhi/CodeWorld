import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    userDetails = '';
    username;
    userId;
    solutionHistory;
    // tslint:disable-next-line:max-line-length
    constructor(private userService: UserService, private _dataService: DataService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    // This will fetch user profile first.
    ngOnInit() {
        this.username = this.userService.getUserPayload().user_name;
        this.userId = this.route.snapshot.paramMap.get('userId');
        this.userService.getUserProfileById(this.userId).subscribe(
            res => {
                this.userDetails = res['user'];
                if (this.userDetails['birth_date'] !== null) {
                    this.userDetails['birth_date'] = this.userDetails['birth_date'].slice(0, 10);
                } else {
                    this.userDetails['birth_date'] = 'Not Assign';
                }
            },
            error => {
                if (error.status = 422) {
                    this.toastr.error(error.error.join('<br>'));
                } else {
                    this.toastr.error('some thing went wrong... ');
                }
                this.router.navigateByUrl('/home');
            }
        );
        this._dataService.getSolutionHistoryById(this.userId).subscribe(
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
            if (status[0].problemStatus === false && this.username !== this.userDetails['user_name']) {
                this.toastr.error('Solution available after finish the contest');
            } else {
                this.router.navigate(['viewsolution', data.user_name, data._id]);
            }
          }
         );
      }
}
