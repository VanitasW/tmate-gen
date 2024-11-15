const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// API Key dari environment variable
const TMATE_API_KEY = process.env.TMATE_API_KEY || 'tmk-914Hzkcw1fm57fD6wJTmyFUzB0';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-tmate', (req, res) => {
    // Ambil nama sesi dari body request atau gunakan default
    const sessionName = req.body.sessionName || `zumyfree-${Date.now()}`;
    
    // Perintah untuk membuat tmate session dengan nama khusus dan API key
    const createSessionCmd = `tmate -k ${TMATE_API_KEY} -n ${sessionName} new-session -d`;
    
    exec(createSessionCmd, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ 
                error: `Gagal membuat sesi: ${stderr}`,
                command: createSessionCmd
            });
        }
        
        // Fungsi untuk mendapatkan informasi koneksi
        const getConnectionInfo = (displayFormat) => {
            return new Promise((resolve, reject) => {
                exec(`tmate -S /tmp/tmate.sock display -p "${displayFormat}"`, (err, output, stderr) => {
                    if (err) {
                        reject(stderr);
                    } else {
                        resolve(output.trim());
                    }
                });
            });
        };

        // Dapatkan informasi koneksi SSH dan Web
        Promise.all([
            getConnectionInfo("#{tmate_ssh}"),
            getConnectionInfo("#{tmate_web}")
        ])
        .then(([sshConn, webConn]) => {
            res.json({ 
                sessionName: sessionName,
                sshLink: sshConn,
                webLink: webConn,
                apiKey: TMATE_API_KEY
            });
        })
        .catch(error => {
            res.status(500).json({ 
                error: 'Gagal mendapatkan informasi koneksi',
                details: error 
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
