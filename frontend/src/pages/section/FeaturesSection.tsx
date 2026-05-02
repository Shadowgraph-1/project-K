import { FEATURE_CARDS } from "@/const/featureCards"
import { SECTION_ID } from "@/const/sectionIds"

function FeaturesSection() {
    const sectionScroll = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    return (
        <section id={SECTION_ID.FEATURES} className="scroll-mt-20 bg-neutral-50 px-4 py-20 md:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="max-w-6xl grid grid-cols-2 gap-4">
                    {FEATURE_CARDS.map((info) => (
                        <div key={info.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                            <h3 className="text-sm font-semibold text-neutral-950">{info.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-neutral-600">{info.description}</p>
                            <button 
                            type="button"
                            onClick={() => sectionScroll(info.buttonLink)}
                            className="mt-4 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">{info.buttonText}</button>
                        </div>
                    ))}
          </div>
        </div>
      </section>
    );
  }

export default FeaturesSection;