import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const handle = searchParams.get('handle')
  const count = searchParams.get('count')

  if (!endpoint || !handle) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    let url = ''
    
    if (endpoint === 'user.rating') {
      url = `https://codeforces.com/api/${endpoint}?handle=${handle}`
    } else if (count) {
      url = `https://codeforces.com/api/${endpoint}?handle=${handle}&count=${count}`
    } else {
      url = `https://codeforces.com/api/${endpoint}?handles=${handle}`
    }

    console.log('Codeforces API URL:', url) // Debug log

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Bot/1.0)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('Codeforces API response:', data) // Debug log
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Codeforces API error:', error)
    return NextResponse.json(
      { 
        status: 'FAILED',
        comment: 'Failed to fetch data from Codeforces API',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 