// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { items } = body;

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
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
        return NextResponse.json({ checkoutUrl: result.data.checkoutCreate.checkout.webUrl });
      } else {
        return NextResponse.json(
          {
            error: 'Checkout failed',
            details: result.data?.checkoutCreate?.userErrors,
          },
          { status: 400 }
        );
      }
    } catch (parseErr) {
      console.error('Failed to parse response as JSON:', text);
      return NextResponse.json({ error: 'Invalid JSON response from Shopify' }, { status: 500 });
    }
  } catch (err) {
    console.error('Checkout creation error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}