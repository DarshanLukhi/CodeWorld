import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [UserService]
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  model = {
    user_name: '',
    password: ''
  };
  ngOnInit() {
    if (this.userService.getToken()) {
      this.router.navigate(['/home']);
    }

  }

  // after click login button
  loginUser(form: NgForm) {
    this.userService.login(form).subscribe(
      res => {
        this.userService.setToken(res['token']);
        this.router.navigate(['/home']);
      },
      err => {
        this.toastr.error(err.error.message);
      }
    );
  }
}
