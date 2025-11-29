import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
  chefName: string;
  subscriptionId: string;
  onClose: () => void;
  onSubmit: (id: string, rating: number) => void;
}

export default function RatingModal({
  chefName,
  subscriptionId,
  onClose,
  onSubmit
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(subscriptionId, rating);
      onClose();
    } else {
      alert('Veuillez donner une note avant de soumettre.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
      }}
    >
      <div
        className="card"
        style={{ width: '90%', maxWidth: '400px', padding: '24px', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={20} color="#9CA3AF" />
        </button>

        <h3 className="section-title" style={{ marginBottom: '8px' }}>
          Noter votre expérience
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
          Comment évalueriez-vous les repas du <strong>{chefName}</strong> ?
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '30px'
          }}
        >
          {[1, 2, 3, 4, 5].map((starValue) => (
            <Star
              key={starValue}
              size={36}
              fill={starValue <= (hoverRating || rating) ? '#FBBF24' : 'none'}
              color="#FBBF24"
              style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>
          Soumettre la note ({rating} Étoile{rating > 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}
