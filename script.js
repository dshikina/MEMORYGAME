"use strict";

// Código de la barra lateral junto con los elementos
let lateral = document.getElementById("lateral");

let cuatroCuatro = document.createElement("button");
let seisSeis = document.createElement("button");
cuatroCuatro.className = "botonLateral";
seisSeis.className = "botonLateral";
cuatroCuatro.textContent = "16 cartas";
seisSeis.textContent = "24 cartas";

let indicacion = document.createElement("h2");
indicacion.className = "indicacion";
indicacion.textContent = "SELECCIONA EL MODO QUE DESEAS JUGAR ||  8x2  ||  8x3";

let intentos = document.createElement("h3");
intentos.className = "intentos";
let inten = 0;
intentos.textContent = `Intentos realizados:  ${inten}`;

let temporizador = document.createElement("h3");
temporizador.className = "temporizador";
let segundos = 0;
let intervalo;

let botonReiniciar = document.createElement("button");
botonReiniciar.textContent = "REINICIAR";
botonReiniciar.className = "botonReiniciar";

// Agregar los elementos al contenedor lateral
lateral.appendChild(indicacion);
lateral.appendChild(cuatroCuatro);
lateral.appendChild(seisSeis);
lateral.appendChild(intentos);
lateral.appendChild(temporizador);
lateral.appendChild(botonReiniciar);

//los arrays que almacenan los dinosaurios segun la dificultado que tengo 16 y 24 cartas
let array16 = ["anquilosaurio", "anquilosaurio", "estegosaurio", "estegosaurio", "mosasaurus", "mosasaurus",
    "parasaulorophus", "parasaulorophus", "plesiosaurio", "plesiosaurio", "pterodactylus", "pterodactylus",
    "triceratops", "triceratops", "tiranosaurio", "tiranosaurio"
];

let array24 = ["anquilosaurio", "anquilosaurio", "estegosaurio", "estegosaurio", "mosasaurus", "mosasaurus",
    "parasaulorophus", "parasaulorophus", "plesiosaurio", "plesiosaurio", "pterodactylus", "pterodactylus",
    "triceratops", "triceratops", "tiranosaurio", "tiranosaurio", "silvisaurus", "silvisaurus", "spinosaurus",
    "spinosaurus", "velociraptor", "velociraptor", "bagaceratops", "bagaceratops"
];

// metodo para iniciar el cronómetro
function iniciarCronometro() {
    clearInterval(intervalo); // Detener cualquier intervalo previo
    segundos = 0;
    temporizador.textContent = `Tiempo transcurrido: ${segundos}s`;
    intervalo = setInterval(() => {
        segundos++;
        temporizador.textContent = `Tiempo transcurrido: ${segundos}s`;
    }, 1000);
}

// metodo para detener el cronómetro
function detenerCronometro() {
    clearInterval(intervalo);
}

// Lógica del contenedor de juego
//creacion de elementos adicionales del contenedor juego
let juego = document.getElementById('juego');
let titulo = document.createElement("h1");
titulo.className = "titulo";
titulo.textContent = "MEMORY";
juego.appendChild(titulo);

let cartasVolteadas = [];  // Almacenar cartas volteadas
let cartasCorrectas = [];  // Almacenar cartas que coinciden
let numIntentos = 0;

// metodo para crear las cartas, recibe una cantidad
function generacionCartas(cantidad) {
    //desarodena y reparte las cartas aleatoriamente
    let cartas = (cantidad === 16 ? array16 : array24).sort(() => Math.random() - 0.5);

    for (let i = 0; i < cantidad; i++) {
        let carta = document.createElement('div');
        carta.className = 'carta';

        carta.innerHTML = `
            <div class="cara trasera">
                <img src="carta.png" alt="Carta trasera">
            </div>
            <div class="cara delantera">
                <img src="${cartas[i]}.png" alt="${cartas[i]}">
            </div>
        `;
        //cuando se da click en una carta se llama al metodo que la voltea
        carta.addEventListener("click", () => voltearCarta(carta)); 
        juego.appendChild(carta);
    }
}

