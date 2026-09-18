import {graphics} from "./graphics.js";
import {utils} from "./utils.js";

//Round Controller
export class gameMaster {
    constructor(){
        //master data
        this.players = []
        this.record = [];

        //round-local data
        this.currentPlayers = [];
        this.currentMatchups = [];
        this.currentRound = 1;
        
        //state machine
        this.currentState = "CREATE_MATCHES";
        this.finishedState = true;
        this.roundCompleted = false;
        //draw state
        this.focusedMatchup = -1;
    }
    
    init(){
        //creates player objects from class list and sets currentPlayers to playerIDs
        var roster = ["Kai", "Cole", "Jay", "Zane", "Nya", "Lloyd", "Wu", "Garmadon", "Misako", "Ed", "Edna", "P.I.X.A.L.", "Skylor", "Dareth", "Arin",
        "Sora", "Wyldfyre", "Frak", "Euphrasia", "Overlord", "Chen", "Clouse","Morro", "Nadakhan", "Time Twins", "Pythor", "Skales", "Harumi", "Omega", "Karlof", "Akita", "Aspheera"];
        for (var i = 0; i < roster.length; i++){
            this.players.push(new player(roster[i], i));
            this.currentPlayers.push(i);
        }

        //get nav elements set
        this.leftButton = document.getElementById("left-arrow");
        this.rightButton = document.getElementById("right-arrow");
        this.headerText = document.getElementById("header-text");
        
        //gets matchup buttons set
        this.player_1 = document.getElementById("player1");
        this.player_2 = document.getElementById("player2");

        //adds hover and click events for matchup objects
        graphics.canvas.addEventListener("mousemove", (event) => {
            for (const matchup of this.currentMatchups) {
                matchup.checkHover(event);
            }
        });

        graphics.canvas.addEventListener("click", (event) => {
            for (const matchup of this.currentMatchups) {
                matchup.checkClick();
            }
        });
    }
    
    loop(){
        if (this.finishedState == true){
            switch (this.currentState){
            case "CREATE_MATCHES":
                this.createMatchups();
                
                //condition to switch states
                if (this.finishedState == true){
                    this.currentState = "GET_WINNERS"
                }
                break;
            case "GET_WINNERS":
                this.checkWinners();
                
                //condition to switch states
                if (this.roundCompleted && this.currentRound > this.record.length){
                    this.currentState = "FINISH_ROUND";
                }
                break;
            case "FINISH_ROUND":
                this.concludeRound();
                
                //condition to switch states
                if (this.finishedState == true){
                    this.currentState = "CREATE_MATCHES"
                }
                break;
            }
        }
    }
    
    createMatchups(){
        //set state machine to running
        this.finishedState = false;
        
        //check if round already exists in record 
        if (this.currentRound - 1 < this.record.length){
            //update currentMatchups to record of completed round
            var recordedMatchups = this.record[this.currentRound-1].map(m => m.cloneMatchup());
            recordedMatchups.forEach((currentMatchup)=>{currentMatchup.init()});
            this.currentMatchups = recordedMatchups;
            
        //get players from past round from record
            var roundPlayers = [];
            for (const matchup of this.currentMatchups) {
                roundPlayers.push(matchup.players[0].playerID);
                roundPlayers.push(matchup.players[1].playerID);
            }
            this.currentPlayers = roundPlayers;

        } else {

            //shuffles player array
            var newMatchups = [];
            this.currentPlayers = utils.shuffleArray(this.currentPlayers);
            
            //calculates # of objects in rows and columns
            var side = (Math.log(this.currentPlayers.length/2)/Math.log(2))/2;
            var grid = [2 ** Math.ceil(side), 2 ** Math.floor(side)];
            
            //scale of tiles compared to grid
            var scale = 0.8;
            
            //creates and initializes matchups
            var gridID = 0;
            for (var i = 0; i <  this.currentPlayers.length; i+=2){
                var newMatchup = new matchup( this.players[this.currentPlayers[i]],  this.players[this.currentPlayers[i+1]], gridID, [...grid]);
                newMatchup.init();
                newMatchups.push(newMatchup);
                gridID++;
            }
            this.currentMatchups = newMatchups;
            
        }
        
        //set nav buttons to navigate functions
        this.setNavigateRounds(true);

        //set state machine to finished
        this.roundCompleted = false;
        this.finishedState = true;
    }
    
