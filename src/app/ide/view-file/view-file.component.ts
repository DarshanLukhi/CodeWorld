import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
declare var $: any;
declare var ace: any;

@Component({
    selector: 'app-view-file',
    templateUrl: './view-file.component.html',
    styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {

    public data;
    public user_name;
    public solutionID;
    public editor;
    public theme = 'ace/theme/clouds';
    public lang = 'C';

    constructor(private _dataService: DataService, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router, private userService: UserService) { }

    ngOnInit() {
        const that = this;
        that.editor = ace.edit('editor');
        that.editor.setTheme('ace/theme/clouds');
        this.user_name = this.route.snapshot.paramMap.get('username');
        this.solutionID = this.route.snapshot.paramMap.get('solutionID');
        let x;
        x = { user_name: this.user_name, _id : this.solutionID};

        console.log(x);
        this._dataService.getFile(x).subscribe(data => {
          this.lang = data.lang;
          if (data.lang === 'Python') {
            this.editor.session.setMode('ace/mode/python');
          }
          if (data.lang === 'Java') {
            this.editor.session.setMode('ace/mode/java');
          }
          if (data.lang === 'C' || data.lang === 'C++') {
            this.editor.session.setMode('ace/mode/c_cpp');
          }
          that.editor.setOptions({
            readOnly: true
          });
          that.editor.session.setValue(data.file);
        });
      }
      onThemeChange() {
        this.editor.setTheme(this.theme);
      }
      onLanguageChange() {
        if (this.lang === 'Python') {
          this.editor.session.setMode('ace/mode/python');
        }
        if (this.lang === 'Java') {
          this.editor.session.setMode('ace/mode/java');
        }
        if (this.lang === 'C' || this.lang === 'C++') {
          this.editor.session.setMode('ace/mode/c_cpp');
        }
      }

}
