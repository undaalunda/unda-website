import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    const lineItems = items.map((item: any) => {
      const rawVariantId = item.variantId || item.variant_id;

      if (!rawVariantId) {
        console.warn('⚠️ Missing variantId on item:', item);
        throw new Error('Missing variantId on one or more items.');
      }

      const isGID = rawVariantId.startsWith('gid://shopify/ProductVariant/');
      const finalVariantId = isGID ? rawVariantId : `gid://shopify/ProductVariant/${rawVariantId}`;

      return {
        variantId: finalVariantId,
        quantity: item.quantity,
      };
    });

    const query = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    const variables: { input: { lineItems: { variantId: string; quantity: number }[] } } = {
      input: {
        lineItems: lineItems,
      },
    };

    const payload = JSON.stringify({ query, variables });

    console.log('📦 Sending payload to Shopify:', payload);

    const shopifyRes = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: payload,
    });

    const result = await shopifyRes.json();

    console.log('🧪 Shopify response:', JSON.stringify(result, null, 2));

    const checkout = result?.data?.checkoutCreate?.checkout;
    const errors = result?.data?.checkoutCreate?.checkoutUserErrors;

    if (checkout?.webUrl) {
      return NextResponse.json({ checkoutUrl: checkout.webUrl });
    }

    console.error('❌ Shopify checkoutUserErrors:', errors);
    return NextResponse.json({ error: 'Checkout failed', details: errors ?? [] }, { status: 400 });
  } catch (err: any) {
    console.error('🔥 Internal Error:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}