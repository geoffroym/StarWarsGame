//variables
var littleJedi = document.getElementById("little-jedi");
var darthVader = document.getElementById("darth-vader");
var stormtrooper = document.getElementById("stormtrooper");
var yoda = document.getElementById("yoda");
var jediHPContainer = document.getElementById("jedi-container");
var darthVaderHPContainer = document.getElementById("darth-vader-container");
var outputDiv = document.getElementById("output-div");

let lastYodaClick = 0;
let jediDamageInterval;

let isJediChoked = false;
var gameIsRunning = true;
var isJediTurn = true;

var randomAttack;

//arrays
var jediObj = {
    name: "Jedi",
    life: 200,
    HP: jediHPContainer,
    img: littleJedi,
    attack: 20
};
var vaderObj = {
    name: "Darth Vader",
    life: 200,
    HP: darthVaderHPContainer,
    img: darthVader,
    attack: 20
};

//onclick events
littleJedi.onclick = function(){
    if (isJediTurn){
        jediAgainstVader();
        isJediTurn = false;
    }
};

yoda.onclick = yodaHeal;

alert(`Welcome to Darth Vader Fight Simulator
Here are the rules of the game:

Embrace your destiny as an apprentice Jedi, 
eager to learn the ways of the Force from your wise and experienced master.
The fate of the galaxy rests upon your shoulders, 
and your master will not intervene in your duel with Darth Vader. 
You must summon all of your Jedi training and courage to defeat the Dark Lord.
Your master's healing abilities are limited, 
and you must conserve his strength for when it's most critical.
Beware Darth Vader's formidable Force powers, including his ability to choke you, 
and summon his relentless stormtroopers to his aid.

Embark on a perilous journey to prove your worth as a Jedi and defeat Darth Vader! 
May the Force be with you, young Padawan.`)

function jediAgainstVader(){
    if (!gameIsRunning || isJediChoked){
        return;
    }

    //jedi animation   
    littleJedi.style.left = "700px"
    littleJedi.style.transform = 'rotate(10deg)';
    setTimeout(() => {
        littleJedi.style.left = "250px"
        littleJedi.style.transform = 'none';
    }, 500);

    //jedi does random damage to darth Vader from 5 to 20
    const min = 5;
    const max = 20;
    randomAttack = Math.floor(Math.random() * (max - min) + min);
    jediObj.attack = randomAttack;

    //if jedi life is bigger then 0, he takes damage from Vader
    if (vaderObj.life >= 0){
        updateJediHP();
        vaderObj.life -= jediObj.attack;
        

    //Vader attacks after 1/2 second
    setTimeout(vaderAgaintsJedi, 500);
    }

    if (vaderObj.life <= 0){
        vaderObj.life = 0;
        alert("May the force be with you. You won this battle against Darth vader.")
        vaderObj.HP.style.backgroundColor = "red";
        gameIsRunning = false;
    }
    console.log(`vader life: ${vaderObj.life}`);
}

function vaderAgaintsJedi(){
    if (!gameIsRunning){
        return; //do nothing if game is not running
    }

    outputDiv.innerHTML = "";
    //makes darth vader go against jedi
    darthVader.style.right = "600px"
    darthVader.style.transform = 'rotate(-10deg)';

    //sets darth vader image back to original place
    setTimeout(() => {
        darthVader.style.right = "200px"
        darthVader.style.transform = 'none';
    }, 500);

    //darth vader attack does random damage from 10 to 20
    const min = 10;
    const max = 20;
    randomAttack = Math.floor(Math.random() * (max - min) + min);
    vaderObj.attack = randomAttack;
    if (jediObj.life >= 0){
        updateVaderHP();
        jediObj.life -= vaderObj.attack;

        darthVader.style.transform = 'rotate(-10deg)';
        setTimeout(() => {
            darthVader.style.transform = 'none';
        }, 500);

        if (Math.floor(Math.random() * 4) === 1){ //darth vader has a 25% chance to choke jedi
            isJediChoked = true;
            vaderChoke();
        }

        console.log(jediObj.life)

        if (jediObj.life <= 0){
            jediObj.life = 0;
            littleJedi.src = 'Images/little-jedi-dying.png';
            littleJedi.style.width = '150px';
            littleJedi.style.transform = 'rotate(-90deg)';
            jediObj.HP.style.backgroundColor = "red";

            gameIsRunning = false;
            alert("You lose! Did you really think you were going to win against Darth Vader?")
        }
    }

    isJediTurn = true;
    console.log(`jedi life: ${jediObj.life}`);
}

function vaderChoke(){
    if (isJediChoked){
        //changes darth vader image to choking mode
        darthVader.src = 'Images/choking-darth-vader.png';
        darthVader.style.transform = 'rotate(-10deg)';
        darthVader.style.width = '250px';

        //changes jedi image to choked/dying mode
        littleJedi.src = 'Images/little-jedi-dying.png';
        littleJedi.style.width = '150px';
        littleJedi.style.bottom = '100px';

        //setInterval to damage the jedi every second
        jediDamageInterval = setInterval(() => {
            updateJediHP();
            jediObj.life -= 10;
            console.log(jediObj.life);

        //check if jedi is dead and stop the interval if so
        if (jediObj.life <= 0) {
            jediObj.life = 0;
            littleJedi.src = 'Images/little-jedi-dying.png';
            littleJedi.style.width = '150px';
        clearInterval(jediDamageInterval);
        }
        }, 1000);
    }
    
    // Reset images back to the original after 3 seconds
    if (jediObj.life > 0){
        setTimeout(() => {
            isJediChoked = false;
            isJediTurn = true;
            clearInterval(jediDamageInterval);
            littleJedi.src = 'Images/little-jedi.png';
            littleJedi.style.width = '150px';
            littleJedi.style.bottom = '5px';
            darthVader.src = 'Images/darth-vader.png';
            darthVader.style.height = '230px';
            darthVader.style.width = '175px';
        }, 3000);
    }     
}

function yodaHeal(){
    if (!gameIsRunning){
        return;  //this statement causes the function to exit immediately
    }

    const healPoints = 30;

    const currentTime = Date.now();
    const elapsedTime = currentTime - lastYodaClick;

    if (elapsedTime >= 5000){
        lastYodaClick = currentTime;
            if (jediObj.life > 0){
                jediObj.life += healPoints;
                if (jediObj.life >= 200){
                    jediObj.life = 200;
                }
                if (jediObj.life == 0){
                    jediObj.life = 0;
                }
                updateJediHP();
            }
    } else {
        outputDiv.innerHTML = "Yoda says: I can not heal you now."
    }
}

function updateJediHP(){
    jediObj.HP.style.backgroundColor = "green";
    jediObj.HP.style.width = `${jediObj.life}px`
}

function updateVaderHP(){
    vaderObj.HP.style.backgroundColor = "green";
    vaderObj.HP.style.width = `${vaderObj.life}px`;
}


//NEED TO MAKE STORMTROOPER APPEAR EVERY X SECONDS OR SOMETHING >>> new function

//IF JEDI DIES IN THE MIDDLE OF A CHOKE, HE DOESN'T REALLY DIE, HE HAS TO ATTACK ONCE MORE TO DIE, SHOULD FIX THIS




