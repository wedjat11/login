// Definición de las URL y elementos del DOM
const apiUrl = 'https://sandbox.belvo.com/api/institutions/?page_size=100&country_code=MX&country_code__in=';
const apiDetails = 'https://sandbox.belvo.com/api/accounts/';
const ul = document.getElementById("lista-enlaces");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const detallesUl = document.createElement("ul");
let idUsable; // Variable para almacenar el ID obtenido

// Credenciales de autorización
const credentials = 'Basic ZjU0OTMzMjUtOWJkYi00OGY5LWJiMDYtODY2ZjJlYzU4YWZjOnBjOFVjRngjaUEwempSV3FXblBjLXlAdU0qQWpPdS1oUnhWMEFCRTZ5Y0kxeUtXS0p4bjYwTiM4VzZBcU44eTY=';

// Función asincrónica para obtener el ID de la API
async function obtenerIdUsable() {
  try {
    const response = await fetch('https://sandbox.belvo.com/api/links/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': credentials
      },
      body: JSON.stringify({
        access_mode: 'recurrent',
        institution: 'erebor_mx_retail',
        username: 'bnk100',
        password: 'full'
      })
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud de ID: ${response.status}`);
    }

    const data = await response.json();
    idUsable = data.id; // Almacenar el ID obtenido
  } catch (error) {
    console.error('Error al obtener el ID:', error);
  }
}

// Función asincrónica para obtener detalles con el ID
async function obtenerDetalles() {
  try {
    const response = await fetch(apiDetails, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': credentials
      },
      body: JSON.stringify({ save_data: true, link: idUsable })
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud de detalles: ${response.status}`);
    }

    const data = await response.json();
    
     // Iterar a través de los objetos en la respuesta y mostrar los campos "name" y "balance" en elementos de lista
     data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `Name: ${item.name}, Balance (Current): ${item.balance.current}, Balance (Available): ${item.balance.available}`;
      detallesUl.appendChild(li); // Agregar el elemento li a la lista ul
    });

    // Mostrar la lista de detalles en el modal
    modalContent.appendChild(detallesUl);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
  }
}

// Función para crear un elemento de lista a partir de un resultado
function crearListItem(result) {
  const li = document.createElement("li");
  li.textContent = `${result.name}`;

  // Crear el contenedor de botones
const buttonContainer = document.createElement("div");
buttonContainer.className = "button-container";

const verDetallesBtn = document.createElement("button");
verDetallesBtn.textContent = "Ver detalles";
verDetallesBtn.className = "ver-detalles";
buttonContainer.appendChild(verDetallesBtn);

li.appendChild(buttonContainer); // Agregar el contenedor al elemento li

  // Agregar un manejador de eventos para mostrar detalles al hacer clic en el botón
  verDetallesBtn.addEventListener('click', () => {
    modal.style.display = "block"; // Mostrar el modal
    obtenerDetalles(); // Realizar la solicitud de detalles
  });

  return li;
}

// Función para cargar la lista de resultados en el DOM
function cargarLista(data) {
  data.results.forEach(result => {
    ul.appendChild(crearListItem(result));
  });
}

// Función asincrónica para obtener la lista de instituciones
async function obtenerInstituciones() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': credentials
      }
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener la respuesta de la API');
    }

    const data = await response.json();
    cargarLista(data); // Cargar la lista de resultados en el DOM
  } catch (error) {
    console.error('Error:', error);
  }
}

closeModal.className = "cerrar-modal"; // Aplicar la clase de estilo "cerrar-modal" al botón "Cerrar" del modal

// Agregar manejadores de eventos para cerrar el modal
closeModal.addEventListener('click', () => {
  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }
  modal.style.display = "none";
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Iniciar el proceso: obtener el ID y luego cargar la lista de instituciones
obtenerIdUsable()
  .then(() => obtenerInstituciones());
