export class graphics {
    static CANVAS_WIDTH = 0;
    static CANVAS_HEIGHT = 0;
    
    
    static init(canvasID, width = 1000, height = 1000){
        //creates canvas and 2d context
        this.canvas = document.getElementById(canvasID);
        this.ctx = canvas.getContext("2d");
        
        //gets canvas size based on window
        this.resizeCanvas();
    }
    
    static resizeCanvas() {
    // Set canvas size to match CSS display size
    this.CANVAS_WIDTH = canvas.width = canvas.clientWidth;
    this.CANVAS_HEIGHT = canvas.height = canvas.clientHeight;
    }
    
    static clearFrame(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    static drawRect(relWidth, relHeight, relX, relY, color, strokeColor="transparent", strokeThickness = 2){
        //converts relative X and Y (out of 1) to global X and Y (out of CANVAS_WIDTH)
        var centerX = relX * this.CANVAS_WIDTH; 
        var centerY = relY * this.CANVAS_HEIGHT; 
        
        //converts relative width and height (out of 1) to global X and Y (out of CANVAS_WIDTH)
        var width = relWidth * this.CANVAS_WIDTH; 
        var height = relHeight * this.CANVAS_HEIGHT; 
        this.ctx.fillStyle = color;
        this.ctx.fillRect(centerX - (width/2),centerY - (height/2), width, height);
        this.ctx.strokeStyle = strokeColor; // Sets the stroke color to blue
        this.ctx.lineWidth = strokeThickness;
        this.ctx.strokeRect(centerX - (width/2),centerY - (height/2), width, height);

    }
    
    static drawText(text, relFontSize, relX, relY, color, hAlign = "center"){
        var centerX = relX * this.CANVAS_WIDTH; 
        var centerY = relY * this.CANVAS_HEIGHT; 
        var fontSize = relFontSize * this.CANVAS_WIDTH / 387;

        this.ctx.font = fontSize + "px Tahoma";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = hAlign;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text,centerX,centerY);
    }
    
    static createBoundingBox (relWidth, relHeight, relX, relY){
        var centerX = relX * this.CANVAS_WIDTH; 
        var centerY = relY * this.CANVAS_HEIGHT; 
        var width = relWidth * this.CANVAS_WIDTH; 
        var height = relHeight * this.CANVAS_HEIGHT;
        var boundingBox = new Path2D();
        boundingBox.rect(centerX - (width/2),centerY - (height/2), width, height);
        return boundingBox;
    }
    



}