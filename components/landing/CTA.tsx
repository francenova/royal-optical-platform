export function CTA() {
  return (
    <section className="bg-primary py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden relative">
      <div className="md:max-w-container-max md:mx-auto text-center relative z-10" data-animate="scale-in">
        <span className="font-label-mono text-label-mono text-on-primary/60 uppercase tracking-[4px] md:tracking-[6px] mb-5 md:mb-6 block">
          Ready for your transformation?
        </span>
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-8 md:mb-10">
          THE CLEAR CHOICE FOR <br className="hidden md:block" />
          EXCEPTIONAL EYESIGHT
        </h2>
        <a
          href="#contact"
          className="btn-magnetic inline-block w-full md:w-auto bg-on-primary text-primary px-8 md:px-16 py-5 md:py-6 rounded-full font-label-mono text-sm md:text-body-std uppercase tracking-[3px] md:tracking-[4px] hover:bg-surface-container-lowest transition-all md:hover:scale-105 active:scale-95 shadow-2xl"
        >
          Book Your Appointment
        </a>
      </div>
    </section>
  );
}
