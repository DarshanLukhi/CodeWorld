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
  getRankList(data) {
    return this._http.post<any>(environment.apiEndPoint + '/getRankList' ,  data);
  }

  getSolutionHistory() {
    return this._http.get(environment.apiEndPoint + '/getSolutionHistory');
  }
  getFile(data) {
    return this._http.post<any>(environment.apiEndPoint + '/getFile' ,  data);
  }

  getSolutionHistoryById(data) {
    // tslint:disable-next-line:max-line-length
    return this._http.get<any>(environment.apiEndPoint.concat('/getSolutionHistoryById'), {headers : {'userid' : data, 'NoAuth' : 'True' }});
  }


}
