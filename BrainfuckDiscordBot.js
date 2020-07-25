//this libary is required to access the discord API
const discord = require("discord.js");

//this libary is required to load the .env file containing the discord login token
require("dotenv/config");

const client = new discord.Client({
	//to prevent unintended @Everyone mentions
	disableEveryone: true
});

//This event gets triggered if the bot has been initialized and logged on
client.on("ready", () => {
	//Print to the debug console to check if the bot has been initialized
	console.log("BrainfuckDiscordBot is now ready!");
	
	//Setup the status message
	client.user.setPresence({
        game: {
            name: "!bf <code> <input> <debug true|false>"
        },
        status: "online"
    });
});

//This event gets triggered if the bot receives either a direct message, or a users writes a message to a channel, in a server with the bot
client.on("message", async message => {
	try {
		if (message.content.startsWith("!bf ")) { // Checks if the message starts with "!bf " wich is the command
			//Print the message content to the console for debug purposes
			console.log(message.content);
			
			//Extract the necessary Arguments
			let split = message.content.replace("!bf ").split(" ");
			let code = split[0];
			let input = split[1];
			let debug = split[2];
			
			//check if debug value is set and is either "debug" or "true"
			if(!debug===undefined && (debug === "debug" || debug === "true")) {
				debug = true;
			} else {
				debug = false;
			}	
			
			//Execute the Brainfuck code with the arguments
			let result = executeBrainfuck(code, input, debug);		
			
			//Process and print the result
			if(result === false){ // Check if the program did not terminate (like an endless loop)
				//If that is the case print the endless loop message
				message.channel.send('Programm terminated: Too long. Check your code for possible endless loops');
			} else {
				//Just for additonal security possible escape sequences get removed
				result = result.replace('/```/g','');
				if (result === "") { //Check if the result is empty (=> No output has been printed by the code)
					message.channel.send('Programm sucessfully terminated: *No output*'); //If that is the case print the *No output* message
				} else { //Everything ok: printing result
					message.channel.send('Programm sucessfully terminated: ```' + result + '```'); //If that is not the case return the answer
				}
			}
		}
	} catch (err) { //If something goes wrong+
		//write message to debug console
		console.log('[ERR]: ' + err + ' at message: \"' + message + '\"');
		try { //Try to notify user of error
			//Send error message to user
			message.channel.send('An unknown error has occurred!');
		} catch(err2){ // if the error message can't be processed
			//write to debug console
			console.log('[ERR]: could not notify user of error');
		}
	}
});

//Handle Login with TOKEN stored in the .env file
client.login(process.env.TOKEN);

//Function to execute the brainfuck code. Returns the output
function executeBrainfuck(program, input, debug, bits) {
	return false;
}