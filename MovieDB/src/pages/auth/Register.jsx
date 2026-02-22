import { Button } from "@/components/ui/button";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";

export default function Register({ onSubmit }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Create Account</h2>

        <Input label="Full Name" placeholder="Your Name" />
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="" />

        <Button className="w-full" onClick={onSubmit}>
          Register
        </Button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}
