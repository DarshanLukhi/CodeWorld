import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Class/user';
import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers : [UserService]
})
export class RegistrationComponent implements OnInit {

  emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]{2,5}$/;
  usernameRegex = /^(?=.{6,15}$)(?=[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$)/;
  showSuccessMessage: boolean;
  cpassword: string;

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    if (this.userService.getToken()) {
      this.router.navigate(['/home']);
    }
  }

  // After click create account button
  registerUser(user: User) {
    user.first_name = user.first_name.trim();
    user.last_name = user.last_name.trim();
    user.user_name = user.user_name.trim();
    user.email_id = user.email_id.toLowerCase();
    console.log(user);
    // Check password and confirm password
    if (user.password === this.cpassword ) {
      this.userService.postUser(user).subscribe(
        res => {
          this.toastr.success('Registration Complete');
          this.userService.setToken(res['token']);
          this.router.navigate(['/home']);
        },
        err => {
          if (err.status = 422) {
            this.toastr.error(err.error.join('<br>'));
          } else {
            this.toastr.error('some thing went wrong... ');
          }
        }
    );
    } else {
      this.toastr.error('Password and confirm password must be same . ');
    }
  }

}
