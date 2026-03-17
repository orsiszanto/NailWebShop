import { Injectable } from '@angular/core';
import { auth, firestore, firebaseApp } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly app = firebaseApp;
  readonly auth = auth;
  readonly firestore = firestore;
}