
let W, H, c, ctx;
let textValue;
let balls = [];
let bombs = [];
let interval, index = 0, sort = true;

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const clear = () => {
	ctx.fillStyle = 'rgba(0,0,0,.2)';
	ctx.fillRect(0, 0, W, H);
};

const posText = (txt) => {
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0, 0, W, H);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 0.5
	ctx.font = "Bold 50px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.strokeText(txt, W/2, H/2);
	var m=ctx.getImageData(0,0,W,H);
	for(let i=0; i<m.data.length; i+=4) {
		if(m.data[i]>0)balls.push(new Ball(i/4%W,~~(i/4/W))); 
	}
	ctx.fillRect(0, 0, W, H);
};


class Ball{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.show = false
		this.boom = false
		this.s = {x:0,y:0}
	}
	draw() {
		if(this.show){
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255,255,255,.2)';
			ctx.arc(this.x+this.s.y, this.y+this.s.y, 1, 0, 2*Math.PI);
			ctx.fill();		
			ctx.closePath();
		}
	}	
}

class Bomb{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.s = {x:random(1,-1),y:random(3,-3)}
		this.r = random(1.5,1)
	}
	draw() {
		ctx.beginPath();
		ctx.fillStyle = 'rgba(255,250,150,0.2)';
		ctx.arc(this.x, this.y, this.r , 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	update() {
		this.x+=this.s.x
		this.y+=this.s.y
		this.r-=0.05
		this.draw()
	}	
}

const changeText = () => {
	balls = [];
	index = 0;
	posText(textValue.value);
	sort ? sortArr() : randomArr()
};

const randomArr = () => {
	const newArr = balls.slice();
	for (let i = newArr.length - 1; i > 0; i--) {
		const rand = ~~random(i+1);
		[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
	}
	balls = newArr;
}

const animate = () => {
	clear();
	balls.forEach(x => x.draw());
	for(var i = bombs.length - 1; i >= 0; i--){
		bombs[i].update()
		if(bombs[i].r<0.2)bombs.splice(i, 1);
	}
	requestAnimationFrame(animate);
};

const sortArr = () =>  balls.sort( (a, b) => a.y - b.y + a.x - b.x )

const init = () => {
	c = document.getElementById("cnv");
	c.width = W = innerWidth;
	c.height = H = innerHeight;
	ctx = c.getContext("2d");
	textValue = document.getElementById("textvalue");
	posText(textValue.value)
	sortArr()
	let choice =  document.getElementById("sorted");
	choice.addEventListener('change', function () {
		sort = choice.checked ? true : false
		changeText()
	});   	
	interval = setInterval(()=>{
		if(index+1<balls.length-1){
			let e = sort ? 5 : 10
			for(let a=0;a<5;a++){
				for(let i=0;i<e;i++)bombs.push(new Bomb(balls[index].x,balls[index].y))
				balls[index].show = true
				index++			   
			}
			 
		}
		else {
			
			for(let i=0;i<balls.length;i++){
				if(!balls[i].bomb){
					balls[i].s.x =random(5,-5)
					balls[i].s.y =random(5,-5)
					balls[i].bomb = true
				}
			}
		}	  
	}, 10)  
	
	animate();
};

onload = init;