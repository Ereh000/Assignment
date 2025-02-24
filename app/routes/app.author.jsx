import {
    Page,
    Card,
    IndexTable,
    Link,
    Button,
    Text,
    Select,
    TextField,
  } from "@shopify/polaris";
  import { useLoaderData } from "@remix-run/react";
  import { useState } from "react";
  
  // Loader function to fetch authors from the API
  export const loader = async () => {
    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors`, {
      headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    const authors = await response.json();
    return authors;
  };
  
  // Authors component
  export default function Authors() {
    const authors = useLoaderData();
    console.log('authors->', authors)
  
    const [title, setTitle] = useState("");
  
    // Filter the books based on the title and genre
    const filteredBooks = authors.items.filter((author) => {
      const matchesTitle = author.first_name.toLowerCase().includes(title.toLowerCase());
      return matchesTitle;
    });
  
    // Define the rows for the IndexTable
    const rowMarkup = filteredBooks.map((author) => (
      <IndexTable.Row id={author.id} key={author.id}>
        <IndexTable.Cell>
          <Text fontWeight="bold">{author.id}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{`${author.first_name} ${author.last_name}`}</IndexTable.Cell>
        <IndexTable.Cell>{author.gender}</IndexTable.Cell>
        <IndexTable.Cell>{author.place_of_birth}</IndexTable.Cell>
        <IndexTable.Cell>
          <Link url={`/app/authors/${author.id}`}>View Author</Link>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button destructive>Delete</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ));
  
    return (
      <Page title="Authors">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form submission (since we're filtering locally)
            }}
          >
            <TextField
              label="Search Author"
              name="title"
              value={title}
              onChange={(value) => setTitle(value)}
              autoComplete="off"
            />
            {/* <Button submit>Filter</Button> */}
          </form>
        </Card>
  
        <Card>
          <IndexTable
            resourceName={{ singular: "author", plural: "authors" }}
            itemCount={authors.items.length}
            headings={[
              { title: "Author ID" },
              { title: "Author Name" },
              { title: "Gender" },
              { title: "Place of Birth" },
              { title: "Actions" },
              { title: "" }, // For the Delete button
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      </Page>
    );
  }