    drawState(){
        if (this.currentRound == 6 ) {
            //set nav bar
            this.headerText.innerText = "Winners";
            this.leftButton.innerText = "Previous Round";
            this.rightButton.innerText = "Next Round";
            
            //enable/disable buttons
            this.leftButton.removeAttribute("disabled");
            this.rightButton.setAttribute("disabled", true);

            this.drawEnd();
        } else {
            //draws matchup previews if a match isn't selected
            this.checkFocusedMatchup();
            if (this.focusedMatchup == -1){
                //set nav bar
                this.headerText.innerText = "Round " + this.currentRound;
                this.leftButton.innerText = "Previous Round";
                this.rightButton.innerText = "Next Round";
                
                //disable left button if previous rounds don't exist
                if (this.currentRound == 1) {
                    this.leftButton.setAttribute("disabled", true);
                } else {
                    this.leftButton.removeAttribute("disabled");
                }
                
                //disable right button if further rounds don't exist and round not completed
                if (this.currentRound > this.record.length || !this.roundCompleted){
                    this.rightButton.setAttribute("disabled", true);
                } else {
                    this.rightButton.removeAttribute("disabled");
                }
                
                this.drawMatchups();
            } else {
                this.headerText.innerText = "Match " + (this.focusedMatchup + 1);
                this.leftButton.innerText = "View Round";
                this.rightButton.innerText = "Next Match";
                
                this.player_1.innerText = this.currentMatchups[this.focusedMatchup].players[0].name;
                this.player_2.innerText = this.currentMatchups[this.focusedMatchup].players[1].name;
                
                this.drawFocusedMatchup();
            }
        }
    }
    
    checkFocusedMatchup(){
        if (this.focusedMatchup == -1){
            for (var i = 0; i < this.currentMatchups.length; i++){
                var currentMatchup = this.currentMatchups[i];
                if (currentMatchup.isFocused){
                    this.focusedMatchup = i;
                    this.setGetWinner();
                    break;
                }
            }
        }
    }
    
    drawMatchups(){
        //hide winner selection buttons
        this.player_1.style.display = "none";
        this.player_2.style.display = "none";
        //updates dimensions of each preview before drawing them
        for (const matchup of this.currentMatchups) {
            matchup.setDimensions();
            matchup.drawPreview();
        }
    }
    
    drawFocusedMatchup(){
        this.player_1.style.display = "block";
        this.player_2.style.display = "block";


        var focusedMatchup = this.currentMatchups[this.focusedMatchup];
        focusedMatchup.drawFocused();
    }
    
    drawEnd(){
        this.player_1.style.display = "none";
        this.player_2.style.display = "none";
        
        var winners = []
        for (var i = 4; i > 1; i--){
            this.record[i].forEach((matchup)=>{
                if (!winners.includes(matchup.winner)){
                    winners.push(matchup.winner)
                }
            });
        }
        
        console.log(winners);
        
        var stepWidth = 0.2;
        var stepHeight = [0.5, 0.35,0.2, 0.2]
        var stepX = [0.4, 0.6, 0.2, 0.8]
        
        var placement = [1, 2, 3, 3]
        var textOffset = 0.1;
        var fontSize = 15;
        
        var playerSize = [0.15,0.15];
        var playerNameOffset = 0.05;
        
        for (var i = 0 ; i < stepHeight.length; i++){
            graphics.drawRect(stepWidth,stepHeight[i], stepX[i], 1 - stepHeight[i]/2, "gray");
            graphics.drawText(placement[i], 25, stepX[i], 1 - (stepHeight[i] - textOffset), "white");
            
            this.players[winners[i]].alive = 0;    
            this.players[winners[i]].setProperty([stepX[i], 1 - (stepHeight[i]+ (playerSize[1]/2))], playerSize);
            this.players[winners[i]].drawPlayer();
            
            graphics.drawText( this.players[winners[i]].name, 8, stepX[i], 1 - (stepHeight[i] + playerSize[1] + playerNameOffset), "white");
            
        }

        
        graphics.drawText("CONGRATS WINNERS!", 25, 0.5, 0.15, "white");
    }
    
