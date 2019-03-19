import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user ;
  admin ;
  login ;
  notLogin ;
  first_name = '';
  last_name = '';
  userDetails = '';
  constructor(private userService: UserService, private router: Router) { }


  // Display login , signup or name of user if login.
  ngOnInit() {
     if (this.userService.isAdminLoggedIn()) {
      this.login = true;
      this.notLogin = false;
      this.user = false;
      this.admin = true;
      this.userService.getUserProfile().subscribe(
        res => {
          this.userDetails = res['user'];
          this.first_name = this.userDetails['first_name'];
          this.last_name = this.userDetails['last_name'];
        }
      );
    } else if (this.userService.isLoggedIn()) {
      this.login = true;
      this.notLogin = false;
      this.user = true;
      this.admin = false;
      this.userService.getUserProfile().subscribe(
        res => {
          this.userDetails = res['user'];
          this.first_name = this.userDetails['first_name'];
          this.last_name = this.userDetails['last_name'];
        }
      );
    } else {
      this.login = false;
      this.notLogin = true;
      this.user = true;
      this.admin = false;
    }
  }

  // for logout button in name part of header
  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
