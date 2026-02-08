window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }
});

// Magnetic Buttons Logic
document.querySelectorAll('.btn-elite').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const position = button.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0px, 0px)';
    });
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', e => {
    if(cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
});
