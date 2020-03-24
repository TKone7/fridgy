import { User } from './../../models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[];

  constructor(
    private userService: UserService
  ) { }

  changeAdmin(userId) {
    const user = this.users.find(u => u.uuid === userId);
    this.userService.update(userId, user).subscribe();
  }

  deleteUser(userId)  {
    if (!confirm('Are you sure you want to delete this user')) return;

    this.userService.delete(userId).subscribe(r => {
      this.users = this.users.filter(user => user.uuid !== userId);
    });

  }

  loadProducts() {
    this.userService.getAll({ order: { column: 'username', dir: 'asc'} })
      .subscribe(users => {
        this.users = users;
      });
  }

  ngOnInit() {
    this.loadProducts();
  }

}
