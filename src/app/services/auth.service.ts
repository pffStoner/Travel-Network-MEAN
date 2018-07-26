import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    token: string;

constructor(private route: ActivatedRoute,
    private router: Router) {

    }

    register(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(
            error => console.log(error)
        );
    }

    login(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
            // vzimame token ot backedna i go prisvoqvame na nashata lokalna promenliva
            // poneje ni trqbva za da e izpolzvame izvun -then-
            response => {
                firebase.auth().currentUser.getIdToken()
                .then(
                    (token: string) => this.token = token
                );
            }
        )
        .catch(
            error => console.log(error)
        );
        // firebase.auth().onAuthStateChanged(function(user) {
        //     if (user) {
        //       // User is signed in.
        //       this.router.navigate(['/events']);

        //     } else {
        //       // No user is signed in.
        //             this.router.navigate(['/register']);

        //     }
        //   });
    }

    // iziskvame token koito da polzvame
    getToken() {
        // tuk otnova povotarqme stupkata s prisvoqvaneto, no ne chakame, a napravo vrushtame
        // nashiq prisvoen token ot logina
        // ima opasnast ot expire token, moje da se napravi nqkakuv error handler
         firebase.auth().currentUser.getIdToken()
        .then(
            (token: string) => this.token = token
        );
        return this.token;
    }
}
