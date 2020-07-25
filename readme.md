# BrainfuckDiscordBot
This is a [Discord](https://discord.com/new) bot wich allows users to run Brainfuck code. Brainfuck is an esoteric programming language created in 1993 by Urban Müller.
See the [Wikipedia Article](https://en.wikipedia.org/wiki/Brainfuck) for more information.

## Invite
By clicking this link u can invite the bot to your discord server. 
> **[Invite BrainfuckDiscordBot](https://discord.com/api/oauth2/authorize?client_id=736655212130861157&permissions=2048&scope=bot)**

## Usage
The bot supports direct messages as well as messages in server channels

Simply write: `!bf your_code your_input debug`

Replace your_code with your code and your_input with your input. The debug field can be either true or false. If the debug field is set the bot replies with some debug information about your code. Both debug and input are optional fields. The default values are "" and false

## How to code Brainfuck
Brainfuck is a minimalistic language consisting of only 8 commands.
- `>` to increment the data pointer (to point to the next cell to the right).
- `<` to decrement the data pointer (to point to the next cell to the left).
- `+` to increment (increase by one) the byte at the data pointer.
- `-` to decrement (decrease by one) the byte at the data pointer.
- `.` to output the byte at the data pointer.
- `,` to accept one byte of input, storing its value in the byte at the data pointer.
- `[` if the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching `]` command. 
- `]` if the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching `[` command. 

Source: [Wikipedia](https://en.wikipedia.org/wiki/Brainfuck)

## Build
If u want to host the bot yourself follow this steps:
1. Install [NodeJS](https://nodejs.org/)
2. Install required libaries using `npm install` in the main folder
3. Get your own Discord Token
	- Go to [Discord developer portal](https://discord.com/developers/applications/)
	- Open your Application's settings
	- Navigate to the Bot section on the left
	- Under Token click Copy
	- **NEVER SHARE YOUR DISCORD TOKEN WIHT ANYONE!!!**
4. Create a file named `.env` next to BrainfuckDiscordBot.js
	- insert the following line: `TOKEN=your_token` and replace your_token with your token
5. Use `node BrainfuckDiscordBot.js` to start the bot
	- Press `CTRL-C` to exit

## Permissions
This bot only requires the "Send Message" permission

## Bugs
There are currently no known bugs

## License
This Project ist licensed under the Apache License 2.0

## Contributors
* @Popescu-PfeifferMarc
* @DavidSichma