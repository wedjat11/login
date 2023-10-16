
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic ZjU0OTMzMjUtOWJkYi00OGY5LWJiMDYtODY2ZjJlYzU4YWZjOnBjOFVjRngjaUEwempSV3FXblBjLXlAdU0qQWpPdS1oUnhWMEFCRTZ5Y0kxeUtXS0p4bjYwTiM4VzZBcU44eTY='
    }
  };


// URL de la API que deseas consultar
const apiUrl = 'https://sandbox.belvo.com/api/institutions/?page_size=100&country_code=MX&country_code__in=';

document.addEventListener('DOMContentLoaded', function () {
  // Referencia al elemento <ul> donde se mostrarán los resultados
  const ul = document.createElement('ul');
  document.body.appendChild(ul); // Agregar la lista al cuerpo del documento

  // Realizar la solicitud a la API utilizando fetch
  fetch(apiUrl, options)
  .then(response => {
    // Verificar si la solicitud fue exitosa (código de respuesta 200)
    if (response.status === 200) {
      return response.json(); // Convertir la respuesta a JSON
    } else {
      throw new Error('No se pudo obtener la respuesta de la API');
    }
  })
  .then(data => {
    // Recorrer los resultados y agregarlos a la lista
    data.results.forEach(result => {
      const li = document.createElement("li");
      li.textContent = `Nombre: ${result.name}, Tipo: ${result.type}, País: ${result.country_code}, Estado: ${result.status}`;
      ul.appendChild(li);
    });
  })
  .catch(error => {
    // Manejar errores en caso de que la solicitud falle
    console.error('Error:', error);
  });
});
