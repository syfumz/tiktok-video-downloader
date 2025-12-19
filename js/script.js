const btn = document.getElementById('downloadBtn');
const input = document.getElementById('tiktokUrl');

const result = document.getElementById('result');
const video = document.getElementById('video');
const downloadLink = document.getElementById('downloadLink');
const audioLink = document.getElementById('audioLink');

const photoContainer = document.getElementById('photoContainer');

btn.addEventListener('click', async () => {
  const url = input.value.trim();

  if (!url) {
    alert('Masukkan link TikTok!');
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Mengambil...';

  try {
    const res = await fetch(
      `https://tikwm.com/api/?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

    if (!data || !data.data) {
      alert('Konten tidak ditemukan');
      return;
    }

    // ===== RESET TAMPILAN =====
    result.classList.add('hidden');
    photoContainer.classList.add('hidden');
    photoContainer.innerHTML = '';
    video.src = '';
    downloadLink.href = '';
    audioLink.href = '';
    audioLink.classList.add('hidden');

    // =================================================
    // PRIORITAS FOTO / SLIDE FOTO
    // =================================================
    if (data.data.images && data.data.images.length > 0) {

      data.data.images.forEach((img, i) => {
        const div = document.createElement('div');
        div.className = 'photo-item';

        div.innerHTML = `
          <img src="${img}" alt="Photo ${i + 1}" loading="lazy">
          <a href="${img}" download>Download Foto ${i + 1}</a>
        `;

        photoContainer.appendChild(div);
      });

      photoContainer.classList.remove('hidden');

      // audio slideshow (jika ada)
      if (data.data.music) {
        audioLink.href = data.data.music;
        audioLink.classList.remove('hidden');
      }
    }

    // =================================================
    // VIDEO BIASA
    // =================================================
    else if (data.data.play) {

      video.src = data.data.play;
      downloadLink.href = data.data.play;

      if (data.data.music) {
        audioLink.href = data.data.music;
        audioLink.classList.remove('hidden');
      }

      result.classList.remove('hidden');
    }

    // =================================================
    // TIDAK DIDUKUNG
    // =================================================
    else {
      alert('Jenis konten tidak didukung');
    }

  } catch (err) {
    alert('Gagal mengambil konten');
    console.error(err);
  }

  btn.disabled = false;
  btn.innerText = 'Download';
});
