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
  
      // Redirect to the dashboard and store the token in cookies
      return redirect("/app", {
        headers: { "Set-Cookie": `token=${token_key}; HttpOnly; Path=/;` },
      });
    } catch (error) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  }
  
  // Login component -
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