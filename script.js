let master; 
let players = [];

window.addEventListener("DOMContentLoaded", function() {
    init();
    update();

    // master.createMatchups();
    draw();
    //controlLoop();
    
});

function init(){
    graphics.init("canvas");
    master = new gameMaster();
    master.init();
    window.addEventListener('resize', (update));
}

function update(){
    graphics.resizeCanvas();
}

function controlLoop(){
    if (master.currentRound <= (Math.log(master.players.length)/Math.log(2))){
        master.loop();
    }
}

function draw(){
    controlLoop();
    graphics.clearFrame();
    master.drawState();
    requestAnimationFrame(draw);
}

function createGrid(){
    var addPlayer;
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 8; j++){
            addPlayer = new player ((i*8 + j), (i*8 + j))
            addPlayer.position = [(j+0.5)/8, (i+0.5)/4];
            players.push(addPlayer);
            
        }
    }
}

function drawGrid(){
    var currentPlayer;
    for (var player in players){
        currentPlayer = players[player];
        currentPlayer.drawPlayer();
    }
}