// app/routes/books/$id/edit.jsx
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
// import { error } from "console";
import { useState } from "react";

export const loader = async ({ params }) => {
  const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${params.id}`, {
    headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
  });
  const book = await response.json();
  return json({ book });
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  // const formData = formDataa;
  const authorId = formData.get("authorId");
  const title = formData.get("title");
  const description = formData.get("description");
  const isbn = formData.get("isbn");
  const publicationYear = formData.get("publicationYear");
  const format = formData.get("format");
  const no_of_pages = formData.get("no_of_pages");

  const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    body: JSON.stringify(
      {
        "author": {
          "id": authorId
        },
        "title": title,
        "release_date": publicationYear,
        "description": description,
        "isbn": isbn,
        "format": format,
        "number_of_pages": no_of_pages
      }
    ),
  });

  if (!response.ok) {
    return json({ error: "Failed to update book" }, { status: 500 });
  }

  return redirect(`/app/authors/${authorId}`);
};

export default function EditBook() {
  const { book } = useLoaderData();
  console.log('Edit Book ->', book);

  // const [formDataa, setFormDataa] = useState({
  //   title: book.title,
  //   description: book.description,
  //   isbn: book.isbn,
  //   no_of_pages: book.number_of_pages,
  //   publicationYear: book.release_date,
  //   format: book.format,
  //   authorId: book.author.id
  // });
  // console.log("formDataa ->", formDataa)

  return (
    <div>
      <h1>Add New Book</h1>
      <Form method="post">
        <label>
          Title:
          <input type="text" name="title" defaultValue={book.title} required />
        </label>
        <label>
          Description:
          <input type="text" name="description" defaultValue={book.description} required />
        </label>
        <label>
          Genre:
          <input type="text" name="isbn" defaultValue={book.isbn} required />
        </label>
        <label>
          No. of pages:
          <input type="number" name="no_of_pages" defaultValue={book.number_of_pages} required />
        </label>
        <label>
          Publication Year:
          <input type="text" name="publicationYear" defaultValue={book.release_date} required />
        </label>
        <label>
          Format:
          <input type="text" name="format" defaultValue={book.format} required />
        </label>
        <label>
          Author Id:
          <input type="number" name="authorId" defaultValue={book.author.id} required />
        </label>
        <button type="submit">Add Book</button>
      </Form>
    </div>
  );

  // return (
  //   <div>
  //     <h1>Edit Book</h1>
  //     <Form method="post">
  //       <label>
  //         Title:
  //         <input type="text" name="title" defaultValue={book.title} required />
  //       </label>
  //       <label>
  //         Genre:
  //         <input type="text" name="genre" defaultValue={book.format} required />
  //       </label>
  //       <label>
  //         Publication Year:
  //         <input type="text" name="publicationYear" defaultValue={book.release_date} required />
  //       </label>
  //       <button type="submit">Update</button>
  //     </Form>
  //   </div>
  // );
}