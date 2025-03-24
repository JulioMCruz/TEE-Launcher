import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { existsSync } from 'fs'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { command } = await request.json()
    
    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    // Get the workspace root directory
    const workspaceRoot = process.cwd()
    console.log('Workspace root:', workspaceRoot)
    console.log('Executing command:', command)

    // Check if docker-compose file exists
    if (command.includes('docker-compose')) {
      const match = command.match(/--docker-compose\s+"?([^"'\s]+)"?/)
      if (match) {
        const dockerComposePath = match[1]
        console.log('Docker compose path from command:', dockerComposePath)
        
        if (!existsSync(dockerComposePath)) {
          console.error('Docker compose file not found at:', dockerComposePath)
          return NextResponse.json(
            { error: `Docker compose file not found at: ${dockerComposePath}` },
            { status: 400 }
          )
        }
        console.log('Docker compose file exists at:', dockerComposePath)
      }
    }

    // Execute the command from the project root directory
    const { stdout, stderr } = await execAsync(command, {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:/usr/local/bin:/usr/bin:/bin`,
        HOME: process.env.HOME || '/root'
      },
      shell: '/bin/zsh' // Use zsh as specified in the user info
    })
    
    const output = stdout || stderr
    console.log('Command output:', output)

    return NextResponse.json({
      output: output || 'Command executed successfully with no output.'
    })
  } catch (error: unknown) {
    console.error('Error executing command:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to execute command: ${errorMessage}` },
      { status: 500 }
    )
  }
} 