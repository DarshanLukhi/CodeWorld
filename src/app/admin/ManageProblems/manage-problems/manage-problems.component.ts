import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-manage-problems',
  templateUrl: './manage-problems.component.html',
  styleUrls: ['./manage-problems.component.css']
})
export class ManageProblemsComponent implements OnInit {
  public data;

  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this._dataService.getProblems().subscribe(
      status => {
        this.data = status;
      },
      err => {}
    );

  }
  onProblemSelect(problem) {
    this.router.navigate(['/admin/problem', problem.problemCode]);
  }
}
