$(function() {
	var camera, scene, renderer;
	var cube, plane;
	var rotation = 1;
	var requestId, stopped;
	var cubeColor, bgColor;
				
	var stats = initStats();

	// ���������� ��-�� ������������, �������� �� ��������� � �������� ���������
	var controls = new function() {
		this.rotationSpeed = 0.01;
		this.cubeColor = "#0ca745";
		this.bgColor = '#eeeeee';
		this.play = function() { 
						if( stopped ) {
							requestId = window.requestAnimationFrame( animate );
							stopped = false; 
						}};
		this.stop = function() { 
						if ( requestId ) {
							window.cancelAnimationFrame(requestId);
						}
						stopped = true; 
					};
		this.reverse = function() { rotation = ( rotation == 1 ) ? -1 : 1; };
	}

	var gui = new dat.GUI();
	
	// ������� �������� ���������� (2 ������: Colors, Actions)
	var colors = gui.addFolder('Colors');
		cubeColor = colors.addColor(controls, 'cubeColor');
		bgColor = colors.addColor(controls, 'bgColor');

	var actions = gui.addFolder('Actions');
		actions.add(controls, 'play');
		actions.add(controls, 'stop');
		actions.add(controls, 'reverse');
		actions.add(controls, 'rotationSpeed',0,0.1);
	
	colors.open();
	actions.open();		

	// ��������� ����������� ����� ����
	cubeColor.onChange(function() {
		cube.material.color.setStyle( controls.cubeColor );
	});

	// ��������� ����������� ����� ����
	bgColor.onChange(function() {
		renderer.setClearColor( controls.bgColor );
		plane.material.color.setStyle( controls.bgColor );
	});

	init();
	animate();

	// ������ ������������� �������������, �����, ���������, ����, ����� �����, ������.
	function init() {
		
		// ������� � ���������� ������������
		renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.setClearColor( 0xEEEEEE );
			renderer.shadowMapEnabled = true;
			document.body.appendChild( renderer.domElement );

		// ������� �����
		scene = new THREE.Scene();
		
		// ������� � ����������� ���������
		var spotLight = new THREE.SpotLight( 0xFFFFFF );
			spotLight.position.set( -400, 600, -100 );
			spotLight.castShadow = true;
			scene.add(spotLight);
	
		// ������� � ����������� ��������� ��� ����
		var planeGeometry = new THREE.PlaneBufferGeometry(800,800);
		var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xEEEEEE});
		plane = new THREE.Mesh(planeGeometry,planeMaterial);
			plane.receiveShadow = true;
			plane.rotation.x=-0.5*Math.PI;
			plane.position.x = 300;
			plane.position.y = 0;
			plane.position.z = 0;
			scene.add( plane );

		// ������� � ����������� ���
		var cubeGeometry = new THREE.BoxGeometry(200,200,200);
		var	cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x0CA745 });
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cube.castShadow = true;
			cube.position.y = 200;
			scene.add( cube );
		
		// ������� � ����������� ������
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight , 1, 1000);
			camera.position.x = -300;
			camera.position.y = 400;
			camera.position.z = 150;
			camera.lookAt( cube.position );
		
		// ������ �� ���������� ������� ���� ���������
		window.addEventListener( 'resize', onWindowResize, false );

	}
	
	// ������� ��������� ������ � ������������� ��� ��������� ������� ���� ���������
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// ������� �������� ����
	function animate() {
		if ( !stopped ) {
			requestId = window.requestAnimationFrame( animate );
			stopped = false;
		}
		
		cube.rotation.y += (controls.rotationSpeed * rotation);
		stats.update();

		renderer.render( scene, camera );
	}

	// ������� ������������� ����� ���������� (fps)
	function initStats() {
		var stats = new Stats();
			stats.setMode(0);
			$("#stats-output").append(stats.domElement );
			
		return stats;
	}
});