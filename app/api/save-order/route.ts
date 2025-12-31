// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';
import { allItems } from '../../../src/components/allItems';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      billingInfo,
      shippingInfo,
      cartItems,
      shippingMethod,
      shippingZone,
      shippingRate,
      email,
      orderId,
    } = body;

    if (!billingInfo || !cartItems || !email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;
    
    // ✅ เช็คว่าเป็น digital only หรือไม่
    const isDigitalOnly = cartItems.every((cartItem: any) => {
      const product = allItems.find(p => p.id === cartItem.id);
      if (!product) {
        console.warn('[⚠️ NOT FOUND IN allItems]', cartItem.id);
        return false;
      }
      return product.type === 'digital';
    });

    const amount = Math.round(
      cartItems.reduce((total: number, cartItem: any) => {
        const product = allItems.find((p) => p.id === cartItem.id);
        if (!product) return total;
        const price =
          typeof product.price === 'number' ? product.price : product.price.sale;
        return total + price;
      }, 0) * 100
    );

    // 🆕 ไม่สร้าง tracking ปลอมอีกต่อไป!
    let shipmentResult: {
      tracking_number: string | null;
      courier: string | null;
      tracking_url: string | null;
      estimated_delivery: string | null;
      label_url: string | null;
    };

    // ✅ ถ้าเป็น physical items
    if (!isDigitalOnly) {
      if (!shippingMethod || !shippingZone) {
        return NextResponse.json(
          { error: 'Missing shipping info for physical items.' },
          { status: 400 }
        );
      }

      shipmentResult = {
        tracking_number: null,
        courier: 'dhl',
        tracking_url: null,
        estimated_delivery: null,
        label_url: null,
      };
      
      console.log('[📦 Physical order - will need manual shipping]');
    } else {
      // ✅ Digital order
      shipmentResult = {
        tracking_number: null,
        courier: null,
        tracking_url: null,
        estimated_delivery: null,
        label_url: null,
      };
    }

    const updateData = {
      billing_info: billingInfo,
      shipping_info: shippingInfo || null,
      shipping_method: isDigitalOnly ? null : shippingMethod,
      shipping_zone: isDigitalOnly ? null : shippingZone,
      shipping_rate: isDigitalOnly ? null : shippingRate || 0,
      tracking_number: shipmentResult.tracking_number,
      courier: shipmentResult.courier,
      tracking_url: shipmentResult.tracking_url,
      estimated_delivery: shipmentResult.estimated_delivery,
      label_url: shipmentResult.label_url,
      amount,
      status: isDigitalOnly ? 'paid' : 'pending_shipment',
    };

    console.log('[📦 Updating order in Supabase]', updateData);

    const { error } = await supabase
      .from('Orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('❌ Supabase update error:', error.message);
      return NextResponse.json({ error: 'Failed to update order in DB' }, { status: 500 });
    }

    console.log('✅ Order saved successfully:', {
      orderId,
      isDigitalOnly,
      status: isDigitalOnly ? 'paid' : 'pending_shipment'
    });

    return NextResponse.json({
      success: true,
      tracking: shipmentResult,
      orderId,
    });
  } catch (err: any) {
    console.error('🔥 Unexpected error in save-order:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}