// lib/facebook-pixel.ts - Facebook Pixel Integration

export const FB_PIXEL_ID = '1208706057865403';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track custom events
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

// E-commerce events
export const trackViewContent = (productId: string, productName: string, price: number, currency = 'USD') => {
  event('ViewContent', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: currency,
  });
};

export const trackAddToCart = (productId: string, productName: string, price: number, quantity = 1, currency = 'USD') => {
  event('AddToCart', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price * quantity,
    currency: currency,
    num_items: quantity,
  });
};

export const trackInitiateCheckout = (value: number, items: any[], currency = 'USD') => {
  event('InitiateCheckout', {
    value: value,
    currency: currency,
    num_items: items.length,
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity,
    })),
  });
};

export const trackPurchase = (value: number, orderId: string, items: any[], currency = 'USD') => {
  event('Purchase', {
    value: value,
    currency: currency,
    transaction_id: orderId,
    num_items: items.length,
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity,
    })),
  });
};

export const trackSearch = (searchString: string) => {
  event('Search', {
    search_string: searchString,
  });
};

export const trackLead = (contentName?: string) => {
  event('Lead', {
    content_name: contentName || 'Newsletter Signup',
  });
};