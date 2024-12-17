document.addEventListener("DOMContentLoaded", () => {
  // Below timeline runs on page load
  let pageLoadTimeline = gsap.timeline({
    onComplete: () => {
      gsap.set(".transition", { display: "none" });
    },
    defaults: {
      ease: "linear",
    },
  });

  pageLoadTimeline
    .to(
      ".transition-block",
      {
        opacity: 0,
        duration: 0.1,
        stagger: { amount: 0.75, from: "random" },
      },
      0.1
    )
    .fromTo(
      "[data-title-svg] rect",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.001,
        stagger: { amount: 1, from: "random" },
      },
      "<+=0.25"
    );

  // Pre-process all valid links
  const validLinks = Array.from(document.querySelectorAll("a")).filter(
    (link) => {
      const href = link.getAttribute("href") || "";
      const hostname = new URL(link.href, window.location.origin).hostname;

      return (
        hostname === window.location.hostname && // Same domain
        !href.startsWith("#") && // Not an anchor link
        link.getAttribute("target") !== "_blank" && // Not opening in a new tab
        !link.hasAttribute("data-transition-prevent") // No 'data-transition-prevent attribute'
      );
    }
  );

  // Add event listeners to pre-processed valid links
  validLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // dont go to destination immediately, but save the link we wanna go to
      event.preventDefault();
      const destination = link.href;

      // Show loading grid with animation
      gsap.set(".transition", { display: "grid" });
      gsap.fromTo(
        ".transition-block",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.001,
          ease: "linear",
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => {
            // when grid is full, go to the other page
            window.location.href = destination;
          },
        }
      );
    });
  });

  // Handle the back button behavior
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
});
