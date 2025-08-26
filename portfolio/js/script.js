document.addEventListener('DOMContentLoaded', function() {
    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;

            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null;
                accordionItem.classList.remove('active');
            } else {
                document.querySelectorAll('.accordion-content').forEach(content => {
                    content.style.maxHeight = null;
                    content.parentElement.classList.remove('active');
                });
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                accordionItem.classList.add('active');
            }
        });
    });

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.slider-nav .prev');
    const nextBtn = document.querySelector('.slider-nav .next');

    if (slider && prevBtn && nextBtn) {
        const scrollAmount = slider.offsetWidth;

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Progress Bars
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const progress = circle.dataset.progress;
        const progressPercent = circle.querySelector('.progress-percent');
        let currentProgress = 0;
        const interval = setInterval(() => {
            if (currentProgress > progress) {
                clearInterval(interval);
                currentProgress = progress;
            }
            progressPercent.textContent = `${currentProgress}%`;
            circle.style.background = `conic-gradient(#ff5a3c ${currentProgress * 3.6}deg, #eee 0deg)`;
            currentProgress++;
        }, 20);
    });
});
