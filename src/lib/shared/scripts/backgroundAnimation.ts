export function animateBackground() {
    const background = document.querySelector('.background-animation')

    const duration = 80000
    const startTime = performance.now()

    function animate(currentTime) {
        const elapsed = (currentTime - startTime) % duration
        const t = (elapsed / duration) * Math.PI * 2

        const x = 12 * Math.sin(t)
        const y = 6 * Math.sin(2 * t)

        if (background) {
            background.style.transform = `scale(2) translate(${x}%, ${y}%)`
        }

        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
}