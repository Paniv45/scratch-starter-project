import React from "react";
import Block from "./Block";

export default function Sidebar({ onAddBlock }) {
  const blocks = [
    {
      type: "move",
      label: "Move",
      color: "bg-blue-500",
      inputs: [{ name: "steps", default: 10, placeholder: "steps", type: "number" }],
    },
    {
      type: "turnLeft",
      label: "Turn",
      color: "bg-blue-500",
      inputs: [{ name: "degrees", default: 15, placeholder: "deg", type: "number" }],
    },
    {
      type: "goTo",
      label: "Go To",
      color: "bg-blue-500",
      inputs: [
        { name: "x", default: 0, placeholder: "x", type: "number" },
        { name: "y", default: 0, placeholder: "y", type: "number" },
      ],
    },
    {
      type: "repeat",
      label: "Repeat",
      color: "bg-blue-500",
      inputs: [{ name: "times", default: 10, placeholder: "times", type: "number" }],
    },
    {
      type: "say",
      label: "Say",
      color: "bg-yellow-500",
      inputs: [
        { name: "text", default: "Hello!", placeholder: "message" },
        { name: "sec", default: 2, placeholder: "sec", type: "number", width: "50px" },
      ],
    },
    {
      type: "think",
      label: "Think",
      color: "bg-yellow-500",
      inputs: [
        { name: "text", default: "Hmm...", placeholder: "thought" },
        { name: "sec", default: 2, placeholder: "sec", type: "number", width: "50px" },
      ],
    },
  ];

  // When drag starts, send the block data as a JSON string
  const onDragStart = (e, block) => {
    e.dataTransfer.setData("application/json", JSON.stringify(block));
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-2">Motion & Looks</div>
      {blocks.map((block) => (
        <div
          key={block.type}
          draggable
          onDragStart={(e) => onDragStart(e, block)}
          style={{ cursor: "grab", marginBottom: "8px" }}
        >
          <Block {...block} />
        </div>
      ))}
    </div>
  );
}
