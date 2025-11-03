import { ChevronRight } from 'lucide-react';
import { Fact } from '../types';
import { categoryInfo } from '../data/facts';
import { useNavigate } from 'react-router-dom';

interface FactCardProps {
  fact: Fact;
}

export function FactCard({ fact }: FactCardProps) {
  const navigate = useNavigate();
  const category = categoryInfo[fact.category];

  return (
    <div
      onClick={() => navigate(`/fact/${fact.id}`)}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{category.emoji}</span>
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: category.color, color: '#2C3E50' }}
        >
          {category.name}
        </span>
      </div>

      <h3 className="mb-2" style={{ color: '#2C3E50' }}>
        {fact.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {fact.shortDescription}
      </p>

      <div className="flex items-center justify-end">
        <span className="text-sm flex items-center gap-1" style={{ color: '#5FCEA8' }}>
          더보기
          <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
}
