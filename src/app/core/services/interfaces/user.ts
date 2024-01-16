export type Guest = {
  email: string;
  emailVerified: boolean;
  photoURL?: string;
};
export type FirebaseUser = firebase.default.User;
export type User = FirebaseUser | Guest;
export type FirebaseCredential = firebase.default.auth.UserCredential;
