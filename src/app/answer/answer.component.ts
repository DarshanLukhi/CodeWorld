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
  likes;
  p = 1;
  likedata;
  mergedData = [];
  tempData = [];
  flag;
  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    if ( this.userService.isLoggedIn() ) {
      this.userId = this.userService.getUserPayload().user_name;
      this.isNotLogin = false;
    }
    if (this.userService.isAdminLoggedIn()) {
      this.admin = true;
    } else {
      this.admin = false;
    }


    this._dataService.getQuestionById(this.questionId).subscribe(result => {
      this.ques = result[0];
      if (this.ques == null) {
        this.router.navigate( [ '/discuss'] );
      }
    });
    if (this.isNotLogin === false) {
      this.likedata = {
        questionId : this.questionId,
        userId : this.userId
      };
      this._dataService.getAnswers(this.questionId).subscribe(result => {
        this.answers = result;
        this._dataService.getLikes(this.likedata).subscribe(result2 => {
          this.likes = result2;
          // var objectC = {...objectA, ...objectB};
          this.flag = 0;
          for (let i of this.answers) {
            this.flag = 0;
            i = {...i, ...{like: 0, dislike: 0, answerId: i._id} };
            for (const j of this.likes) {
              if (i._id === j.answerId) {
                this.mergedData.push({...i, ...j, ...{userId: i.userId}});
                this.flag = 1;
                break;
              }
            }
            if (this.flag === 0) {
              this.mergedData.push(i);
            }
          }
          this.mergedData.reverse();
        });
      });
    } else {
      this._dataService.getAnswers(this.questionId).subscribe(result => {
        this.answers = result;
        this.mergedData = this.answers.reverse();
      });
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
  }



  addLike(event, answerid) {
    const likedata = {
      answerid : answerid,
      userId : this.userId,
      questionId : this.questionId
    };
    this._dataService.giveLike(likedata).subscribe(
      status => {
        this.toastr.success('liked');
        this.tempData = [];
        // location.reload();
        this._dataService.getAnswers(this.questionId).subscribe(result => {
          this.answers = result;
          this._dataService.getLikes(this.likedata).subscribe(result2 => {
            this.likes = result2;
            // var objectC = {...objectA, ...objectB};
            this.flag = 0;
            for (let i of this.answers) {
              this.flag = 0;
              i = {...i, ...{like: 0, dislike: 0, answerId: i._id}};
              for (const j of this.likes) {
                if (i._id === j.answerId) {
                  this.tempData.push({...i, ...j, ...{userId: i.userId}});
                  this.flag = 1;
                  break;
                }
              }
              if (this.flag === 0) {
                this.tempData.push(i);
              }
            }
            this.tempData.reverse();
            this.mergedData = this.tempData;
          });
        });
      },
      error => {
        this.toastr.error(error.error[0]);
      }

    );
  }

  addDislike(event, answerid) {
    const dislikedata = {
      answerid : answerid,
      userId : this.userId,
      questionId : this.questionId
    };

    this._dataService.giveDislike(dislikedata).subscribe(
      status => {
        this.toastr.success('disliked');
        // location.reload();
        this.tempData = [];
        this._dataService.getAnswers(this.questionId).subscribe(result => {
          this.answers = result;
          this._dataService.getLikes(this.likedata).subscribe(result2 => {
            this.likes = result2;
            // var objectC = {...objectA, ...objectB};
            this.flag = 0;
            for (let i of this.answers) {
              this.flag = 0;
              i = {...i, ...{like: 0, dislike: 0, answerId: i._id}};
              for (const j of this.likes) {
                if (i._id === j.answerId) {
                  this.tempData.push({...i, ...j, ...{userId: i.userId}});
                  this.flag = 1;
                  break;
                }
              }
              if (this.flag === 0) {
                this.tempData.push(i);
              }
            }
            this.tempData.reverse();
            this.mergedData  = this.tempData;
          });
        });
      },
      error => {
        this.toastr.error(error.error[0]);
      }
    );
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
