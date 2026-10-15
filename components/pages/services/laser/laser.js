function initLaser() {
    document.querySelectorAll('.laser-benefits').forEach((root) => {
        if (root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';

        root.querySelectorAll('.laser-benefits__item-toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const willExpand = toggle.getAttribute('aria-expanded') !== 'true';

                root.querySelectorAll('.laser-benefits__item-toggle').forEach((itemToggle) => {
                    itemToggle.setAttribute('aria-expanded', 'false');
                    const panel = root.querySelector(`#${itemToggle.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = true;

                    const icon = itemToggle.querySelector('.laser-benefits__toggle-icon img');
                    if (icon) {
                        icon.src = 'https://www.figma.com/api/mcp/asset/225d48e0-b804-457d-a743-1bf7af983def/dcfb2.svg';
                    }
                });

                if (willExpand) {
                    toggle.setAttribute('aria-expanded', 'true');
                    const panel = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = false;

                    const icon = toggle.querySelector('.laser-benefits__toggle-icon img');
                    if (icon) {
                        icon.src = 'https://www.figma.com/api/mcp/asset/225d48e0-b804-457d-a743-1bf7af983def/33e3b.svg';
                    }
                }
            });
        });
    });


    document.querySelectorAll('.laser-materials').forEach((root) => {
        if (root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';
        root.querySelectorAll('.laser-materials__toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';
                root.querySelectorAll('.laser-materials__toggle').forEach((item) => {
                    item.setAttribute('aria-expanded', 'false');
                    const panel = root.querySelector(`#${item.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = true;
                    const icon = item.querySelector('.laser-materials__toggle-icon img');
                    if (icon) icon.src = 'https://www.figma.com/api/mcp/asset/529bb6bf-2950-4bc3-a485-eb3e3f21fa62/dcfb2.svg';
                });
                if (!wasExpanded) {
                    toggle.setAttribute('aria-expanded', 'true');
                    const panel = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = false;
                    const icon = toggle.querySelector('.laser-materials__toggle-icon img');
                    if (icon) icon.src = 'https://www.figma.com/api/mcp/asset/529bb6bf-2950-4bc3-a485-eb3e3f21fa62/33e3b.svg';
                }
            });
        });
        root.querySelectorAll('.laser-materials__zoom').forEach((zoom) => {
            const image = zoom.closest('.laser-materials__visual')?.querySelector('.laser-materials__image');
            if (!image) return;
            zoom.addEventListener('click', () => {
                const preview = window.open(image.src, '_blank', 'noopener,noreferrer');
                if (preview) preview.opener = null;
            });
        });
    });


}
