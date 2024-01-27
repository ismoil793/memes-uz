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
        &copy; <a href="https://shokirov.uz">https://shokirov.uz</a>
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