// metodo de logica segun la cantidad de cartas
function tipoJuego(cantidad) {
    detenerCronometro(); // Reiniciar cronómetro al seleccionar nuevo juego
    iniciarCronometro(); // Comenzar cronómetro para el nuevo juego

    // esto hace que el titulo se mantenga independientemente de lo que suceda con las cartas
    Array.from(juego.children).forEach((child) => {
        if (!child.classList.contains("titulo")) {
            child.remove();
        }
    });
    //seccion que comprueba con la es la dificultad escogida y segun ello se asigna una clase para poder estilizarla
    if (cantidad === 16) {
        juego.className = 'juego-16'; 
    } else if (cantidad === 24) {
        juego.className = 'juego-24'; 
    }
    //se generan la carta segun la cantidad
    generacionCartas(cantidad); 
}

// método que verifica si hay pares iguales o no
function compararCartas() {
    let [carta1, carta2] = cartasVolteadas;
    //se toma la imagen seleccionada según la imagen
    let imagen1 = carta1.querySelector(".delantera img").src;
    let imagen2 = carta2.querySelector(".delantera img").src;
    //si coinciden se agregan a volteadas
    if (imagen1 === imagen2) {  
        cartasCorrectas.push(carta1, carta2);
        cartasVolteadas = []; 
    } else {
        // Si no coinciden se voltean 
        carta1.classList.remove("volteada");
        carta2.classList.remove("volteada");
        cartasVolteadas = [];  
    }

    // Determinar el total de cartas según el tipo de juego para poder terminar el juego
    let cartasTotales = (juego.className === 'juego-16') ? 16 : 24;
    
    // si es que el numero de cartas resueltas es el mismo a las de todas las cartas segun el tipo de juego
    if (cartasCorrectas.length === cartasTotales) {
        //se detiene el temporizador
        detenerCronometro(); 
        // Mensaje de fin de juego
        setTimeout(() => alert(`¡Juego terminado en ${segundos}s y ${numIntentos} intentos!`), 500);  
    }
}


//metodo que voltea la carta tomando como base una clase
function voltearCarta(carta) {
    if (carta.classList.contains("volteada") || cartasVolteadas.length === 2) return; 

    carta.classList.add("volteada");  // Voltear la carta (mostrar el frente)
    cartasVolteadas.push(carta);  // Agregar la carta a la lista de cartas volteadas

    // Comprobar si se han volteado dos cartas
    if (cartasVolteadas.length === 2) {
        numIntentos++;  // Aumentar los intentos
        intentos.textContent = `Intentos realizados: ${numIntentos}`;
        setTimeout(compararCartas, 1000);  // Comparar las cartas después de un pequeño retraso
    }
}

//funcionalidad de 16 cartas por lo que se crea la logica con 16 usando el metodo tipoJuego
cuatroCuatro.addEventListener('click', () => {
    tipoJuego(16);
    //reinicia los intentos
    inten = 0; 
    intentos.textContent = `Intentos realizados: ${inten}`;
});

//funcionalidad de 24 cartas por lo que se crea la logica con 24 usando el metodo tipoJuego
seisSeis.addEventListener('click', () => {
    tipoJuego(24);
    //reinicia intentos
    inten = 0;
    intentos.textContent = `Intentos realizados: ${inten}`; 
});


// funcionalidad del boton de reiniciar, actualiza todos los elementos a un inicio
botonReiniciar.addEventListener('click', () => {
    detenerCronometro();
    iniciarCronometro();
    numIntentos = 0; 
    intentos.textContent = `Intentos realizados:  ${numIntentos}`;
    cartasVolteadas = [];
    cartasCorrectas = [];
    //me parecio mejor que nuevamente se regrese al de 16 como defecto
    tipoJuego(16); 
});
