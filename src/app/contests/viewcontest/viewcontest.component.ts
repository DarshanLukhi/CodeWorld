import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from './../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';


@Component({
    selector: 'app-viewcontest',
    templateUrl: './viewcontest.component.html',
    styleUrls: ['./viewcontest.component.css']
})
export class ViewcontestComponent implements OnInit {
    public id;
    public data = [];
    constructor(private _dataService: DataService, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this._dataService.getContest(this.id).subscribe(
            status => {
                this._dataService.findAllProblem(status[0].problems).subscribe(
                    data => {
                        this.data = data;
                        console.log(data);
                    }
                );
            },
            err => {
                console.log(err.error[0]);
            },
        );


    }
    onProblemSelect(problem) {
        this.router.navigate(['contest', this.id, problem.problemCode]);
    }

}
