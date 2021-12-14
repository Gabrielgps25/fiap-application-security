import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: Array<any>;
  error: string;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getAllUsers()
      .subscribe(
      data => this.users = data,
      error => this.error = error.statusText
      );
  }

}
