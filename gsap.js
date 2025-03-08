window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  let panels = gsap.utils.toArray(".section");
  // we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
  let tops = panels.map((panel) =>
    ScrollTrigger.create({ trigger: panel, start: "top top" })
  );

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top", // if it's shorter than the viewport, we prefer to pin it at the top
      pin: true,
      pinSpacing: false,
    });
  });

  ScrollTrigger.create({
    snap: {
      snapTo: (progress, self) => {
        let panelStarts = tops.map((st) => st.start), // an Array of all the starting scroll positions. We do this on each scroll to make sure it's totally responsive. Starting positions may change when the user resizes the viewport
          snapScroll = gsap.utils.snap(panelStarts, self.scroll()); // find the closest one
        return gsap.utils.normalize(
          0,
          ScrollTrigger.maxScroll(window),
          snapScroll
        ); // snapping requires a progress value, so convert the scroll position into a normalized progress value between 0 and 1
      },
      duration: 0.5,
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

  const menuLinks = document.querySelectorAll(".scroll-button");
  const sections = document.querySelectorAll(".section");

  let isScrolling = false; // 🚀 Track when GSAP is scrolling

  // 🚀 Function to highlight the active button based on section position
  function updateActiveButton() {
    let scrollPosition = window.scrollY;

    sections.forEach((section) => {
      let rect = section.getBoundingClientRect();
      let sectionTop = rect.top + window.scrollY;
      let sectionHeight = rect.height;
      let sectionID = `#${section.id}`;

      if (
        scrollPosition >= sectionTop - 150 && 
        scrollPosition < sectionTop + sectionHeight - 150
      ) {
        menuLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("data-target") === sectionID) {
            link.classList.add("active");
            menuLinks.forEach(l => {
              for (child of l.children) {
                child.classList.remove("active")
              }
            })
            for (child of link.children) {
              child.classList.add("active")
            }
          }
        });
      }
    });
  }

  // ✅ Attach scroll event to track the active section
  window.addEventListener("scroll", updateActiveButton);

  // ✅ Attach click event listeners to menu buttons
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      if (isScrolling) return; // 🚀 Prevent click lagging due to ongoing animation

      event.preventDefault();

      let targetID = this.getAttribute("data-target"); 
      let targetSection = document.querySelector(targetID);

      if (targetSection) {
        isScrolling = true; // 🚀 Prevent multiple clicks during animation

        let currentScrollY = window.scrollY;
        let rect = targetSection.getBoundingClientRect();
        let targetPosition = rect.top + window.scrollY;
        let scrollingDown = targetPosition > currentScrollY;

        let offsetValue = scrollingDown ? 100 : 500; 

        gsap.to(window, {
          duration: 1,
          scrollTo: { y: targetSection, offsetY: offsetValue },
          ease: "power2.inOut",
          onComplete: () => {
            isScrolling = false; // 🚀 Allow clicks immediately after scroll completes
            updateActiveButton();
          },
        });
      } else {
        console.error(`❌ Error: No section found for '${targetID}'`);
      }
    });
  });

  updateActiveButton(); // ✅ Ensure correct button is highlighted on page load
});
