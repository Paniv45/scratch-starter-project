import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sprites, setSprites] = useState([]);
  const [activeSpriteId, setActiveSpriteId] = useState(null);
  const [spriteBlocks, setSpriteBlocks] = useState({});
  const [heroActive, setHeroActive] = useState(false); // Hero mode on/off

  const addSprite = (name) => {
    const offset = sprites.length * 50;
    const newSprite = {
      id: crypto.randomUUID(),
      name,
      x: 50 + offset,
      y: 50 + offset,
      sayMessage: "",
      sayVisible: false,
      thinkMessage: "",
      thinkVisible: false,
      rotation: 0,
    };
    setSprites((prev) => [...prev, newSprite]);
    setActiveSpriteId(newSprite.id);
  };

  const resetAll = () => {
    setSpriteBlocks({});
  };

  const updateSpritePosition = (id, x, y) => {
    setSprites((prev) =>
      prev.map((sprite) => (sprite.id === id ? { ...sprite, x, y } : sprite))
    );
  };

  const removeSprite = (id) => {
    setSprites((prev) => prev.filter((s) => s.id !== id));
    setSpriteBlocks((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeSpriteId === id) setActiveSpriteId(null);
  };

  const updateSpriteBlocks = (id, blocks) => {
    setSpriteBlocks((prev) => ({
      ...prev,
      [id]: blocks,
    }));
  };

  // This function executes each block including repeating inner blocks
  const executeBlock = async (sprite, block) => {
    const inputs = block.inputs || [];

    switch (block.type) {
      case "move": {
        const distance = parseInt(inputs[0]?.value || "0", 10);
        updateSpritePosition(sprite.id, (sprite.x || 0) + distance, sprite.y || 0);
        return new Promise((resolve) => setTimeout(resolve, 500));
      }
      case "say": {
        const message = inputs[0]?.value || "";
        const sec = parseInt(inputs[1]?.value || "2", 10) * 1000;
        return new Promise((resolve) => {
          setSprites((prev) =>
            prev.map((s) =>
              s.id === sprite.id ? { ...s, sayMessage: message, sayVisible: true } : s
            )
          );
          setTimeout(() => {
            setSprites((prev) =>
              prev.map((s) => (s.id === sprite.id ? { ...s, sayVisible: false } : s))
            );
            resolve();
          }, sec);
        });
      }
      case "think": {
        const message = inputs[0]?.value || "";
        const sec = parseInt(inputs[1]?.value || "2", 10) * 1000;
        return new Promise((resolve) => {
          setSprites((prev) =>
            prev.map((s) =>
              s.id === sprite.id ? { ...s, thinkMessage: message, thinkVisible: true } : s
            )
          );
          setTimeout(() => {
            setSprites((prev) =>
              prev.map((s) => (s.id === sprite.id ? { ...s, thinkVisible: false } : s))
            );
            resolve();
          }, sec);
        });
      }
      case "turnLeft": {
        const angle = parseInt(inputs[0]?.value || "0", 10);
        setSprites((prevSprites) =>
          prevSprites.map((s) =>
            s.id === sprite.id
              ? { ...s, rotation: ((s.rotation || 0) - angle + 360) % 360 }
              : s
          )
        );
        return Promise.resolve();
      }
      case "turn": {
        const angle = parseInt(inputs[0]?.value || "0", 10);
        setSprites((prevSprites) =>
          prevSprites.map((s) =>
            s.id === sprite.id ? { ...s, rotation: ((s.rotation || 0) + angle) % 360 } : s
          )
        );
        return Promise.resolve();
      }
      case "goTo": {
        const x = parseInt(inputs[0]?.value || "0", 10);
        const y = parseInt(inputs[1]?.value || "0", 10);
        updateSpritePosition(sprite.id, x, y);
        return Promise.resolve();
      }
      case "repeat": {
        const times = parseInt(inputs[0]?.value || "0", 10);
        const innerBlocks = block.innerBlocks || [];
        for (let i = 0; i < times; i++) {
          for (const innerBlock of innerBlocks) {
            await executeBlock(sprite, innerBlock);
          }
        }
        return Promise.resolve();
      }
      default:
        console.warn("Unknown block type:", block.type);
        return Promise.resolve();
    }
  };

  // Swap remaining blocks function if heroActive (optional game mechanic)
  const swapRemainingFunctions = (movedSpriteId) => {
    if (!heroActive) return;

    const movedSprite = sprites.find((s) => s.id === movedSpriteId);
    if (!movedSprite) return;

    const overlappingSprite = sprites.find(
      (s) =>
        s.id !== movedSpriteId &&
        Math.hypot(movedSprite.x - s.x, movedSprite.y - s.y) < 20
    );

    if (!overlappingSprite) return;

    const movedBlocks = spriteBlocks[movedSpriteId] || [];
    const otherBlocks = spriteBlocks[overlappingSprite.id] || [];

    setSpriteBlocks((prev) => ({
      ...prev,
      [movedSpriteId]: otherBlocks,
      [overlappingSprite.id]: movedBlocks,
    }));

    console.log(
      `Swapped blocks between ${movedSprite.name} and ${overlappingSprite.name}`
    );
  };

  const playAll = async () => {
    // Clone sprites and their blocks for execution state
    let spritesState = sprites.map((sprite) => ({
      ...sprite,
      blocks: [...(spriteBlocks[sprite.id] || [])],
      currentIndex: 0,
    }));

    const areSpritesOverlapping = (s1, s2) => {
      const dx = s1.x - s2.x;
      const dy = s1.y - s2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 20;
    };

    const executeBlocksForSprite = async (spriteState) => {
      while (spriteState.currentIndex < spriteState.blocks.length) {
        const block = spriteState.blocks[spriteState.currentIndex];
        await executeBlock(spriteState, block);
        spriteState.currentIndex++;

        const updatedSprite = sprites.find((sp) => sp.id === spriteState.id);
        if (updatedSprite) {
          spriteState.x = updatedSprite.x;
          spriteState.y = updatedSprite.y;
        }

        if (heroActive) {
          for (let otherSprite of spritesState) {
            if (
              otherSprite.id !== spriteState.id &&
              otherSprite.currentIndex < otherSprite.blocks.length &&
              areSpritesOverlapping(spriteState, otherSprite)
            ) {
              const s1Remaining = spriteState.blocks.slice(spriteState.currentIndex);
              const s2Remaining = otherSprite.blocks.slice(otherSprite.currentIndex);

              spriteState.blocks = spriteState.blocks
                .slice(0, spriteState.currentIndex)
                .concat(s2Remaining);
              otherSprite.blocks = otherSprite.blocks
                .slice(0, otherSprite.currentIndex)
                .concat(s1Remaining);

              console.log(
                `Sprites ${spriteState.name} and ${otherSprite.name} swapped remaining functions!`
              );
            }
          }
        }
      }
    };

    await Promise.all(spritesState.map((spriteState) => executeBlocksForSprite(spriteState)));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MidArea
        selectedSprites={sprites}
        activeSpriteId={activeSpriteId}
        setActiveSpriteId={setActiveSpriteId}
        spriteBlocks={spriteBlocks}
        updateSpriteBlocks={updateSpriteBlocks}
      />
      <PreviewArea
        sprites={sprites}
        addSprite={addSprite}
        activeSpriteId={activeSpriteId}
        setActiveSpriteId={setActiveSpriteId}
        updateSpritePosition={updateSpritePosition}
        removeSprite={removeSprite}
        playAll={playAll}
        resetAll={resetAll}
        heroActive={heroActive}
        setHeroActive={setHeroActive}
        swapRemainingFunctions={swapRemainingFunctions}
      />
    </div>
  );
}
