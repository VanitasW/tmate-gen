const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// API Key dari environment variable
const TMATE_API_KEY = process.env.TMATE_API_KEY || 'tmk-914Hzkcw1fm57fD6wJTmyFUzB0';
const TMATE_SOCKET = '/tmp/tmate.sock';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-tmate', (req, res) => {
    const sessionName = req.body.sessionName || `zumyfree-${Date.now()}`;
    
    // Modifikasi perintah untuk menggunakan socket
    const createSessionCmd = `tmate -S ${TMATE_SOCKET} -k ${TMATE_API_KEY} -n ${sessionName} new-session -d`;

    console.log('Executing command:', createSessionCmd);

    // Fungsi untuk mendapatkan informasi koneksi
    const getConnectionInfo = (displayFormat) => {
        return new Promise((resolve, reject) => {
            // Gunakan socket yang sama untuk mendapatkan informasi
            exec(`tmate -S ${TMATE_SOCKET} display -p "${displayFormat}"`, (err, output, stderr) => {
                if (err) {
                    console.error(`Error getting connection info for ${displayFormat}:`, stderr);
                    reject(stderr);
                } else {
                    resolve(output.trim());
                }
            });
        });
    };

    // Eksekusi perintah membuat sesi
    exec(createSessionCmd, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing tmate command:', stderr);
            return res.status(500).json({ 
                error: `Gagal membuat sesi: ${stderr}`,
                command: createSessionCmd
            });
        }

        // Tunggu sebentar untuk memastikan sesi siap
        setTimeout(() => {
            // Tambahkan perintah wait tmate-ready untuk memastikan sesi benar-benar siap
            exec(`tmate -S ${TMATE_SOCKET} wait tmate-ready`, (waitErr) => {
                if (waitErr) {
                    console.error('Error waiting for tmate session:', waitErr);
                }

                // Ambil informasi koneksi
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
                    console.error('Gagal mendapatkan informasi koneksi:', error);
                    res.status(500).json({ 
                        error: 'Gagal mendapatkan informasi koneksi',
                        details: error 
                    });
                });
            });
        }, 3000); // Tambahkan delay 3 detik untuk memastikan sesi terbentuk
    });
});

// Tambahkan error handling untuk server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server!');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
