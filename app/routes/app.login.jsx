import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
// import axios from "axios";

export async function action({ request }) {

    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "password": password
            }),
        });
        const { token_key } = await response.json();

        // console.log('tokeN', token_key) ----------------

        if (!response.ok) {
            return json({ error: "Invalid credentials" }, { status: 401 });
        }
        return redirect("/app/additional", {
            // Store token in cookies
            headers: { "Set-Cookie": `token=${token_key}; HttpOnly; Path=/;` },
        });

    } catch (error) {
        return json({ error: "Invalid credentials" }, { status: 401 });
    }
}

export default function Login() {
    const actionData = useActionData();

    return (
        <div>
            <h1>Login</h1>
            <Form method="post">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
                {actionData?.error && <p>{actionData.error}</p>}
            </Form>
        </div>
    );
}
