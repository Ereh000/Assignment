import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
} from "@shopify/polaris";
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { createCookieSessionStorage } from "@remix-run/node";

// Create session storage for managing cookies
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production", // Only set to true in production (HTTPS)
    secrets: ["your-secret-key"], // Replace with a real secret key
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
});

// Loader function to check if the user is already logged in
export async function loader({ request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const token = session.get("token");

  console.log("Token from session:", token); // Debugging: Log the token

  // If the user has a token, redirect them to the dashboard
  if (token) {
    return redirect("/app");
  }

  // Otherwise, show the login page
  return null;
}

// Action function to handle login
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { token_key } = await response.json();

    // Create a new session and store the token in the session
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    session.set("token", token_key);

    console.log("Token stored in session:", token_key); // Debugging: Log the token

    // Redirect to the dashboard and set the session cookie
    return redirect("/app", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
}

// Login component
export default function Login() {
  const actionData = useActionData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Page title="Login">
      <Card sectioned>
        <Form method="post">
          <FormLayout>
            {/* Display error message if login fails */}
            {actionData?.error && (
              <Banner status="critical">{actionData.error}</Banner>
            )}

            {/* Email Field */}
            <TextField
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(newValue) => setEmail(newValue)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <TextField
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(newValue) => setPassword(newValue)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {/* Submit Button */}
            <Button submit primary>
              Login
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}