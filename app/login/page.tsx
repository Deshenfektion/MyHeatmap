import { login, signup } from "@/app/login/actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 border border-white">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-white shadow-sm focus:ring sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-white shadow-sm focus:ring sm:text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              formAction={login}
              className="w-full py-2 px-4 rounded-md border border-emerald-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Log in
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm">Don't have an account?</p>
            <button
              formAction={signup}
              className="mt-2 w-full py-2 px-4 rounded-md border border-emerald-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