    setNavigateRounds(activated){
        //function to return to previous round if exists
        if (!this.previousRound) {
            this.previousRound = () => {
                this.currentRound --;
                this.currentState = "CREATE_MATCHES";
                this.finishedState = true;
            };
        }

        //function to go to next round if exists
        if (!this.nextRound) {
            this.nextRound = () => {
                this.finishedState = false;
                this.updateRecords();
                this.currentRound ++;
                this.currentState = "CREATE_MATCHES";
                this.finishedState = true;
            };
        }
        
        
        if (activated) {
            //add listeners to nav buttons
            this.leftButton.addEventListener("click", this.previousRound);
            this.rightButton.addEventListener("click", this.nextRound);
            
        } else {
            // remove round navigation listeners
            this.leftButton.removeEventListener("click", this.previousRound);
            this.rightButton.removeEventListener("click", this.nextRound);
        }
    }
    
    setGetWinner() {
        //set running state to true while in focus mode to avoid early checks
        this.finishedState = false;
        
        //remove navigation listeners
        this.setNavigateRounds(false);

        // array for player select handlers
        const winnerHandlers = [];
        
        //add listener to set winner when appropriate button is clicked
        [this.player_1, this.player_2].forEach((button, index) => {
            const handleWinner = () => {
                 
                //set winner
                var currentMatchup = this.currentMatchups[this.focusedMatchup];
                currentMatchup.winner = currentMatchup.players[index].playerID;

                //set alive/dead status for players and color buttons
                if (index == 0){
                    currentMatchup.players[0].alive = 1;
                    currentMatchup.players[1].alive = -1;
                    this.player_1.style.backgroundColor = "#FFFAA5";
                    this.player_2.style.backgroundColor = "WHITE";
                } else if (index == 1) {
                    currentMatchup.players[0].alive = -1;
                    currentMatchup.players[1].alive = 1;
                    this.player_1.style.backgroundColor = "WHITE";
                    this.player_2.style.backgroundColor = "#FFFAA5";
                }
                
                //accordingly enable/disable left and right buttons
                this.leftButton.removeAttribute("disabled");
                if (this.focusedMatchup !== this.currentMatchups.length -1){
                    //enable only if there is another match to go to
                    this.rightButton.removeAttribute("disabled");
                }
            };
    
            button.addEventListener("click", handleWinner);
            winnerHandlers.push({ button, handleWinner });
        });
    
    
        //function for left button confirm winner and exit focusedMatchup
        const returnToRound = () => {
            var currentMatchup = this.currentMatchups[this.focusedMatchup];
            if (currentMatchup.winner >=0) {
                //remove all player button listeners
                winnerHandlers.forEach(({ button, handleWinner }) => {
                    button.removeEventListener("click", handleWinner);
                });
                
                //remove listeners from left and right buttons
                this.leftButton.removeEventListener("click", returnToRound);
                this.rightButton.removeEventListener("click", nextMatchup);

                //get rid of focusedMatchup
                this.currentMatchups[this.focusedMatchup].isFocused = false;
                this.focusedMatchup = -1;
                
                //change button colors back
                this.player_1.style.backgroundColor = "WHITE";
                this.player_2.style.backgroundColor = "WHITE";
                
                this.setNavigateRounds(true);
                
                //set finished state to true to allow for next round checks
                this.finishedState = true;
            }
        }
    
        //function for right button to confirm winner and focus on next matchup
        const nextMatchup = () => {
            var currentMatchup = this.currentMatchups[this.focusedMatchup];
            if (currentMatchup.winner >= 0) {
                //remove all player button listeners
                winnerHandlers.forEach(({ button, handleWinner }) => {
                    button.removeEventListener("click", handleWinner);
                });
                
                //remove listeners from left and right buttons
                this.leftButton.removeEventListener("click", returnToRound);
                this.rightButton.removeEventListener("click", nextMatchup);

                //replaced focused Matchup
                this.currentMatchups[this.focusedMatchup].isFocused = false;
                var nextMatchupID = Math.min(this.focusedMatchup + 1, this.currentMatchups.length - 1);
                this.currentMatchups[nextMatchupID].isFocused = true;
                this.focusedMatchup = -1;
                
                 //change button colors back
                this.player_1.style.backgroundColor = "WHITE";
                this.player_2.style.backgroundColor = "WHITE";
                
                //activate navigation buttons
                this.setNavigateRounds(true);

                //set finished state to true to allow for next round checks
                this.finishedState = true;

            }
        }
    
        //add listener to submit buttons
        this.leftButton.addEventListener("click", returnToRound);
        this.rightButton.addEventListener("click", nextMatchup);
        
        if (this.currentMatchups[this.focusedMatchup].winner < 0){
            this.leftButton.setAttribute("disabled", true);
        } else {
            this.leftButton.removeAttribute("disabled");
        }
        this.rightButton.setAttribute("disabled", true);

    }
    
