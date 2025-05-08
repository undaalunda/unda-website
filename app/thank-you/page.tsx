export default function ThankYouPage() {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] px-4 text-center font-[Cinzel]">
        <h1 className="text-5xl font-[Cinzel] text-[#dc9e63]">
        Thank you for your purchase!
        </h1>
        <p className="mt-4 text-s opacity-80 max-w-xl">
        Your order has been successfully processed. You will receive a confirmation email shortly.
        If you have any questions, feel free to contact our support team.
        </p>
        <a
  href="/"
  className="mt-8 inline-block px-6 py-3 border border-[#dc9e63] text-[#dc9e63] rounded-xl hover:bg-[#dc9e63] hover:text-black transition"
>
  Back to home
</a>
      </main>
    );
  }