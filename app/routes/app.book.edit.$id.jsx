import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
} from "@shopify/polaris";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { title } from "process";

// Loader function to fetch book details
export const loader = async ({ params }) => {
  const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${params.id}`, {
    headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
  });
  const book = await response.json();
  return json({ book });
};

// Action function to handle book updates
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const authorId = formData.get("authorId");
  const title = formData.get("title");
  const description = formData.get("description");
  const isbn = formData.get("isbn");
  const publicationYear = formData.get("publicationYear");
  const format = formData.get("format");

  const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    body: JSON.stringify({
      // author: { id: authorId },
      title,
      release_date: publicationYear,
      description,
      isbn,
      format,
    }),
  });

  if (!response.ok) {
    return json({ error: "Failed to update book" }, { status: 500 });
  }

  // return redirect(`/app/authors/1034`);    
  return redirect(`/app/authors/${authorId}`);
};

// EditBook component
export default function EditBook() {
  const { book } = useLoaderData();
  console.log('book->', book)

  const [formDetails, setFormDetails] = useState({
    title: book.title,
    description: book.description,
    isbn: book.isbn,
    publicationYear: book.release_date,
    format: book.format,
    authorId: book.id
  })

  const handleOnChange = (newValue) => {
    setFormDetails(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  return (
    <Page title="Edit Book">
      <Card sectioned>
        <Form method="post">
          <FormLayout>
            {/* Title Field */}
            <TextField
              label="Title"
              name="title"
              value={formDetails.title}
              onChange={handleOnChange}
              defaultValue={book?.title}
              autoComplete="off"
              required
            />

            {/* Description Field */}
            <TextField
              label="Description"
              name="description"
              defaultValue={book?.description}
              value={formDetails.description}
              onChange={handleOnChange}
              autoComplete="off"
              required
            />

            {/* ISBN Field */}
            <TextField
              label="ISBN"
              name="isbn"
              defaultValue={book?.isbn}
              value={formDetails.isbn}
              onChange={handleOnChange}
              autoComplete="off"
              required
            />

            {/* Publication Year Field */}
            <TextField
              label="Publication Year"
              name="publicationYear"
              type="number"
              // defaultValue={book?.release_date}
              value={formDetails.release_date}
              onChange={handleOnChange}
              autoComplete="off"
              required
            />

            {/* Format Field */}
            <TextField
              label="Format"
              name="format"
              defaultValue={book?.format}
              value={formDetails.format}
              onChange={handleOnChange}
              autoComplete="off"
              required
            />

            {/* Author ID Field */}
            <TextField
              label="Author ID"
              name="authorId"
              type="number"
              value={formDetails.authorId}
              onChange={handleOnChange}
              defaultValue={book?.author?.id}
              autoComplete="off"
              required
            />

            {/* Submit Button */}
            <Button submit primary>
              Update Book
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}