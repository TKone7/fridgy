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
  ) { }

  changeAdmin(userId) {
    const user = this.users.find(u => u.id === userId);
    this.userService.update(userId, user).subscribe();
  }

  deleteUser(userId)  {
    if (!confirm('Are you sure you want to delete this user')) return;

    this.userService.delete(userId).subscribe(r => {
      this.users = this.users.filter(user => user.id !== userId);
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
