$("document").ready(iniciar);

function iniciar(){
	var recursos = "";
	var game = new Phaser.Game(800,600,Phaser.AUTO, "vistaJuego");
	var juego = Juego(game,recursos);
	game.state.add("juego", juego);
	game.state.start("juego");
}

function Juego(game, recursos){
	
	var palo ;
	var bola;
	var ladrillos;
	var bolaEnpalo = true;

	var puntaje = 0 ;
	var vidas = 3;
	
	var puntajeText ;
	var vidasText ;
	var introText;

	var fondo ;	

	var teclaDerecha;
	var teclaIzquierda;	
	var teclaEspacio;

	var estado = {
		preload: function(){
			game.load.image("fondo" , recursos+"starfield.jpg")
			game.load.image("bola", recursos+"breakout/ball.png");
			game.load.image("palo", recursos+"breakout/paddle.png")	
			for(var i  = 0 ;  i < 6 ; i++){
				game.load.image("ladrillo"+i, recursos+"breakout/brick"+i+'.png');
			}
		},
		create: function(){
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.checkCollision.down = false;
			
			fondo = game.add.tileSprite(0,0,800,600,"fondo");

			ladrillos = game.add.group();
			ladrillos.enableBody = true;
			ladrillos.physicsBodyType = Phaser.Physics.ARCADE;	

			var ladrillo ;

			for(var fila = 0 ; fila < 4 ; fila++){
				for(var col = 0 ; col < 15 ; col++){
					ladrillo = ladrillos.create(120 + (col * 36), 100 + (fila * 52), "ladrillo"+fila);
					ladrillo.body.bounce.set(1);
					ladrillo.body.immovable = true;
				}
			}
			palo = game.add.sprite(game.world.centerX ,500 , "palo");
			game.physics.enable(palo,Phaser.Physics.ARCADE);
			palo.anchor.setTo(0.5,0.5);
			palo.body.bounce.set(1);
			palo.body.immovable = true;
			palo.body.collideWorldBounds= true;
			
			bola = game.add.sprite(game.world.centerX ,palo.y-16 , "bola");
			game.physics.enable(bola,Phaser.Physics.ARCADE);
			bola.body.collideWorldBounds = true;		
			bola.anchor.set(0.5);
			bola.checkWorldBounds = true;
			bola.events.onOutOfBounds.add(bolaSale,game);			
			bola.body.bounce.set(1);
			
			puntajeText = game.add.text(31,550, ' puntaje: 0 ',  { font: "20px Arial", fill: "#ffffff", align: "left" });
			vidasText = game.add.text(680,550 , ' vidas: 3 ', { font: "20px Arial", fill: "#ffffff", align: "left" });
			introText = game.add.text(game.world.centerX , 400 , " CLICK PARA INICIAR" , { font: "40px Arial", fill: "#ffffff", align: "center" });
			introText.anchor.setTo(0.5,0.5);

			game.input.onDown.add(lanzarBola , game);
			Phaser.Keyboard.enable = true;
			teclaDerecha = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			teclaIzquierda = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			teclaEspacio = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
	
			
		},
		update: function(){
			if(bolaEnpalo){
				bola.body.x = palo.x;
			}else{
			 	game.physics.arcade.collide(bola,palo , bolaPegaPalo , null, game);
				game.physics.arcade.collide(bola,ladrillos, bolaPegaLadrillo , null , game);
			}	
			if(teclaDerecha.isDown){
				palo.body.x += 10;
			}else if(teclaIzquierda.isDown){
				palo.body.x -= 10;
			}
			if(teclaEspacio.isDown){
				lanzarBola();
			}
		},
		render: function(){
				
		}	
	}

	function bolaSale(){	
		vidas--;
		vidasText.text = 'vidas :' + vidas;
		if(vidas == 0 ){
			finJuego();		
		}else{
			bolaEnpalo = true;
			bola.reset(palo.body.x+16 , palo.y -16 );
		}
			
	}
	function lanzarBola(){
		if(bolaEnpalo){
			introText.visible = false;
			bola.body.velocity.y = -300;
			bola.body.velocity.x = -375;
			bolaEnpalo = false;
		}		
	}
	function bolaPegaPalo(_bola,_palo){
		var diferencia ; 
		if(_bola.x < _palo.x){
			diferencia = _palo.x - _bola.x;
			_bola.body.velocity.x = (-10*diferencia);
		}else if(_bola.x > _palo.x){
			diferencia = _bola.x - _palo.x;
			_bola.body.velocity.x = (10*diferencia);
		}else{
			_bola.body.velocity.x = 2 + Math.random() * 8;
		}
	
	}
	function bolaPegaLadrillo(_bola,_ladrillo){
		_ladrillo.kill();
		puntaje += 70; 
		puntajeText.text= "puntaje: " + puntaje;
		if(ladrillos.countLiving() == 0 ){
			puntaje +=1000;
			puntajeText.text= "puntaje: " + puntaje;
			introText.text="--PROXIMO NIVEL--";
			introText.visible =true;
			bolaEnpalo = true;
			ladrillos.callAll("revive");
			bola.x= palo.x+16 ;
			bola.y = palo.y-16;
			bola.body.velocity.set(0);	
			
		}		
	};
	function finJuego(){
		bolaEnpalo = true;
		ladrillos.callAll("revive");
		puntaje = 0 ;
		vidas = 3;
		introText.text = "Fin del Juego";
		introText.visible = true;
		puntajeText.text = "Puntaje: 0";
		vidasText.text = "Vidas: 3";
		bola.x= palo.x+16 ;
		bola.y = palo.y-16;
		bola.body.velocity.set(0);	
	};
	return estado ;
}

	
