import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  try {
    const response = await fetch('https://7njlzqz8mkmnxi-5000.proxy.runpod.net/try_dual', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer rpa_C2OMPENESTKX3UI7S1HQJPVUMSKIZZYMPS9SMJJEpuh0gn'
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
