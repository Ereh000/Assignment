// app/routes/books/new.jsx
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async () => {
    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors`, {
        headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    const authors = await response.json();
    return json({ authors });
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const genre = formData.get("genre");
    const publicationYear = formData.get("publicationYear");
    const authorId = formData.get("authorId");
    const format = formData.get("format");
    const no_of_pages = formData.get("no_of_pages");

    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
        body: JSON.stringify(
            {
                "author": {
                    "id": authorId
                },
                "title": title,
                "release_date": publicationYear,
                "description": description,
                "isbn": genre,
                "format": format,
                "number_of_pages": 20
            }
        ),
    });

    if (!response.ok) {
        return json({ error: "Failed to add book" }, { status: 500 });
    }

    return redirect("/app/author");
};

export default function AddBook() {
    const { authors } = useLoaderData();
    console.log('book new - authors->', authors)

    return (
        <div>
            <h1>Add New Book</h1>
            <Form method="post">
                <label>
                    Title:
                    <input type="text" name="title" required />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" required />
                </label>
                <label>
                    Genre:
                    <input type="text" name="genre" required />
                </label>
                <label>
                    No. of pages:
                    <input type="number" name="no_of_pages" required />
                </label>
                <label>
                    Publication Year:
                    <input type="text" name="publicationYear" required />
                </label>
                <label>
                    Format:
                    <input type="text" name="format" required />
                </label>
                <label>
                    Author:
                    <select name="authorId" required>
                        <option value="">Select an author</option>
                        {authors.items.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.first_name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Add Book</button>
            </Form>
        </div>
    );
}