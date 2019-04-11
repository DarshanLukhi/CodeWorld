import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }


  model = {
    user_name: '',
    code: ''
  };
  entered_code: '';
  ngOnInit() {
    $('#verifyCode').css('display', 'none');
    $('#sendCode').css('display', 'block');
  }

  // After enter username for reset pssword
  sendCode() {
        console.log(this.model.user_name);
        this.model.code = String( Math.floor(Math.random() * 900000) + 100000 );
        this.userService.sendForgetPasswordCode(this.model).subscribe(
          res => {
            $('#verifyCode').css('display', 'block');
            $('#sendCode').css('display', 'none');
          },
          err => {
            this.toastr.error(err.error.message);
          }
        );
      }

 // After enter verification code for verify
  verifyCode() {
    if (this.model.code === this.entered_code) {
      this.model.code = '';
      this.toastr.success('Code is valid.....');
      this.userService.makeLoggedInUser(this.model.user_name).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigate(['/reset-password']);
        },
        err => {
          this.toastr.error('Some problem,try again....');
        }
      );
    } else {
      this.toastr.error('Code is not valid....');
    }
  }

}
