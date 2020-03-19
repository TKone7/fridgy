import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[];

  constructor(
    private userService: UserService
  ) {
    this.userService.getAll({ order: { column: 'username', dir: 'asc'} })
      .subscribe(users => {
        this.users = users;
      });
  }

  changeAdmin(userId) {
    console.log('change: ' , userId);
    const user = this.users.find(u => u.id === userId);
    console.log('userobject', user);
    this.userService.update(userId, user).subscribe();
  }

  ngOnInit() {
  }

}
