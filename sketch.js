var dog,sadDog,happyDog,garden,washroom,livingRoom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");
livingRoom=loadImage("Living Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
 // currentTime=hour();
 // if(currentTime==(lastFed+1)){
 //     update("Playing");
 //     foodObj.garden();
 //  }else if(currentTime==(lastFed+2)){
 //   update("Sleeping");
 //     foodObj.bedroom();
 //  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
 //   update("Bathing");
 //     foodObj.washroom();
 //  }else{
 //   update("Hungry")
 //   foodObj.display();
 //  }
   getTime();
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}

async function getTime(){
  var response=await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseType=await response.json();  
  console.log(responseType);
  var dt=responseType.datetime;
  console.log(dt);
  var hour=dt.slice(11,13);
  console.log(hour);
  if(hour>=6 && hour<=7){
    update("Hungry")
    foodObj.display();
  }
  else if(hour>7 && hour<8){
    update("Bathing");
    foodObj.washroom();
  }
  else if(hour>=8 && hour<12){
    update("Playing");
    foodObj.garden();
  }
   else if(hour>=12 && hour<13){
    update("Hungry")
    foodObj.display();
  }
  else if(hour>=13 && hour<15){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(hour>=15 && hour<18){
    update("Playing");
    foodObj.garden();
  }
  else if(hour>=18 && hour<19){
    update("Bathing");
    foodObj.washroom();
  }
  else if(hour>=19 && hour<20){
    update("Hungry")
    foodObj.display();
  }
  else if(hour>=20 && hour<=24){
    update("Sleeping");
      foodObj.bedroom();
  }
  else if(hour>=0 && hour<6){
    update("Sleeping");
      foodObj.bedroom();
  }
 }