// angular import
import { Component } from '@angular/core';
import * as glob from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgFor } from '@angular/common';
import _3D from 'src/app/demo/3d/3d.component';


@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss'],
  providers: [_3D],
})
export class NavLeftComponent {

  //dropDownData: any [] = [];
  dropDownData: any;

  fun(){
    alert('Clicked');
  }

  private  baseUrl1 =  glob.environment.baseUrl;  
  constructor(private http:HttpClient,private _3d: _3D) { }

  get_state_name() {
    const headers = new HttpHeaders().set('Content-Type','application/json');
    let url = "http://localhost:8085/get_state_name";
    this.http.get(url, {headers:headers}).subscribe(
      result => {
      this.dropDownData=result;
      console.log(this.dropDownData);
  });
  }


  // get_layer_by_state_id(event){
  //   var state_id = event.target.getAttribute("state_id");


  //   this._3d.get_layer_panel_data("3D" , state_id);

  // }

  ngOnInit(){
    this.get_state_name()
  }

}
