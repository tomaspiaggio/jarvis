/**
 * Created by Tomas on 10/12/17.
 */

import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {HTTP} from "@ionic-native/http";
import {URLBuilderService} from "../../app/services/url-builder.service";
import {EncryptedHttpService} from "../../app/services/encrypted-http.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController,
              private http: HTTP,
              private urlBuilder: URLBuilderService) {
  }

  login(email: string, password: string): void {
    // this.http.post(this.urlBuilder.buildURL('users'), JSON.stringify({user: email, password: password}), {})
    //   .then((data) => console.log(data))
    //   .catch(err => console.log(err));
  }
}
