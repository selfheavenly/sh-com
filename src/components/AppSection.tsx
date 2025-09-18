import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBrain, FaChartLine, FaGlobeAmericas } from "react-icons/fa";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import mockup1 from "../assets/mockup1.png";
import mockup2 from "../assets/mockup2.png";
import mockup3 from "../assets/mockup3.png";
import { motion } from "framer-motion";

type FormData = { email: string; message?: string };

const AppSection = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data); // Replace with Formspree submission
  };

  const features = [
    {
      icon: <FaChartLine className="text-3xl text-[var(--accent)]" />,
      title: "Session Tracker",
      desc: "Gamified stats propel you forward, tracking every breakthrough in real-time.",
    },
    {
      icon: <FaBrain className="text-3xl text-[var(--accent)]" />,
      title: "Grammar Mastery",
      desc: "Dynamic levels unlock complex structures, turning novices into fluent visionaries.",
    },
    {
      icon: <FaGlobeAmericas className="text-3xl text-[var(--accent)]" />,
      title: "Word Discovery",
      desc: "Low-stakes exploration reveals vocabulary treasures through interactive guessing.",
    },
  ];

  return (
    <section className="glass p-8 neon-hover">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Revolutionize Language Learning: Enter the Infinite Realm
      </motion.h2>
      <p className="mb-8 text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
        Imagine an app that reads your mind—delivering an endless, AI-curated
        feed tailored to your exact proficiency. LangStacks (coming soon) isn't
        just learning—it's ascension.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[mockup1, mockup2, mockup3].map((mockup, i) => (
          <motion.img
            key={i}
            src={mockup}
            alt={`Mockup ${i + 1}`}
            className="rounded-lg shadow-neon w-full object-cover max-h-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {features.map((feat, i) => (
          <motion.div
            key={i}
            className="neon-hover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-[var(--secondary)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-[var(--text)]">
                  {feat.icon}
                  {feat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  {feat.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <p className="mb-8 text-lg font-semibold text-center text-[var(--text)]">
        Be among the elite: Secure early access and shape the future with your
        feedback.
      </p>
      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-6"
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter your email for beta invites"
          className="bg-[var(--background-secondary)] border-[var(--secondary)] text-[var(--text)] placeholder-[var(--text-secondary)] rounded-lg focus:ring-[var(--primary)]"
          required
        />
        <Textarea
          {...register("message")}
          placeholder="Share your vision or interests"
          className="bg-[var(--background-secondary)] border-[var(--secondary)] text-[var(--text)] placeholder-[var(--text-secondary)] rounded-lg focus:ring-[var(--primary)]"
          rows={3}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--text)] rounded-lg transition-all"
        >
          Unlock Your Future Now
        </Button>
      </form>
    </section>
  );
};

export default AppSection;
