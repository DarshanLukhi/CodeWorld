import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DataService } from './../../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-view-contest',
  templateUrl: './view-contest.component.html',
  styleUrls: ['./view-contest.component.css']
})
export class ViewContestComponent implements OnInit {
  public id;
  public data = [];
  public sendData;
  constructor(private route: ActivatedRoute, private _dataService: DataService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this._dataService.getContest(this.id).subscribe(
      status => {
        this.data = status[0];
      },
      error => {
        console.log(error);
      },
    );

  }
  onStatusChange(status) {
    const that = this;
    $(document).ready(function() {
      that.sendData = {
        contestCode: that.id,
        contestStatus: $('#option').val(),
      };
    if (that.sendData.contestStatus !== null) {
      that._dataService.updateContest(that.sendData).subscribe(
        sts => {
          that.toastr.success('Contest status update successfully');
          that.router.navigate(['/admin/contests']);
        },
        err => {
          console.log('e');
        },
      );
    }
  });
  }
}
