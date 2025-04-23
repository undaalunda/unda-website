'use client';

export default function ContactPage() {
  return (
    <main className="contact-section">
    <h1 className="contact-title">Booking & Contact</h1>
      <form
        action="https://formspree.io/f/mdkgodpr"
        method="POST"
        className="w-full max-w-xl space-y-6"
      >
        <input type="hidden" name="_redirect" value="http://localhost:3000/thank-you" />

        <div>
          <label htmlFor="name" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
            Your name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full px-4 py-2 bg-transparent border border-[#dc9e63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc9e63] text-sm sm:text-base cursor-text"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-4 py-2 bg-transparent border border-[#dc9e63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc9e63] text-sm sm:text-base cursor-text"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
            Your message
          </label>
          <textarea
            name="message"
            id="message"
            rows={5}
            required
            className="w-full px-4 py-2 bg-transparent border border-[#dc9e63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc9e63] text-sm sm:text-base cursor-text"
          />
        </div>

        <button
          type="submit"
          className="bg-[#dc9e63] text-black px-6 py-2 rounded-lg hover:bg-[#e6aa6f] transition cursor-pointer text-sm sm:text-base"
        >
          Send
        </button>
      </form>
    </main>
  );
}
