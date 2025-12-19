import { NextRequest, NextResponse } from 'next/server'

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Log to terminal (server-side console)
    console.log('\n' + '='.repeat(80))
    console.log('🔐 LOGIN API RESPONSE (Terminal Log)')
    console.log('='.repeat(80))
    console.log(JSON.stringify(data, null, 2))
    console.log('='.repeat(80) + '\n')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}







