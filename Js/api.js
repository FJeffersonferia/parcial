axios.get('/api/home')
            .then(response => {
                const data = response.data;
                document.getElementById('about-us').innerHTML = data.aboutUs;
                // Cargar otros datos dinámicamente
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });