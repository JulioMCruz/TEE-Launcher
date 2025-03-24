import { NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'wordpress'
    
    // Get the absolute path from the workspace root
    const fullPath = join(process.cwd(), 'assets', 'docker', type, 'docker-compose.yml')
    
    return NextResponse.json({ path: fullPath })
  } catch (error) {
    console.error('Error getting docker-compose path:', error)
    return NextResponse.json(
      { error: 'Failed to get docker-compose path' },
      { status: 500 }
    )
  }
} 