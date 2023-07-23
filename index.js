const readline = require('readline')

// Define the grid size
const gridSize = 5
// Define the initial robot position and direction
let robot = {
	x: 0,
	y: 0,
	direction: 'N',
}

// Function to move the robot forward in its current direction
const move = () => {
	switch (robot.direction) {
		case 'N':
			if (robot.y < gridSize - 1) robot.y++
			break
		case 'S':
			if (robot.y > 0) robot.y--
			break
		case 'E':
			if (robot.x < gridSize - 1) robot.x++
			break
		case 'W':
			if (robot.x > 0) robot.x--
			break
	}
}

// Function to change the robot's direction
const changeDirection = (rotate) => {
	const directions = ['N', 'E', 'S', 'W']
	const currentDirection = directions.indexOf(robot.direction)
	let newDirection =
		rotate === 'right' ? currentDirection + 1 : currentDirection - 1
	newDirection = newDirection < 0 ? 3 : newDirection
	newDirection = newDirection > 3 ? 0 : newDirection
	robot.direction = directions[newDirection]
}

// Function to draw the grid and robot's location
const drawGrid = () => {
	readline.cursorTo(process.stdout, 0, 0)
	for (let y = gridSize - 1; y >= 0; y--) {
		let row = ''
		for (let x = 0; x < gridSize; x++) {
			row += x === robot.x && y === robot.y ? ' O ' : ' . '
		}
		readline.clearLine(process.stdout, 0)
		console.log(row)
	}
}

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// Function to handle user commands
const handleCommand = (command) => {
	switch (true) {
		case /^MOVE$/.test(command):
			move()
			break
		case /^PLACE [0-4],[0-4],[N|S|W|E]$/.test(command):
			const params = command
				.match(/[0-4],[0-4],[N|S|W|E]/gi)[0]
				.split(',')
			robot = {
				x: +params[0],
				y: +params[1],
				direction: params[2].toUpperCase(),
			}
			break
		case /^LEFT$/.test(command):
			changeDirection('left')
			break
		case /^RIGHT$/.test(command):
			changeDirection('right')
			break
		default:
			console.log('Invalid command!')
			return
	}
	drawGrid()
	readline.cursorTo(process.stdout, 0, gridSize + 1)
	console.log(`Robot direction: ${robot.direction}`)
}

drawGrid()
readline.cursorTo(process.stdout, 0, gridSize + 1)
console.log(`Robot direction: ${robot.direction}`)

// Start the CLI app
rl.setPrompt(`
Enter a command:
MOVE: Move one step in the designated direction
PLACE X,Y,Direction: Change place of the robot
LEFT: Rotate direction to the left
RIGHT: Rotate direction to the right
Ctrl+C: End
`)

rl.prompt()
rl.on('line', (command) => {
	readline.clearScreenDown(process.stdout)
	handleCommand(command.trim().toUpperCase())
	rl.prompt()
}).on('close', () => {
	console.log('CLI app closed.')
	process.exit(0)
})
