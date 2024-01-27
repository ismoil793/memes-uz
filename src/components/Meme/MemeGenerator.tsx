'use client';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import styles from './styles.module.scss';
import Image from 'next/image';
import axios from 'axios';
import { downloadFile } from '@/utils/file';
import { IMeme } from '@/constants/types';
import MemePrintScreenTip from '@/components/Meme/MemePrintScreenTip';
import { notifySuccess } from '@/utils/notify';

interface TopTextPosition {
  top: number;
  left: number;
}

interface BottomTextPosition {
  bottom: number;
  left: number;
}

const pickRandomMeme = (memesArr: IMeme[]) => {
  const randomNumber = Math.floor(Math.random() * memesArr.length);
  return memesArr[randomNumber];
};

const MemeGenerator = () => {
  const [textTop, setTextTop] = useState<string>('');
  const [textBottom, setTextBottom] = useState<string>('');
  const [randomMeme, setRandomMeme] = useState<IMeme | null>(null);
  const [memes, setMemes] = useState<IMeme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topTextPosition, setTopTextPosition] = useState<TopTextPosition>({
    top: 15,
    left: 15
  });
  const [bottomTextPosition, setBottomTextPosition] = useState<BottomTextPosition>({
    bottom: 30,
    left: 15
  });

  const screenshotArea = useRef<HTMLDivElement>(null);

  const onTextTopChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextTop(e.target.value);
  };

  const onTextBottomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextBottom(e.target.value);
  };

  const fetchMemes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://api.imgflip.com/get_memes');
      setMemes(response.data.data.memes);
      const randMeme = pickRandomMeme(response.data.data.memes);
      setRandomMeme(randMeme);
    } catch (e: any) {
      console.error(e);
      alert(`Error while fetching memes: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateMeme = useCallback(() => {
    const randMeme = pickRandomMeme(memes);
    setRandomMeme(randMeme);
  }, [memes]);

  const onTopTextPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopTextPosition(prev => ({
      ...prev,
      [e.target.name]: Number(e.target.value)
    }));
  };

  const onBottomTextPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBottomTextPosition(prev => ({
      ...prev,
      [e.target.name]: Number(e.target.value)
    }));
  };

  const handleMemeDownload = async () => {
    if (!screenshotArea.current) return;
    await htmlToImage.toJpeg(screenshotArea.current).then(downloadFile);
    notifySuccess('Meme saved as meme-shot.jpg');
  };

  useEffect(() => {
    fetchMemes();
  }, []);


  return (
    <div className={styles.memeGenerator}>
      <header className={styles.memeHeader}>
        <Image width={100} height={80} src="/troll.png" alt="Troll face" />
        <h1>meme Generator</h1>
      </header>

      <div className={styles.memeGenWrapper}>
        <div className={styles.memeRandom}>
          <div className={styles.memeImgWrap} ref={screenshotArea} style={{ width: 'fit-content' }}>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <img
                  src={randomMeme?.url}
                  alt="Random meme"
                  data-tooltip-id="meme-tooltip"
                  data-tooltip-place="right"
                />
                <p style={{ background: '#fff' }}>
                  {'"'}
                  {randomMeme?.name}
                  {'"'} - generate your own meme at memes.uz
                </p>
                <MemePrintScreenTip />
              </div>
            )}
            <h2 className={styles.textTop} style={{ ...topTextPosition }}>
              {textTop}
            </h2>
            <h2 className={styles.textBottom} style={{ ...bottomTextPosition }}>
              {textBottom}
            </h2>
          </div>
          <div onClick={handleMemeDownload} className={styles.memeBtn} style={{ marginTop: 20 }}>
            Download meme
          </div>
        </div>

        <div className={styles.memeModerateArea}>
          <div>
            <input
              placeholder="Top Text"
              type="text"
              value={textTop}
              onChange={onTextTopChange}
            />
            <input
              type="number"
              placeholder="top"
              value={topTextPosition.top}
              name="top"
              onChange={onTopTextPositionChange}
            />
            <input
              type="number"
              placeholder="left"
              name="left"
              value={topTextPosition.left}
              onChange={onTopTextPositionChange}
            />
          </div>

          <div>
            <input
              placeholder="Bottom Text"
              type="text"
              value={textBottom}
              onChange={onTextBottomChange}
            />
            <input
              type="number"
              placeholder="bottom"
              name="bottom"
              value={bottomTextPosition.bottom}
              onChange={onBottomTextPositionChange}
            />
            <input
              type="number"
              placeholder="left"
              name="left"
              value={bottomTextPosition.left}
              onChange={onBottomTextPositionChange}
            />
          </div>

          <div onClick={handleGenerateMeme} className={`${styles.memeBtn} gen-random-meme`}>
            Gen. Random meme
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
