import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from './../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';



@Component({
  selector: 'app-view-contest-problem',
  templateUrl: './view-contest-problem.component.html',
  styleUrls: ['./view-contest-problem.component.css']
})
export class ViewContestProblemComponent implements OnInit {
  public id;
  public pid;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.pid = this.route.snapshot.paramMap.get('pid');
    this._dataService.getProblem(this.pid).subscribe(
      status => {
        $('#name').append(status.problemName);
        $('#code').append(status.problemCode);
        $('#content').append(status.Defination);

      },
    );


  }
    onSubmit() {
      this.router.navigate(['contest', this.id, 'submit', this.pid ]);
    }

}
