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
  public buttonStatus = false;


  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    const that = this;
    $(document).ready(function() {
      $('#toggle').click(function() {
        $('#input').slideToggle();
      });
      ace.require('ace/ext/language_tools');
      that.editor = ace.edit('editor');
      that.editor.setTheme('ace/theme/clouds');
      that.editor.session.setMode('ace/mode/c_cpp');
      that.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
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
        console.log(status);
        this.output = status.output;
        this.error = status.error;
        this.buttonStatus = false;
      }
    );
  }
}
