import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../services/discuss.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute} from '@angular/router';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  constructor(private _dataService: DiscussService, private userService: UserService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router, private location: Location) { }

  ans;
  admin;
  userId;
  questionId: string;
  ques = '';
  data;
  answers;
  isNotLogin = true;
  p = 1;

  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    this._dataService.getQuestionById(this.questionId).subscribe(result => {
      this.ques = result[0];
    });

    this._dataService.getAnswers(this.questionId).subscribe(result => {
      this.answers = result;
      this.answers.reverse();
    });
    if ( this.userService.isLoggedIn() ) {
        this.userId = this.userService.getUserPayload().user_name;
        this.isNotLogin = false;
    }

    if (this.userService.isAdminLoggedIn()) {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  onPostAnswer() {
    this.data = {
      userId : this.userId,
      questionId : this.questionId,
      answer : this.ans,
    };

    this._dataService.postAnswer(this.data).subscribe(
      status => {
        this.toastr.success('Thank You for contributing...');
        // this.router.navigate( [ '/discuss'] );
        location.reload();
      },
      error => {
        // console.log(error);
        this.toastr.error(error.error[0]);
      }
    );

    // this._dataService.getAnswers(this.questionId).subscribe(result => {
    //   this.answers = result;
    //   this.answers.reverse();
    // });


  }



  addLike(event, id) {
    const likedata = {
      id : id,
    };
    this._dataService.giveLike(likedata).subscribe(
      status => {
        this.toastr.success('liked');
        // location.reload();
      },
      error => {
        this.toastr.error(error.error[0]);
      }

    );

    this._dataService.getAnswers(this.questionId).subscribe(result => {
      this.answers = result;
      this.answers.reverse();
    });
  }

  addDislike(event, id) {
    const dislikedata = {
      id : id,
    };
    this._dataService.giveDislike(dislikedata).subscribe(
      status => {
        this.toastr.success('disliked');
        // location.reload();
      },
      error => {
        this.toastr.error(error.error[0]);
      }
    );
    this._dataService.getAnswers(this.questionId).subscribe(result => {
      this.answers = result;
      this.answers.reverse();
    });
  }


  deleteAnswer(event, id, qid) {
    const delData = {
      answerid : id,
      questionid : qid
    };
    this._dataService.deleteAnswer(delData).subscribe(
      status => {
        this.toastr.success('deleted');
        // navigate
        location.reload();
      },
      error => {
        this.toastr.error(error.error[0]);
      }
    );
  }



  addAnswerButton() {
    document.getElementById('answer').focus();
  }
}
