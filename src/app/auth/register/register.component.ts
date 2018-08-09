import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private aService: AuthService) { }


  onRegister(form: NgForm) {
    if (form.invalid) {
      alert('invalid');
      return;
    }

    this.aService.register(form.value.username, form.value.email, form.value.password);

  }
}
