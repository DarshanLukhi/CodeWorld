import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private _http: HttpClient) { }

  postProblem(data) {
    return this._http.post<any>(environment.apiEndPoint + '/addproblem', data);
  }

  getProblems() {
    return this._http.get<any>(environment.apiEndPoint + '/problems');
  }
  getProblem(data) {
    return this._http.get<any>(environment.apiEndPoint + '/problem?problemCode=' + data);
  }

  postContest(data) {
    return this._http.post<any>( environment.apiEndPoint + '/createContest', data);
  }

  getContests() {
    return this._http.get<any>(environment.apiEndPoint + '/getContests');
  }

  getContest(data) {
    return this._http.get<any>(environment.apiEndPoint + '/getContest?contestCode=' + data);
  }
  updateContest(data) {
    return this._http.post<any>(environment.apiEndPoint + '/updateContest' , data);
  }

  compileCode(data) {
    return this._http.post<any>(environment.apiEndPoint + '/compilecode' , data);
  }
  compileContestCode(data) {
    return this._http.post<any>(environment.apiEndPoint + '/submitsolution' , data);
  }

  findAllProblem(data) {
    return this._http.post<any>(environment.apiEndPoint + '/findAllProblems' , data);
  }


}
