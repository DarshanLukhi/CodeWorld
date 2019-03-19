import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

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
  error;
  public editor;
  public theme = 'ace/theme/clouds';
  public buf;
  public disable = false;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit() {
    this.loadingBar.start();
    const that = this;
    $(document).ready(function() {
      $('#toggle').click(function() {
        $('#input').slideToggle();
      });

      that.editor = ace.edit('editor');
      that.editor.setTheme('ace/theme/clouds');
      that.editor.session.setMode('ace/mode/c_cpp');
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.pid = this.route.snapshot.paramMap.get('pid');
    this._dataService.getContest(this.id).subscribe(
      status => {
        if (status[0].contestStatus !== 'Start') {
            this.contestError = true;
        }
      },
      err => {
        // this.error = 'The contest problem is not available for accepting solutions.';
        this.contestError = true;
      }
    );

    this.loadingBar.complete();

  }
  // <ngx-loading-bar></ngx-loading-bar>
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
    this.loadingBar.start();
    this.disable = true;
    // this.code = document.getElementsByClassName('ace_content')[0].textContent;
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
        this.error = null;
      },
      error => {
        this.output = null;
        if ( error.error[0] === 'Input Missing') {
          this.toastr.error(error.error[0]);
        }
        this.error = error.error[0];
      }
    );
    this.disable = false;
    this.loadingBar.complete();
  }

  onSubmitCode() {
    this.disable = true;
    this.code = this.editor.getValue();
    const data = {
      code: this.code,
      lang: this.lang,
      pcode: this.pid,
      ccode: this.id

    };
    this._dataService.compileContestCode(data).subscribe(
      status => {
        this.toastr.success(status.status);
      },
      error => {
        this.output = null;
        this.error = error.error[0];
      }
    );
    this.disable = false;
  }

}
