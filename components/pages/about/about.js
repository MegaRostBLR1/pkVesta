function initAbout() {
    const documentsGrid = document.querySelector('.about-documents__grid');
    const documentsMore = document.querySelector('.about-documents__more');

    if (documentsGrid && documentsMore) {
        documentsMore.addEventListener('click', () => {
            const expanded = documentsGrid.classList.toggle('is-expanded');
            documentsMore.setAttribute('aria-expanded', String(expanded));
            documentsMore.querySelector('span').textContent = expanded ? 'Скрыть' : 'Показать еще';
        });
    }
    const tabs = document.querySelectorAll('.about__media-tab');

    const gallery = document.querySelector('.about-team__featured-row');
    const previousButton = document.querySelector('.about-team__arrow--previous');
    const nextButton = document.querySelector('.about-team__arrow--next');

    if (gallery && previousButton && nextButton) {
        previousButton.addEventListener('click', () => {
            gallery.scrollBy({ left: -gallery.clientWidth * 0.7, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            gallery.scrollBy({ left: gallery.clientWidth * 0.7, behavior: 'smooth' });
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });
        });
    });

    const timelineYears = document.querySelector('.about-timeline__years');
    const timelineMilestones = timelineYears
      ? Array.from(timelineYears.querySelectorAll('.about-timeline__milestone'))
      : [];
    const previousTimelineButton = document.querySelector('.about-timeline__arrow--previous');
    const nextTimelineButton = document.querySelector('.about-timeline__arrow--next');

    if (timelineYears && timelineMilestones.length) {
        let activeMilestoneIndex = timelineMilestones.findIndex((milestone) =>
          milestone.classList.contains('is-active')
        );

        if (activeMilestoneIndex < 0) {
            activeMilestoneIndex = 0;
        }

        const setActiveMilestone = (nextIndex, scrollIntoView = false) => {
            activeMilestoneIndex = Math.max(0, Math.min(nextIndex, timelineMilestones.length - 1));

            timelineMilestones.forEach((milestone, index) => {
                const isActive = index === activeMilestoneIndex;
                const markerButton = milestone.querySelector('.about-timeline__milestone-mark');

                milestone.classList.toggle('is-active', isActive);

                if (isActive) {
                    milestone.setAttribute('aria-current', 'step');
                } else {
                    milestone.removeAttribute('aria-current');
                }

                markerButton?.setAttribute('aria-pressed', String(isActive));
            });

            if (previousTimelineButton) {
                previousTimelineButton.disabled = activeMilestoneIndex === 0;
            }

            if (nextTimelineButton) {
                nextTimelineButton.disabled = activeMilestoneIndex === timelineMilestones.length - 1;
            }

            if (scrollIntoView) {
                const activeMilestone = timelineMilestones[activeMilestoneIndex];
                const containerRect = timelineYears.getBoundingClientRect();
                const milestoneRect = activeMilestone.getBoundingClientRect();
                const scrollPadding = 16;
                let scrollOffset = 0;

                if (milestoneRect.left < containerRect.left + scrollPadding) {
                    scrollOffset = milestoneRect.left - containerRect.left - scrollPadding;
                } else if (milestoneRect.right > containerRect.right - scrollPadding) {
                    scrollOffset = milestoneRect.right - containerRect.right + scrollPadding;
                }

                if (scrollOffset !== 0) {
                    timelineYears.scrollBy({ left: scrollOffset, behavior: 'smooth' });
                }
            }
        };

        timelineMilestones.forEach((milestone, index) => {
            const markerButton = milestone.querySelector('.about-timeline__milestone-mark');

            markerButton?.addEventListener('click', () => {
                setActiveMilestone(index);
            });
        });

        previousTimelineButton?.addEventListener('click', () => {
            setActiveMilestone(activeMilestoneIndex - 1, true);
        });

        nextTimelineButton?.addEventListener('click', () => {
            setActiveMilestone(activeMilestoneIndex + 1, true);
        });

        setActiveMilestone(activeMilestoneIndex);
    }

    const timelineScrollbar = document.querySelector('.about-timeline__scrollbar');
    const timelineThumb = document.querySelector('.about-timeline__scrollbar-thumb');

    if (timelineYears && timelineScrollbar && timelineThumb) {
        const updateTimelineScrollbar = () => {
            const maxScroll = timelineYears.scrollWidth - timelineYears.clientWidth;
            const trackWidth = timelineScrollbar.clientWidth;

            if (maxScroll <= 0 || trackWidth === 0) {
                timelineScrollbar.hidden = true;
                return;
            }

            timelineScrollbar.hidden = false;

            const viewportWidth = window.innerWidth;
            const responsiveThumbWidth = Math.min(
              240,
              Math.max(56, 56 + (viewportWidth - 680) * (184 / 344))
            );
            const thumbWidth = Math.min(trackWidth, responsiveThumbWidth);
            const maxThumbOffset = trackWidth - thumbWidth;
            const thumbOffset = maxThumbOffset * timelineYears.scrollLeft / maxScroll;

            timelineThumb.style.width = `${thumbWidth}px`;
            timelineThumb.style.transform = `translateX(${thumbOffset}px)`;
        };

        let dragStartX = 0;
        let dragStartScroll = 0;

        timelineThumb.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            dragStartX = event.clientX;
            dragStartScroll = timelineYears.scrollLeft;
            timelineThumb.setPointerCapture(event.pointerId);
        });

        timelineThumb.addEventListener('pointermove', (event) => {
            if (!timelineThumb.hasPointerCapture(event.pointerId)) {
                return;
            }

            const trackWidth = timelineScrollbar.clientWidth;
            const thumbWidth = timelineThumb.offsetWidth;
            const maxThumbOffset = trackWidth - thumbWidth;
            const maxScroll = timelineYears.scrollWidth - timelineYears.clientWidth;

            if (maxThumbOffset <= 0 || maxScroll <= 0) {
                return;
            }

            const scrollPerPixel = maxScroll / maxThumbOffset;
            timelineYears.scrollLeft = dragStartScroll + (event.clientX - dragStartX) * scrollPerPixel;
        });

        timelineYears.addEventListener('scroll', updateTimelineScrollbar, { passive: true });
        window.addEventListener('resize', updateTimelineScrollbar);

        if ('ResizeObserver' in window) {
            const timelineResizeObserver = new ResizeObserver(updateTimelineScrollbar);
            timelineResizeObserver.observe(timelineYears);
            timelineResizeObserver.observe(timelineScrollbar);
        }

        updateTimelineScrollbar();
    }

    const reasonTabs = document.querySelectorAll('.about-reasons__tab');
    reasonTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            reasonTabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });
        });
    });
}
