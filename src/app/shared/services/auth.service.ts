import { Injectable } from '@angular/core';

import { StorageService, STORAGE_KEYS } from 'app/shared/services/storage.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { Promise, User } from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(private authFirebase: AngularFireAuth, private storage: StorageService) { }

  login(email: string, password: string): Promise<User> {
    return this.authFirebase.auth.signInWithEmailAndPassword(email, password);
  }

  isLogged(): boolean {
    return this.authFirebase.auth.currentUser !== null;
  }
}
