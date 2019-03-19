import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
declare var $: any;
declare var ace: any;


@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css'],
})
export class IdeComponent implements OnInit {

  code = '';
  input = '';
  inputRadio = true;
  lang = 'C';
  output;
  error;
  public editor;
  public theme = 'ace/theme/clouds';
  public buf;


  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    const that = this;
    $(document).ready(function() {
      $('#toggle').click(function() {
        $('#input').slideToggle();
      });

      that.editor = ace.edit('editor');
      that.editor.setTheme('ace/theme/clouds');
      that.editor.session.setMode('ace/mode/c_cpp');
    });
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

    console.log(this.output);
    // this.code = document.getElementsByClassName('ace_content')[0].textContent;
    this.code = this.editor.getValue();
    const data = {
      code: this.code,
      input: this.input,
      inputRadio: this.inputRadio,
      lang: this.lang
    };
    console.log(data);
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
  }
}
