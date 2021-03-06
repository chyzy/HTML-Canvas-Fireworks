var canvas=document.querySelector('canvas');
var c =canvas.getContext('2d');


function init(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    c.fillStyle='rgba(000,000,005,1)';
    c.fillRect(0,0,window.innerWidth,window.innerHeight);

    c.font = "60px Arial";
    c.textAlign = "center";
    c.fillStyle='#ddd';
    c.fillText("Press mouse button to launch fireworks", canvas.width/2, canvas.height/3);
}

var startAnimate=true;
var mouseDown=false;
var shoots=[];
var parts=[];
var mousePosition={x:window.innerWidth/2,y:window.innerHeight/2};
const colors=['#c92e2e','#13a5a5','#eee'];


window.addEventListener('mousemove',(mouse)=>{
    mousePosition.x=mouse.x;
    mousePosition.y=mouse.y;
});

window.addEventListener('resize',function(){
    shoots=[];
    parts=[];
    init();
    console.log(window.innerHeight);
    init();
});

window.addEventListener('mousedown',()=>{
    mouseDown=true;
    if(startAnimate)
        animate();
    startAnimate=false;
});

window.addEventListener('mouseup',()=>{
    mouseDown=false;  
});

function particular(x,y,r,direction,isShoot){
    this.x=x;
    this.y=y;
    this.r=r;
    this.direction=direction;
    this.timeLeft=getRandomFloat(50,70);
    if(isShoot){
        this.color='#ddd';
        this.force=new vector(0,-0.19);
    }    
    else{
        this.force=new vector(0,-0.06);
        this.color=getRandomColor();
    }
        
    this.draw=()=>{
        c.beginPath();
        c.fillStyle=this.color;
        c.strokeStyle=this.color;
        c.arc(this.x,this.y,r,0,2*Math.PI,false);
        c.stroke();
        c.fill();
        c.closePath();
    }

    this.applyDrag=()=>this.force.a=-this.direction.a*0.01;
    
    this.update=()=>{
        this.applyDrag();
        this.direction.a+=this.force.a;
        this.direction.b+=this.force.b;

        this.x-=this.direction.a;
        this.y-=this.direction.b;

        this.timeLeft-=1;
        this.draw();
    }
}


function explode(x,y)
{
    for(var i=0;i<80;i++)
    {
        parts.push(new particular(x,y,getRandomFloat(1,2.3),getExplosionVector(),false));
    }
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor(){
    return colors[Math.floor(Math.random()*colors.length-0.01)];
}

function getExplosionVector(){
    var angle=Math.random()*2*Math.PI;
    vx=Math.sin(angle)*3*Math.random();
    vy=Math.cos(angle)*4*Math.random();
    if(vy<-0.5)
        vy=-vy*0.7;
    return new vector(vx,vy);
}

function vector(a,b){
    return{a:a,b:b}
}

function getShootHeight(){
    var height=window.innerHeight;
    if(height<460)
        return getRandomFloat(9.5,12.1);
    else if (height>=460 && height<650)
        return getRandomFloat(11.5,13.1);
    else if(height>=650 && height <800)
        return getRandomFloat(12.5,15.1);
    else
        return getRandomFloat(15.5,17.1);
}

function getShootDirection(){
    var dx=mousePosition.x-window.innerWidth/2;
    //var dy=window.innerHeight-mousePosition.y;

    return new vector(-dx/50,getShootHeight());
}

function shoot(){
    if(mouseDown)
        shoots.push(new particular(window.innerWidth/2,window.innerHeight,5,getShootDirection(),true));
    setTimeout(shoot, 200);
       
}

function filterShoots(s){
    if(s.direction.b<-0.8)
    {
        explode(s.x,s.y);
        return false;
    }
    return true;
}

function animate(){
    requestAnimationFrame(animate);
    c.fillStyle='rgba(000,000,005,0.2)';
    c.fillRect(0,0,window.innerWidth,window.innerHeight);
    
    parts=parts.filter(p=>p.timeLeft>0);
    shoots=shoots.filter(p=>filterShoots(p));
    
    parts.forEach((p)=>{
        p.update();
    });

    shoots.forEach((p)=>{
        p.update();
    });
}
init();
shoot();
