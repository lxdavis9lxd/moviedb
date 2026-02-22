import { Button } from "@/components/ui/button";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";

export default function Login({ onSubmit }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Sign In</h2>

        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />

        <Button className="w-full" onClick={onSubmit}>
          Sign In
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </Card>
    </div>
  );
}