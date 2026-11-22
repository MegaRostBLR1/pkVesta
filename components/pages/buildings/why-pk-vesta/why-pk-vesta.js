/* Интерактивность блока «Почему PK VESTA». */
function initBuildingsWhyPkVesta() {
    const accordion = document.querySelector('[data-why-vesta-accordion]');

    if (!accordion || accordion.dataset.initialized === 'true') {
        return;
    }

    accordion.dataset.initialized = 'true';

    accordion.addEventListener('click', (event) => {
        const toggle = event.target.closest('.why-vesta__toggle');

        if (!toggle || !accordion.contains(toggle)) {
            return;
        }

        const item = toggle.closest('.why-vesta__item');
        const contentId = toggle.getAttribute('aria-controls');
        const content = contentId ? document.getElementById(contentId) : null;
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        accordion.querySelectorAll('.why-vesta__toggle').forEach((button) => {
            button.setAttribute('aria-expanded', 'false');
            const controlledId = button.getAttribute('aria-controls');
            const controlledContent = controlledId ? document.getElementById(controlledId) : null;

            if (controlledContent) {
                controlledContent.hidden = true;
            }

            button.closest('.why-vesta__item')?.classList.remove('is-open');
            const icon = button.querySelector('.why-vesta__toggle-icon img');

            if (icon) {
                icon.src = 'https://www.figma.com/api/mcp/asset/ed29d227-ac6b-4ba1-b090-2248640e4b4c/5d936.svg';
            }
        });

        if (!isExpanded) {
            toggle.setAttribute('aria-expanded', 'true');

            if (content) {
                content.hidden = false;
            }

            item?.classList.add('is-open');
            const icon = toggle.querySelector('.why-vesta__toggle-icon img');

            if (icon) {
                icon.src = 'https://www.figma.com/api/mcp/asset/ed29d227-ac6b-4ba1-b090-2248640e4b4c/33e3b.svg';
            }
        }
    });
}
