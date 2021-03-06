import { AfterViewChecked, Component, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';

import { FormValidator } from '../../shared/services/formValidator.service';

import { PasswordToggleComponent } from '../../shared/components/password-toggle/password-toggle.component';

import { Email } from 'types/email';
import { PostalCode } from 'types/postalcode';
import { Phone } from 'types/phone';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../child.component.scss']
})
export class RegisterComponent implements AfterViewChecked {
  @ViewChild(PasswordToggleComponent)
  toggler: PasswordToggleComponent;

  @ViewChild(NgForm)
  form: NgForm;

  name: string;
  email: string;
  password: string;
  postalcode: string;
  phone: string;

  validator: FormValidator;
  private messages = {
    'email': {
      'pattern': 'Email inválido'
    },
    'postalcode': {
      'pattern': 'CEP inválido'
    },
    'phone': {
      'pattern': 'Celular inválido'
    },
    'password': {
      'minlength': 'Mínimo de 6 caracteres'
    }
  };
  private error = {
    'email': '',
    'postalcode': '',
    'phone': '',
    'password': ''
  };

  private service: AuthService;
  private snackbar: MatSnackBar;
  private loader: LoaderService;
  private router: Router;

  constructor(service: AuthService, snackbar: MatSnackBar, router: Router) {
    this.service = service;
    this.snackbar = snackbar;
    this.loader = LoaderService.getInstance();
    this.router = router;

    this.validator = new FormValidator(this.form, this.messages, this.error);
  }

  ngAfterViewChecked(): void {
    this.validator.updateForm(this.form);
  }

  register(): void {
    if (!this.form.valid) return;

    this.loader.setState(true);

    let email = new Email(this.email);
    let postalcode = new PostalCode(this.postalcode);
    let phone = new Phone(this.phone);

    let self = this;
    this.service.register(this.name, email, this.password, postalcode, phone).then(function registered() {
      self.loader.setState(false);

      self.reset();
      self.snackbar.open('Registro efetuado! Um email de confirmação foi enviado.', undefined, {
        duration: 2000
      });
      self.router.navigate(['/home']);
    }, function error(error) {
      self.loader.setState(false);

      self.snackbar.open(error.message, undefined, {
        duration: 2000
      });
    });
  }

  private reset(): void {
    this.form.resetForm();
  }
}
