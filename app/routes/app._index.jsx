// app/routes/books/index.jsx
import { useState } from "react";
import { Page, Card, TextField, Select, Button, DataTable } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }) => {
  const authorId = params.id;

  // Fetch author details
  // const authorResponse = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors/${authorId}`, {
  //     headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
  // });
  // if (!authorResponse.ok) throw new Error("Author not found");

  // Fetch associated books
  const booksResponse = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books`, {
    headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
  });
  if (!booksResponse.ok) throw new Error("Books not found");

  // const [author, books] = await Promise.all([authorResponse.json(), booksResponse.json()]);
  // return json({ author, books });
  // const [books] = await Promise.all([booksResponse.json()]);
  const books = await booksResponse.json();
  return books;
};

// Static dataset (replace this with your actual data)
// const staticBooks = [
//   { title: "Book 1", genre: "fiction", publicationYear: 2020 },
//   { title: "Book 2", genre: "non-fiction", publicationYear: 2019 },
//   { title: "Book 3", genre: "fiction", publicationYear: 2021 },
//   { title: "Book 4", genre: "non-fiction", publicationYear: 2018 },
//   { title: "Book 5", genre: "fiction", publicationYear: 2022 },
// ];

export default function Books() {
  const books = useLoaderData();
  console.log('books->', books)

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  // Filter the books based on the title and genre
  const filteredBooks = books.items.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(title.toLowerCase());
    const matchesGenre = genre === "" || book.isbn === genre;
    return matchesTitle && matchesGenre;
  });

  // Extract unique genres from the dataset
  const uniqueGenres = [...new Set(books.items.map((book) => book.isbn))];

  // Generate dynamic options for the Select component
  const genreOptions = [
    { label: "All", value: "" }, // Default option
    ...uniqueGenres.map((genre) => ({
      label: genre.charAt(0).toUpperCase() + genre.slice(1), // Capitalize the first letter
      value: genre,
    })),
  ];

  return (
    <Page title="Books">
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission (since we're filtering locally)
          }}
        >
          <TextField
            label="Title"
            name="title"
            value={title}
            onChange={(value) => setTitle(value)}
            autoComplete="off"
          />
          <Select
            label="Genre"
            name="genre"
            options={genreOptions}
            value={genre}
            onChange={(value) => setGenre(value)}
          />
          <Button submit>Filter</Button>
        </form>
      </Card>

      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric"]}
          headings={["Title", "Genre", "Publication Year"]}
          rows={filteredBooks.map((book) => [
            book.title,
            book.isbn,
            book.release_date,
          ])}
        />
      </Card>
    </Page>
  );
}