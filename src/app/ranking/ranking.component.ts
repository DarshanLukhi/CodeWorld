import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  model = {
    contestCode : ' '
};
 data ;
 p;
 header ;
 columns1 ;
  constructor(private _dataService: DataService, private toastr: ToastrService , private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.model.contestCode = this.route.snapshot.paramMap.get('id');
    this._dataService.getRankList(this.model).subscribe(
        data => {
        this.data = data;
        const temp = JSON.stringify(data[0]);
        const result = $.parseJSON(temp);
        const columns = [];
        $.each(result, function(k, v) {
            columns.push(k);
        });
        this.columns1 = columns;
      },
      error => {
        if (error.status = 422) {
          this.toastr.error(error.error.join('<br>'));
        } else {
          this.toastr.error('some thing went wrong... ');
        }
        this.router.navigateByUrl('/home');
      }
    );

  }

}
