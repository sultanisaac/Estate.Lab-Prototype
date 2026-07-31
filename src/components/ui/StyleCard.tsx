import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { StyleType } from '../../data/styles';

interface StyleCardProps {
  styleData: StyleType;
  onHover: (id: string | null) => void;
}

export function StyleCard({ styleData, onHover }: StyleCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
      onMouseEnter={() => onHover(styleData.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/properties?style=${styleData.id}`)}
    >
      <div className="absolute inset-0">
        <img 
          src={styleData.image} 
          alt={styleData.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      </div>
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="text-3xl font-serif text-white mb-2">{styleData.name}</h3>
        <p className="text-brand-accent/90 text-sm md:text-base mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {styleData.description}
        </p>
        <ul className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
          {styleData.features.map((feature, idx) => (
            <li key={idx} className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
