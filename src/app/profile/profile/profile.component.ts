import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails = '';
  constructor(private userService: UserService, private router: Router) { }

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
  }

}
