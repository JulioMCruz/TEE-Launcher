import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'wordpress'
    
    const filePath = join(process.cwd(), 'assets', 'docker', type, 'docker-compose.yml')
    const content = await readFile(filePath, 'utf-8')
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading docker-compose.yml:', error)
    return NextResponse.json(
      { error: 'Failed to read docker-compose.yml' },
      { status: 500 }
    )
  }
} 