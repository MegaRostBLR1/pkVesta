(() => {
    const choiceItems = document.querySelectorAll('.header__location-choice-item');

    choiceItems.forEach((item) => {
        item.addEventListener('click', () => {
            const choice = item.closest('.header__location-choice');

            if (!choice) {
                return;
            }

            choice.querySelectorAll('.header__location-choice-item--selected')
                .forEach((selectedItem) => {
                    selectedItem.classList.remove('header__location-choice-item--selected');
                });

            item.classList.add('header__location-choice-item--selected');

            const trigger = choice.parentElement;
            const selectedText = item.querySelector('.header__location-choice-name')?.textContent.trim()
                || item.querySelector('.header__location-choice-code')?.textContent.trim()
                || item.querySelector('.header__location-choice-country')?.textContent.trim()
                || item.textContent.trim();

            if (trigger) {
                const arrow = trigger.querySelector('.arrow-svg');
                const textNode = Array.from(trigger.childNodes)
                    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

                if (textNode) {
                    textNode.textContent = `\n                        ${selectedText}\n                        `;
                } else if (arrow) {
                    trigger.insertBefore(document.createTextNode(`\n                        ${selectedText}\n                        `), arrow);
                }
            }
        });
    });
})();