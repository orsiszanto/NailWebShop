import { Injectable } from '@angular/core';
import { firebaseApp } from './firebase.config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly app = firebaseApp;
  readonly auth = getAuth(firebaseApp);
  readonly firestore = getFirestore(firebaseApp);
}