
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  ctaText,
  ctaLink,
  popular = false
}) => {
  return (
    <Card className={`flex flex-col border ${popular ? 'border-primary shadow-lg relative' : 'border-border'}`}>
      {popular && (
        <Badge variant="default" className="absolute -top-3 right-4 bg-primary text-white">
          Más Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Gratis' && <span className="text-muted-foreground ml-1">/mes</span>}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`mt-0.5 mr-2 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                <Check size={18} />
              </div>
              <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={ctaLink} className="w-full">
          <Button
            variant={popular ? "default" : "outline"}
            className={`w-full ${popular ? 'bg-primary hover:bg-primary/90' : ''}`}
          >
            {ctaText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Plan Gratis",
      price: "Gratis",
      description: "Ideal para pequeños negocios que están comenzando",
      features: [
        { text: "Hasta 20 productos", included: true },
        { text: "1 catálogo público básico", included: true },
        { text: "Botón de contacto WhatsApp", included: true },
        { text: "Personalización básica de colores y logo", included: false },
        { text: "Estadísticas simples de visitas", included: false },
      ],
      ctaText: "Comenzar gratis",
      ctaLink: "/register",
      popular: false
    },
    {
      name: "Plan Advanced",
      price: "Gs. 150.000",
      description: "Para negocios que buscan crecer y profesionalizar su presencia",
      features: [
        { text: "Hasta 50 productos", included: true },
        { text: "Personalización básica de colores y logo", included: true },
        { text: "Estadísticas simples de visitas", included: true },
        { text: "Botón de contacto WhatsApp", included: true },
        { text: "Soporte prioritario", included: true },
      ],
      ctaText: "Actualizar a Advanced",
      ctaLink: "/register?plan=advanced",
      popular: true
    }
  ];

  return (
    <section id="precios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-semibold mb-4">Planes y Precios</h2>
          <p className="text-xl text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan key={index} {...plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">
            ¿Necesitas un plan personalizado para tu negocio? <a href="#contacto" className="text-primary hover:underline">Contáctanos</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
