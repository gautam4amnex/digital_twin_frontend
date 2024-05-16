import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationCheckService } from 'src/app/services/authorization-check.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import * as CryptoJS from 'crypto-js';
import { NgIf } from '@angular/common';
import { data } from 'jquery';
import * as glob from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,NgIf],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
  //providers: [UserService]
})
export default class AuthSigninComponent implements OnInit {

  constructor(public fb: FormBuilder,private authorizationCheckService:AuthorizationCheckService, 
    private userservice: UserService, private _router: Router, private toastr: ToastrService) {
  }

  user: User = new User();
  captcha_data: any;
  submitted = false;
  rememberMe = false;
  conversionOutput: string;

  private  baseUrl1 =  glob.environment.baseUrl;  

  ngOnInit(){
    localStorage.clear();
    this.submitted = false;
    //this.loadUsernameAndPassword();

    var captcha_img = document.getElementById("captcha_img");
    captcha_img.setAttribute("src" , this.baseUrl1 + "getcaptcha");

  }

  loginForm = new FormGroup({
    user_name: new FormControl('', [Validators.required]), // Validators.required,
    password: new FormControl('', [Validators.required]),
    captcha: new FormControl('' , [Validators.required]) // Validators.required,
    //rememberMe : new FormControl()
  });

  refreshCaptcha(){
    var captcha_img = document.getElementById("captcha_img");
    captcha_img.setAttribute("src" , this.baseUrl1 + "getcaptcha");
  }

  verifyCaptcha(){

    if(this.loginForm.controls.captcha.value == ""){
      this.toastr.info('Please Enter Captcha');
      return;
    }

    var form_data = {
      flag: "fetch"
    }

    this.userservice.verifyCaptcha(form_data).subscribe((data: any) =>{
      console.log(data);
      
      if(data.responseCode == 200){
        if(data.data[0].captcha == this.loginForm.controls.captcha.value){          
          this.loginUser("");
        }
        else{
          this.toastr.error('Invalid Captcha');
        }
      }

    });

  }

  loginUser(loginUser) {
    this.user = new User();
    this.user.user_name = this.loginForm.value['user_name'] //this.userName.value;
    this.user.user_password = this.loginForm.value['password'];
    this.user.password = this.loginForm.value['password'];;
    //this.rememberMe = this.loginForm.value['rememberMe'];
    this.rememberMe = true;
    if(this.rememberMe == true){
      let d = new Date();
      d.setTime(d.getTime() + (365*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      if(this.user.password != null && this.user.password != undefined &&
        this.user.user_name != null && this.user.user_name != undefined
        ){
          this.conversionOutput = CryptoJS.AES.encrypt(this.user.password.trim(),this.user.user_name.trim()).toString();
          document.cookie = "username=" + this.user.user_name + ";" + expires + ";";
          document.cookie = "password=" + this.conversionOutput + ";" + expires + ";";
      }
    } else {
      document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "password= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    }
    this.submitted = true;
    this.login();
  }

  login() {
    this.userservice.logindata(this.user).subscribe((data: any) => {
      
        if (data.responseCode === 200) {
          this._router.navigate(['/dashboard']);
          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('name', data.data[0].name);
          localStorage.setItem('role_id', data.data[0].role_id);
          localStorage.setItem('user_id', data.data[0].user_id);
          localStorage.setItem('modules', data.data[0].modules);
          localStorage.setItem('token', data.data[0].accessToken);
          this.authorizationCheckService.modules = data.data[0].modules;
          this.toastr.success('Login Success');
		  
          //this.utilModule.notify(this.utilModule.SUCCESS_TAG, 'Login Successfull.');
        } else{
          this.toastr.error(data.responseMessage);
          //this.utilModule.notify(this.utilModule.ERROR_TAG, data.responseMessage);
        }
        
      }, (error) => {        
        this.toastr.error('Something Happend Wrong');
        //this.utilModule.notify(this.utilModule.ERROR_TAG, 'Something Happend Wrong.');
      });
    this.user = new User();
  }

  userName() {
    return this.loginForm.get('user_name');
  }

  password() {
    return this.loginForm.get('password');
  }

  loadUsernameAndPassword(){
    let cookies = document.cookie.split(';');
    
    if(cookies.length > 0 && cookies != null && cookies!= undefined){
        let username = cookies[0];
        let password = cookies[1];
        if(username != null && username != undefined &&
          password != null && password !=undefined){
            if(username && password){
              username = username.replace('username=','');
              password = password.replace('password=','');
              this.conversionOutput = CryptoJS.AES.decrypt(password.trim(),username.trim()).toString(CryptoJS.enc.Utf8);
              this.loginForm.controls['user_name'].setValue(username);
              this.loginForm.controls['password'].setValue(this.conversionOutput);
              this.loginForm.controls['rememberMe'].setValue(true);
              
            }
        }
    }
   } 


}
