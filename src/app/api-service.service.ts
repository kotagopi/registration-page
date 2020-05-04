import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private httpClient: HttpClient) { }
  CREATE_USER = 'https://realto-task-api.herokuapp.com/users';

  // put method used to send the payload from an api
  public createUser(payload) {
    return this.httpClient.post(this.CREATE_USER, payload);
  }
}
