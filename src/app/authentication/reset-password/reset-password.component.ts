import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  model = {
    newpassword: '',
    confirmpassword: ''
  };

  ngOnInit() {
  }

  // After reset password
  resetPassword() {
      // Check password and confirm password
      if (this.model.newpassword === this.model.confirmpassword ) {
         this.userService.updatePrivacyDetail(this.model).subscribe(
         res => {
          this.toastr.success('Password updated successfully');
          this.router.navigate(['/home']);
           },
        err => {
            this.toastr.error('some thing went wrong... ');
           }
       );
     } else {
            this.toastr.error('New password and confirm password must be same . ');
      }
  }
}
