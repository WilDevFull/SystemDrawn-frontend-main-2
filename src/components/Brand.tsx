import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link className="site-brand" to="/" aria-label="SystemDrawn, início">
      <span className="brand-mark" aria-hidden="true">SD</span>
      <span className="brand-wordmark">System<span>Drawn</span></span>
    </Link>
  );
}
