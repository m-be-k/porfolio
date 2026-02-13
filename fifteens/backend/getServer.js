

fetch('http://localhost:3000/api/get_top_players')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));