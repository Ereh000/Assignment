import {
    Page,
    Card,
    IndexTable,
    Link,
    Button,
    Text,
    Banner,
  } from "@shopify/polaris";
  import { Form, useLoaderData, useActionData } from "@remix-run/react";
  import { json, redirect } from "@remix-run/node";
  
  // Loader function to fetch author details and associated books
  export const loader = async ({ params }) => {
    const authorId = params.id;
    // const authorId = 360;
  
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
  
  // Action function to handle book deletion
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
  
    return redirect(`/app/authors/${params.id}`);
  };
  
  // AuthorDetail component
  export default function AuthorDetail() {
    const { author, books } = useLoaderData();
    console.log('author->', author)
    const actionData = useActionData();
  
    // Define the rows for the IndexTable
    const rowMarkup = books.items.map((book) => (
      <IndexTable.Row id={book.id} key={book.id}>
        <IndexTable.Cell>
          <Text fontWeight="bold">{book.id}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{book.title}</IndexTable.Cell>
        <IndexTable.Cell>{book.format}</IndexTable.Cell>
        <IndexTable.Cell>{book.release_date}</IndexTable.Cell>
        <IndexTable.Cell>{book.number_of_pages}</IndexTable.Cell>
        <IndexTable.Cell>
          <Link url={`/app/book/edit/${book.id}`}>Edit</Link>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Form method="delete">
            <input type="hidden" name="bookId" value={book.id} />
            <Button submit destructive>
              Delete
            </Button>
          </Form>
        </IndexTable.Cell>
      </IndexTable.Row>
    ));
  
    return (
      <Page title={`Author:`}>
        <Card sectioned>
          <Text variant="headingMd" as="h1">
            {author.first_name}
          </Text>
          {/* <p>Book Count: {author.bookCount}</p> */}
  
          {actionData?.error && (
            <Banner status="critical">{actionData.error}</Banner>
          )}
  
          <IndexTable
            resourceName={{ singular: "book", plural: "books" }}
            itemCount={books.items.length}
            headings={[
              { title: "ID" },
              { title: "Title" },
              { title: "Format" },
              { title: "Released Date" },
              { title: "No. of Pages" },
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