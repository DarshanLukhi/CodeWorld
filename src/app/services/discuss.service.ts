import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiscussService {

  constructor(private _http: HttpClient) { }

  getQuestions() {
    return this._http.get<any>(environment.apiEndPoint.concat('/questions'));
  }

  getMyQuestions(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/my-questions'), data);
  }

  getAnswers(data) {
    return this._http.get<any>(environment.apiEndPoint.concat('/answers'), {headers : {'questionid' : data}});
  }

  getMyAnswers(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/my-answers'), data);
  }

  getQuestionById(data) {
    return this._http.get<any>(environment.apiEndPoint.concat('/questionbyid'), {headers : {'questionid' : data}});
  }





  postAnswer(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/answer'), data);
  }

  postQuestion(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/question'), data);
  }

  giveLike(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/like'), data);
  }

  giveDislike(data) {
    return this._http.post<any>(environment.apiEndPoint.concat('/dislike'), data);
  }




  deleteQuestion(data) {
    return this._http.delete<any>(environment.apiEndPoint.concat('/deletequestion'), {headers : {'questionid' : data}});
  }

  deleteAnswer(data) {
    return this._http.delete<any>(environment.apiEndPoint.concat('/deleteanswer'), {headers : {'answerid' : data.answerid,
    'questionid' : data.questionid}});
  }
}
