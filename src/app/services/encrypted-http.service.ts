import {Injectable} from "@angular/core";
import {HTTP, HTTPResponse} from "@ionic-native/http";
/**
 * Created by Tomas on 10/11/17.
 */

@Injectable()
export class EncryptedHttpService {

  constructor(private http: HTTP) {}

  public get(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      //encriptar y mandar, desencriptar y devolver
    });
  }

  public post(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      //encriptar y mandar, desencriptar y devolver
    });
  }

  public put(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      //encriptar y mandar, desencriptar y devolver
    });
  }

  public delete(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      //encriptar y mandar, desencriptar y devolver
    });
  }

}

export class EncryptedHttpresponse implements HTTPResponse{
  constructor(public status: number,
              public headers: any,
              public data?: any,
              public error?: any) {}
}
