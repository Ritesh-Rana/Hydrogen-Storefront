import { useLoaderData } from '@remix-run/react';
import { MediaFile } from '@shopify/hydrogen';

export async function loader({ context }) {
  return await context.storefront.query(COLLECTIONS_QUERY);
}

export default function Index() {
  const collections = useLoaderData();
  // console.log(collections);

  const products = collections.products;

  // Create the table rows
  const tableRows = products.edges.map((edge) => {
    const product = edge.node;
    console.log(product.media.edges[0]);
    return (
      <tr key={product.handle}>
        <td>{product.title}</td>
        <td>{product.description}</td>
        <td>{product.productType}</td>
        <td>{product.handle}</td>
        <td><MediaFile data={product.media.edges[0].node} key={product.id} /></td>
        <td><img src={product.media.edges[0].node.image.url} alt={product.title} /></td>
      </tr>
    );
  });

  return (
    <div>
      <h2 className="text-center m-10">Products</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-8 text-left border-b border-gray-300">Title</th>
            <th className="p-8 text-left border-b border-gray-300">Description</th>
            <th className="p-8 text-left border-b border-gray-300">Product Type</th>
            <th className="p-8 text-left border-b border-gray-300">Handle</th>
            <th className="p-8 text-left border-b border-gray-300">Image by Component</th>
            <th className="p-8 text-left border-b border-gray-300">Simple Image</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
query Products {
  products(first: 5) {
    edges {
      node {
        id
        title
        description
        productType
        handle
        media(first: 1) {
          edges {
            node {
              __typename
              ... on MediaImage {
                mediaContentType
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
              ... on Video {
                mediaContentType
                id
                previewImage {
                  url
                }
                sources {
                  mimeType
                  url
                }
              }
              ... on ExternalVideo {
                mediaContentType
                id
                embedUrl
                host
              }
              ... on Model3d {
                mediaContentType
                id
                alt
                mediaContentType
                previewImage {
                  url
                }
                sources {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
