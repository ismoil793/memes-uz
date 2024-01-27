import { CSSProperties } from 'react';
import MemeGenerator from '@/components/Meme/MemeGenerator';

interface IMemePageStyle {
  container: CSSProperties;
  footer: CSSProperties;
}

export default function MemePage() {
  return (
    <div className="meme-container" style={styles.container}>
      <MemeGenerator />
      <footer style={styles.footer}>
        <a href="https://shokirov.uz">&copy; 2024 Support the Project</a>
      </footer>
    </div>
  );
}

const styles: IMemePageStyle = {
  container: {
    position: 'relative'
  },
  footer: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)'
  }
};
