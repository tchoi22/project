class Block{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = y;
    
    this.obj = document.createElement("a-box");
    this.obj.setAttribute("position",{x:x,y:y,z:z});
    this.obj.setAttribute("material","src: #stone");
    
    scene.append(this.obj);

  }
}