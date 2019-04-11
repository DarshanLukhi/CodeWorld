import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { UserService } from 'src/app/services/user.service';

declare var $: any;
declare var ace: any;


@Component({
  selector: 'app-compile-and-run',
  templateUrl: './compile-and-run.component.html',
  styleUrls: ['./compile-and-run.component.css']
})
export class CompileAndRunComponent implements OnInit {
  public id;
  public pid;
  public contestError = false;
  code = '';
  input = '';
  inputRadio = true;
  lang = 'C';
  output;
  error = false;
  public editor;
  public theme = 'ace/theme/clouds';
  public buf;
  public userId;
  public buttonStatus = false;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    const that = this;
    if ( this.userService.isLoggedIn() ) {
      this.userId = this.userService.getUserPayload().user_name;
  }
    $(document).ready(function() {
      $('#toggle').click(function() {
        $('#input').slideToggle();
      });

      that.editor = ace.edit('editor');
      that.editor.setTheme('ace/theme/clouds');
      that.editor.session.setMode('ace/mode/c_cpp');
      that.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.pid = this.route.snapshot.paramMap.get('pid');
    this._dataService.getContest(this.id).subscribe(
      status => {
        console.log(this.id);
        if (status[0].contestStatus !== 'Start' && this.id !== 'PRACTICE') {
          this.toastr.warning('The contest problem is not available for accepting solutions.');
          this.id = 'PRACTICE';
        }
      },
      error => {
        if ( this.id !== 'PRACTICE' ) {
          this.toastr.error('Invalid Contest');
          this.router.navigate(['/contests']);
        }
      }
    );


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
  onThemeChange() {
    this.editor.setTheme(this.theme);
  }
  onRunCode() {
    this.buttonStatus = true;
    this.code = this.editor.getValue();
    const data = {
      code: this.code,
      input: this.input,
      inputRadio: this.inputRadio,
      lang: this.lang
    };
    this._dataService.compileCode(data).subscribe(
      status => {
        this.output = status.output;
        this.error = status.error;
        this.buttonStatus = false;
      }
    );

  }

  onSubmitCode() {
    this.buttonStatus = true;
    this.code = this.editor.getValue();
    const data = {
      username: this.userId,
      code: this.code,
      lang: this.lang,
      pcode: this.pid,
      ccode: this.id,

    };
    this._dataService.compileContestCode(data).subscribe(
      status => {
        this.buttonStatus = false;
        if (status.status === 'AC') {
          this.toastr.success(status.status);
        } else {
          this.toastr.error(status.status);
        }
      },
      error => {
        this.output = null;
        this.error = error.error[0];
        this.buttonStatus = false;
      }
    );
  }

}
