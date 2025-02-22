// app/routes/authors/$id.jsx
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";

export const loader = async ({ params }) => {
    const authorId = params.id;

    // Fetch author details
    const authorResponse = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors/${authorId}`, {
        headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    if (!authorResponse.ok) throw new Error("Author not found");

    // Fetch associated books
    const booksResponse = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books?authorId=${authorId}`, {
        headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    if (!booksResponse.ok) throw new Error("Books not found");

    const [author, books] = await Promise.all([authorResponse.json(), booksResponse.json()]);
    return json({ author, books });
};

export const action = async ({ request, params }) => {
    const formData = await request.formData();
    const bookId = formData.get("bookId");

    // Delete the book
    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });

    if (!response.ok) {
        return json({ error: "Failed to delete book" }, { status: 500 });
    }

    return redirect(`/authors/${params.id}`);
};

export default function AuthorDetail() {
    const { author, books } = useLoaderData();
    console.log('author $id - author->', author);
    console.log('author $id - books->', books);

    return (
        <div>
            <h1>{author.name}</h1>
            <p>Book Count: {author.bookCount}</p>

            <h2>Books</h2>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Format</th>
                        <th>Released Date</th>
                        <th>No. of pages</th>
                    </tr>
                </thead>
                <tbody>
                    {books.items.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.format}</td>
                            <td>{book.release_date}</td>
                            <td>{book.number_of_pages}</td>
                            <td>
                                <Link to={`/app/book/edit/${book.id}`}>Edit</Link>
                            </td>
                            <td>
                                <Form method="post">
                                    <input type="hidden" name="bookId" value={book.id} />
                                    <button type="submit">Delete</button>
                                </Form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}