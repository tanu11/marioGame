
	var game=new Phaser.Game(1300,600,Phaser.AUTO,'myphasergame',GameState2,GameState1,menu,scorecard1);
    game.score1=0;
    game.score2=0;

	//myphaser game is the div in whuch game will be displayed
    var menu={
		init:function()
		{
			this.H=this.world.height;
			this.W=this.world.width;
			
		},
		preload:function()
		{
			this.load.image('level1','assets/level11.png');
			this.load.image('level2','assets/level21.png');
			this.load.image('background','assets/back1.jpg');
			
		},
		create:function()
		{   this.bg=this.add.sprite(0,0,'background');
			this.bg.alpha-=.4;
			this.level1=this.add.sprite(500,200,'level1');
		    this.level2=this.add.sprite(500,300,'level2');
		    this.level1.inputEnabled = true;
		    this.level2.inputEnabled = true;
		    this.level1.events.onInputDown.add(this.listener1, this);
		    this.level2.events.onInputDown.add(this.listener2, this);
			
		},
		update:function()
		{
			 
			
		},
		listener1:function()
		{
			game.state.start('level1');
		},
		listener2:function()
		{
			game.state.start('level2');
		}
		
		
	}
	
	var scorecard1={
		init:function()
		{
			this.H=this.world.height;
			this.W=this.world.width;
			
		},
		preload:function()
		{   
			this.load.image('box','assets/box.png');
			this.load.image('score','assets/score.png');
			this.load.image('background','assets/back3.png');
			
		},
		create:function()
		{   this.bg=this.add.sprite(0,0,'background');
		    
			this.bg.alpha-=.6;
		    this.box=this.add.sprite(350,50,'box');
		    this.textbox=this.add.text(400,100,"Score: "+game.score1);
			
			
		},
		update:function()
		{
			 
			
		},
		
		
	}

	var GameState1={

		init:function(someparm){

			//initalise settings for entire game
			//optional method
			// but if information between 2 levels needed to be passed

			console.log("in init");
			GameState1.world.resize(2500,600);
			flag=0;
			this.H=this.world.height;
			this.W=this.world.width;
			this.playerHealth=100;
			this.score=0;
		   //this game uses arcade physics, so to START PHYSICS
			this.physics.startSystem(Phaser.Physics.ARCADE);


			this.physics.arcade.gravity.y=1000;

		  //attach the keyboard to this game cursor keys are left right up and down
			this.keys= this.input.keyboard.createCursorKeys();
			//this is for spacebadr;
			this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		},
		preload:function()
		{    
				//key ,image to be loaded
			//this.load.image('player','images/pika.png')
			this.load.image('ground','images/greenground.png');
			this.load.image('platform','images/platform.png');
			this.load.image('tree','images/tree.png');
			this.load.image('hill','images/hill.png');
			this.load.image('ball','images/snow.png');
			this.load.image('door','images/castledoors.png');
			this.load.image('key','images/key-icon.png');
			this.load.spritesheet('android','Images/android_spritesheet.png',80,100,5);

			this.load.spritesheet('player','Images/player_spritesheet.png',29,31,5);
			//no of frames,padding ,margin


			this.load.spritesheet('coin','assets/coin_gold.png',32,31,8);
			//no of frames,padding ,margin



		},


		create: function()
		{//to create the objects in the game  


			console.log("in create");
			this.textbox=this.add.text(20,20,"Health= "+this.playerHealth);
			this.textbox2=this.add.text(1000,20,"Score= "+this.score);
			this.textbox.fixedToCamera=true;
			this.textbox2.fixedToCamera=true;
			 for(var i=0;i<=10;i++)
			{    var s=Math.random()*2 + 0.5;

				var h=this.add.sprite(i*200,this.H-82,'hill');
				 h.anchor.setTo(0.5,1);
				  h.scale.setTo(s,s);
			}


			this.stage.backgroundColor="#6dbbe5";
			//		this.player2=this.add.image(100,100,'player');
			//		this.player2.anchor.setTo(0.25,0.25);


			//add trees

			for(var i=0;i<=10;i++)
			{   var x=Math.random()*this.W;
				this.add.sprite(x,this.H-200,'tree');
			}
			this.player=this.add.sprite(100,100,'player');
			this.door=this.add.sprite(this.W-64,this.H-159,'door');


			this.player.scale.setTo(2,2);
			this.player.animations.add('playerwalk',[0,1,2,0],6,true);

			//add ground
			this.ground=this.add.tileSprite(0,this.H-82,this.W,82,'ground');


			//add platform
			this.platform=this.add.sprite(200,150,'platform');

			//add android
			this.android=this.add.sprite(200,150,'android');
			//change the anchor point so that it is drawn on platform
			this.android.anchor.setTo(0,1);
			this.android.animations.add('androidkick',[0,1,2,0],10,true);
			// spritesheetname,frame,speed,
			this.android.animations.play('androidkick');

			//<------------------------------------------------------------------------------------------->

			//both steps can be done by enabling physics on a sprite
			this.physics.arcade.enable(this.player);
			this.physics.arcade.enable(this.ground);
			this.physics.arcade.enable(this.door);
			this.physics.arcade.enable(this.platform);//set immovable now;



			//<------------------------------------------------------------------------------------------->
			this.ground.body.allowGravity=false;
			this.ground.body.immovable=true;


			this.platform.body.allowGravity=false;
			this.platform.body.immovable=true;

			this.door.body.allowGravity=false;
			this.door.body.immovable=true;


			//<------------------------------------------------------------------------------------------->

			//this.player.body.bounce.y=0.5; //this.player.body.setSize(250,286,0,0);
			//for adding event listners

			//for pixel perfect collision
	//	    this.player.input.pixelPerfectClick = true;
			//make sure input is enabled for the body
			this.player.events.onInputDown.add(this.jump,this);

			this.createPlatforms();
			//SO THAT PLAYER DOESNOT GO OUT OF SCReeN
			this.player.body.collideWorldBounds=true;
			//making ball groups
			this.ballsGroup=this.add.group();
			this.ballsGroup.enableBody=true;
			this.door.body.setSize(10,10,50,50);


			//talk about events
			//something like setinterval
			this.ballMaker=this.time.events.loop(2000,this.makeBall,this);

			this.player.inputEnabled=true;


		},

		makeBall:function()
		{ 


			var ball=this.ballsGroup.getFirstExists(false);
			if(!ball)
			 ball=this.ballsGroup.create(250,130,'ball');
			else
			{	ball.reset(250,130);
				console.log("A ball is reset");
			}

		    ball.body.velocity.x=100;
				var x = Math.random();
			if(x>0.4){
				ball.body.velocity.x = 140;//Math.round(Math.random()*40 + 20);
			}
			else{
				 ball.body.velocity.x = -50;//-1*Math.round(Math.random()*40 + 20);
			}

		},
		update:function(){
			//upade te objects 

			//this.player.alpha-=0.01;
			//this.player2.angle+=0.05;

			this.physics.arcade.collide(this.player,this.ground);

			this.physics.arcade.collide(this.player,this.platform);
			this.physics.arcade.collide(this.ballsGroup,this.platform);
			this.physics.arcade.collide(this.ballsGroup,this.ground);
			//this.physics.arcade.collide(this.ballsGroup,this.player);
			this.physics.arcade.collide(this.player,this.platformGroup);
			this.physics.arcade.collide(this.ballsGroup,this.platformGroup);


			this.physics.arcade.overlap(this.ballsGroup,this.player,this.reduceHealth,null,this);
			this.physics.arcade.overlap(this.key,this.player,this.keyfound,null,this);
			this.physics.arcade.overlap(this.door,this.player,this.goalReached,null,this);
			// function call,ofter overlap is complete function,context

			this.player.body.velocity.x=0;

			var flag=0;

			if(this.jumpButton.isDown )
				{  
					this.jump(800);

				}
			else if(this.keys.up.isDown)
				{  
					this.jump(400);

				}
			 if(this.keys.left.isDown)
				{  
					this.player.scale.setTo(2,2);
					this.player.animations.play('playerwalk');
					flag=1;
					this.player.body.velocity.x=-390;
				}
			 if(this.keys.right.isDown)
				{  this.player.scale.setTo(-2,2);
					this.player.animations.play('playerwalk');
					flag=1;
					this.player.body.velocity.x=390;
				}
			if(flag==0)
				{
					this.player.animations.stop();
					   this.player.frame = 3;

				}

			//iterate over every ball in the pool 
			this.ballsGroup.forEach(function(ball){

				if(ball.x<=0||ball.x>=this.W)
				{
					ball.kill();
					console.log("A ball is dead");
				}
				else if(ball.y>=this.H-82)
				{
					ball.kill();
					console.log("A ball is dead");
				}	

			});
		    
			if (game.physics.arcade.collide(this.player,this.coinGroup,this.collisionHandler,this.processHandler, this))
			{  
				this.incrementScore();
				console.log('boom');
			}

			

			this.camera.follow(this.player);

		},

		 reduceHealth:function(){
			 this.playerHealth -= 1;
		   // console.log("Reducing health"+this.playerHealth);
			this.textbox.setText("Health="+this.playerHealth);
			//alert("Reducing Health");

			 if(this.playerHealth<0)
			{	alert("game over");
			   this.game.state.start('level1');
			}

		},
		incrementScore:function()		{
			this.score=this.score+10;
			this.textbox2.setText("Score="+this.score);
			
		},		

		jump:function(x){

			//if this condition is removed then player player will jump i=even in mid air which we dont want
			if(this.player.body.touching.down)
			{
				console.log("jump");
				this.player.body.velocity.y =-x;
			}

		},
		createPlatforms:function()
		{
			//make a group name platform
			this.platformGroup=this.add.group();
			this.platformGroup.enableBody=true;

			this.coinGroup=this.add.group();

			this.coinGroup.enableBody=true;

		   //this.platformGroup=[];
			var x=150;
			var rand=Math.floor(Math.random()*7)+1;
			for(var i=1;i<8;i++)
			{   
				var y=this.H/2+80-Math.round(Math.random()*250);
	//			var a=this.add.sprite(i*300+x,y,'platform');
	//			this.physics.arcade.enable(a);
	//			a.body.allowGravity=false;
	//			a.body.immovable=true;
	//			this.platformGroup.push(a);



				this.platformGroup.create(i*300+x, y,'platform');
				 if(i==rand)
				{
					this.createkey(i*300+x,y);
				}
				else
					this.createcoins(i*300+x,y);
				//this.platformGroup.create(i*400, y2,'platform');
			}

	        this.coinGroup.setAll('body.immovable',true);
			this.coinGroup.setAll('body.allowGravity',false);

			this.platformGroup.setAll('body.immovable',true);
			this.platformGroup.setAll('body.allowGravity',false);

		},
		createkey:function(x,y)
		{   this.key=this.add.sprite(x+100,y-70,'key');
			this.physics.arcade.enable(this.key);
			this.key.body.allowGravity=false;
			this.key.body.immovable=true;



		},
		createcoins:function(x,y)
		{
			//add android
			var coins=this.coinGroup.create(x+40, y-30,'coin');
			
			
			coins.animations.add('coinrotate',[0,1,2,3,4,5,6,7],10,true);
			// spritesheetname,frame,speed,
			coins.animations.play('coinrotate');

		},
		keyfound:function()
		{
			this.key.destroy();
			flag=1;
		},
		goalReached:function()
		{    
			if(flag==1)
			{    alert('goal reacchecgef');
				game.state.start('menu');
			}

		},
		 processHandler:function(player,object) {

			return true;

		},

	   collisionHandler:function (player,object) {

		  object.kill();
	   },


	};


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------


	var GameState2={
			init:function(){
			this.physics.startSystem(Phaser.Physics.ARCADE);

			//this.physics.arcade.gravity.y=600;

			//attach the keyboard to this game

			//this is for spacebar;
			this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


			this.H=this.world.height;
			this.k=this.H/60;

			this.W=this.world.width;
			this.pts=0;
			this.timelastkey=0;
			this.numkeys=0;
		    this.coins=0;
			this.lock=[];
				

		},

		preload: function() { 

			this.load.image('bird', 'assets/bird.png'); 
			this.load.image('pole','assets/pipe.png');
			this.load.image('key','assets/key.png');
			this.load.image('lock','assets/lock.png');
			//add audio
			this.load.audio('jump','assets2/jump.wav');
			this.load.image('background','assets/background2.png');
			
			this.load.spritesheet('coin','assets/coin_gold.png',32,31,8);
			//no of frames,padding ,margin

		},

		create: function() { 

			//this.stage.backgroundColor="#7ec0ee";
			this.bg=this.add.sprite(0,0,'background');
			this.bg.alpha-=0.1;
			this.bird=this.add.sprite(220,100,'bird');
		 
		
			this.physics.startSystem(Phaser.Physics.ARCADE);
			this.physics.arcade.enable(this.bird);

			this.bird.body.setSize(30,33,0,7);
			//so that momentum is not transferred when it collides with key
			this.bird.body.immovable=true;

		// Add gravity to the bird to make it fall
			this.bird.body.gravity.y = 290; 
			this.bird.body.collideWorldBounds=true;
			//create audio object
			this.jumpSound=this.add.audio('jump');


		//make group for poles
			this.polesGroup=this.add.group();
		//enable on body;
			this.polesGroup.enableBody=true;

		//make group for poles
			this.keyGroup=this.add.group();
		//enable on body;
			this.keyGroup.enableBody=true;
		    
			//this.textbox=this.add.text(20,20,"keys left = "+(3-this.numkeys));
			
			
			
		//
			
			for(var i=0;i<3;i++)
			{   var x=this.add.sprite(i*35+15,15,'lock');
			    x.scale.setTo(1.2,1.2);
				this.lock.push(x);
			}
		    var coins=this.add.sprite(1180,15,'coin');
			coins.animations.add('coinrotate',[0,1,2,3,4,5,6,7],10,true);
			// spritesheetname,frame,speed,
			coins.animations.play('coinrotate');
			coins.scale.setTo(1.8,1.8);
			this.textbox2=this.add.text(1235,20,"X "+this.coins);
			
			
			
		    //make group for poles
			this.coinGroup=this.add.group();
		    //enable on body;
			this.coinGroup.enableBody=true;
		    
			
			this.polesGroup.setAll('body.immovable',true);
			this.polesGroup.setAll('body.allowGravity',false);

			
			this.keyGroup.setAll('body.immovable',true);
			this.keyGroup.setAll('body.allowGravity',false);
			
			
			 
			this.coinGroup.setAll('body.immovable',true);
			this.coinGroup.setAll('body.allowGravity',false);




			this.poleMaker=this.time.events.loop(1900,this.addRow,this);



		},

		update: function() {

			if(this.bird.angle<=15)
			this.bird.angle+=1;
			if(this.jumpButton.isDown)
			{   this.bird.body.velocity.y=-175;
			  	if(this.bird.angle>-15)
			    this.bird.angle-=2;
        		this.jumpSound.play();
			}

			this.polesGroup.forEach(function(pole){

				if(pole.x+100<0)
				{
					pole.kill();
					console.log("A pole is dead");
				}


			});
			
			this.coinGroup.forEach(function(coin){

				if(coin.x+100<0)
				{
					coin.kill();
					console.log("A pole is dead");
				}


			});
			
			this.physics.arcade.collide(this.polesGroup,this.bird,this.game_over,null,this);

			if (game.physics.arcade.collide(this.bird,this.keyGroup,this.collisionHandler,this.processHandler, this))
			{   this.countkeys();
				console.log('boom');
			}
			
			if (game.physics.arcade.collide(this.bird,this.coinGroup,this.collisionHandler,this.processHandler, this))
			{   this.incrementCoins();
				console.log('boom');
			}
			this.keyGroup.forEach(function(key){

				if(key.x+100<0)
				{
					key.kill();
					console.log("A key is dead");
				}


			});
		},
		game_over:function()
		{
			this.bird_angle=-90;
			
			//game.state.restart('level1');
			game.state.start('menu');
		},
		addRow:function()
		{ 
				var hole= Math.floor(Math.random() * (this.k-4)) + 1;
				this.addpole(hole); 

		},

		addpole:function(hole)
		{  

			//because poles can be made after create functin so it has to be done in update

			var pole=this.polesGroup.getFirstExists(false);

			//var fire=this.fireGroup.getFirstExists(false);
			if(!pole)      
			{
				 pole=this.polesGroup.create(this.W,0,'pole');//do -100 if you want it i between 
				 pole.scale.setTo(1,hole);


			}
			else
			{	 pole.reset(this.W,0);
				 pole.scale.setTo(1,hole);
				 console.log("A ball is reset");
			}
			var poled=this.polesGroup.getFirstExists(false);

			if(!poled)      
			{
				 poled=this.polesGroup.create(this.W,(hole+3)*60,'pole');//do -100 if you want it i between 
				 poled.scale.setTo(1,this.k-2-hole);


			}
			else
			{	poled.reset(this.W,(hole+3)*60);
				poled.scale.setTo(1,this.k-2-hole);
					console.log("A ball is reset");
			}
			
			
			//creating keys
			var rand=Math.random()*10;
			if(rand==0){
				  this.createkey(hole);
				  this.timelastkey=0;
				  console.log("key here 0");
			}
			else
			{  this.timelastkey=this.timelastkey+1;
			   if(this.timelastkey>=5)
				{
				  this.createkey(hole);
				  this.timelastkey=0;
			    }
			  console.log("key here");

			}
			
			 rand=Math.random()*10;
			if(rand<3){
				  this.createcoins(hole);
				
			}
			


			console.log("timelastkey"+this.timelastkey);

			poled.body.velocity.x=-200;
			pole.body.velocity.x=-200;


	
		},

		createkey:function(hole)
		{ 
			var key=this.keyGroup.getFirstExists(false);


			if(!key)      
			{
				 key=this.keyGroup.create(this.W,(hole+1)*60,'key');//do -100 if you want it i between 
				 key.scale.setTo(2,2);


			}
			else
			{  key.reset(this.W,(hole+1)*60);
			   key.scale.setTo(2,2);
					console.log("A ball is reset");
			}
			key.body.velocity.x=-200;
			key.body.velocity.x=-200;
			key.body.setSize(22,22,8,8);
            
			this.keyGroup.setAll('body.immovable',true);
			this.keyGroup.setAll('body.allowGravity',false);



		},
		countkeys:function()
		{
			this.numkeys=this.numkeys+1;
			this.lock[this.lock.length-1].destroy();
			this.lock.pop();
			
			

			if(this.numkeys==3)
			{
				alert('YOU WIN !!');
				game.state.restart('level1');
			}
		},

	   processHandler:function(player,object) {

			return true;

		},
		createcoins:function(hole)
		{
			//add android
			
			var coins=this.coinGroup.getFirstExists(false);


			if(!coins)      
			{
				 coins=this.coinGroup.create(this.W,(hole+1)*60,'coin');//do -100 if you want it i between 
				


			}
			else
			{  coins.reset(this.W,(hole+1)*60);
			  
			}
			coins.body.velocity.x=-200;
			
           
			
			
			coins.animations.add('coinrotate',[0,1,2,3,4,5,6,7],10,true);
			// spritesheetname,frame,speed,
			coins.animations.play('coinrotate');

		},
		incrementCoins:function()
		{  
			this.coins=this.coins+1;
			this.textbox2.setText("X "+this.coins);
			
		},
		

	    collisionHandler:function (player,object) {

		  object.kill();
	   },

		render:function()
		{
			 //game.debug.body(this.bird);
		}




	};
  
    game.state.add('menu',menu);
	game.state.add('level2',GameState2);

	game.state.add('level1',GameState1);
   
	game.state.add('scorecard1',scorecard1);
	//start game by telling game manager which state level to start
	game.state.start('menu');


