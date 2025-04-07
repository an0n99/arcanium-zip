// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "../../lib/firebaseConfig";
// import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User} from "firebase/auth";

// const provider = new GoogleAuthProvider();

// const Login: React.FC = () => {
//     const router = useRouter();
//     const [user, setUser] = useState<User | null>(null);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const getSerializableUser = (user: User) => ({
//         displayName: user.displayName,
//         email: user.email
//     });

//     const redirectToDashboard = (user: User) => {
//         const serizableUser = getSerializableUser(user);
//         router.push("/dashboard");
//     };

//     const handleLoginWithGoogle = () => {
//         signInWithPopup(auth, provider)
//             .then((result) => {
//                 setUser(result.user);
//                 redirectToDashboard(result.user);
//             })
//     };

//     const handleEmailLogin = (e: React.FormEvent) => {
//         e.preventDefault();
//         signInWithEmailAndPassword(auth, email, password)
//             .then((result) => {
//                 setUser(result.user);
//                 redirectToDashboard(result.user);
//             })
//             .catch((error) => {
//                 console.error("There was an error logging in with email: ", error);
//                 alert(error.message);
//             });
//     };

//     const handleEmailSignup = () => {
//         createUserWithEmailAndPassword(auth, email, password)
//             .then((result) => {
//                 setUser(result.user);
//                 redirectToDashboard(result.user);
//             })
//             .catch((error) => {
//                 console.error("Error signing up with email: ", error);
//                 alert(error.message);
//             });
//     };

//     useEffect(() => {
//         console.log(user);
//     }, [user])

//     return (
//         <>
//             <h1>hello world please work type hsi</h1>
//         </>
//     )
// }

// export default Login;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

const provider = new GoogleAuthProvider();

const Login: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getSerializableUser = (user: User) => ({
    displayName: user.displayName,
    email: user.email,
  });

  const redirectToDashboard = (user: User) => {
    const serizableUser = getSerializableUser(user);
    router.push("/dashboard");
  };

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        redirectToDashboard(result.user);
      })
      .catch((error) => {
        console.error("Google login error:", error);
        alert(error.message);
      });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
        redirectToDashboard(result.user);
      })
      .catch((error) => {
        console.error("Email login error:", error);
        alert(error.message);
      });
  };

  const handleEmailSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
        redirectToDashboard(result.user);
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert(error.message);
      });
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg border border-primary/10">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Login or create a new account to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Login with Email
            </Button>
          </form>

          <Button
            onClick={handleEmailSignup}
            variant="outline"
            className="w-full"
          >
            Create Account
          </Button>

          <Separator className="my-2" />

          <Button
            onClick={handleLoginWithGoogle}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-xs text-muted-foreground">
          Secure login powered by Firebase
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
