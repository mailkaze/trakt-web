'use strict';
function Spinner(){
	Spinner.element=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	let c=document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	Spinner.element.setAttribute('width','40');
	Spinner.element.setAttribute('height','40');
	c.setAttribute('viewBox','0 0 100 100');
	c.setAttribute('cx','20');
	c.setAttribute('cy','20');
	c.setAttribute('r','18');
	c.setAttribute('stroke-width','3');
	c.setAttribute("stroke", "#646475");
	c.setAttribute('fill','transparent');
	Spinner.element.appendChild(c);
	Spinner.element.style.cssText='position:absolute;left:calc(50% - 20px);top:calc(50% - 20px)';
	document.getElementsByClassName('loading-spinner')[0].appendChild(Spinner.element)
	// document.body.appendChild(Spinner.element)
}
Spinner.id=null;
Spinner.element=null;
Spinner.show=function(){
	const c=128,m=6;
	Spinner.element.style.display='block';
	move1();
	function move1(){
		let i=0,o=0;
		move();
		function move(){
			if(i==c)move2();
			else{
				i+=2;o+=4;
				Spinner.element.setAttribute('stroke-dasharray',i+' '+(c-i));
				Spinner.element.setAttribute('stroke-dashoffset',o)
				Spinner.id=setTimeout(move,m)
			}
		}
	}
	function move2(){
		let i=c,o=c*2;
		move();
		function move(){
			if(i==0)move1();
			else{
				i-=1;o+=2;
				Spinner.element.setAttribute('stroke-dasharray',i+' '+(c-i));
				Spinner.element.setAttribute('stroke-dashoffset',o)
				Spinner.id=setTimeout(move,m)
			}
		}
	}
};
// Spinner.hide=function(){
// 	Spinner.element.style.display='none';
// 	if(Spinner.id){
// 		clearTimeout(Spinner.id);
// 		Spinner.id=null
// 	}
// 	Spinner.element.setAttribute('stroke-dasharray','0 264');
// 	Spinner.element.setAttribute('stroke-dashoffset','0')
// };