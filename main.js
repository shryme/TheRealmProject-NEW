//Total Earnings in donations off of the game so far: $3.99

//Const for images
var PATH = {
  character: 'assets/sprites/classes/',
  enemy: 'assets/sprites/enemies/',
  item: 'assets/sprites/items/',
  projectile: 'assets/sprites/projectiles/',
  tile: 'assets/sprites/tiles/',
  sound: 'assets/sounds/'
}

//Audio Files
//Game Background Music loops with this.
var gameBackgroundMusic = new Audio(PATH.sound + "Valiant-Struggle.mp3");
      gameBackgroundMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.volume = 0.5;
        this.play();
      }, false);
gameBackgroundMusic.volume = 0.5;
gameBackgroundMusic.play();

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
document.getElementById("myCanvas").style.background = "url('" + PATH.tile + "oldStoneFloor.png') repeat";
document.getElementById("myCanvas").style.backgroundSize = "50px";
var mouseClicked = false;

//ENEMIES
var enemy_bug_Pic = new Image();
enemy_bug_Pic.src = PATH.enemy + "enemy_bug.png";
var enemy_skull_Pic = new Image();
enemy_skull_Pic.src = PATH.enemy + "enemy_skull.png";
var enemy_skull_boss_Pic = new Image();
enemy_skull_boss_Pic.src = PATH.enemy + "enemy_skull_boss.png";
//CHARACTERS
var classSelectionPics = [new Image(), new Image(), new Image()];
classSelectionPics[0].src = PATH.character + "characterSprite.png";
classSelectionPics[1].src = PATH.character + "archer_right_Pic.png";
classSelectionPics[2].src = PATH.character + "mage_right_Pic.png";
//Default Class
var player_Pic = new Image();
player_Pic.src = PATH.character + "characterSprite.png";
//Archer Class
var archer_Pics = [new Image(), new Image(), new Image(), new Image()];
archer_Pics[0].src = PATH.character + "archer_right_Pic.png";
//BULLETS
var player_Bullet_Pic = new Image();
player_Bullet_Pic.src = PATH.projectile + "charBullet1.png";
//ITEMS
var weaponBowList = [[new Image(), new Image()], [new Image(), new Image()]];
weaponBowList[0][0].src = PATH.item + "shadowBow.png";
weaponBowList[0][1].src = PATH.projectile + "shadowBowArrow.png";
weaponBowList[1][0].src = PATH.item + "innocentBloodBow.png";
weaponBowList[1][1].src = PATH.projectile + "innocentBloodBowArrow.png";
var armorList = [new Image(), new Image(), new Image(), new Image()];
armorList[0].src = PATH.item + "chestplate_T1.png";
armorList[1].src = PATH.item + "chestplate_T2.png";
armorList[2].src = PATH.item + "chestplate_T3.png";
armorList[3].src = PATH.item + "chestplate_T4.png";
var potionList = [new Image(), new Image(), new Image(), new Image(), new Image()];
potionList[0].src = PATH.item + "attack_Potion.png";
potionList[1].src = PATH.item + "speed_Potion.png";
potionList[2].src = PATH.item + "dexterity_Potion.png";
potionList[3].src = PATH.item + "wizardry_Potion.png";
potionList[4].src = PATH.item + "youth_Potion.png";
var lootBagPics = [new Image()];
lootBagPics[0].src = PATH.item + "brownLootBag.png";

var backgroundPos = [0, 0];
var FRAME_SPEED = 16;
var gameSecond = 1000 / FRAME_SPEED;
var gameTime = 0;
var mouseX = 0;
var mouseY = 0;
var defaultNamesList = ["Yammo", "Mish", "Netuno", "Pridon", "Kamini", "Ellil", "Zanoo", "Nin", "Noroen", "Vypio", "Terg", "Rarmom", "Tsang", "Oitzo", "Oopu", "Oorbo", "Asham", "Iti", "Tish", "Scell", "Er", "Othvo", "Yivoo", "Glaspio", "Luoten", "Zythe"];

//Selects random user name.
var PLAYER_USER_NAME = defaultNamesList[Math.floor((Math.random() * defaultNamesList.length) + 0).toFixed(0)];
//CHAT
var wordString = "";
var chatLog = [];
//VERSION INFO
var versionInfo = "Version 1.1.E";
//FOR MAP HITBOX SORTING
var left = 0;
var right = 1;
var topOf = 2;
var bottomOf = 3;
//Kill count for statistics
var killCount = 0;
//Map
var mapBorder = [-600, 600, -600, 600];
var MAP_TILES = [];

var stoneGround = [new Image(), new Image(), new Image(), new Image()];
stoneGround[0].src = PATH.tile + "oldStoneFloor.png";
stoneGround[1].src = PATH.tile + "oldStoneFloorCracked.png";
stoneGround[2].src = PATH.tile + "oldStoneFloorHole.png";
stoneGround[3].src = PATH.tile + "oldStoneFloorSmallCracked.png";

