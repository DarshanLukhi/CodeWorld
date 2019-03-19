import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-create-contests',
  templateUrl: './create-contests.component.html',
  styleUrls: ['./create-contests.component.css']
})
export class CreateContestsComponent implements OnInit {

  public contestCode;
  public contestName;
  public multiSelect: any = [];
  public startDateTime;
  public endDateTime;
  public startDate;
  public endDate;
  public startTime;
  public endTime;
  public data;
  date1 = new Date('2010-07-12T18:30:00.000Z');

  myDate = new Date();
  public problemData;
  public selectedProblems = [];
  selectedOptions = [];


    config = {
      displayKey: 'problemCode',
      search: true,
      limitTo: 5
    };

  currentDate = this.myDate.getFullYear() + '-' + ('0' + (this.myDate.getMonth() + 1)).slice(-2) +
                '-' + ('0' + this.myDate.getDate()).slice(-2);
    constructor(private _dataService: DataService,  private toastr: ToastrService,
      private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
    this._dataService.getProblems().subscribe(
        status => {
          this.problemData = status.filter(a => a.problemStatus === false);
        }
      );
  }


  onSubmit() {
    this.startDateTime = new Date(this.startDate + 'T' + this.startTime );
    this.endDateTime = new Date(this.endDate + 'T' + this.endTime);
    console.log(Math.ceil(Math.abs(this.startDateTime.getTime() - this.endDateTime.getTime()) / (1000 * 3600 * 24)));
    if ( Math.ceil(Math.abs(this.startDateTime.getTime() - this.endDateTime.getTime()) / (1000 * 3600 * 24)) <= 0) {
      this.toastr.error('Ending date and time must be greater than starting date and time');
    } else {
      this.data = {
        contestCode: this.contestCode,
        contestName: this.contestName,
        contestStatus: 'Not Publish',
        problems: this.multiSelect.map(a => a.problemCode),
        startDateTime: new Date(this.startDate + 'T' + this.startTime ),
        endDateTime: new Date(this.endDate + 'T' + this.endTime),
      };

      this._dataService.postContest(this.data).subscribe(
        status => {
          this.toastr.success('contest created successfuly');
          this.router.navigate( [ '/admin/contests'] );
        },
        err => {
          this.toastr.error(err.error[0]);
        },
      );
    }
  }

}
