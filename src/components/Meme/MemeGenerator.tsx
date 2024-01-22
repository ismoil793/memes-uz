"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as htmlToImage from "html-to-image";
import styles from "./styles.module.scss";
import Image from "next/image";
import axios from "axios";
import { downloadFile } from "@/utils/file";

interface Meme {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions: number;
}

interface TopTextPosition {
  top: number;
  left: number;
}

interface BottomTextPosition {
  bottom: number;
  left: number;
}

const MemeGenerator = () => {
  const [textTop, setTextTop] = useState<string>("");
  const [textBottom, setTextBottom] = useState<string>("");
  const [randomMeme, setRandomMeme] = useState<Meme | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topTextPosition, setTopTextPosition] = useState<TopTextPosition>({
    top: 15,
    left: 15,
  });
  const [bottomTextPosition, setBottomTextPosition] =
    useState<BottomTextPosition>({
      bottom: 30,
      left: 15,
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
      const response = await axios.get("https://api.imgflip.com/get_memes");
      setMemes(response.data.data.memes);
      setRandomMeme(response.data.data.memes[0]);
    } catch (e: any) {
      console.error(e);
      alert(`Error while fetching memes: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const genRandomMeme = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * memes.length);
    const randMeme = memes[randomNumber];
    setRandomMeme(randMeme);
  }, [memes]);

  const onTopTextPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopTextPosition((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const onBottomTextPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBottomTextPosition((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handleMemeDownload = async () => {
    if (!screenshotArea.current) return;
    await htmlToImage.toJpeg(screenshotArea.current).then(downloadFile);
    alert("Meme saved as meme-shot.jpg");
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
          <div
            className={styles.memeImgWrap}
            ref={screenshotArea}
            style={{ width: "fit-content" }}
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <img src={randomMeme?.url} alt="Random meme" />
                <p style={{ background: "#fff" }}>
                  {'"'}
                  {randomMeme?.name}
                  {'"'} - generate your own meme at memes.uz
                </p>
              </div>
            )}
            <h2 className={styles.textTop} style={{ ...topTextPosition }}>
              {textTop}
            </h2>
            <h2 className={styles.textBottom} style={{ ...bottomTextPosition }}>
              {textBottom}
            </h2>
          </div>
          <div
            onClick={handleMemeDownload}
            className={styles.memeBtn}
            style={{ marginTop: 20 }}
          >
            Download meme
          </div>
        </div>

        <div className={styles.memeModerateArea}>
          <div>
            <input
              placeholder="Top Text"
              type="text"
              value={textTop}
              style={{ width: "calc(100% - 200px)" }}
              onChange={onTextTopChange}
            />
            <input
              type="number"
              placeholder="top"
              value={topTextPosition.top}
              name="top"
              style={{ width: 100 }}
              onChange={onTopTextPositionChange}
            />
            <input
              type="number"
              placeholder="left"
              name="left"
              style={{ width: 100 }}
              value={topTextPosition.left}
              onChange={onTopTextPositionChange}
            />
          </div>

          <div>
            <input
              placeholder="Bottom Text"
              type="text"
              value={textBottom}
              style={{ width: "calc(100% - 200px)" }}
              onChange={onTextBottomChange}
            />
            <input
              type="number"
              placeholder="bottom"
              name="bottom"
              style={{ width: 100 }}
              value={bottomTextPosition.bottom}
              onChange={onBottomTextPositionChange}
            />
            <input
              type="number"
              placeholder="left"
              name="left"
              style={{ width: 100 }}
              value={bottomTextPosition.left}
              onChange={onBottomTextPositionChange}
            />
          </div>

          <div
            onClick={genRandomMeme}
            className={`${styles.memeBtn} gen-random-meme`}
          >
            Gen. Random meme
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
