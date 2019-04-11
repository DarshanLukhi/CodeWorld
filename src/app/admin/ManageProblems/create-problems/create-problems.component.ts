import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-create-problems',
  templateUrl: './create-problems.component.html',
  styleUrls: ['./create-problems.component.css']
})
export class CreateProblemsComponent implements OnInit {
  public problemCode: any;
  public problemName: any;
  public problemType: any;
  public Defination: any;
  public No_of_testcase: any;
  public Testcase: any;
  public timeLimit: any;
  public publish = false;
  data;
  defFile;
  testcaseFile;
  tc = '';
  def;
  nof;

  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    $(document).on('click', '.browse', function() {
      let file;
      file = $(this).parent().parent().parent().find('.file');
      file.trigger('click');
    });
    $(document).on('change', '#single', function() {
      $(this).parent().find('.form-control').val($(this).val().replace('C:\\fakepath\\', ''));
    });

  }



  onSubmit() {
    if (this.defFile === '' || this.tc === '' ) {
      if (this.defFile === '') {
        this.toastr.error('Please upload problem defination file');
      }
      if (this.tc === '') {
        this.toastr.error('Please upload testcase file');
      }
    } else {
      this.data = {
        problemCode: this.problemCode,
        problemName: this.problemName,
        problemType: this.problemType,
        problemStatus : this.publish,
        timeLimit : this.timeLimit,
        Defination: this.def,
        No_of_testcase: this.No_of_testcase,
        Testcase: this.tc
      };

      this._dataService.postProblem(this.data).subscribe(
        status => {
          this.toastr.success('Problem insrted successfuly');
          this.router.navigate( [ '/admin/problems'] );
        },
        error => {
          this.toastr.error(error.error[0]);
        }
      );
    }
  }

  // change event on defination upload
  definationUpload(event) {
    this.defFile = '';
    this.defFile = event.srcElement.files[0];
    const reader = new FileReader();
    reader.readAsText(this.defFile);
    const that = this;
    reader.onload = function() {
      that.def = reader.result as string;
    };
  }

  // change event on testcase upload
  testCaseUpload(event) {
    this.tc = '';
    this.No_of_testcase = event.srcElement.files.length;

    // jquery For display No of files selected.
    $(document).on('change', '#multiple', function() {
      $(this).parent().find('.form-control').val($(this).val().replace($(this).val(), event.srcElement.files.length + ' files selected'));
    });

    for (let i = 0; i < this.No_of_testcase; i++) {
      this.testcaseFile = event.srcElement.files[i];
      const reader = new FileReader();
      reader.readAsText(this.testcaseFile);
      const that = this;
      reader.onload = function() {
        that.tc = that.tc + reader.result as string + '#############################################';
      };
    }
  }

  notPublish() {
    this.publish = false;
  }

  Publish() {
    this.publish = true;
  }

}
