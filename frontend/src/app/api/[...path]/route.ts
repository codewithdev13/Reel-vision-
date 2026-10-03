import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetPath = `/api/${path.join('/')}`;
  const targetUrl = new URL(targetPath, BACKEND_URL);
  
  // Forward search params
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers(req.headers);
  // Remove host header so backend receives its own host
  headers.delete('host');

  const method = req.method;
  const body = ['GET', 'HEAD'].includes(method) ? undefined : await req.arrayBuffer();

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      redirect: 'manual',
    });

    const responseHeaders = new Headers(backendResponse.headers);
    // Remove content-encoding to avoid double compression issues
    responseHeaders.delete('content-encoding');

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[API Proxy Error] Failed to fetch ${targetUrl.toString()}:`, error);
    return NextResponse.json(
      { error: 'Failed to communicate with backend service', details: String(error) },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
