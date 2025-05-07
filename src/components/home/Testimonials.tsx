
import React from 'react';

interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  image: string;
}

const TestimonialItem: React.FC<TestimonialProps> = ({ text, author, role, image }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <img src={image} alt={author} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">&quot;{text}&quot;</p>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      text: "Con CataloGo pude crear un catálogo profesional para mi pequeña tienda de ropa en menos de una hora. Mis clientes lo aman.",
      author: "Ana Martínez",
      role: "Boutique Mariposa",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    },
    {
      text: "La plataforma es súper intuitiva. Antes tenía que enviar fotos sueltas por WhatsApp, ahora comparto un solo link con todo mi catálogo.",
      author: "Carlos Mendoza",
      role: "Artesanías Mendoza",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    },
    {
      text: "Me encanta que puedo actualizar mi catálogo en cualquier momento. Mis clientes siempre ven los productos más recientes.",
      author: "Laura González",
      role: "Repostería Dulce Sabor",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
    }
  ];

  return (
    <section id="testimonios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-semibold mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-xl text-gray-600">
            Miles de pequeños negocios ya están usando CataloGo para mostrar sus productos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialItem 
              key={index} 
              text={testimonial.text}
              author={testimonial.author}
              role={testimonial.role}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
