class Box {
  constructor() {
    
    this.obj = document.createElement("a-entity");

    let base = document.createElement("a-box");
    base.setAttribute("color", "#4444aa");
    base.setAttribute("width", "0.6");
    base.setAttribute("height", "0.4");
    base.setAttribute("depth", "0.6");
    this.obj.appendChild(base);

    // bullets
    for (let i = -1; i <= 1; i++) {
      let cyl = document.createElement("a-cylinder");
      cyl.setAttribute("color", "gold");
      cyl.setAttribute("radius", "0.05");
      cyl.setAttribute("height", "0.3");
      cyl.setAttribute("rotation", "90 0 0");
      cyl.setAttribute("position", `${i * 0.15} 0.25 0`);
      this.obj.appendChild(cyl);
      
      let tip = document.createElement("a-cone");
      tip.setAttribute("color", "orange");
      tip.setAttribute("radius-bottom", "0.03");
      tip.setAttribute("radius-top", "0");
      tip.setAttribute("height", "0.1");
      tip.setAttribute("rotation", "90 0 0");
      
      tip.setAttribute("position", `${i * 0.15} 0.25 0.15`);
      this.obj.appendChild(tip);
    }

    this.spawn();
    scene.appendChild(this.obj);
  }

  spawn() {
    let radius = 30;
    let theta = Math.random() * 2 * Math.PI;
    let x = radius * Math.cos(theta);
    let y = 0.5;
    let z = radius * Math.sin(theta);
    this.obj.setAttribute("position", `${x} ${y} ${z}`);
  }
}

class HealthBox {
  constructor() {
    // health box
    this.obj = document.createElement("a-entity");

    let base = document.createElement("a-box");
    base.setAttribute("color", "red");
    base.setAttribute("width", "0.7");
    base.setAttribute("height", "0.7");
    base.setAttribute("depth", "0.7");
    this.obj.appendChild(base);

    
    function makeBar(w, h, d, pos, rot) {
      let bar = document.createElement("a-box");
      bar.setAttribute("color", "white");
      bar.setAttribute("width", w);
      bar.setAttribute("height", h);
      bar.setAttribute("depth", d);
      bar.setAttribute("position", pos);
      if (rot) bar.setAttribute("rotation", rot);
      return bar;
    }

    
    const offset = 0.38; 
    
    this.obj.appendChild(makeBar("0.14", "0.42", "0.1", `0 0 ${offset}`));
    this.obj.appendChild(makeBar("0.42", "0.14", "0.1", `0 0 ${offset}`));
    // back
    this.obj.appendChild(makeBar("0.14", "0.42", "0.1", `0 0 -${offset}`));
    this.obj.appendChild(makeBar("0.42", "0.14", "0.1", `0 0 -${offset}`));
    // left
    this.obj.appendChild(makeBar("0.1", "0.42", "0.42", `-${offset} 0 0`, `0 90 0`));
    this.obj.appendChild(makeBar("0.1", "0.14", "0.42", `-${offset} 0 0`, `0 90 0`));
    // right
    this.obj.appendChild(makeBar("0.1", "0.42", "0.42", `${offset} 0 0`, `0 90 0`));
    this.obj.appendChild(makeBar("0.1", "0.14", "0.42", `${offset} 0 0`, `0 90 0`));

    this.spawn();
    scene.appendChild(this.obj);
  }

  spawn() {
    let radius = 30;
    let theta = Math.random() * 2 * Math.PI;
    let x = radius * Math.cos(theta);
    let y = 0.5;
    let z = radius * Math.sin(theta);
    this.obj.setAttribute("position", `${x} ${y} ${z}`);
  }
}
