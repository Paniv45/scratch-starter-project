import React from "react";

export default function MidArea({
  selectedSprites,
  activeSpriteId,
  setActiveSpriteId,
  spriteBlocks,
  updateSpriteBlocks,
  setSpriteMessage,
}) {
  const activeSprite = selectedSprites.find((s) => s.id === activeSpriteId);

  const onDrop = (e) => {
    e.preventDefault();
    if (!activeSprite) return;

    const blockData = e.dataTransfer.getData("application/json");
    if (!blockData) return;

    const newBlock = JSON.parse(blockData);
    newBlock.inputs = newBlock.inputs.map((input) => ({
      ...input,
      value: input.default || "",
    }));

    const current = spriteBlocks[activeSprite.id] || [];
    updateSpriteBlocks(activeSprite.id, [...current, newBlock]);
  };

  const removeBlock = (index) => {
    if (!activeSprite) return;
    const current = [...(spriteBlocks[activeSprite.id] || [])];
    current.splice(index, 1);
    updateSpriteBlocks(activeSprite.id, current);
  };

  const handleInputChange = (blockIndex, inputIndex, newValue) => {
    if (!activeSprite) return;
    const updated = [...(spriteBlocks[activeSprite.id] || [])];
    updated[blockIndex].inputs[inputIndex].value = newValue;
    updateSpriteBlocks(activeSprite.id, updated);

    // Show message
    setSpriteMessage(activeSprite.id, newValue);

    // Remove message after 3 seconds
    setTimeout(() => {
      setSpriteMessage(activeSprite.id, "");
    }, 3000);
  };

  const blocks = activeSprite ? spriteBlocks[activeSprite.id] || [] : [];

  return (
    <div
      className="flex-1 h-full overflow-auto p-4 border border-gray-300 rounded"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {selectedSprites.length > 0 ? (
        <>
          <div className="mb-4 flex space-x-2 justify-center">
            {selectedSprites.map((sprite) => (
              <button
                key={sprite.id}
                onClick={() => setActiveSpriteId(sprite.id)}
                className={`px-4 py-2 rounded font-semibold ${
                  sprite.id === activeSpriteId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {sprite.name.charAt(0).toUpperCase() + sprite.name.slice(1)}
              </button>
            ))}
          </div>

          {blocks.length === 0 ? (
            <p className="text-gray-500">
              Drag blocks here for {activeSprite.name}
            </p>
          ) : (
            blocks.map((block, idx) => (
              <div
                key={idx}
                className="border p-2 mb-4 rounded bg-white shadow relative"
              >
                <button
                  onClick={() => removeBlock(idx)}
                  className="absolute top-1 right-1 text-red-500 font-bold hover:text-red-700"
                >
                  ×
                </button>
                <div className="font-bold text-lg mb-2">{block.label}</div>
                <div className="flex flex-wrap">
                  {block.inputs.map((input, i) => (
                    <div key={i} className="flex items-center mr-4 mb-2">
                      <input
                        type={input.type || "text"}
                        value={input.value}
                        placeholder={input.placeholder}
                        onChange={(e) =>
                          handleInputChange(idx, i, e.target.value)
                        }
                        className="px-2 py-1 border rounded"
                        style={{ width: input.width || "80px" }}
                      />
                      <span className="ml-1">{input.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <p className="text-gray-400 italic">
          Select a sprite to begin scripting
        </p>
      )}
    </div>
  );
}
