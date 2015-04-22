var camera, scene, renderer;
var cube;
var rotation = 1;
			
			var stats = initStats();
			
			var controls = new function() {
				this.rotationSpeed = 0.01;
				this.cubeColor = 0x0ca745;
				this.bgColor = 0xEEEEEE;
				this.play = function() { console.log("play") };
				this.stop = function() { console.log("stop") };
				this.reverse = function() { console.log("reverse") };
			}
			
			var gui = new dat.GUI();
			
			var colors = gui.addFolder('Colors');
				colors.addColor(controls, 'cubeColor');
				colors.addColor(controls, 'bgColor');

			var actions = gui.addFolder('Actions');
				actions.add(controls, 'play');
				actions.add(controls, 'stop');
				actions.add(controls, 'reverse');
				actions.add(controls, 'rotationSpeed',0,0.05);

			actions.open();

			init();
			animate();

			function init() {

				renderer = new THREE.WebGLRenderer();
				
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor(0xEEEEEE);
				renderer.shadowMapEnabled = true;
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();
				
				camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight , 1, 1000);
		
				var spotLight = new THREE.SpotLight( 0xFFFFFF );
				spotLight.position.set( -400, 600, -100 );
				spotLight.castShadow = true;
				scene.add(spotLight);

				var planeGeometry = new THREE.PlaneBufferGeometry(800,800);
				var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xEEEEEE});
				var plane = new THREE.Mesh(planeGeometry,planeMaterial);
				plane.receiveShadow = true;
						   
				plane.rotation.x=-0.5*Math.PI;
				plane.position.x = 300;
				plane.position.y = 0;
				plane.position.z = 0;
				
				scene.add(plane);
		  
				var cubeGeometry = new THREE.BoxGeometry(200,200,200);
				var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x0ca745 });
				cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
				cube.castShadow = true;
				
				cube.position.y = 200;
				
				scene.add(cube);
				
				camera.position.x = -300;
				camera.position.y = 400;
				camera.position.z = 150;
				
				camera.lookAt(cube.position);
				
				animate();

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
	
				cube.rotation.y += (controls.rotationSpeed * rotation);
				stats.update();

				renderer.render( scene, camera );
			}
			
			function setRotation() {
				rotation = ( rotation == 1 ) ? -1 : 1;
			}
			
			function initStats() {
				var stats = new Stats();
				stats.setMode(0);
				$("#stats-output").append(stats.domElement );
				return stats;
			}