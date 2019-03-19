import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }
  userDetails = '';
  model = {
    user_name: '',
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: ''
  };
  model2 = {
    email_id: '',
    city: '',
    state: '',
    mobile_no: ''
  };
  model3 = {
    oldpassword: '',
    newpassword: '',
    confirmpassword: ''
  };
  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        if (this.userDetails['birth_date'] !== null) {
          this.userDetails['birth_date'] =  this.userDetails['birth_date'].slice(0, 10);
          this.model.birth_date = this.userDetails['birth_date'];
        } else {
          this.userDetails['birth_date'] =  ' ';
          this.model.birth_date = this.userDetails['birth_date'];
        }
        this.model.user_name = this.userDetails['user_name'];
        this.model.first_name = this.userDetails['first_name'];
        this.model.last_name = this.userDetails['last_name'];
        this.model.gender = this.userDetails['gender'];
        this.model2.email_id = this.userDetails['email_id'];
        this.model2.city = this.userDetails['city'];
        this.model2.state = this.userDetails['state'];
        this.model2.mobile_no = this.userDetails['mobile_no'];
      },
      err => {
      }
    );
  }

  // After update personal details
  updatePersonal() {
    this.userService.updatePersonalDetail(this.model).subscribe(
      res => {
          this.toastr.success('Profile updated successfully');
          this.router.navigate(['/home']);
      },
      err => {
        this.toastr.error('Something went wrong');
      }
    );
  }

    // After update communication details
    updateCommunication() {
      this.userService.updateCommunicationDetail(this.model2).subscribe(
        res => {
            this.toastr.success('Profile updated successfully');
            this.router.navigate(['/home']);
        },
        err => {
          this.toastr.error('Something went wrong');
        }
      );
    }


    // After update communication details
        updatePrivacy() {
          // check old password
          if (this.userDetails['password'] !== this.model3.oldpassword) {
            this.toastr.error('Old password is wrong.');
          } else {
            // Check password and confirm password
            if (this.model3.newpassword === this.model3.confirmpassword ) {
               this.userService.updatePrivacyDetail(this.model3).subscribe(
               res => {
                this.toastr.success('Profile updated successfully');
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



}
