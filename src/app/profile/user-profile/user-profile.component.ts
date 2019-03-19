import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails = '';
  userId;
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  // This will fetch user profile first.
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserProfileById(this.userId).subscribe(
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
