import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaHandshake, FaUniversity } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="glass p-8 neon-hover">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient">
        The Visionary Behind the Magic
      </h2>
      <p className="mb-8 text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
        As a trailblazing entrepreneur forged in the halls of Politechnika
        Wrocławska (PWr) and KU Leuven, I blend cutting-edge technical prowess
        with a passion for innovation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="glass border-[var(--secondary)] neon-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-[var(--text)]">
              <FaUniversity className="text-3xl text-[var(--accent)]" />
              Elite Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)] text-center">
              Technical mastery honed at PWr and KU Leuven.
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-[var(--secondary)] neon-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-[var(--text)]">
              <FaHandshake className="text-3xl text-[var(--accent)]" />
              Cosmic Collaborations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)] text-center">
              Seeking visionary startups for investment and partnership.
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-lg font-semibold text-center text-[var(--text)]">
        Founders: If your startup pulses with revolutionary tech, let's
        co-create the future.
      </p>
    </section>
  );
};

export default AboutSection;
