import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-contests',
  templateUrl: './manage-contests.component.html',
  styleUrls: ['./manage-contests.component.css']
})
export class ManageContestsComponent implements OnInit {

  public data;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this._dataService.getContests().subscribe(
      status => {
        this.data = status;
      },
      err => {
        console.log(err);
      },
    );
  }
  onContestSelect(contest) {
    this.router.navigate(['/admin/contest', contest.contestCode]);
  }
}
