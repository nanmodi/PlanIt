import { useState } from "react";
import { signInWithGoogle, auth, logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  // 🔹 Detect user login state
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {user ? "Welcome, " + user.displayName : isLogin ? "Login" : "Sign Up"}
        </h2>

        {user ? (
          <>
            <p className="text-center text-gray-600">You're logged in as {user.email}</p>
            <button
              onClick={logout}
              className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <form className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <button
              onClick={signInWithGoogle}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
