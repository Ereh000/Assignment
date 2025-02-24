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
  
  // Loader function to fetch authors for the dropdown
  export const loader = async () => {
    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors`, {
      headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    const authors = await response.json();
    return json({ authors });
  };
  
  // Action function to handle adding a new book
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
      body: JSON.stringify({
        author: { id: authorId },
        title,
        release_date: publicationYear,
        description,
        isbn: genre,
        format,
        number_of_pages: parseInt(no_of_pages, 10), // Ensure it's an integer
      }),
    });
  
    if (!response.ok) {
      return json({ error: "Failed to add book" }, { status: 500 });
    }
  
    return redirect("/app/author");
  };
  
  // AddBook component
  export default function AddBook() {
    const { authors } = useLoaderData();
    console.log('authors->', authors);
  
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [format, setFormat] = useState("");
    const [noOfPages, setNoOfPages] = useState("");
    const [authorId, setAuthorId] = useState("");
  
    // Debugging: Check if authors.items exists and log the options
    const authorOptions = authors?.items?.map((author) => ({
      label: `${author.first_name} ${author.last_name}`,
      value: author.id,
    })) || [];
  
    console.log('Author Options:', authorOptions);
  
    return (
      <Page title="Add New Book">
        <Card sectioned>
          <Form method="post">
            <FormLayout>
              {/* Title Field */}
              <TextField
                label="Title"
                name="title"
                value={title}
                onChange={(newValue) => setTitle(newValue)}
                required
              />
              {/* Description Field */}
              <TextField
                label="Description"
                name="description"
                value={description}
                onChange={(newValue) => setDescription(newValue)}
                required
              />
              {/* Genre Field */}
              <TextField
                label="Genre"
                name="genre"
                value={genre}
                onChange={(newValue) => setGenre(newValue)}
                required
              />
              {/* Number of Pages Field */}
              <TextField
                label="Number of Pages"
                name="no_of_pages"
                type="number"
                value={noOfPages}
                onChange={(newValue) => setNoOfPages(newValue)}
                required
              />
              {/* Publication Year Field */}
              <TextField
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={releaseDate}
                onChange={(newValue) => setReleaseDate(newValue)}
                required
              />
              {/* Format Field */}
              <TextField
                label="Format"
                name="format"
                value={format}
                onChange={(newValue) => setFormat(newValue)}
                required
              />
              {/* Author Dropdown */}
              <Select
                label="Author"
                name="authorId"
                value={authorId}
                options={[
                  { label: "Select an author", value: "" },
                  ...authorOptions,
                ]}
                onChange={(value) => setAuthorId(value)}
                required
              />
              {/* Submit Button */}
              <Button submit primary>
                Add Book
              </Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    );
  }