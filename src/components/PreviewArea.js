import React, { useEffect, useRef, useState } from "react";

const SPRITE_EMOJIS = {
  cat: "🐱",
  dog: "🐶",
  robot: "🤖",
};

export default function PreviewArea({
  sprites,
  addSprite,
  activeSpriteId,
  setActiveSpriteId,
  updateSpritePosition,
  playAll,
  resetAll,
  heroActive,
  setHeroActive,
  swapRemainingFunctions,
}) {
  const containerRef = useRef(null);
  const [draggingSpriteId, setDraggingSpriteId] = useState(null);

  useEffect(() => {
    if (sprites.length === 0) {
      addSprite("cat");
    }
  }, [sprites, addSprite]);

  const handleAddSprite = (e) => {
    const value = e.target.value;
    if (!value) return;
    addSprite(value);
    e.target.value = "";
  };

  const handleMouseDown = (e, id) => {
    setDraggingSpriteId(id);
    setActiveSpriteId(id);
  };

  const handleMouseMove = (e) => {
    if (draggingSpriteId !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      updateSpritePosition(draggingSpriteId, x, y);
    }
  };

  const handleMouseUp = () => {
    if (draggingSpriteId !== null && heroActive) {
      swapRemainingFunctions(draggingSpriteId);
    }
    setDraggingSpriteId(null);
  };

  const usedSprites = sprites.map((s) => s.name);

  return (
    <div className="w-1/2">
      {/* Drop Area */}
      <div
        ref={containerRef}
        className="w-full border border-gray-300 rounded relative bg-gray-50 flex flex-col"
        style={{ height: "50vh" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="flex-1 relative bg-white">
          {sprites.length === 0 ? (
            <p className="text-gray-400 italic flex justify-center items-center h-full">
              Add a sprite to begin
            </p>
          ) : (
            sprites.map((sprite) => (
              <div
                key={sprite.id}
                style={{
                  position: "absolute",
                  left: sprite.x,
                  top: sprite.y,
                  transform: "translate(-50%, -50%)",
                  cursor: "move",
                }}
                onMouseDown={(e) => handleMouseDown(e, sprite.id)}
                className={`select-none ${
                  activeSpriteId === sprite.id
                    ? "outline outline-2 outline-blue-500"
                    : ""
                }`}
              >
                {/* Think bubble */}
                {sprite.thinkVisible && sprite.thinkMessage && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      backgroundColor: "lightyellow",
                      border: "1px solid orange",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      marginBottom: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                      fontStyle: "italic",
                    }}
                  >
                    {sprite.thinkMessage}
                  </div>
                )}

                {/* Say bubble */}
                {sprite.sayVisible && sprite.sayMessage && (
                  <div
                    style={{
                      position: "absolute",
                      bottom:
                        sprite.thinkVisible && sprite.thinkMessage
                          ? "120%"
                          : "100%",
                      backgroundColor: "white",
                      border: "1px solid gray",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      marginBottom: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sprite.sayMessage}
                  </div>
                )}

                {/* Emoji */}
                <div
                  style={{
                    fontSize: 48,
                    userSelect: "none",
                    textAlign: "center",
                  }}
                >
                  {SPRITE_EMOJIS[sprite.name] || "❓"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="mt-2 p-2 bg-gray-100 border rounded shadow text-sm flex items-center justify-between gap-2">
        {sprites.length === 1 && (
          <div className="text-left w-full">
            {`${sprites[0].name.charAt(0).toUpperCase() + sprites[0].name.slice(1)}: ${sprites[0].x},${sprites[0].y}`}
          </div>
        )}

        {sprites.length === 2 && (
          <>
            <div className="text-left w-1/2">
              {`${sprites[0].name.charAt(0).toUpperCase() + sprites[0].name.slice(1)}: ${sprites[0].x},${sprites[0].y}`}
            </div>
            <div className="text-right w-1/2">
              {`${sprites[1].name.charAt(0).toUpperCase() + sprites[1].name.slice(1)}: ${sprites[1].x},${sprites[1].y}`}
            </div>
          </>
        )}

        {sprites.length === 3 && (
          <>
            <div className="text-left w-1/3">
              {`${sprites[0].name.charAt(0).toUpperCase() + sprites[0].name.slice(1)}: ${sprites[0].x},${sprites[0].y}`}
            </div>
            <div className="text-center w-1/3">
              {`${sprites[1].name.charAt(0).toUpperCase() + sprites[1].name.slice(1)}: ${sprites[1].x},${sprites[1].y}`}
            </div>
            <div className="text-right w-1/3">
              {`${sprites[2].name.charAt(0).toUpperCase() + sprites[2].name.slice(1)}: ${sprites[2].x},${sprites[2].y}`}
            </div>
          </>
        )}

        {sprites.length >= 4 &&
          sprites.map((sprite) => (
            <div key={sprite.id} className="text-center flex-1">
              {`${sprite.name.charAt(0).toUpperCase() + sprite.name.slice(1)}: ${sprite.x},${sprite.y}`}
            </div>
          ))}
      </div>

            {/* Controls */}
      <div className="p-2 bg-white flex items-center gap-2 mt-2">
        <button
          onClick={playAll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ▶ Play All
        </button>
        <button
          onClick={resetAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset ALL
        </button>

        <label className="ml-4 flex items-center gap-1 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={heroActive}
            onChange={(e) => setHeroActive(e.target.checked)}
          />
          Hero Section
        </label>

        <select
          onChange={handleAddSprite}
          defaultValue=""
          className="ml-auto p-2 border rounded"
        >
          <option value="" disabled>
            + Add Sprite
          </option>
          {Object.keys(SPRITE_EMOJIS)
            .filter((name) => !usedSprites.includes(name))
            .map((name) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
                {SPRITE_EMOJIS[name]}
              </option>
            ))}
        </select>
      </div>

    </div>
  );
}

