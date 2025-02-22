import { Link, useLoaderData } from "@remix-run/react";

export const loader = async () => {
    const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors`, {
        headers: { Authorization: `Bearer e1ea929642a5215f004ce10e612e71722cec8022d5e6afca37af5c56442634e3768a11c9ce047765` },
    });
    const authors = await response.json();
    return authors;
};

export default function Authors() {
    const authors = useLoaderData();
    console.log(authors)
    return (
        <table>
            <thead>
                <tr>
                    <th>Author Id</th>
                    <th>Author Name</th>
                    <th>Author Gender</th>
                    <th>Author Birth date</th>
                </tr>
            </thead>
            <tbody>
                {authors.items.map((author) => (
                    <tr key={author.id}>
                        <td>{author.id}</td>
                        <td>{author.first_name} {author.last_name}</td>
                        <td>{author.gender}</td>
                        <td>{author.place_of_birth}</td>
                        <td><Link to={`/app/authors/${author.id}`}>View Author</Link></td>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}