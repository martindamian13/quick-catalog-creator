
import React from 'react';
import { CircleCheck, Palette, Share2 } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-white shadow-soft hover:shadow-card transition-all flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <CircleCheck size={32} />,
      title: 'Fácil de usar',
      description: 'Interfaz intuitiva que te permite crear un catálogo profesional sin conocimientos técnicos.'
    },
    {
      icon: <Palette size={32} />,
      title: 'Personaliza tu catálogo',
      description: 'Adapta colores, fuentes y estilos para que reflejen la identidad de tu marca.'
    },
    {
      icon: <Share2 size={32} />,
      title: 'Comparte con un link',
      description: 'Distribuye tu catálogo fácilmente a través de redes sociales, WhatsApp o correo electrónico.'
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-semibold mb-4">Beneficios de CataloGo</h2>
          <p className="text-xl text-gray-600">
            Diseñado pensando en las necesidades de pequeñas empresas y emprendedores
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitItem 
              key={index} 
              icon={benefit.icon} 
              title={benefit.title} 
              description={benefit.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