    checkWinners(){
        var winners = 0
        for (const matchup of this.currentMatchups) {
            if (matchup.winner >= 0) {
                winners++;
            }
        }
        if (winners == this.currentMatchups.length){
            this.roundCompleted = true;
        } else {
            this.roundCompleted = false;
        }
    }
    
    concludeRound(){
        //set state machine to running
        this.finishedState = false;
        
        
        //adds matchups with end result into record array
        this.record.push(this.currentMatchups.map(m => m.cloneMatchup()));
        //updates current players by clearing array and adding in each round winner
        
        var remainingPlayers = [];
        for (const matchup of this.currentMatchups){
            this.players[matchup.winner].alive = 0;
            remainingPlayers.push(matchup.winner);
        }
        this.currentPlayers = remainingPlayers;
        
        //increases round
        this.currentRound++;
            
        //set state machine to finished
        this.finishedState = true;
    }
    
    updateRecords(){
         if (this.currentRound == this.record.length){
            //updates current players by clearing array and adding in each round winner
            var remainingPlayers = [];
            for (const matchup of this.currentMatchups){
                this.players[matchup.winner].alive = 0;
                remainingPlayers.push(matchup.winner);
            }
            this.currentPlayers = remainingPlayers;
            
        } else {
            //record winners from record that were overridden
            var alteredWinners = [];
            for (var i = 0; i < this.currentMatchups.length; i++){
                if (this.currentMatchups[i].winner !== this.record[this.currentRound - 1][i].winner){
                    alteredWinners.push({oldWinner: this.record[this.currentRound - 1][i].winner, newWinner: this.currentMatchups[i].winner});
                }
            }

            //replace overriden winners with placeholders to avoid undefined
            alteredWinners.forEach((changedWinner)=>{

                //create criteria for putting in placeholders
                var placeholderConversion = {
                        playerID: -1,
                        standIn: changedWinner.oldWinner
                };
            
                //iterate through each round above current round
                for (var i = this.currentRound; i < this.record.length; i++){
                    //iterate through each matchup of current round
                    for (const matchup of this.record[i]){
                        var seek = (changedWinner.oldWinner == -1) ? placeholderConversion.standIn : changedWinner.oldWinner;
                        var index = matchup.players.findIndex(p => p.playerID === seek);
                        if (index !== -1){
                            if (i == this.currentRound){
                                //if on next immediate round, update next level to reflect changed winner and reset winner
                                matchup.winner = -1;
                                matchup.players[index] = this.players[changedWinner.newWinner];
                            } else {
                                //if on any other round, then just replace old winner with placeholder
                                 matchup.players[index] = placeholderConversion;
                            }
                            //switch to next altered winner pair
                            break;
                        }
                    }
                }
            });
        }
        
        //update record for current round
        this.record[this.currentRound - 1] = this.currentMatchups.map(m => m.cloneMatchup());

    }
}

//Pair of Players
export class matchup {
    constructor(player1, player2, gridID, grid){
        //set variables
        this.gridID = gridID;
        this.grid = grid;
        
        //grid drawing variables
        this.position = [0.5,0.5];
        this.size = [0.1,0.1];
        
        //state variables
        this.isFocused = false;
        this.isHover = false;

        //data
        this.players = [player1, player2];
        this.winner = -1;
    }
    
    init(){
        //sets initial dimensions and creates a bounding box for hover and click events
        this.setDimensions();
        this.boundingBox = graphics.createBoundingBox(this.size[0],this.size[1], this.position[0], this.position[1]);
        
        //sets dead or alive status for players based on winenr
        if (this.winner == this.players[0].playerID){
            this.players[0].alive = 1;
            this.players[1].alive = -1;
        } else if (this.winner == this.players[1].playerID){
            this.players[0].alive = -1;
            this.players[1].alive = 1;
        } else {
            this.players[0].alive = 0;
            this.players[1].alive = 0;
        }
    }
    
