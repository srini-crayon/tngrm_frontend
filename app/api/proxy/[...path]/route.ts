import { NextRequest, NextResponse } from 'next/server'

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const API_BASE_URL = 'https://agents-store.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, resolvedParams, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path.join('/')
    const url = `${API_BASE_URL}/api/${path}`
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url

    // Prepare headers
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    // Preserve Content-Type from original request if it exists
    const contentType = request.headers.get('content-type')
    if (contentType) {
      headers['Content-Type'] = contentType
    }

    // Forward relevant headers from the original request
    const forwardHeaders = ['authorization', 'user-agent', 'x-forwarded-for']
    forwardHeaders.forEach(header => {
      const value = request.headers.get(header)
      if (value) {
        headers[header] = value
      }
    })

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    }

    // Add body for non-GET requests
    if (method !== 'GET') {
      try {
        // Use arrayBuffer to handle all content types (text, JSON, binary, etc.)
        // This avoids serialization issues with request.text()
        const arrayBuffer = await request.arrayBuffer()
        if (arrayBuffer.byteLength > 0) {
          requestOptions.body = arrayBuffer
        }
      } catch (error) {
        // Log error but continue without body if reading fails
        console.error('Failed to read request body:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    console.log(`Proxying ${method} request to:`, fullUrl)
    console.log('Request headers:', headers)

    // Make the request to the backend
    const response = await fetch(fullUrl, requestOptions)
    
    console.log('Backend response status:', response.status)
    // Fix for Safari: safely convert headers to object
    try {
      const headersObj = Object.fromEntries(response.headers.entries())
      console.log('Backend response headers:', headersObj)
    } catch (e) {
      console.log('Backend response headers: [unable to log in Safari]')
    }

    // Get response body
    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    // Create response with CORS headers
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
    })

    // Add CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    // Forward relevant response headers
    const forwardResponseHeaders = ['content-type', 'set-cookie']
    forwardResponseHeaders.forEach(header => {
      const value = response.headers.get(header)
      if (value) {
        nextResponse.headers.set(header, value)
      }
    })

    return nextResponse

  } catch (error) {
    console.error('Proxy error:', error)
    
    const errorResponse = NextResponse.json(
      { 
        message: 'Proxy server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )

    // Add CORS headers even for errors
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return errorResponse
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}
