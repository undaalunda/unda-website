// /pages/api/create-checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items' });
  }

  try {
    const lineItems = items.map((item: any) => ({
      variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
      quantity: item.quantity,
    }));

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation checkoutCreate($input: CheckoutCreateInput!) {
            checkoutCreate(input: $input) {
              checkout {
                id
                webUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            lineItems,
          },
        },
      }),
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text);

      if (result.data?.checkoutCreate?.checkout?.webUrl) {
        return res.status(200).json({ checkoutUrl: result.data.checkoutCreate.checkout.webUrl });
      } else {
        return res.status(400).json({
          error: 'Checkout failed',
          details: result.data?.checkoutCreate?.userErrors,
        });
      }
    } catch (parseErr) {
      console.error('Failed to parse response as JSON:', text);
      return res.status(500).json({ error: 'Invalid JSON response from Shopify' });
    }
  } catch (err) {
    console.error('Checkout creation error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}