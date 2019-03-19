import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DataService } from './../../../services/data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-view-problem',
  templateUrl: './view-problem.component.html',
  styleUrls: ['./view-problem.component.css']
})
export class ViewProblemComponent implements OnInit {
  public id;
  public data;
  public dataa = 'a<br>a';
  public i;
  public testcase;
  public tcid = ['#testcase1', '#testcase2', '#testcase3', '#testcase4', '#testcase5',
                  '#testcase6', '#testcase7', '#testcase8', '#testcase9', '#testcase10'];

  constructor(private route: ActivatedRoute, private _dataService: DataService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this._dataService.getProblem(this.id).subscribe(
      status => {
        $('#name').append(status.problemName);
        $('#code').append(status.problemCode);
        $('#content').append(status.Defination);

        const x = status.No_of_testcase;
        this.testcase = status.Testcase.split('#############################################');
        for (this.i = 0; this.i < x; this.i++ ) {
          $(this.tcid[this.i]).css('display', 'block').append(this.testcase[this.i]);
        }
      },
    );


  }

}
