import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserValidators } from './user.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, UserValidators.cannotContainSpace], UserValidators.mustBeUnique(this.userService)],
      displayname: [''],
      email: ['', Validators.required, UserValidators.emailMustBeUnique(this.userService)],
      pwd: this.fb.group({
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required]
      }, { validators: UserValidators.newPwdEqual })
    });
  }

  get username() {
    return this.form.get('username');
  }
  get displayname() {
    return this.form.get('displayname');
  }
  get email() {
    return this.form.get('email');
  }
  get pwd() {
    return this.form.get(['pwd']) as FormGroup;
  }
  get password() {
    return this.pwd.get(['password']);
  }
  get passwordRepeat() {
    return this.pwd.get(['passwordRepeat']);
  }

  ngOnInit() {
  }

  register() {
    let user = {
      username: this.username.value,
      email: this.email.value,
      displayname: this.displayname.value,
      password: this.password.value
    };
    console.log(this.form);
    this.userService.create(user)
      .subscribe(r => this.router.navigate(['/login'])
      );
  }
}
