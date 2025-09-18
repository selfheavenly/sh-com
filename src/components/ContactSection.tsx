import { FaEnvelope, FaLinkedin } from "react-icons/fa";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormData = { name: string; email: string; message: string };

const ContactSection = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data); // Replace with Formspree submission
  };

  return (
    <section className="glass p-8 neon-hover">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient">
        Forge Connections in the Ether
      </h2>
      <p className="mb-8 text-lg text-[var(--text-secondary)] text-center max-w-2xl mx-auto">
        Whether it's app feedback, startup synergies, or cosmic chats—reach out
        and let's manifest magic together.
      </p>
      <div className="flex justify-center gap-6 mb-8">
        <a
          href="https://www.linkedin.com/in/your-profile"
          className="flex items-center text-[var(--primary)] hover:text-[var(--accent)] neon-hover p-3 rounded-full transition-colors"
        >
          <FaLinkedin className="mr-2 text-2xl" /> LinkedIn
        </a>
        <a
          href="mailto:your@email.com"
          className="flex items-center text-[var(--primary)] hover:text-[var(--accent)] neon-hover p-3 rounded-full transition-colors"
        >
          <FaEnvelope className="mr-2 text-2xl" /> Email
        </a>
      </div>
      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-6"
      >
        <Input
          {...register("name")}
          placeholder="Your Name"
          className="bg-[var(--background-secondary)] border-[var(--secondary)] text-[var(--text)] placeholder-[var(--text-secondary)] rounded-lg focus:ring-[var(--primary)]"
          required
        />
        <Input
          {...register("email")}
          type="email"
          placeholder="Your Email"
          className="bg-[var(--background-secondary)] border-[var(--secondary)] text-[var(--text)] placeholder-[var(--text-secondary)] rounded-lg focus:ring-[var(--primary)]"
          required
        />
        <Textarea
          {...register("message")}
          placeholder="Your Message – Let's Create Magic"
          className="bg-[var(--background-secondary)] border-[var(--secondary)] text-[var(--text)] placeholder-[var(--text-secondary)] rounded-lg focus:ring-[var(--primary)]"
          rows={4}
          required
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--text)] rounded-lg transition-all"
        >
          Send Transmission
        </Button>
      </form>
    </section>
  );
};

export default ContactSection;
