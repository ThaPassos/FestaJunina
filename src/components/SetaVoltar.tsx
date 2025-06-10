import { Link } from 'react-router-dom';
import './SetaVoltar.css'; // Importa o CSS externo

const SetaVoltar = () => {
  return (
    <Link to="/" className="seta-voltar">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 6L9 12L15 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

export default SetaVoltar;
