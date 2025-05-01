// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    console.log('🧪 items:', items);

    const lineItems = items.map((item: any) => ({
      variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
      quantity: item.quantity,
    }));

    console.log('🧪 lineItems:', lineItems);

    const query = `
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
    `;

    const variables = {
      input: {
        lineItems,
      },
    };

    const shopifyRes = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await shopifyRes.json();

    console.log('🧪 Shopify raw response:', JSON.stringify(result, null, 2));

    if (result.data?.checkoutCreate?.checkout?.webUrl) {
      return NextResponse.json({ checkoutUrl: result.data.checkoutCreate.checkout.webUrl });
    } else {
      console.error('🧨 userErrors:', result.data?.checkoutCreate?.userErrors);
      return NextResponse.json(
        {
          error: 'Checkout failed',
          details: result.data?.checkoutCreate?.userErrors,
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('🔥 Internal Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}