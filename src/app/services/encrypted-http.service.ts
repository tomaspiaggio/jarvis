import {Injectable} from "@angular/core";
import {HTTP, HTTPResponse} from "@ionic-native/http";
import {NativeStorage} from "@ionic-native/native-storage";
declare var JSEncrypt: any;
/**
 * Created by Tomas on 10/11/17.
 */

@Injectable()
export class EncryptedHttpService {

  private decrypt = new JSEncrypt();
  private encrypt = new JSEncrypt();

  constructor(private http: HTTP,
              private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('keys')
      .then(pk => {
        const keys = JSON.parse(pk);
        this.decrypt.setPrivateKey(keys.private);
        this.encrypt.setPublicKey(keys.public);
      }).catch(err => console.log(err));
  }

  /**
   * GET decrypts and resolves the http response
   * @param url the path of the request
   * @param parameters parameters of the request
   * @param headers headers of the request
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public get(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.get(url, parameters, headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.decrypt.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * POST encrypted JSON file
   * @param url
   * @param body
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public post(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.post(url, JSON.stringify({data: this.encrypt.encrypt(body)}), headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.decrypt.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * PUT encrypted JSON file
   * @param url
   * @param body
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public put(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.put(url, JSON.stringify({data: this.encrypt.encrypt(body)}), headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.decrypt.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * DELETE http method
   * @param url
   * @param parameters
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public delete(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.delete(url, parameters, headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.decrypt.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

}

export class EncryptedHttpresponse implements HTTPResponse{
  constructor(public status: number,
              public headers: any,
              public data?: any,
              public error?: any) {}
}
