<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TMate SSH Creator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            text-align: center; 
        }
        .form-group {
            margin-bottom: 15px;
        }
        input, button {
            padding: 10px;
            margin: 5px 0;
            width: 100%;
            max-width: 300px;
        }
        #sessionInfo { 
            background-color: #f4f4f4; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 20px; 
            text-align: left; 
        }
        .link-container {
            margin: 10px 0;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <h1>Buat Sesi SSH tmate</h1>
    
    <div class="form-group">
        <input 
            type="text" 
            id="sessionNameInput" 
            placeholder="Nama Sesi (opsional)"
        >
    </div>
    
    <button id="createSession">Buat Sesi</button>
    
    <div id="sessionInfo"></div>

    <script>
        document.getElementById('createSession').addEventListener('click', function() {
            const button = this;
            const sessionNameInput = document.getElementById('sessionNameInput');
            const sessionName = sessionNameInput.value.trim();

            button.disabled = true;
            button.textContent = 'Membuat Sesi...';

            fetch('/create-tmate', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    sessionName: sessionName || undefined 
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal membuat sesi');
                }
                return response.json();
            })
            .then(data => {
                button.disabled = false;
                button.textContent = 'Buat Sesi';

                document.getElementById('sessionInfo').innerHTML = `
                    <h3>Informasi Sesi</h3>
                    <div class="link-container">
                        <strong>Nama Sesi:</strong> ${data.sessionName}
                    </div>
                    <div class="link-container">
                        <strong>API Key:</strong> ${data.apiKey}
                    </div>
                    <div class="link-container">
                        <strong>SSH Link:</strong> 
                        <a href="ssh://${data.sshLink}" target="_blank">${data.sshLink}</a>
                    </div>
                    <div class="link-container">
                        <strong>Web Link:</strong> 
                        <a href="${data.webLink}" target="_blank">${data.webLink}</a>
                    </div>
                    <p><small>Catatan: Gunakan API Key untuk akses yang stabil</small></p>
                `;
            })
            .catch(error => {
                button.disabled = false;
                button.textContent = 'Buat Sesi';

                document.getElementById('sessionInfo').innerHTML = `
                    <p style="color: red;">${error.message}</p>
                `;
            });
        });
    </script>
</body>
</html>
