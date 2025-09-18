import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FaBookOpen } from "react-icons/fa";

const PublicationsSection = () => {
  const articles = [
    {
      title: "Unlocking Infinite Learning: The AI Revolution",
      desc: "Exploring personalized education paradigms.",
      link: "#",
    },
    {
      title: "Investing in Tomorrow: Spotting Unicorn Tech",
      desc: "Strategies for visionary collaborations.",
      link: "#",
    },
  ];

  return (
    <section className="glass p-8 neon-hover">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient">
        Dispatches from the Innovation Frontier
      </h2>
      <p className="mb-8 text-lg text-[var(--text-secondary)] text-center max-w-3xl mx-auto">
        Dive into my insights on AI-driven learning and entrepreneurial alchemy.
        More revelations incoming.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, i) => (
          <Card key={i} className="glass border-[var(--secondary)] neon-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                <FaBookOpen className="text-2xl text-[var(--accent)]" />
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--text-secondary)]">
                {article.desc}
              </p>
              <a
                href={article.link}
                className="mt-4 inline-block text-[var(--primary)] hover:text-[var(--accent)]"
              >
                Read More
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PublicationsSection;
