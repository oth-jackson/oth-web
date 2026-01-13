import { Compass, Bot, Glasses, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";

const services = [
  {
    icon: Compass,
    title: "Strategy & Roadmapping",
    description:
      "AI strategy, compliance guidance, and technical roadmapping to align cutting-edge capabilities with your business objectives.",
  },
  {
    icon: Bot,
    title: "AI-Native Product Development",
    description:
      "Full-stack AI engineering including agents, RAG systems, and production-ready applications designed for scale.",
  },
  {
    icon: Glasses,
    title: "AR/VR & Digital Twins",
    description:
      "Spatial computing, AR/VR experiences, digital twin simulations, and immersive activations powered by Unity3D and Azure.",
  },
  {
    icon: Network,
    title: "Network-Aware AI Infrastructure",
    description:
      "Telecom and network-aware APIs for AI and immersive applications, including location-based services, remote rendering, and medical tele-mentoring.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">WHAT WE DO</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Intelligent Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group hover:shadow-lg transition-all duration-300 border-gray-300 dark:border-primary/30"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
