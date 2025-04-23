export default function ThankYouPage() {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] px-4 text-center font-[Cinzel]">
        <h1 className="text-5xl font-[Cinzel] text-[#dc9e63]">
          Thank you for reaching out.
        </h1>
        <p className="mt-4 text-lg opacity-80 max-w-xl">
          Your message has been received by the Undaalunda orbit.
          Our manager or one of the cats will get back to you shortly.
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 border border-[#dc9e63] rounded-xl hover:bg-[#dc9e63] hover:text-black transition"
        >
          Return to the Light
        </a>
      </main>
    );
  }