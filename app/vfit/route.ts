import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  try {
    const response = await fetch('https://dsru466g0fylrq-5000.proxy.runpod.net/try_dual', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer rpa_Y7FQEAI7I34VOTQRGSZY38CG812HKYRQDNX8TGED6zui22'
      }
    });

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to proxy request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
