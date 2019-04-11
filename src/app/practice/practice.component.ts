import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DataService } from './../services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {
  public easy;
  public medium;
  public hard;
  public challenge;
  public p = [];
  public no_easy;
  public no_mediaum;
  public no_hard;
  public no_challenge;
  constructor(private route: ActivatedRoute, private _dataService: DataService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this._dataService.getProblems().subscribe(
      status => {
        this.easy = status.filter(a => a.problemStatus === true && a.problemType === 'Easy');
        this.medium = status.filter(a => a.problemStatus === true && a.problemType === 'Medium');
        this.hard = status.filter(a => a.problemStatus === true && a.problemType === 'Hard');
        this.challenge = status.filter(a => a.problemStatus === true && a.problemType === 'Challenge');
        this.no_easy = this.easy.length;
        this.no_mediaum = this.medium.length;
        this.no_hard = this.hard.length;
        this.no_challenge = this.challenge.length;
      }
    );
  }

  onProblemSelect(problem) {
    this.router.navigate(['contest', 'PRACTICE', problem.problemCode]);
}

}
