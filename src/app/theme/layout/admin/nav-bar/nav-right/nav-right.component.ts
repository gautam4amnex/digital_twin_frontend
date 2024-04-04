// angular import
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent implements OnInit{

  username: string;
  userdetails = [];

  ngOnInit() {
    this.username = localStorage.getItem('name');
    this.userdetails.push({"username":this.username});
  }

}
