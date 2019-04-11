import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {
  public data;
  public LiveContests;
  public FutureContests;
  public PastContests;
  public no_live;
  public no_past;
  public no_future;
  public p = [0, 0, 0];
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this._dataService.getContests().subscribe(
      status => {
        this.FutureContests = status.filter(a => a.contestStatus === 'Publish');
        this.LiveContests = status.filter(a => a.contestStatus === 'Start');
        this.PastContests = status.filter(a => a.contestStatus === 'End');
        this.no_live = this.LiveContests.length;
        this.no_past = this.PastContests.length;
        this.no_future = this.FutureContests.length;

      },
      err => {
        console.log(err);
      },
    );
  }
  onClick(contest) {
    this.router.navigate(['contest', contest.contestCode]);
  }

}
