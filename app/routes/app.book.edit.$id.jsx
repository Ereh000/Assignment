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
// import { title } from "process";

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
      title: title,
      release_date: publicationYear,
      description: description,
      isbn: isbn,
      format: format,
    }),
  });

  if (!response.ok) {
    return json({ error: "Failed to update book" }, { status: 500 });
  }

  // return redirect(`/app/authors/349`);
  return redirect(`/app/authors/${authorId}`);
};

// EditBook component
export default function EditBook() {
  const { book } = useLoaderData();
  console.log('book->', book)

  // const [formDetails, setFormDetails] = useState({
  //   title: book.title,
  //   description: book.description,
  //   isbn: book.isbn,
  //   publicationYear: book.release_date,
  //   format: book.format,
  //   authorId: book.authorId
  // })
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description);
  const [isbn, setIsbn] = useState(book.isbn);
  const [releaseDate, setReleaseDate] = useState(book.releaseDate);
  const [format, setFormat] = useState(book.format);
  const [authorId, setAuthorId] = useState(book.author.id);

  // const handleOnChange = (newValue) => {
  //   setFormDetails(prevState => ({
  //     ...prevState,
  //     [name]: newValue
  //   }));
  // };

  return (
    <Page title="Edit Book">
      <Card sectioned>
        <Form method="post">
          <FormLayout>

            <input type="hidden" name="authorId"
              value={authorId}
              onChange={(newValue) => setAuthorId(newValue)}
            />
            
            {/* Title Field */}
            <TextField
              label="Title"
              name="title"
              value={title}
              onChange={(newValue) => setTitle(newValue)}
              // defaultValue={book?.title}
              autoComplete="off"
              required
            />

            {/* Description Field */}
            <TextField
              label="Description"
              name="description"
              // defaultValue={book?.description}
              value={description}
              onChange={(newValue) => setDescription(newValue)}
              autoComplete="off"
              required
            />

            {/* ISBN Field */}
            <TextField
              label="ISBN"
              name="isbn"
              // defaultValue={book?.isbn}
              value={isbn}
              onChange={(newValue) => setIsbn(newValue)}
              autoComplete="off"
              required
            />

            {/* Publication Year Field */}
            <TextField
              label="Publication Year"
              name="publicationYear"
              type="number"
              // defaultValue={book?.release_date}
              value={releaseDate}
              onChange={(newValue) => setReleaseDate(newValue)}
              autoComplete="off"
              required
            />

            {/* Format Field */}
            <TextField
              label="Format"
              name="format"
              // defaultValue={book?.format}
              value={format}
              onChange={(newValue) => setFormat(newValue)}
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