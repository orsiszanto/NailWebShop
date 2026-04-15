import { Injectable, inject } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { firebaseApp } from '../firebase/firebase.config';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { Observable, from, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = getAuth(firebaseApp);
  private readonly firestore = getFirestore(firebaseApp);
  /**
   * Register új felhasználót Firebase-ben és Firestore-ban
   * @param email Felhasználó email
   * @param password Jelszó (minimum 6 karakter)
   * @param displayName Felhasználó neve
   * @returns Promise<void>
   */
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    try {
      // 1. Firebase Auth felhasználó létrehozása
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // 2. Felhasználó adatok tárolása Firestore-ban
      await setDoc(doc(this.firestore, 'users', firebaseUser.uid), {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: displayName,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3. Kijelentkeztetjük az automatikusan bejelentkeztetett felhasználót
      // (createUserWithEmailAndPassword automatikusan bejelentkeztet)
      await signOut(this.auth);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Login a felhasználó
   * @param email Felhasználó email
   * @param password Jelszó
   * @returns Promise<FirebaseUser | null>
   */
  async login(email: string, password: string): Promise<FirebaseUser | null> {
    try {
      // Session persistence beállítása
      await setPersistence(this.auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return userCredential.user;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Logout a jelenlegi felhasználó
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Jelenlegi bejelentkezett felhasználó Observable-ként
   * Betölti a Firestore-ból a teljes felhasználó adatokat (name, role, stb.)
   * @returns Observable<User | null>
   */
  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (firebaseUser) => {
        if (!firebaseUser) {
          observer.next(null);
          return;
        }

        // Firestore-ból betöltjük a teljes user adatokat
        try {
          const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            observer.next(userData);
          } else {
            // Ha nincs Firestore doc, null-t visszaadunk (hiba esete)
            observer.next(null);
          }
        } catch (error) {
          console.error('Hiba a felhasználó adatok betöltésénél:', error);
          observer.next(null);
        }
      });

      return () => unsubscribe();
    });
  }

  /**
   * Firebase hibaüzenetek lefordítása magyar nyelvre
   * @param error Firebase error object
   * @returns Error message string
   */
  private mapFirebaseError(error: { code?: string; message?: string }): Error {
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use':
        'Ez az e-mail cím már regisztrálva van. Próbáld a bejelentkezést!',
      'auth/invalid-email': 'Érvénytelen e-mail cím.',
      'auth/weak-password': 'A jelszó túl gyenge. Használj minimum 6 karaktert.',
      'auth/user-not-found': 'Felhasználó nem található. Regisztrálj először!',
      'auth/wrong-password': 'Helytelen jelszó. Próbáld újra!',
      'auth/too-many-requests':
        'Túl sok bejelentkezési kísérlet. Próbáld később!',
      'auth/network-request-failed':
        'Hálózati hiba. Ellenőrizd az internetkapcsolatodat!',
      'auth/invalid-credential': 'Helytelen email vagy jelszó.',
      'auth/operation-not-allowed': 'Ez a művelettípus nem engedélyezett.',
    };

    const message =
      errorMap[error.code || ''] || error.message || 'Ismeretlen hiba történt.';
    return new Error(message);
  }

  /**
   * Email cím frissítése  
   * @param newEmail Új email cím
   * @returns Promise<void>
   */
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Nincs bejelentkezett felhasználó.');
      }

      // 1. Firebase Auth email frissítése
      await updateEmail(currentUser, newEmail);

      // 2. Firestore dokumentum frissítése
      await updateDoc(doc(this.firestore, 'users', currentUser.uid), {
        email: newEmail,
        updatedAt: new Date(),
      });

      // 3. Verifikációs email küldése
      await sendEmailVerification(currentUser);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Jelszó frissítése
   * @param newPassword Új jelszó (minimum 6 karakter)
   * @returns Promise<void>
   */
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Nincs bejelentkezett felhasználó.');
      }

      // Firebase Auth jelszó frissítése
      await updatePassword(currentUser, newPassword);

      // Firestore dokumentum updatedAt frissítése
      await updateDoc(doc(this.firestore, 'users', currentUser.uid), {
        updatedAt: new Date(),
      });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Jelszó reset email küldése
   * @param email Email cím ahová a reset link megy
   * @returns Promise<void>
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Email verifikációs email küldése az aktuális felhasználónak
   * @returns Promise<void>
   */
  async sendVerification(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Nincs bejelentkezett felhasználó.');
      }

      await sendEmailVerification(currentUser);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }

  /**
   * Felhasználó fiók törlése: Firebase Auth + Firestore
   * Jelszó megerősítés szükséges (reauthenticate)
   * @param password Felhasználó jelszava az ujrahitelesítéshez
   * @returns Promise<void>
   */
  async deleteAccount(password: string): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('Nincs bejelentkezett felhasználó.');
      }

      // 1. Ujrahitelesítés a jelszóval (biztonsági oka)
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Firestore dokumentum törlése
      await deleteDoc(doc(this.firestore, 'users', currentUser.uid));

      // 3. Firebase Auth felhasználó törlése
      await deleteUser(currentUser);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      throw this.mapFirebaseError(err);
    }
  }
}