function generateGameMap () {

  //Creates a 20x20 Grid.
  for (var row = 0; row < 20; row++) {
    for (var column = 0; column < 20; column++) {

      var chance = (Math.random() * 10);
      if (chance <= 7) { MAP_TILES.push([stoneGround[0] , row * 50, column * 50]);  }
      else if (chance <= 8) { MAP_TILES.push([stoneGround[1] , row * 50, column * 50]); }
      else if (chance <= 9) { MAP_TILES.push([stoneGround[2] , row * 50, column * 50]); }
      else if (chance <= 10) { MAP_TILES.push([stoneGround[3] , row * 50, column * 50]); };

    };
  };
}
//Player(s)
var playerList = [new player()];
var playerDamageNumberList = [];
//Enemies
var enemyList = [];
var damageNumberList = [];
//Bullets
var bulletList = [];
var enemyBulletList = [];
//Loot
var lootBagList = [];
//Keyboard keys used in game
var keys = {

    W: false,
    A: false,
    S: false,
    D: false,
    T: false,
    B: false,
    P: false,
    ENTER: false,
    SHIFT: false
};
//Screen
var screenType = "MAIN_MENU";
//SAVE AND LOAD GAME ============
function LOAD_GAME () {

  playerList[0].userName = localStorage["userName"];

  alert("Game Loaded!");
}
function SAVE_GAME () {

  localStorage["userName"] = playerList[0].userName;

  alert("Game Saved!");
}
//END SAVE AND LOAD GAME ========
//GAME OBJECTS ==================
function player () {

  //Username
  this.userName = PLAYER_USER_NAME;
  this.spriteImage = player_Pic;
  this.timeToSpriteChange = 100;
  //Death Stats
  this.deathGlory = 0;
  //Weapon and Sprite
  this.bulletSpriteImage = player_Bullet_Pic;
  //Speed
  this.speed = 10;
  this.speedFormula = 3 + (7 * (this.speed / 100));
  this.MAX_SPEED = 100;
  //Damage
  this.damageVariance = function() { return (Math.random() * 10) - 5; };
  this.damage = 100;
  //Dexterity
  this.dexterity = 200;
  this.MAX_DEXTERITY = 200;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = 1000 / (1 + (this.dexterity / 8));
  //Position and Dimensions
  this.Xpos = (canvas.width - 210) / 2;
  this.Ypos = canvas.height / 2;
  this.height = 40;
  this.width = 40;
  //Exp/Leveling
  this.EXP = 0;
  this.level = 1;
  this.levelExpReq = 100;
  this.glory = 0;
  //HP
  this.HP = 200;
  this.MAX_HP = 200;
  this.youth = 300;
  this.MAX_YOUTH = 1000;
  //MP
  this.MP = 150;
  this.MAX_MP = 150;
  this.wizardry = 200;
  this.MAX_WIZARDRY = 400;
  //Specials
  this.special_MP_cost = 20;
  this.specialCooldown = 0;
  this.MAX_SPECIAL_COOLDOWN = 200;
  //isViewingLoot used to only see one loot bag at a time.
  this.isViewingLoot = [false, 0];
  this.mouseOccupied = false;
  this.inventory = [];
  this.inventoryInitialized = false;
  //Equipment
  this.equipmentInventory = [];

  //Temporary hitbox for inventory. Just to quickly throw in something. will be re-worked later.
  this.inventoryTop = function () { return 370; };
  this.inventoryBottom = function () { return 370 + 90; };
  this.inventoryLeft = function () { return canvas.width - 195; };
  this.inventoryRight = function () { return canvas.width - 195 + 165; };

  this.drawInventory = function() {

    //If inventory isn't drawn then items will not appear. This way inventory slots are not layered, but all in one layer.
    for (var i = 0; i < 3; i++) {
      for (var col = 0; col < 8; col++) {

        var row = 0;
        if (col >= 4) { row = 1; };
        var topOfInventory = 420;

        if (this.inventory.length < 8) {

          //Default Xpos, Ypos, col, row, itemGiven
          this.inventory.push(new inventorySlot(canvas.width - 180, topOfInventory, col, row));

        }
        else { this.inventory[col].renderToScreen(i); };

      };
    };
  };
  //Leveling up
  this.levelUP = function() {

    //Dexterity
    if (this.dexterity < this.MAX_DEXTERITY) { this.dexterity = this.dexterity + Math.floor((Math.random() * 5) + 2); };
    this.MAX_WEAPON_COOLDOWN = 1000 / (1 + (this.dexterity / 8));
    //HP
    this.MAX_HP = this.MAX_HP + Math.floor((Math.random() * 40) + 16);
    this.HP = this.MAX_HP;
    //MP
    if (this.wizardry < this.MAX_WIZARDRY) { this.wizardry = this.wizardry + Math.floor((Math.random() * 3) + 1); };
    this.MAX_MP = this.MAX_MP + Math.floor((Math.random() * 15) + 6);
    this.MP = this.MAX_MP;
    //Attack
    this.damage = this.damage + Math.floor((Math.random() * 3) + 1);
    //Speed
    this.speed = this.speed + Math.floor((Math.random() * 2));
    if (this.speed >= this.MAX_SPEED) { this.speed = this.MAX_SPEED; };
    this.speedFormula = 3 + (7 * (this.speed / 100));
    //Youth
    if (this.youth < this.MAX_YOUTH) { this.youth = this.youth + Math.floor((Math.random() * 4) + 1); };
    if (this.youth > this.MAX_YOUTH) { this.youth = this.MAX_YOUTH; };
    //EXP
    this.EXP = this.EXP - this.levelExpReq;
    this.level++;
    this.levelExpReq = this.levelExpReq + 150;

    if (this.EXP >= this.levelExpReq && this.level < 50) { this.levelUP(); };
  };
  //Death Scene
  this.deathScene = function() {

    this.HP = this.MAX_HP;
    this.MP = this.MAX_MP;
    //Remove all Entities
    enemyList.splice(0, enemyList.length);
    enemyBulletList.splice(0, enemyBulletList.length);
    bulletList.splice(0, bulletList.length);
    damageNumberList.splice(0, damageNumberList.length);
    playerDamageNumberList.splice(0, playerDamageNumberList.length);
    lootBagList.splice(0, lootBagList.length);
    //Show Death screen
    screenType = "DEATH_SCREEN";
    this.deathGlory += this.glory;
  };
  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };
  //Movement Logic
  this.move = function() {

    if (keys["W"] && this.Ypos > mapBorder[topOf] + this.height) { this.Ypos = this.Ypos - (this.speedFormula * (60 / gameSecond)); };
    if (keys["A"] && this.Xpos > mapBorder[left] + this.width) { this.Xpos = this.Xpos - (this.speedFormula * (60 / gameSecond)); };
    if (keys["S"] && this.Ypos < mapBorder[bottomOf] - this.height) { this.Ypos = this.Ypos + (this.speedFormula * (60 / gameSecond)); };
    if (keys["D"] && this.Xpos < mapBorder[right] - this.width) { this.Xpos = this.Xpos + (this.speedFormula * (60 / gameSecond)); };
  };
  this.renderToScreen = function() {

    //Image of player
    ctx.drawImage(this.spriteImage, this.Xpos, this.Ypos, this.width, this.height);
  };
}
function playerBullet (defaultXspeed, defaultYspeed, defaultHeight, defaultWidth, angleSend, mouseXSent, mouseYSent, imageGiven) {

  //Calculates angle of attack
  var deltaY = playerList[0].Ypos + (playerList[0].height / 2) - mouseY;
  var deltaX = playerList[0].Xpos + (playerList[0].width / 2) - mouseX;
  this.angle = angleSend * (Math.PI / 180) || Math.atan2(-deltaY, -deltaX);

  this.damage = playerList[0].damage + playerList[0].damageVariance();
  this.Xspeed = defaultXspeed * (60 / gameSecond);
  this.Yspeed = defaultYspeed * (60 / gameSecond);
  this.Xpos = mouseXSent || playerList[0].Xpos + (playerList[0].width / 2);
  this.Ypos = mouseYSent || playerList[0].Ypos + (playerList[0].height / 2);
  this.height = defaultHeight;
  this.width = defaultWidth;
  this.lifeTime = 0.5 * gameSecond;
  this.spriteImage = imageGiven;

  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  //Movement Logic
  this.move = function() {

    this.Xpos = this.Xpos + (this.Xspeed * Math.cos(this.angle));
    this.Ypos = this.Ypos + (this.Yspeed * Math.sin(this.angle));
  };
  //Scrolls when screen scrolls
  this.scrollOnScreen = function() {

    if (playerList[0].Xpos > (canvas.width - 210) / 2) { this.Xpos = this.Xpos - (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Xpos < (canvas.width - 210) / 2) { this.Xpos = this.Xpos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos < canvas.height / 2) { this.Ypos = this.Ypos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos > canvas.height / 2) { this.Ypos = this.Ypos - (playerList[0].speedFormula * (60 / gameSecond)); };

  };
}
function enemy (defaultHP, expReward, attackDamage, defaultSpeed, defaultHeight, defaultWidth, spriteGiven, movementType) {

  this.HP = defaultHP;
  this.MAX_HP = defaultHP;
  this.speed = defaultSpeed;
  this.Xpos = playerList[0].Xpos + (800 * Math.cos(Math.floor((Math.random() * 360) + 1)));
  this.Ypos = playerList[0].Ypos + (800 * Math.sin(Math.floor((Math.random() * 360) + 1)));
  this.height = defaultHeight;
  this.width = defaultWidth;
  this.bulletSpeed = 7;
  this.bulletRadius = 15;
  this.damage = attackDamage;
  this.expGiven = expReward;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = 2000;
  this.spriteImage = spriteGiven;

  this.moveCounter = 0;
  this.movement_Pattern = movementType || "random";
  this.movement = "left";

  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  //Weapon
  this.fireWeapon = function() {

    var deltaY = this.Ypos - playerList[0].Ypos;
    var deltaX = this.Xpos - playerList[0].Xpos;
    var angleSend = Math.atan2(-deltaY, -deltaX);

    enemyBulletList.push(new enemyBullet(this.bulletSpeed, this.bulletRadius, this.Xpos, this.Ypos, angleSend ,this.damage));
    this.weaponCooldown = this.MAX_WEAPON_COOLDOWN;
  }
  //Movement Logic
  this.move = function() {

    if (this.Ypos > playerList[0].Ypos + 220 || this.Xpos > playerList[0].Xpos + 220 || this.Ypos < playerList[0].Ypos - 220 || this.Xpos < playerList[0].Xpos - 220) {

      //UP
      if (this.Ypos > playerList[0].Ypos + 150) { this.Ypos = this.Ypos - (this.speed * (60 / gameSecond)); };
      //LEFT
      if (this.Xpos > playerList[0].Xpos + 150) { this.Xpos = this.Xpos - (this.speed * (60 / gameSecond)); };
      //DOWN
      if (this.Ypos < playerList[0].Ypos - 150) { this.Ypos = this.Ypos + (this.speed * (60 / gameSecond)); };
      //RIGHT
      if (this.Xpos < playerList[0].Xpos - 150) { this.Xpos = this.Xpos + (this.speed * (60 / gameSecond)); };

    };
    //Enemy should re-randomize movement every duration specified.
    if (this.movement_Pattern == "random") { movement_Pattern_Random(this); }
    else if (this.movement_Pattern == "chase") { movement_Pattern_Chase(this); };
  };
  //Drops loot when killed
  this.dropLoot = function() {

    lootBagList.push(new lootBag(this.Xpos, this.Ypos, lootBagPics[0]));

    var chance = (Math.random() * 1000) + 1;
    if (chance > 980) { dropSpeedPot(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 980) { dropAttackPot(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 980) { dropFireRatePot(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 980) { dropWizardryPot(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 980) { dropYouthPot(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 950) { dropChestplate(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 950) { dropShadowBow(); };
    var chance = (Math.random() * 1000) + 1;
    if (chance > 950) { dropInnocentBloodBow(); };

    playerList[0].EXP += this.expGiven;

  };
  //Draws enemy to screen
  this.renderToScreen = function() {

    //Image
    ctx.drawImage(this.spriteImage, this.Xpos - 1, this.Ypos, this.width, this.height);
    //HP Bar
    ctx.fillStyle = "#CC0000";
    ctx.fillRect(this.Xpos, this.Ypos - 8, this.width - 3, 5);
    ctx.fillStyle = "#00BB00";
    ctx.fillRect(this.Xpos, this.Ypos - 8, this.HP * ((this.width - 3) / this.MAX_HP), 5);

  };
  //Scrolls when screen scrolls
  this.scrollOnScreen = function() {

    if (playerList[0].Xpos > (canvas.width - 210) / 2) { this.Xpos = this.Xpos - (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Xpos < (canvas.width - 210) / 2) { this.Xpos = this.Xpos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos < canvas.height / 2) { this.Ypos = this.Ypos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos > canvas.height / 2) { this.Ypos = this.Ypos - (playerList[0].speedFormula * (60 / gameSecond)); };

  };
}
function enemyBullet (bulletSpeed, bulletRadius, startX, startY, angleSend, damageSend) {

  this.height = bulletRadius;
  this.width = bulletRadius;
  this.Xpos = startX;
  this.Ypos = startY;
  this.speed = bulletSpeed;
  this.angle = angleSend;
  this.damage = damageSend;

  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  //Movement Logic
  this.move = function() {

    this.Xpos = this.Xpos + (this.speed * Math.cos(this.angle));
    this.Ypos = this.Ypos + (this.speed * Math.sin(this.angle));
  };
  //Scrolls when screen scrolls
  this.scrollOnScreen = function() {

    if (playerList[0].Xpos > (canvas.width - 210) / 2) { this.Xpos = this.Xpos - (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Xpos < (canvas.width - 210) / 2) { this.Xpos = this.Xpos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos < canvas.height / 2) { this.Ypos = this.Ypos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos > canvas.height / 2) { this.Ypos = this.Ypos - (playerList[0].speedFormula * (60 / gameSecond)); };

  };
}
function loot (defaultXpos, defaultYpos, defaultTypeOfItem, widthGiven, heightGiven, nameGiven, effectGiven, descriptionGiven) {

  this.Xpos = defaultXpos;
  this.Ypos = defaultYpos;
  this.height = heightGiven;
  this.width = widthGiven;
  this.typeOfItem = defaultTypeOfItem;
  this.beingHeld = false;

  this.itemName = nameGiven || "Item Name";
  this.itemEffect = effectGiven || "This item does something";
  this.itemDescription = descriptionGiven || "This item has lore...";

  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  //Gives Loot
  this.giveItem = function() {

    if (this.typeOfItem == potionList[1] && playerList[0].speed < playerList[0].MAX_SPEED) {

      playerList[0].speed++;
      playerList[0].speedFormula = 3 + (7 * (playerList[0].speed / 100));

    };
    if (this.typeOfItem == potionList[0]) { playerList[0].damage++; };
    if (this.typeOfItem == potionList[2] && playerList[0].dexterity < playerList[0].MAX_DEXTERITY) {

      playerList[0].dexterity++;

    };
    if (this.typeOfItem == potionList[3] && playerList[0].wizardry < playerList[0].MAX_WIZARDRY) { playerList[0].wizardry++; };
    if (this.typeOfItem == potionList[4] && playerList[0].youth < playerList[0].MAX_YOUTH) { playerList[0].youth++; };
    if (this.typeOfItem == armorList[0]) {

      playerList[0].MAX_HP += 10;

    };
    if (this.typeOfItem == weaponBowList[0][0]) { playerList[0].bulletSpriteImage = weaponBowList[0][1]; };
    if (this.typeOfItem == weaponBowList[1][0]) { playerList[0].bulletSpriteImage = weaponBowList[1][1]; };

    playerList[0].MAX_WEAPON_COOLDOWN = 1000 / (1 + (5 * (playerList[0].dexterity / 100)));
  };
}
function lootBag (defaultXpos, defaultYpos, imageGiven) {

  this.Xpos = defaultXpos;
  this.Ypos = defaultYpos;
  this.height = 25;
  this.width = 25;
  this.lifeTime = 30 * gameSecond;
  this.imageSprite = imageGiven;
  this.itemSlot = [];

  //Hitbox
  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  //The inventory on lootbags is different than player inventories since there is no need to have it be specific. It might as well be a feature that they are infinite in size and autofill. Also prevents trolling by players switching items to wierd slots
  this.drawInventory = function() {

    //OLD VERSION OF LOOT BAG
    for (var i = 0; i < 2; i++) {
      for (var col = 0; col < 8; col++) {

        var row = 0;
        if (col >= 4) { row = 1; };

        var colWidth = 38;
        var colPos = colWidth * col;
        var rowHeight = 38 * row;
        var rowWidth = row * 4 * colWidth;

        //inventory drawn on first pas through, items second pass.
        if (i == 0) {

          ctx.fillStyle = "#CCC";
          ctx.fillRect(canvas.width - 180 + colPos - rowWidth, canvas.height - 90 + rowHeight, colWidth, colWidth);
          ctx.fillStyle = "#000";
          ctx.lineWidth = 2;
          ctx.strokeRect(canvas.width - 180 + colPos - rowWidth, canvas.height - 90 + rowHeight, colWidth, colWidth);

        };
        if (i == 1) {
          //Checks to see if items exist before trying to render.
          if (this.itemSlot[col]) {
            if (this.itemSlot[col].beingHeld == false) {

              this.itemSlot[col].Xpos = canvas.width - 177 + colPos - rowWidth;
              this.itemSlot[col].Ypos = canvas.height - 87 + rowHeight;

            } else {

              this.itemSlot[col].Xpos = mouseX - (this.itemSlot[col].width / 2);
              this.itemSlot[col].Ypos = mouseY - (this.itemSlot[col].height / 2);

            };

            ctx.drawImage(this.itemSlot[col].typeOfItem, this.itemSlot[col].Xpos, this.itemSlot[col].Ypos, 32, 32);
          };
        };
      };
    };
  };
  //Scrolls when screen scrolls
  this.scrollOnScreen = function() {

    if (playerList[0].Xpos > (canvas.width - 210) / 2) { this.Xpos = this.Xpos - (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Xpos < (canvas.width - 210) / 2) { this.Xpos = this.Xpos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos < canvas.height / 2) { this.Ypos = this.Ypos + (playerList[0].speedFormula * (60 / gameSecond)); };
    if (playerList[0].Ypos > canvas.height / 2) { this.Ypos = this.Ypos - (playerList[0].speedFormula * (60 / gameSecond)); };

  };
}
function inventorySlot (defaultXpos, defaultYpos, col, row, itemGiven) {

  this.width = 38;
  this.height = 38;
  this.Xpos = defaultXpos + (this.width * col) - (this.width * 4 * row);
  this.Ypos = defaultYpos + (this.height * row);

  this.item = itemGiven;

  this.topOf = function() { return this.Ypos; };
  this.bottomOf = function() { return this.Ypos + this.height; };
  this.leftSide = function() { return this.Xpos; };
  this.rightSide = function() { return this.Xpos + this.width; };

  this.renderToScreen = function(i) {

    if (this.item && mouseClicked == true && this.item.bottomOf() && mouseY > this.item.topOf() && mouseX > this.item.leftSide() && mouseX < this.item.rightSide() || (this.item && this.item.beingHeld == true)) {

      this.item.Xpos = mouseX - (this.width / 2);
      this.item.Ypos = mouseY - (this.height / 2);
      this.item.beingHeld = true;
      playerList[0].mouseOccupied = true;

    } else if (this.item) {

      this.item.Xpos = this.Xpos;
      this.item.Ypos = this.Ypos;
      if (mouseClicked == false) { this.item.beingHeld = false; };

    };

    if (i == 0) {

    ctx.fillStyle = "#CCC";
    ctx.fillRect(this.Xpos, this.Ypos, this.width, this.height);
    ctx.fillStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.Xpos, this.Ypos, this.width, this.height);

    } else if (this.item && i == 1) {

      ctx.drawImage(this.item.typeOfItem, this.item.Xpos + 3, this.item.Ypos + 3, 32, 32);

    } else if (this.item && i == 2 && this.item.beingHeld == true) {

      ctx.drawImage(this.item.typeOfItem, this.item.Xpos + 3, this.item.Ypos + 3, 32, 32);

    };
  };
}
//END GAME OBJECTS ==============
//CHECK BROWSER TYPE ============
var mie = (navigator.appName == "Microsoft Internet Explorer")?true:false;
document.onkeydown = keyClick;
document.onkeyup = keyClear;
if (!mie) {

  document.captureEvents(Event.MOUSEMOVE);
  document.captureEvents(Event.MOUSEDOWN);
}
//END CHECK BROWSER TYPE ========

document.onmousemove = mousePos;
document.onmousedown = function () { mouseClicked = true; };
document.onmouseup = function () { mouseClicked = false };
document.onkeydown = keyClick;
window.onload = generateGameMap;

var generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN") { spawnEnemy() }; } , 200);
var drawtheGame = setInterval(function() { drawGameScreen() } , FRAME_SPEED);

/*

TO DO LIST:
1. Make game Multiplayer
2. Find out how to get localstorage to work since it wasn't foolproof on my last game. (WHEN GAME GOES MULTIPLAYER FIND SECURE WAY TO STORE ACCOUNTS ON DATABASE. DO NOT USE SAVEFILES suggestion by Israphiel)
3. Get game time to work 100% properly or make easier to understand by shortening algorithms.
4. Finish optimizing collisions.
5. Make inventory slots all individual with hitboxes and make it possible to swap items in inventory.
6. Work out how to make the map the absolute position and player position only relative to the map, not vice versa. (player/enemies move on map, not map and enemies moving in relation to player)

Game concept so far: Make it into a fully fledged standard RPG, but add aspects of the incremental / idle games into it. Have things like weapon smiths that upgrade your weapon based on the amount of money you put into it. Have a tiering system for weapons/armors/abilities.
have a garbage area where you can dump off old junk and that garbage area will produce a new item with tiering based on the amount of junk put into it, the types of junk put in, and the tier of the junk put into it. With enough stuff in the garbage dump, you can get potentially super powerful new weapons, although this will take an obscene amount of junk so it needs to have a high number of players (via multiplayer) to be constantly dumping junk into it for a long time before it generates a good item. The dump's item will also be able to be taken at any time, so on multiplayer it will require teamwork among the community in order to avoid wanting to take the item before it gets super awesome. There should be quests that the player can complete for rewards, a dungeon system, and a storage area for items you want to keep. An in game currency could be used to buy things out of a shop too.

Prestige/Fame Plans: Have certain increments (like star rankings in Rotmg) for reaching certain milestones in the game. Ranks will increase a player's stats or give various bonuses. You can also choose from certain perks to lower exp required to level up when re-rolling so expereinced players spend less time wasting leveling up and thereby are not as bored of the game on death. Also a possible drop rate increase for higher tier weapons, but this needs to be thought through more.

Dungeons should have a couple of door options for difficulty levels. If a player goes in the easy version, they go through a standard dungeon. Medium would make impossible to go solo, should require a group of 3-5 to do in a safe amount of time, but the rewards are higher. Hard mode should be tough enough to where only a good guild could finish it. Likely involving teamwork as the dungeon should be large enough to get lost in without proper communication and should require planning to get through. This level should also have different enemies added in order to make things tougher and have an occasional roadblock. (sidenote, maybe all dungeons should only have all paths lead to the boss, but certain branches make for different results such as going right makes high damage/low hp enemies, going left makes weak but high hp enemies, etc.)

Idea for solving map lag: Only load images that are within a few tiles of what is visible by the player. Check image sizes and decrease resolution if you have to. Also, it looks like simple background images can be resized a decent amount without distortion. Only higher detail sprites get blurred. Also depends on if you are retaining correct ratio of height to width.

*/

//MOVEMENT PATTERNS ==============
function movement_Pattern_Random (thing) {

  if (thing.moveCounter > 15 * (60 / gameSecond)) {

    var chance = (Math.random() * 5);

    if (chance <= 1 && (thing.Xpos > playerList[0].Xpos + 100 || thing.Xpos < playerList[0].Xpos - 100)) {
      thing.movement = "left";
    }
    else if (chance <= 2 && (thing.Xpos < playerList[0].Xpos + 100 || thing.Xpos < playerList[0].Xpos - 100)) {
      thing.movement = "right";
    }
    else if (chance <= 3 && (thing.Ypos < playerList[0].Ypos + 100 || thing.Ypos < playerList[0].Ypos - 100)) {
      thing.movement = "up";
    }
    else if (chance <= 4 && (thing.Ypos < playerList[0].Ypos + 100 || thing.Ypos < playerList[0].Ypos - 100)) {
      thing.movement = "down";
    }
    else { thing.movement = "stopped"; };

    thing.moveCounter = 0;
  };

  if (thing.movement == "up") { thing.Ypos = thing.Ypos - ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "left") { thing.Xpos = thing.Xpos - ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "down") { thing.Ypos = thing.Ypos + ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "right") { thing.Xpos = thing.Xpos + ((thing.speed * (60 / gameSecond)) / 2); };

  thing.moveCounter++;
}
function movement_Pattern_Chase (thing) {

  if (thing.Ypos > playerList[0].Ypos + 20 || thing.Xpos > playerList[0].Xpos + 20 || thing.Ypos < playerList[0].Ypos - 20 || thing.Xpos < playerList[0].Xpos - 20) {

    //UP
    if (thing.Ypos > playerList[0].Ypos) { thing.Ypos = thing.Ypos - (thing.speed * (60 / gameSecond)); };
    //LEFT
    if (thing.Xpos > playerList[0].Xpos) { thing.Xpos = thing.Xpos - (thing.speed * (60 / gameSecond)); };
    //DOWN
    if (thing.Ypos < playerList[0].Ypos) { thing.Ypos = thing.Ypos + (thing.speed * (60 / gameSecond)); };
    //RIGHT
    if (thing.Xpos < playerList[0].Xpos) { thing.Xpos = thing.Xpos + (thing.speed * (60 / gameSecond)); };

  };

  if (thing.moveCounter > 15 * (60 / gameSecond)) {

    var chance = (Math.random() * 5);

    if (chance <= 1 && (thing.Xpos > playerList[0].Xpos + 100 || thing.Xpos < playerList[0].Xpos - 100)) {
      thing.movement = "left";
    }
    else if (chance <= 2 && (thing.Xpos < playerList[0].Xpos + 100 || thing.Xpos < playerList[0].Xpos - 100)) {
      thing.movement = "right";
    }
    else if (chance <= 3 && (thing.Ypos < playerList[0].Ypos + 100 || thing.Ypos < playerList[0].Ypos - 100)) {
      thing.movement = "up";
    }
    else if (chance <= 4 && (thing.Ypos < playerList[0].Ypos + 100 || thing.Ypos < playerList[0].Ypos - 100)) {
      thing.movement = "down";
    }
    else { thing.movement = "stopped"; };

    thing.moveCounter = 0;
  };

  if (thing.movement == "up") { thing.Ypos = thing.Ypos - ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "left") { thing.Xpos = thing.Xpos - ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "down") { thing.Ypos = thing.Ypos + ((thing.speed * (60 / gameSecond)) / 2); };
  if (thing.movement == "right") { thing.Xpos = thing.Xpos + ((thing.speed * (60 / gameSecond)) / 2); };

  thing.moveCounter++;
}
//END MOVEMENT PATTERNS ==========
//SPAWNING SYSTEMS ===============
function spawn_Enemy_Bug () {
  if (enemyList.length < 35) {
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType
    enemyList.push(new enemy(115, 105, 3, 3, 25, 25, enemy_bug_Pic, "random"));

  };
}
function spawn_Enemy_Skull () {
  if (enemyList.length < 40) {
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType
    enemyList.push(new enemy(300, 2800, 10, 2, 28, 28, enemy_skull_Pic, "chase"));

  };
}
function spawn_Enemy_Skull_Boss () {
  if (enemyList.length < 45) {
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType
    enemyList.push(new enemy(2500, 2500, 56, 1, 60, 60, enemy_skull_boss_Pic, "random"));

  };
}
function spawnEnemy () {

  var difficulty = (Math.random() * 1000) + 1;
  if (difficulty >= 100 + playerList[0].level) { spawn_Enemy_Bug(); };
  if (difficulty >= 700 - playerList[0].level) { spawn_Enemy_Skull(); };
  if (difficulty >= 990 - playerList[0].level) { spawn_Enemy_Skull_Boss(); };
}
//END SPAWNING SYSTEMS
//PLAYER BULLETS =================
function spellBomb () {

  for (var i = 0; i < 21; i++) { newBullet(i * 18, mouseX, mouseY); };

  playerList[0].MP = playerList[0].MP - playerList[0].special_MP_cost;
  playerList[0].specialCooldown = playerList[0].MAX_SPECIAL_COOLDOWN;
}
function newBullet (angleSend, mouseXSent, mouseYSent) {
  //Xspeed, Yspeed, width, height, anglesend, mouseXsent, mouseYsent, spriteImage
  bulletList.push(new playerBullet(10, 10, 25, 25, angleSend, mouseXSent, mouseYSent, playerList[0].bulletSpriteImage));

  playerList[0].weaponCooldown = playerList[0].MAX_WEAPON_COOLDOWN;
}
//END PLAYER BULLETS =============
//POTIONS ========================
function dropSpeedPot () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, potionList[1], 26, 26, "Potion of Speed", "+1 Speed"));
}
function dropAttackPot () {

 lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, potionList[0], 26, 26, "Potion of Attack", "+1 Attack"));
}
function dropFireRatePot () {

    lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, potionList[2], 26, 26, "Potion of Dexterity", "+1 Dexterity"));
}
function dropWizardryPot () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, potionList[3], 26, 26, "Potion of Wizardry", "+1 Wizardry"));
}
function dropYouthPot () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, potionList[4], 26, 26, "Potion of Youth", "+1 Youth"));
}
function dropChestplate () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, armorList[0], 26, 26, "Chestplate T1", "Max HP + 10", "Forged by a local blacksith."));
}
function dropShadowBow () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, weaponBowList[0][0], 26, 26, "Shadow Bow", "Looks cool", "Shadowy shadow lore..."));
}
function dropInnocentBloodBow () {

  lootBagList[lootBagList.length - 1].itemSlot.push(new loot(200, 200, weaponBowList[1][0], 26, 26, "Innocent Blood Bow", "Looks cool", "Blood was spilled for this bow."));
}
//END POTIONS ====================
//DRAW STUFF =====================
function displayLootBags() {

  var i = 0;
  for (var j = 0; j < lootBagList.length; j++) {

    ctx.fillStyle = "#9E6F31";
    ctx.drawImage(lootBagList[i].imageSprite, lootBagList[i].Xpos, lootBagList[i].Ypos, 35, 28);
    lootBagList[i].lifeTime--;

    if (lootBagList[i].itemSlot.length < 1 || lootBagList[i].lifeTime < 1) {

      lootBagList.splice(i, 1);
      i--;
    };
    i++;
  };
}
function displayItemDrops () {
  //Displayes items in loot bag currently being stood over.
  for (var i = 0; i < lootBagList.length; i++) {

    //Only allows one loot bag to be seen at a time. No overlapping loot bags. If viewing loot, only view i.
    if (playerList[0].topOf() < lootBagList[i].bottomOf() && playerList[0].bottomOf() > lootBagList[i].topOf() && playerList[0].leftSide() < lootBagList[i].rightSide() && playerList[0].rightSide() > lootBagList[i].leftSide() && (playerList[0].isViewingLoot[0] == false || playerList[0].isViewingLoot[1] == i)) {

      playerList[0].isViewingLoot[0] = true;
      playerList[0].isViewingLoot[1] = i;
      lootBagList[i].drawInventory();

      //For loop must be inside if statement to ensure only one bag being viewed
      for (var j = 0; j < lootBagList[i].itemSlot.length; j++) {

        //Draw Item description
        drawItemDescription(i, j);

        //Drink potion if shift clicking
        if (mouseClicked == true && mouseY < lootBagList[i].itemSlot[j].bottomOf() && mouseY > lootBagList[i].itemSlot[j].topOf() && mouseX < lootBagList[i].itemSlot[j].rightSide() && mouseX > lootBagList[i].itemSlot[j].leftSide() && keys["SHIFT"]) {

          lootBagList[i].itemSlot[j].giveItem();
          lootBagList[i].itemSlot.splice(j, 1);
          mouseClicked = false;

        }
        //Mouse selecting the item if it's position is over the item's hitbox and nothing else is in hand.
        else if (mouseClicked == true && (mouseY < lootBagList[i].itemSlot[j].bottomOf() && mouseY > lootBagList[i].itemSlot[j].topOf() && mouseX < lootBagList[i].itemSlot[j].rightSide() && mouseX > lootBagList[i].itemSlot[j].leftSide() && lootBagList[i].itemSlot[j].beingHeld == false) && !keys["SHIFT"] && playerList[0].mouseOccupied == false) {

          lootBagList[i].itemSlot[j].beingHeld = true;
          playerList[0].mouseOccupied = true;

        }
        //If item is being held in the hand.
        else if (mouseClicked == true && playerList[0].mouseOccupied == true && lootBagList[i].itemSlot[j].beingHeld == true) {

          lootBagList[i].itemSlot[j].beingHeld = true;
          playerList[0].mouseOccupied = true;

        } else {

          lootBagList[i].itemSlot[j].beingHeld = false;

          if (mouseClicked == false) { playerList[0].mouseOccupied = false; };

          //Checks to see if item is being dropped in player inventory
          for (var p = 0; p < playerList[0].inventory.length; p++) {


            if (lootBagList[i].itemSlot[j].topOf() < playerList[0].inventory[p].bottomOf() && lootBagList[i].itemSlot[j].bottomOf() > playerList[0].inventory[p].topOf() && lootBagList[i].itemSlot[j].leftSide() < playerList[0].inventory[p].rightSide() && lootBagList[i].itemSlot[j].leftSide() > playerList[0].inventory[p].rightSide()) {

              playerList[0].inventory[p].item = lootBagList[i].itemSlot[j];
              lootBagList[i].itemSlot.splice(j, 1);

            };
          };
        };
      };
    }
    else if (!(playerList[0].topOf() < lootBagList[i].bottomOf() && playerList[0].bottomOf() > lootBagList[i].topOf() && playerList[0].leftSide() < lootBagList[i].rightSide() && playerList[0].rightSide() > lootBagList[i].leftSide()) && playerList[0].isViewingLoot[1] == i) {

      playerList[0].isViewingLoot[0] = false;
      playerList[0].isViewingLoot[1] = 0;

    };
  };
}
function drawMap () {

  document.getElementById("myCanvas").style.backgroundPosition = backgroundPos[0] + "px " + backgroundPos[1] + "px";
  ctx.fillStyle = "black";
  ctx.fillRect(mapBorder[left], mapBorder[topOf], -1220, 1500);
  ctx.fillRect(mapBorder[left], mapBorder[bottomOf], 1220, 1500);
  ctx.fillRect(mapBorder[left] - 600, mapBorder[topOf], 2500, -2300);
  ctx.fillRect(mapBorder[right], mapBorder[topOf], 1500, 1800);
  ctx.fillStyle = "grey";
  ctx.fillRect(mapBorder[left], mapBorder[topOf], 1220, playerList[0].height);
  ctx.fillRect(mapBorder[left], mapBorder[bottomOf], 1220, playerList[0].height);
  ctx.fillRect(mapBorder[left], mapBorder[topOf], playerList[0].width, 1200);
  ctx.fillRect(mapBorder[right], mapBorder[topOf], playerList[0].width, 1200);
}
function displayStats () {

  //Lines for box of displaying stats
  ctx.fillStyle = "#000";
  ctx.fillRect(canvas.width - 200, 0, 2, canvas.height);
  ctx.fillStyle = "#333";
  ctx.fillRect(canvas.width - 198, 0, 198, canvas.height);
  //Soon to be MINIMAP
  ctx.fillStyle = "#000000";
  ctx.fillRect(canvas.width - 195, 5, 190, 190);
  ctx.fillStyle = "orange";
  //Stats
  ctx.fillText("Name: " + playerList[0].userName, canvas.width - 190, 212);
  ctx.fillText("Level: " + playerList[0].level, canvas.width - 190, 230);
  ctx.font = "14px black Palatino";
  ctx.fillText("Attack: " + playerList[0].damage, canvas.width - 185, 320);
  ctx.fillText("Speed: " + playerList[0].speed.toFixed(0), canvas.width - 95, 320);
  ctx.fillText("Wizardry: " + playerList[0].wizardry, canvas.width - 185, 340);
  ctx.fillText("Dexterity: " + playerList[0].dexterity, canvas.width - 95, 340);
  ctx.fillText("Youth: " + playerList[0].youth, canvas.width - 185, 360);

  //FOR BUG TESTING
  //ctx.fillText("Glory: " + playerList[0].deathGlory.toFixed(0), canvas.width - 185, 380);
  //ctx.fillText("mouseocc: " + playerList[0].mouseOccupied, canvas.width - 185, 400);

  //INVENTORY SLOTS
  drawPlayerInventory();

  ctx.font = "18px Palatino";
  //Exp Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190, 240, 150, 18);
  if (playerList[0].level < 50) {

    ctx.fillStyle = "#00AA00";
    ctx.fillRect(canvas.width - 190, 240, playerList[0].EXP * (150 / playerList[0].levelExpReq), 18);

  }
  //Glory Bar
  else {

    ctx.fillStyle = "orange";
    ctx.fillRect(canvas.width - 190, 240, 150, 18);

  };

  if (mouseX > canvas.width - 190 && mouseX < canvas.width - 36 && mouseY > 242 && mouseY < 262) {

    ctx.fillStyle = "white";

    if (playerList[0].level < 50) {

      ctx.fillText(playerList[0].EXP.toFixed(0) + " / " + playerList[0].levelExpReq, canvas.width - 150, 256);

    } else { ctx.fillText(playerList[0].glory.toFixed(0), canvas.width - 125, 256); };
  };
  //HP Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190, 260, 150, 18);
  ctx.fillStyle = "#CC0000";
  ctx.fillRect(canvas.width - 190, 260, playerList[0].HP * (150 / playerList[0].MAX_HP), 18);
  if (mouseX > canvas.width - 190 && mouseX < canvas.width - 36 && mouseY > 262 && mouseY < 282) {

  ctx.fillStyle = "white";
  ctx.fillText( + playerList[0].HP.toFixed(0) + " / " + playerList[0].MAX_HP, canvas.width - 150, 276);

  };
  //Mana Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190, 280, 150, 18);
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(canvas.width - 190, 280, playerList[0].MP * (150 / playerList[0].MAX_MP), 18);
  if (mouseX > canvas.width - 190 && mouseX < canvas.width - 36 && mouseY > 282 && mouseY < 302) {

  ctx.fillStyle = "white";
  ctx.fillText( + playerList[0].MP.toFixed(0) + " / " + playerList[0].MAX_MP, canvas.width - 150, 296);

  };
}
function drawPlayer () {

  for (var i = 0; i < playerList.length; i++) { playerList[i].renderToScreen(); };
}
function drawPlayerBullet() {

  for (var i = 0; i < bulletList.length; i++) {

    //Rotates Image based on angle fired at. DO NOT REMOVE CTX.SAVE OR CTX.RESTORE
    ctx.save();
    ctx.translate(bulletList[i].Xpos - 5, bulletList[i].Ypos - 5);
    ctx.rotate(bulletList[i].angle + (45 * (Math.PI / 180)));
    ctx.drawImage(bulletList[i].spriteImage, -(bulletList[i].width / 2), -(bulletList[i].height / 2), bulletList[i].width, bulletList[i].height);
    ctx.restore();
  };
}
function drawPlayerInventory () {

  //Checks to see if player has something in inventory before running for loop.
  if (playerList[0].inventory[0]) {
    for (var j = 0; j < playerList[0].inventory.length; j++) {

      //Gives Item if Shift Clicking
      if (mouseClicked == true && mouseY < playerList[0].inventory[j].bottomOf() && mouseY > playerList[0].inventory[j].topOf() && mouseX < playerList[0].inventory[j].rightSide() && mouseX > playerList[0].inventory[j].leftSide() && keys["SHIFT"]) {

        playerList[0].inventory[j].item.giveItem();
        playerList[0].inventory[j].item = new loot(0,0, potionList[0]);
        mouseClicked = false;
        break;

      };
      //Mouse selecting the item if it's position is over the item's hitbox
      if (mouseClicked == true && mouseY < playerList[0].inventory[j].bottomOf() && mouseY > playerList[0].inventory[j].topOf() && mouseX < playerList[0].inventory[j].rightSide() && mouseX > playerList[0].inventory[j].leftSide() && playerList[0].mouseOccupied == false) {

        playerList[0].inventory[j].item.beingHeld = true;

      }
      //Mouse continues to select the item if mouse is held down.
      else if (mouseClicked == true && playerList[0].mouseOccupied == true && playerList[0].inventory[j].item.beingHeld == true) {

        playerList[0].mouseOccupied = true;
        playerList[0].inventory[j].item.beingHeld = true;

      }
      //Mouse either releases item or places somewhere when no longer holding click down.
      else {

        if (mouseClicked == false) {

          playerList[0].mouseOccupied = false;
          if (playerList[0].inventory[j].item) { playerList[0].inventory[j].item.beingHeld = false; };

        };

        if (playerList[0].inventory[j].Xpos < canvas.width - 195) {

          lootBagList.push(new lootBag(playerList[0].Xpos, playerList[0].Ypos, lootBagPics[0]));
          lootBagList[lootBagList.length - 1].itemSlot.push(playerList[0].inventory[j].item);
          playerList[0].inventory.splice(j, 1);
          break;

        };
      };
    };
  };
  //Put last so it is drawn after all movement is done for accurate representation of field
  playerList[0].drawInventory();
}
function drawEnemy () {

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].renderToScreen(); };
}
function drawEnemyBullet () {

  ctx.fillStyle = "red";
  for (var i = 0; i < enemyBulletList.length; i++) {

    ctx.fillRect(enemyBulletList[i].Xpos, enemyBulletList[i].Ypos, enemyBulletList[i].width, enemyBulletList[i].height);
  };
}
function showDamageTaken () {

  ctx.font = "16px Palatino";
  ctx.fillStyle = "red";

  //Enemies Damage
  for (var i = 0; i < damageNumberList.length; i++) {
    for (var j = 0; j < enemyList.length; j++) {
      if (damageNumberList[i][4] == j) {

        damageNumberList[i][1] = enemyList[j].Xpos;
        damageNumberList[i][2] = enemyList[j].Ypos - (damageNumberList[i][3] + 10);

      };
    };

    ctx.fillText("-" + damageNumberList[i][0], damageNumberList[i][1], damageNumberList[i][2]);
    damageNumberList[i][2] = damageNumberList[i][2] - (3 * (60 / gameSecond));
    damageNumberList[i][3]++;

    if (damageNumberList[i][3] > 27 * (60 / gameSecond)) { damageNumberList.splice(i, 1); };

  };
  //Players Damage
  for (var i = 0; i < playerDamageNumberList.length; i++) {
    for (var j = 0; j < playerList.length; j++) {
      if (playerDamageNumberList[i][4] == j) {

        playerDamageNumberList[i][1] = playerList[j].Xpos;
        playerDamageNumberList[i][2] = playerList[j].Ypos - (playerDamageNumberList[i][3] + 10);

      };
    };

    ctx.fillText("-" + playerDamageNumberList[i][0], playerDamageNumberList[i][1], playerDamageNumberList[i][2]);
    playerDamageNumberList[i][2] = playerDamageNumberList[i][2] - (3 * (60 / gameSecond));
    playerDamageNumberList[i][3]++;

    if (playerDamageNumberList[i][3] > 27 * (60 / gameSecond)) { playerDamageNumberList.splice(i, 1); };

  };
}
function drawItemDescription (i, j) {

  if (mouseY < lootBagList[i].itemSlot[j].bottomOf() && mouseY > lootBagList[i].itemSlot[j].topOf() && mouseX < lootBagList[i].itemSlot[j].rightSide() && mouseX > lootBagList[i].itemSlot[j].leftSide()) {

    ctx.fillStyle = "#AAA";
    ctx.fillRect(mouseX, mouseY, -200, -280);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.strokeRect(mouseX, mouseY, -200, -280);

    ctx.fillStyle = "#111";
    ctx.fillText(lootBagList[i].itemSlot[j].itemName, mouseX - 190, mouseY - 260);
    ctx.font = "14px Palatino";
    ctx.fillText(lootBagList[i].itemSlot[j].itemEffect, mouseX - 190, mouseY - 230);
    ctx.fillText(lootBagList[i].itemSlot[j].itemDescription, mouseX - 190, mouseY - 200);

  };
}
//END DRAWING STUFF ==============
//MOVE STUFF =====================
function movePlayer () {

  for (var i = 0; i < playerList.length; i++) { playerList[i].move(); };
}
function moveEnemy () {

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].move(); };
}
function movePlayerBullet () {

  for (var i = 0; i < bulletList.length; i++) {

    bulletList[i].move();
    bulletList[i].lifeTime--;

    if (bulletList[i].lifeTime <= 0) { bulletList.splice(i, 1); };
  };
}
function moveEnemyBullet () {

  for (var i = 0; i < enemyBulletList.length; i++) { enemyBulletList[i].move(); };
}
function scrollScreen () {

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].scrollOnScreen(); };
  for (var i = 0; i < bulletList.length; i++) { bulletList[i].scrollOnScreen(); };
  for (var i = 0; i < enemyBulletList.length; i++) { enemyBulletList[i].scrollOnScreen(); };
  for (var i = 0; i < lootBagList.length; i++) { lootBagList[i].scrollOnScreen(); };

  //Moving Right
  if (playerList[0].Xpos > (canvas.width - 210) / 2) {

    mapBorder[left] -= (playerList[0].speedFormula * (60 / gameSecond));
    mapBorder[right] -= (playerList[0].speedFormula * (60 / gameSecond));
    backgroundPos[0] -= (playerList[0].speedFormula * (60 / gameSecond));
  };
  //Moving Left
  if (playerList[0].Xpos < (canvas.width - 210) / 2) {

    mapBorder[left] += (playerList[0].speedFormula * (60 / gameSecond));
    mapBorder[right] += (playerList[0].speedFormula * (60 / gameSecond));
    backgroundPos[0] += (playerList[0].speedFormula * (60 / gameSecond));
  };
  //Moving Up
  if (playerList[0].Ypos < canvas.height / 2) {

    mapBorder[topOf] += (playerList[0].speedFormula * (60 / gameSecond));
    mapBorder[bottomOf] += (playerList[0].speedFormula * (60 / gameSecond));
    backgroundPos[1] += (playerList[0].speedFormula * (60 / gameSecond));
  };
  //Moving Down
  if (playerList[0].Ypos > canvas.height / 2) {

    mapBorder[topOf] -= (playerList[0].speedFormula * (60 / gameSecond));
    mapBorder[bottomOf] -= (playerList[0].speedFormula * (60 / gameSecond));
    backgroundPos[1] -= (playerList[0].speedFormula * (60 / gameSecond));
  };

  playerList[0].Xpos = (canvas.width - 210) / 2;
  playerList[0].Ypos = canvas.height / 2;
}
function backgroundScrollingScene() {

  backgroundPos[0] -= 0.2;
  backgroundPos[1] -= 0.2;
  document.getElementById("myCanvas").style.backgroundPosition = backgroundPos[0] + "px " + backgroundPos[1] + "px";
}
function replenishPlayerStats (gameTime) {

  if (gameTime >= gameSecond / 60) {

      if (playerList[0].MP < playerList[0].MAX_MP) { playerList[0].MP = playerList[0].MP + (0.001 * playerList[0].wizardry); };
      if (playerList[0].HP < playerList[0].MAX_HP) { playerList[0].HP = playerList[0].HP + (0.0015 * playerList[0].youth); };
      if (playerList[0].MP > playerList[0].MAX_MP) { playerList[0].MP = playerList[0].MAX_MP; };
      if (playerList[0].weaponCooldown > 0) { playerList[0].weaponCooldown = playerList[0].weaponCooldown - FRAME_SPEED; };
      if (playerList[0].specialCooldown > 0) { playerList[0].specialCooldown = playerList[0].specialCooldown - FRAME_SPEED; };
      for (var i = 0; i < enemyList.length; i++) {

        enemyList[i].weaponCooldown = enemyList[i].weaponCooldown - FRAME_SPEED;

      };
      gameTime = 0;
    };
    if (enemyList.length > 1) {
      for (var i = 0; i < enemyList.length; i++) {
        if (enemyList[i].weaponCooldown <= 0) { enemyList[i].fireWeapon(); };
      };
    };

  return gameTime;
}
//END MOVE STUFF =================
//COLLISIONS =====================
function checkCollisions () {

  var i = 0;
  var p = 0;
  if (playerList[0].bottomOf > lootBagList) {};

  //Player bullets
  for (var k = 0; k < bulletList.length; k++) {
    //Map and bullet
    if (!(bulletList[i].bottomOf() > mapBorder[topOf] && bulletList[i].topOf() < mapBorder[bottomOf] && bulletList[i].leftSide() < mapBorder[right] && bulletList[i].rightSide() > mapBorder[left])) {

        bulletList.splice(i, 1);
        i--;

    };
    //Enemies and bullet
    for (var j = 0; j < enemyList.length; j++) {

      if (i >= 0 && bulletList[i].bottomOf() > enemyList[j].topOf() && bulletList[i].topOf() < enemyList[j].bottomOf() && bulletList[i].leftSide() < enemyList[j].rightSide() && bulletList[i].rightSide() > enemyList[j].leftSide()) {

        enemyList[j].HP = enemyList[j].HP - bulletList[i].damage;
        damageNumberList.push([bulletList[i].damage.toFixed(0), enemyList[j].Xpos, enemyList[j].Ypos - 10, 0, j]);
        bulletList.splice(i, 1);
        i--;

        if (enemyList[j].HP < 1) {

          enemyList[j].dropLoot();
          enemyList.splice(j, 1);
          killCount++;
          if (playerList[0].EXP >= playerList[0].levelExpReq && playerList[0].level < 50) { playerList[0].levelUP(); };
          playerList[0].glory = playerList[0].EXP / 2000;
          j--;

        };
      };
    };
    i++;
  };
  //Enemy Bullets
  for (var k = 0; k < enemyBulletList.length; k++) {
    //Map and enemy bullet
    if (!(enemyBulletList[p].bottomOf() > mapBorder[topOf] && enemyBulletList[p].topOf() < mapBorder[bottomOf] && enemyBulletList[p].leftSide() < mapBorder[right] && enemyBulletList[p].rightSide() > mapBorder[left])) {

        enemyBulletList.splice(p, 1);
        p--;

    };
    //Players and enemy bullet
    for (var j = 0; j < playerList.length; j++) {

      if (p >= 0 && enemyBulletList[p].bottomOf() > playerList[j].topOf() && enemyBulletList[p].topOf() < playerList[j].bottomOf() && enemyBulletList[p].leftSide() < playerList[j].rightSide() && enemyBulletList[p].rightSide() > playerList[j].leftSide()) {

        playerList[j].HP = playerList[j].HP - enemyBulletList[p].damage;
        playerDamageNumberList.push([enemyBulletList[p].damage, playerList[j].Xpos, playerList[j].Ypos - 10, 0, j]);
        enemyBulletList.splice(p, 1);
        p--;

        if (playerList[j].HP <= 0) { playerList[j].deathScene(); };

      };
    };
    p++;
  };
}
//HitboxIntersectCheck has not been implemented yet.
function hitboxIntersectCheck (hitbox1, hitbox2) {

  var collisionDetected = false;

  if (hitbox1.topOf() > hitbox2.bottomOf() && hitbox1.bottomOf() < hitbox2.topOf() && hitbox1.leftSide() < hitbox2.rightSide() && hitbox1.rightSide() > hitbox2.leftSide()) {

    collisionDetected = true;

  };
  return collisionDetected;
}
//mouseIsTouching has not been implemented yet.
function mouseIsTouching (thing) {

  var collisionDetected = false;

  if (mouseY < thing.bottomOf() && mouseY > thing.topOf() && mouseX > thing.leftSide() && mouseX < thing.rightSide()) {

    collisionDetected = true;

  };

  return collisionDetected;
}
function placeButtonHere (text, Xpos, Ypos, screenTypeGiven, buttonFont, buttonColor, functionToPerform) {

  ctx.font = buttonFont;
  //Makes button adjust hitbox based on size of text contained.
  var buttonWidth = ctx.measureText(text).width + 15;
  var buttonHeight = parseInt(buttonFont) + 10;
  var textHeight = parseInt(buttonFont);
  ctx.fillStyle =  buttonColor;
  ctx.fillRect(Xpos, Ypos, buttonWidth, buttonHeight);
  ctx.fillRect(Xpos, Ypos, buttonWidth, buttonHeight);

  //Makes hitboxes for buttons visible Comment out if not wanting to see hitboxes.
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#DDD";

  if (mouseX > Xpos && mouseX < Xpos + buttonWidth && mouseY > Ypos && mouseY < Ypos + buttonHeight) {

    ctx.fillStyle = "#EBE1A0";

    if (mouseClicked == true) {
      if (functionToPerform) { functionToPerform(); };

      screenType = screenTypeGiven;
      mouseClicked = false;
    };
  };
  //Use strokeRect for debugging if buttons are not working properly
  //ctx.strokeRect(Xpos, Ypos, buttonWidth, buttonHeight);
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
  ctx.fillText(text, Xpos + 6, Ypos + textHeight);
  ctx.shadowBlur = 0;
}
//END COLLISIONS =================
//MOUSE AND KEYBOARD =============
function activateChat () {

  ctx.lineWidth = 1;
  ctx.strokeRect(5, canvas.height - 26, canvas.width - 230, 20);
  ctx.fillStyle = "orange";
  ctx.fillText(wordString, 10, canvas.height - 10);
}
function submitChat () {

  ctx.fillStyle = "orange";
  //Word string pushed, Ypos, and age of text
  if (wordString.length > 1) {

    chatLog.push([wordString, 16, 0]);
    for (var i = 0; i < chatLog.length; i++) { chatLog[i][1] = chatLog[i][1] + 20; };
  };

  wordString = "";
}
function displayChat () {

  ctx.strokeStyle = "#000";
  var i = 0;

  if (chatLog.length > 0) {

    var textWidth = ctx.measureText(chatLog[chatLog.length - 1][0]).width + 5;

    if (chatLog[chatLog.length - 1][2] <= 200 ) {

      ctx.fillStyle = "#DDDDDD";
      ctx.fillRect(playerList[0].Xpos + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Ypos - 30, textWidth, 20);
      ctx.fillStyle = "black";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(playerList[0].Xpos + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Ypos - 30, textWidth, 20);
      ctx.fillText(chatLog[chatLog.length - 1][0], playerList[0].Xpos + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Ypos - 14);

    };
  };
  ctx.fillStyle = "orange";
  for (var j = 0; j < chatLog.length; j++) {

    ctx.fillText(playerList[0].userName + ": " + chatLog[i][0], 10, canvas.height - chatLog[i][1]);
    chatLog[i][2]++;

    if (chatLog[i][2] > 800) { chatLog.splice(i, 1); i--; };
    i++;

  };
}
function mousePos (e) {
  if (!mie) {

    mouseX = e.pageX;
    mouseY = e.pageY;
  };
  if (mie) {

    mouseX = event.clientX + document.body.scrollLeft;
    mouseY = event.clientY + document.body.scrollTop;
  };
  //Makes sure shift key is constantly updated. Temporary fix for bug.
  if (mie) {

    e = window.event;
    keyButton = e.keyCode;

  } else if (e.which) { keyButton = String.fromCharCode(e.which); };

  if (e.shiftKey == true) { keys["SHIFT"] = true; } else { keys["SHIFT"] = false; };

  return true;
}
function keyClear (e) {
  if (mie) {

    e = window.event;
    keyButton = e.keyCode;

  } else if (e.which) { keyButton = String.fromCharCode(e.which); };

  //Movement
  if (keyButton == "W") { keys["W"] = false; };
  if (keyButton == "A") { keys["A"] = false; };
  if (keyButton == "S") { keys["S"] = false; };
  if (keyButton == "D") { keys["D"] = false; };
  if (keyButton == " ") { keys["B"] = false; };
  //SHIFT Key
  if (e.shiftKey) { keys["SHIFT"] = false; };
}
function keyClick (e) {

  if (mie) {

    e = window.event;
    keyButton = e.keyCode;

  } else if (e.which) { keyButton = String.fromCharCode(e.which); };
  if (e.shiftKey == true) { keys["SHIFT"] = true; } else { keys["SHIFT"] = false; };

  if (!keys["ENTER"]) {
    //Movement
    if (keyButton == "W") { keys["W"] = true; };
    if (keyButton == "A") { keys["A"] = true; };
    if (keyButton == "S") { keys["S"] = true; };
    if (keyButton == "D") { keys["D"] = true; };
    //Fire Weapon
    if (keyButton == "T" && !keys["T"]) { keys["T"] = true; }
    else if (keyButton == "T" && keys["T"]) { keys["T"] = false; };
    //Spellbomb
    if (keyButton == " ") { keys["B"] = true; };
    if (keyButton == "P" && !keys["P"]) { keys["P"] = true; }
    else if (keyButton == "P" && keys["P"]) { keys["P"] = false; };
  };

  //Chat bar
  if ((e.which == 13 || e.keyCode == 13) && !keys["ENTER"]) { keys["ENTER"] = true; }
    else if ((e.which == 13 || e.keyCode == 13) && keys["ENTER"]) { keys["ENTER"] = false; submitChat(); };

  if (keys["ENTER"] && wordString.length < 50) {

    if (!keys["SHIFT"]) { wordString = wordString + keyButton.toLowerCase(); }
      else if (keys["SHIFT"]) { wordString = wordString + keyButton.toUpperCase(); };

    //Delete key
    if ((e.which == 46 || e.keyCode == 8) && wordString.length > 0) {
      wordString = wordString.slice(0, wordString.length - 2);
    };
  };

  e.preventDefault();
  return true;
}
//END MOUSE AND KEYBOARD =========
//GAME SOUNDS ====================
function muteGame () {

  gameBackgroundMusic.pause();
  gameBackgroundMusic.volume = 0;
}
function unMuteGame () {

  gameBackgroundMusic.volume = 0.5;
  gameBackgroundMusic.play();
}
//END GAME SOUNDS ================
//GAME SCREEN WINDOW =============
function drawGameScreen () {

  ctx.font = "16px Palatino";
  if (screenType == "GAME_SCREEN") {
    gameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Move stuff below here
    if (!keys["P"]) {
    moveEnemyBullet();
    movePlayer();
    moveEnemy();
    if ((mouseClicked == true || keys["T"]) && playerList[0].weaponCooldown <= 1 && playerList[0].mouseOccupied == false) { newBullet(); };
    if (keys["B"] && playerList[0].MP >= playerList[0].special_MP_cost && playerList[0].specialCooldown < 1) { spellBomb(); };
    movePlayerBullet();
    checkCollisions();
    scrollScreen();
    gameTime = replenishPlayerStats(gameTime);
    };
    //Draw stuff below here
    displayLootBags();
    drawPlayer();
    drawEnemy();
    drawPlayerBullet();
    drawEnemyBullet();
    showDamageTaken();
    drawMap();
    //CHAT
    if (keys["ENTER"]) { activateChat(); };
    displayChat();
    displayStats();
    displayItemDrops();

  };
  if (screenType == "MAIN_MENU" || screenType == "INSTRUCTIONS" || screenType == "DEATH_SCREEN" || screenType == "OPTIONS") {

    backgroundScrollingScene();

  };
  if (screenType == "MAIN_MENU") {

    drawMainMenuScreen();

  };
  if (screenType == "INSTRUCTIONS") {

    drawInstructionsScreen();

  };
  if (screenType == "DEATH_SCREEN") {

    drawDeathScreen();

  };
  if (screenType == "OPTIONS") {

    drawOptionsScreen();

  };
  if (screenType == "CLASS_SELECTION") {

    drawClassSelectionScreen();

  };
}
function drawMainMenuScreen () {

  //Remember to always clear the whole canvas. We don't have to worry about optimizing canvas clears until lag becomes an issue.
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#696969";
	ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
	placeButtonHere("Play", 340, 423, "CLASS_SELECTION", "35px Palatino", "#696969");
  placeButtonHere("Instructions", 445, 430, "INSTRUCTIONS", "25px Palatino", "#696969");
	placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#000";
  ctx.fillText("The Realm Project", canvas.width / 3, 200);
  ctx.shadowBlur = 0;

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}
function drawOptionsScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#696969";
	ctx.fillRect( 233, 130, 310, 300);

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("OPTIONS", (canvas.width / 3) + 55, 200);

  if (gameBackgroundMusic.volume < 0.2) {

      placeButtonHere("Enable Music!", 305, 260, "OPTIONS", "25px Palatino", "#696969", unMuteGame);

  } else { placeButtonHere("Disable Music!", 305, 260, "OPTIONS", "25px Palatino", "#696969", muteGame); };

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);

  placeButtonHere("Back to Main", 310, 360, "MAIN_MENU", "25px Palatino", "#696969");
}
function drawInstructionsScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#696969";
	ctx.fillRect( 233, 130, 310, 300);

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("INSTRUCTIONS", (canvas.width / 3) + 10, 200);

  ctx.font = "16px Palatino";
  ctx.fillText("WASD to move, Special is 'SpaceBar'", 258, 250);
  ctx.fillText("Click to fire, 'P' to pause, T is autofire", 260, 290);
  ctx.fillText("ENTER to chat.", 330, 330);

  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);

  placeButtonHere("Back to Main", 310, 360, "MAIN_MENU", "25px Palatino", "#696969");
}
function drawDeathScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerList[0].spriteImage, (canvas.width / 2) - 32, 80, 64, 64);

  ctx.font = "28px Palatino";
  ctx.fillStyle = "#696969";
  ctx.fillText(playerList[0].userName + " was killed", (canvas.width / 3) + 30, 200);

  ctx.font = "18px Palatino";
  if (playerList[0].level < 50) { ctx.fillText("Died at level: " + playerList[0].level, 240, 250); }
  else { ctx.fillText("Died with " + playerList[0].glory.toFixed(0) + " renowned Glory", 240, 250); };

  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);

  placeButtonHere("Back to Main", 350, canvas.height - 80, "MAIN_MENU", "25px Palatino", "#696969");
}
function drawClassSelectionScreen () {

  //Remember to always clear the whole canvas. We don't have to worry about optimizing canvas clears until lag becomes an issue.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
  placeButtonHere("Start", 340, 423, "GAME_SCREEN", "35px Palatino", "#696969");
  placeButtonHere("Main Menu", 445, 430, "MAIN_MENU", "25px Palatino", "#696969");
  placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#000";
  ctx.fillText("Class Selection", 290, 200);
  ctx.shadowBlur = 0;

  for (var i = 0; i < classSelectionPics.length; i++) {
    if (mouseX > 260 + (i * 90) && mouseX < 260 + (i * 90) + 64 && mouseY > canvas.height / 2 && mouseY < (canvas.height / 2) + 64) {

      ctx.shadowColor = "white";

      if (mouseClicked == true) {

        playerList[0].spriteImage = classSelectionPics[i];
        screenType = "GAME_SCREEN";

      };
    };
    ctx.shadowBlur = 10;
    ctx.drawImage(classSelectionPics[i], 260 + (i * 90), canvas.height / 2, 64, 64);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "#000";
  };

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}
function drawCreditsScreen () {

  //To be implemented later...

}
//END GAME SCREEN WINDOW =========