    checkHover(event){
        //as long as the bounding box exists and it isn't focused, it checks if mouse is within bounding box
        if (!this.isFocused  && this.boundingBox !== undefined){
            this.isHover = graphics.ctx.isPointInPath(this.boundingBox, event.offsetX, event.offsetY);
        } else {
            this.isHover = false;
        }
    }
    
    checkClick(){
        //if the mouse is within the object, it returns true upon a click
        if (this.isHover){
            this.isFocused = true;
        }
    }
    
    
    setDimensions(){
        //updates position and size in case of page resize
        var scale = 0.9;
        this.position = [((this.gridID % this.grid[0])+0.5)/this.grid[0], ((Math.floor(this.gridID / this.grid[0]))+0.5)/this.grid[1]];
        this.size = [scale* (1/this.grid[0]), scale * 1/this.grid[1]];
    }
    
    drawPreview(){
        //if hover, increases brightness of matchup preview for visual cue
        if (this.isHover){
            graphics.ctx.filter = 'brightness(120%)';
        }
        
        var strokeColor = (this.winner >= 0) ? "green" : "red";
        
        //draws background
        graphics.drawRect(this.size[0],this.size[1], this.position[0], this.position[1], "gray", strokeColor,4);
        
        //clear hover color change
        graphics.ctx.filter = 'none';

        //draws player icons
        var scaleFactor = 1/0.225 * this.size[0];
        var playerOffset = [0.05 * scaleFactor, 0.02 * scaleFactor];
        var playerSize = [0.05 * scaleFactor, 0.05 * scaleFactor];
        this.players[0].setProperty([this.position[0] - playerOffset[0], this.position[1] - playerOffset[1]], playerSize);
        this.players[1].setProperty([this.position[0] + playerOffset[0], this.position[1] - playerOffset[1]], playerSize);
        this.players[0].drawPlayer();
        this.players[1].drawPlayer();

        //draws bounding box
        this.boundingBox = graphics.createBoundingBox(this.size[0],this.size[1], this.position[0], this.position[1]);
        graphics.ctx.fillStyle = "transparent";
        graphics.ctx.fill(this.boundingBox);
        
        //draws text
        var textOffset = [0 * scaleFactor , -0.07 * scaleFactor];
        var fontSize = 8 * scaleFactor;
        graphics.drawText(this.players[0].name + " vs. " + this.players[1].name, fontSize, this.position[0] - textOffset[0], this.position[1] - textOffset[1], "white");
    }
    
    drawFocused(){
        graphics.drawRect(1,0.4, 0.5, 0.8, "gray");
        
        var playerOffset = [0.25, 0.025];
        var playerSize = [0.25, 0.25];
        
        this.players[0].setProperty([0.5 - playerOffset[0], 0.5 - playerOffset[1]], playerSize);
        this.players[1].setProperty([0.5 + playerOffset[0], 0.5 - playerOffset[1]], playerSize);
        this.players[0].drawPlayer();
        this.players[1].drawPlayer();
        
        graphics.drawText("CHOOSE YOUR CHAMPION", 27 , 0.5, 0.2, "white");
    }
    
    cloneMatchup(){
        const clonedMatchup = new matchup(this.players[0], this.players[1], this.gridID, this.grid);
        clonedMatchup.winner = this.winner;
        return clonedMatchup;
    }
}

//Individual Player
export class player {
    constructor(name, playerID){
        //identifiers
        this.name = name;
        this.playerID = playerID;
        
        //status variables
        this.alive = 0;
        
        //draw variables
        this.position = [0.5,0.5];
        this.size = [0.1, 0.1];
    }
    
    setProperty(position, size){
        //quick function to change size or position
        if (position !== undefined){
            this.position = position;
        }
        if (size !== undefined){
            this.size = size;
        }
    }
    
    drawPlayer(){
        //draws player as a square with color based on playerID
        var hue = 360 * (this.playerID/32);
        var size = 0.1;
        if (this.alive == 1){
            graphics.ctx.filter = 'brightness(150%)';
        } else if (this.alive == -1) {
            graphics.ctx.filter = 'brightness(75%) grayscale(70%)';
        } else {
            graphics.ctx.filter = 'none';
        }
        graphics.drawRect(this.size[0] * (graphics.CANVAS_HEIGHT/graphics.CANVAS_WIDTH),this.size[1], this.position[0], this.position[1], "hsl(" + hue + ", 80%, 60%)");
        graphics.ctx.filter = 'none';
    }
}