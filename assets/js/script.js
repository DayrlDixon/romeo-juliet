document.addEventListener('DOMContentLoaded', function() {

    // --- FUNGSI UTAMA: TOMBOL BUKA UNDANGAN ---
    const openInvitationBtn = document.getElementById('openInvitation');
    if (openInvitationBtn) {
        openInvitationBtn.addEventListener('click', function() {
            const coverPage = document.getElementById('coverPage');
            const mainContent = document.getElementById('mainContent');
            const music = document.getElementById('weddingMusic');
            const musicToggle = document.getElementById('musicToggle');

            coverPage.classList.add('hidden');
            mainContent.style.display = 'block';
            document.body.style.overflowY = 'auto';
            
            music.play().catch(e => console.log("Autoplay musik dicegah oleh browser."));
            musicToggle.classList.add('playing');
        });
    } else {
        // Jika tombol tidak ditemukan, tampilkan pesan error di console
        console.error("Error: Tombol 'Buka Undangan' dengan ID 'openInvitation' tidak ditemukan.");
        return; // Hentikan script jika elemen paling penting tidak ada
    }

    // --- FUNGSI-FUNGSI LAINNYA ---

    // Menampilkan nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        const decodedGuestName = guestName.replace(/_/g, ' ');
        document.getElementById('guestName').innerText = decodedGuestName;
        document.getElementById('guestNameHome').innerText = decodedGuestName;
    }

    // Kontrol tombol musik
    const musicToggle = document.getElementById('musicToggle');
    musicToggle.addEventListener('click', () => {
        const music = document.getElementById('weddingMusic');
        if (music.paused) {
            music.play();
            musicToggle.classList.add('playing');
        } else {
            music.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // Countdown Timer
    const countdownElement = document.getElementById('countdown');
    const countdownDate = new Date("Dec 20, 2025 11:00:00").getTime();
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "<h4>Acara Telah Selesai</h4>";
            return;
        }
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `<div class="countdown-item"><div>${d}</div><span>Hari</span></div><div class="countdown-item"><div>${h}</div><span>Jam</span></div><div class="countdown-item"><div>${m}</div><span>Menit</span></div><div class="countdown-item"><div>${s}</div><span>Detik</span></div>`;
    }, 1000);

    // Modal Galeri
    const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', e => {
            document.getElementById('modalImage').src = e.target.src;
            galleryModal.show();
        });
    });
    
    // Salin Nomor Rekening
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Nomor rekening berhasil disalin!');
        });
    };

    // Logika Form RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpList = document.getElementById('rsvpList');
    
    function loadRSVPs() {
        fetch('rsvp.php')
            .then(response => response.json())
            .then(data => {
                rsvpList.innerHTML = '';
                if (data && data.length > 0) {
                    data.forEach(rsvp => {
                        const item = document.createElement('div');
                        item.className = 'rsvp-item';
                        const pesan = rsvp.pesan ? `"${rsvp.pesan}"` : '...';
                        item.innerHTML = `<p class="mb-0"><span class="nama">${rsvp.nama}</span> <span class="status ${rsvp.kehadiran === 'Hadir' ? 'hadir' : 'tidak-hadir'}">${rsvp.kehadiran}</span></p><p class="fst-italic mb-0">${pesan}</p>`;
                        rsvpList.appendChild(item);
                    });
                } else {
                    rsvpList.innerHTML = '<p class="text-center">Jadilah yang pertama memberikan ucapan!</p>';
                }
            })
            .catch(error => console.error('Gagal memuat RSVP:', error));
    }
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('rsvp.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                const rsvpAlert = document.getElementById('rsvp-alert');
                rsvpAlert.innerHTML = `<div class="alert ${data.status === 'success' ? 'alert-success' : 'alert-danger'}">${data.message}</div>`;
                if (data.status === 'success') {
                    this.reset();
                    loadRSVPs();
                }
            });
    });

    // Animasi saat scroll
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => observer.observe(element));

    // Muat daftar RSVP saat halaman pertama kali siap
    loadRSVPs();
});