const teamMembers = [
  {
    name: "Alex Morgan",
    title: "Principal, AI Strategy",
    bio: "Leads AI-native strategy and product roadmaps across enterprise and emerging tech engagements.",
    initials: "AM",
  },
  {
    name: "Jordan Lee",
    title: "Lead Engineer",
    bio: "Builds production-grade AI systems, full-stack platforms, and high-fidelity prototypes.",
    initials: "JL",
  },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">THE TEAM</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Senior, Hands-On Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="border border-gray-300 dark:border-primary/30 rounded-2xl overflow-hidden bg-background flex flex-col"
            >
              <div
                className="relative w-full aspect-[6/7] bg-gradient-to-br from-primary/20 via-accent/30 to-secondary flex items-center justify-center text-xl font-semibold text-primary"
                role="img"
                aria-label={`${member.name} placeholder portrait`}
              >
                {member.initials}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-base font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.title}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
