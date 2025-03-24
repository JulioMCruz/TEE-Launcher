import { NextResponse } from 'next/server'
import { access } from 'fs/promises'
import { constants } from 'fs'
import { join } from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'wordpress'
    
    const filePath = join(process.cwd(), 'assets', 'docker', type, 'docker-compose.yml')
    
    // Check if file exists and is readable
    await access(filePath, constants.R_OK)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error checking docker-compose.yml:', error)
    return NextResponse.json(
      { error: 'docker-compose.yml file not found or not accessible' },
      { status: 404 }
    )
  }
} 