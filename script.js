let maze = [
  
]



let scene;
let camera;
let bullets = [];
let circles = [];
let ammo_count = 25;
let kills = 0;
let wave = 1;
let box;
let healthBox;
let health = 100;
let max_health = 100;
let spawnIntervalId = null;
let spawnRate = 2000; // spawn time 2 secs


window.addEventListener("DOMContentLoaded",function() {
  scene = document.querySelector("a-scene");
  camera = document.querySelector("a-camera");
  scene.addEventListener('loaded', function() {
    for(let r = 0; r < maze.length; r++){
      let row = maze[r];
      let cols = row.split("");
      for(let c = 0; c < cols.length; c++){
        if(cols[c] == "x"){
          new Block(c,1,r)
        }
    }
      
    }

    updateHealthBar();
    document.getElementById("circles-display").textContent = `0/10 Kills`;

    window.addEventListener("keydown",function(e){

    if(e.key == " " && ammo_count > 0  ){
      bullets.push(new Bullet());
      ammo_count--;
      document.getElementById("ammo-display").textContent = `Bullets: ${ammo_count}`;
    }
  })
  
    function spawnCircle() {

      if(circles.length >= 40) return;
      let circle = document.createElement("a-sphere");
      let radius = 30;
      let theta = Math.random() * 2 * Math.PI;
      let x = radius * Math.cos(theta);
      let y = 1;
      let z = radius * Math.sin(theta);
      circle.setAttribute("position", `${x} ${y} ${z}`);
      circle.setAttribute("radius", ".7");
      
      // wave 4 yellow enemy

      let isYellow = wave >= 4 && Math.random() < 0.4; // 40% chance of yellow circles in wave 4+
      if(isYellow) {
        circle.setAttribute("color", "yellow");
        circle.setAttribute("data-speed", "0.12"); // Faster speed for yellow circles
      } else {
        circle.setAttribute("color", "red");
        circle.setAttribute("data-speed", "0.08"); // Original speed for red circles
      }
      
      scene.appendChild(circle);
      circles.push(circle);
    }

    function setSpawnRate(ms) {
      spawnRate = ms;
      if(spawnIntervalId) clearInterval(spawnIntervalId);
      spawnIntervalId = setInterval(spawnCircle, ms);
    }

    function nextWave() {
      wave++;
      document.getElementById("wave-display").textContent = `Wave: ${wave}`;
      let newRate = Math.max(500, 2000 - (wave - 1) * 200);
      setSpawnRate(newRate);
      
      
      kills = 0;
      let needed = 10 + (wave - 1) * 5;
      document.getElementById("circles-display").textContent = `${kills}/${needed} Kills`;
      
      circles.forEach(c => c.remove());
      circles = [];
    }

    function updateHealthBar() {
      let healthPercent = (health / max_health) * 100;
      let healthBar = document.getElementById("health-bar-fill");
      let healthText = document.getElementById("health-text");
      healthBar.style.width = healthPercent + "%";
      healthText.textContent = `Health: ${Math.max(0, health)}`;
    }

    // floor tiles s-------------------------------------

    function createFloorTiles(rows, cols, tileSize) {
      
      let offset = -(rows * tileSize) / 2 + tileSize / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let tile = document.createElement("a-box");
          let x = offset + c * tileSize;
          let z = offset + r * tileSize;
          tile.setAttribute("position", `${x} 0 ${z}`);
          tile.setAttribute("width", tileSize);
          tile.setAttribute("depth", tileSize);
          tile.setAttribute("height", "0.1");

          let base = [150, 75, 0]; 
          let variation = (i) => Math.max(0, Math.min(255, base[i] + (Math.random() - 0.5) * 20));
          let rcol = Math.floor(variation(0));
          let gcol = Math.floor(variation(1));
          let bcol = Math.floor(variation(2));
          let color = `rgb(${rcol},${gcol},${bcol})`;
          tile.setAttribute("color", color);
          scene.appendChild(tile);
        }
      }
    }

    
    createFloorTiles(20, 20, 7.5);


// ------------------------------------------------------------------------------------------------------
    
    function decorateFloor(areaSize) {

      // amount of rocks and grass

      let numRocks = 150; 
      let numGrassClusters = 150; 

      for (let i = 0; i < numRocks; i++) {
        let rock = document.createElement("a-cylinder");
        let rx = (Math.random() - 0.5) * areaSize;
        let rz = (Math.random() - 0.5) * areaSize;
        
        let rRadius = 0.2 + Math.random() * 0.6;
        let rHeight = 0.05 + Math.random() * 0.15;
        let gray = 100 + Math.floor(Math.random() * 80); // 100-180 gray scale
        rock.setAttribute("position", `${rx} ${rHeight / 2} ${rz}`);
        rock.setAttribute("radius", rRadius.toString());
        rock.setAttribute("height", rHeight.toString());
        rock.setAttribute("color", `rgb(${gray},${gray},${gray})`);
        rock.setAttribute("rotation", `0 ${Math.random() * 360} 0`);
        scene.appendChild(rock);
      }
      // grasss 
      for (let i = 0; i < numGrassClusters; i++) {
        let clusterCenterX = (Math.random() - 0.5) * areaSize;
        let clusterCenterZ = (Math.random() - 0.5) * areaSize;
        let blades = 3 + Math.floor(Math.random() * 3);
        for (let j = 0; j < blades; j++) {
          let blade = document.createElement("a-cone");
          let gx = clusterCenterX + (Math.random() - 0.5) * 0.5;
          let gz = clusterCenterZ + (Math.random() - 0.5) * 0.5;
          let height = 0.3 + Math.random() * 0.5;

          blade.setAttribute("position", `${gx} ${height / 2} ${gz}`);
          blade.setAttribute("radius-bottom", "0.05");
          blade.setAttribute("radius-top", "0");
          blade.setAttribute("height", height.toString());
          
          let gval = 150 + Math.floor(Math.random() * 50);
          blade.setAttribute("color", `rgb(34,${gval},34)`);
          blade.setAttribute("rotation", `${(Math.random()-0.5)*20} ${Math.random()*360} ${(Math.random()-0.5)*20}`);
          scene.appendChild(blade);
        }
      }
    }

    decorateFloor(150);

    
    function createTree(x, z) {
      let tree = document.createElement("a-entity");
      // trunk
      let trunk = document.createElement("a-cylinder");
      trunk.setAttribute("position", `0 1.5 0`);
      trunk.setAttribute("radius", "0.3");
      trunk.setAttribute("height", "3");
      trunk.setAttribute("color", "#8B4513");
      tree.appendChild(trunk);
      // small tree
      let leaves = document.createElement("a-cone");
      leaves.setAttribute("position", `0 3.3 0`);
      leaves.setAttribute("radius-bottom", "1.5");
      leaves.setAttribute("radius-top", "0");
      leaves.setAttribute("height", "2");
      leaves.setAttribute("color", "#228B22");
      tree.appendChild(leaves);
      tree.setAttribute("position", `${x} 0 ${z}`);
      return tree;
    }

    
    function createBigTree(x, z) {
      let tree = document.createElement("a-entity");
      // trunk
      let trunk = document.createElement("a-cylinder");
      trunk.setAttribute("position", `0 2 0`);
      trunk.setAttribute("radius", "0.6");
      trunk.setAttribute("height", "4");
      trunk.setAttribute("color", "#8B4513");
      tree.appendChild(trunk);
      // big tree
      let leaves = document.createElement("a-cone");
      leaves.setAttribute("position", `0 4.5 0`);
      leaves.setAttribute("radius-bottom", "3");
      leaves.setAttribute("radius-top", "0");
      leaves.setAttribute("height", "4.8");
      leaves.setAttribute("color", "#2E8B57");
      tree.appendChild(leaves);
      tree.setAttribute("position", `${x} 0 ${z}`);
      return tree;
    }

    
    function scatterTrees(areaSize, count, treeFunc) {
      for (let i = 0; i < count; i++) {
        let tx = (Math.random() - 0.5) * areaSize;
        let tz = (Math.random() - 0.5) * areaSize;
        let tree = treeFunc(tx, tz);
        scene.appendChild(tree);
      }
    }

  
    scatterTrees(150, 50, createTree);
    scatterTrees(150, 30, createBigTree);

    function animateCircles() {
      circles.forEach(circle => {

        let pos = circle.object3D.position;
        let cameraEntity = document.querySelector("a-camera");
        let target = cameraEntity.object3D.position.clone();
        let direction = target.clone().sub(pos).normalize();
        let speed = parseFloat(circle.getAttribute("data-speed")) || 0.08;
        pos.add(direction.multiplyScalar(speed));

        circle.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
      });
      requestAnimationFrame(animateCircles);
    }

// ------------------------------dont change--------------------------------------------------------------------------

    function loop(){
      let cameraPos = camera.object3D.position;
      
      const BOUND = 74.5; 
      if(cameraPos.x > BOUND) cameraPos.x = BOUND;
      if(cameraPos.x < -BOUND) cameraPos.x = -BOUND;
      if(cameraPos.z > BOUND) cameraPos.z = BOUND;
      if(cameraPos.z < -BOUND) cameraPos.z = -BOUND;
      
      if(box) {
        let boxPos = box.obj.object3D.position;
        let distance = cameraPos.distanceTo(boxPos);
        
        if(distance < 2) {
          let bulletsGained = Math.floor(Math.random() * 3) + 3;
          ammo_count += bulletsGained;
          document.getElementById("ammo-display").textContent = `Bullets: ${ammo_count}`;
          box.obj.remove();
          box = new Box();
        }
      }

      if(healthBox) {
        let healthBoxPos = healthBox.obj.object3D.position;
        let distance = cameraPos.distanceTo(healthBoxPos);
        
        if(distance < 2) {
          health += 50;
          if(health > max_health) health = max_health;
          updateHealthBar();
          healthBox.obj.remove();
          healthBox = null;
          
          
          setTimeout(() => {
            healthBox = new HealthBox();
          }, 60000);
        }
      }
      
      for(let b = bullets.length - 1; b >= 0; b--){
        let bullet = bullets[b];
        bullet.fire();
        
        let bulletHit = false;
        for(let i = circles.length - 1; i >= 0; i--){
          let circle = circles[i];
          let bulletPos = bullet.obj.object3D.position;
          let circlePos = circle.object3D.position;
          let distance = bulletPos.distanceTo(circlePos);
          
          if(distance < 1.2){ 
            circle.remove();
            circles.splice(i, 1);
            bullet.obj.remove();
            bullets.splice(b, 1);
            kills++;
            let needed = 10 + (wave - 1) * 5;
            document.getElementById("circles-display").textContent = `${kills}/${needed} Kills`;
            if(kills >= needed) {
              nextWave();
            }
            bulletHit = true;
            break;
          }
        }
      }
      
      for(let i = circles.length - 1; i >= 0; i--){
        let circle = circles[i];
        let circlePos = circle.object3D.position;
        let distance = cameraPos.distanceTo(circlePos);
        
        if(distance < 1.5){
          health -= 10;
          if(health < 0) health = 0;
          updateHealthBar();
          circle.remove();
          circles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(loop);
    }

    
    setSpawnRate(spawnRate);
    setTimeout(() => {
      box = new Box();
    }, 2000);
    setTimeout(() => {
      healthBox = new HealthBox();
    }, 2000);
    animateCircles();
    loop();
  });
})
